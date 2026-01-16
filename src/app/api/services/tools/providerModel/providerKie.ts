/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/lib/request";

interface IResponse {
  data: {
    taskId: string;
  };
}

export interface IProviderKieResult {
  submitTaskId: string;
  params: any;
}

export const providerKie = async <T>(
  params: T,
  processParams: (params: T) => any
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
    }
  );

  return {
    submitTaskId: res.data?.taskId,
    params: processedParams,
  };
};
