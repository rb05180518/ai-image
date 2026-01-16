// BullMQ 任务队列配置
import { Queue, Worker, Job } from "bullmq";
import { redisConnection } from "./redis";
import { prisma } from "./prisma";

// 任务数据类型
export interface ImageTaskData {
  taskId: string;
  userId: string;
}

// 任务结果类型
export interface ImageTaskResult {
  imageUrl: string;
}

// 创建图片生成队列
export const imageQueue = new Queue<ImageTaskData>("image-generation", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // 失败重试 3 次
    backoff: {
      type: "exponential",
      delay: 1000, // 重试间隔
    },
    removeOnComplete: 100, // 保留最近 100 个完成的任务
    removeOnFail: 50, // 保留最近 50 个失败的任务
  },
});

// 添加任务到队列
export async function addImageTask(data: ImageTaskData) {
  const job = await imageQueue.add("generate", data, {
    jobId: data.taskId, // 使用 taskId 作为 jobId，方便查询
  });

  console.log(`任务已加入队列: ${job.id}`);
  return job;
}

// 获取任务状态
export async function getTaskStatus(taskId: string) {
  const job = await imageQueue.getJob(taskId);
  if (!job) return null;

  const state = await job.getState();
  return {
    id: job.id,
    state, // waiting, active, completed, failed, delayed
    progress: job.progress,
    data: job.data,
    result: job.returnvalue,
    failedReason: job.failedReason,
  };
}

// 创建 Worker 处理任务（需要在单独的进程中运行）
export function createImageWorker(
  processor: (job: Job<ImageTaskData>) => Promise<ImageTaskResult>
) {
  const worker = new Worker<ImageTaskData, ImageTaskResult>(
    "image-generation",
    processor,
    {
      connection: redisConnection,
      concurrency: 2, // 同时处理 2 个任务
    }
  );

  // 监听事件
  worker.on("completed", async (job, result) => {
    console.log(`任务完成: ${job.id}`, result);
    // 任务完成更新数据库的某条记录
    const taskId = job.id;

    try {
      await prisma.usage.update({
        where: { taskId },
        data: {
          completeAt: new Date(),
          outputMeta: { imageUrl: result.imageUrl },
        },
      });
    } catch (err) {
      console.error(`❌ 数据库更新失败: ${taskId}`, err);
    }
  });

  worker.on("failed", (job, err) => {
    console.error(`任务失败: ${job?.id}`, err.message);
  });

  worker.on("progress", (job, progress) => {
    console.log(`任务进度: ${job.id}`, progress);
  });

  return worker;
}
