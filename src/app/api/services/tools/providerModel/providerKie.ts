/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/request";

interface IResponse {
  data: {
    taskId: string;
  };
}

interface IResultResponse {
  data: {
    state: "success" | "failed" | "error";
    resultJson: string;
    error: string;
  };
}

const API_KEY = "b3af86d3dff1d6a424398eb5c1eeeb85";

export interface IProviderKieResult {
  submitTaskId: string;
  params: any;
}

export const providerKie = async <T>(
  params: T,
  processParams: (params: T) => any,
): Promise<IProviderKieResult> => {
  // 处理参数
  const processedParams = processParams(params);

  // 发起图片生成请求，获取任务id
  const res = await request.post<IResponse>(
    "https://api.kie.ai/api/v1/jobs/createTask",
    processedParams,
    {
      headers: {
        Authorization: `Bearer b3af86d3dff1d6a424398eb5c1eeeb85`,
      },
    },
  );

  return {
    submitTaskId: res.data?.taskId,
    params: processedParams,
  };
};

export const getResult = async (taskId: string) => {
  const response = await request.get<IResultResponse>(
    `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    },
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
};
