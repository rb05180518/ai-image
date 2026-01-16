/* eslint-disable @typescript-eslint/no-explicit-any */
import { providerKie, type IProviderKieResult } from "./providerKie";
import { processNanoBanana } from "../processParams";

type ProcessParamsFunc<T> = (params: T) => any;
type ProviderFunc = <T>(
  params: T,
  processParams: ProcessParamsFunc<T>
) => Promise<IProviderKieResult>;

const providerMap: Record<string, [ProviderFunc, ProcessParamsFunc<any>]> = {
  providerKie: [providerKie, processNanoBanana],
};

export const executeProvider = async <T>(
  providerName: string,
  params: T
): Promise<IProviderKieResult> => {
  const provider = providerMap[providerName];

  if (!provider) {
    throw new Error(`不支持的图片生成服务商: ${providerName}`);
  }

  const [providerFunc, processParams] = provider;
  return providerFunc<T>(params, processParams);
};

export type { IProviderKieResult };
