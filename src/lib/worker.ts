// Worker 脚本 - 处理图片生成任务
// 运行方式: npx tsx src/worker.ts

import type { ImageTaskData, ImageTaskResult } from "./queue";
import { createImageWorker } from "./queue";
import { request } from "./request";
import type { Job } from "bullmq";

const API_KEY = "b3af86d3dff1d6a424398eb5c1eeeb85";

console.log("🚀 Worker 启动中...");

interface IResponse {
  data: {
    state: "success" | "failed" | "error";
    resultJson: string;
    error: string;
  };
}

// 轮询获取 AI 任务结果
async function pollAITaskResult(taskId: string): Promise<string> {
  const maxAttempts = 60; // 最多轮询 60 次
  const interval = 5000; // 每 2 秒查询一次

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await request.get<IResponse>(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // 根据 AI API 返回的状态判断
    if (response.data?.state === "success") {
      // 任务完成，解析 resultJson 字符串获取图片 URL
      const resultJson = JSON.parse(response.data?.resultJson || "{}");
      return resultJson.resultUrls[0];
    }

    if (response.data?.state === "failed" || response.data?.state === "error") {
      throw new Error(`AI 任务失败: ${response.data?.error || "未知错误"}`);
    }

    // 等待后继续轮询
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("AI 任务超时");
}

// 处理任务
async function processImageTask(
  job: Job<ImageTaskData>
): Promise<ImageTaskResult> {
  const { taskId } = job.data;

  console.log(`\n📝 开始处理任务: ${taskId}`);

  // 更新进度：开始轮询
  await job.updateProgress(10);

  // 轮询 AI API 获取结果
  const imageUrl = await pollAITaskResult(taskId);

  // 更新进度：完成
  await job.updateProgress(100);

  console.log(`✅ 任务完成: ${taskId}`);
  console.log(`   结果: ${imageUrl}\n`);

  return { imageUrl };
}

// 创建并启动 Worker
const worker = createImageWorker(processImageTask);

console.log("✅ Worker 已启动，等待任务...");
console.log("   按 Ctrl+C 停止\n");

// 优雅退出
process.on("SIGINT", async () => {
  console.log("\n🛑 正在关闭 Worker...");
  await worker.close();
  console.log("👋 Worker 已关闭");
  process.exit(0);
});
