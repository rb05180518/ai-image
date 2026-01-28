/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/request";

interface IResponse {
  data: {
    taskId: string;
  };
}

export interface IProviderApiMartResult {
  submitTaskId: string;
  params: any;
}

export const providerApiMart = async <T>(
  params: T,
  processParams: (params: T) => any,
): Promise<IProviderApiMartResult> => {
  // 处理参数
  const processedParams = processParams(params);

  // 发起图片生成请求，获取任务id
  const res = await request.post<IResponse>("xxxxxxx", processedParams, {
    headers: {
      Authorization: `Bearer xxxxxx`,
    },
  });

  return {
    submitTaskId: res.data?.taskId,
    params: processedParams,
  };
};
