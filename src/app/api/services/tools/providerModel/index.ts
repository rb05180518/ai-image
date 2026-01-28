/* eslint-disable @typescript-eslint/no-explicit-any */
import { providerKie, type IProviderKieResult } from "./providerKie";
import type { ProcessType } from "@/config/model";
import {
  processNanoBanana,
  processNanoBananaPro,
} from "../processParams/processImageParams";
import { processSeedance15Pro } from "../processParams/processVideoParams";

type ProcessParamsFunc<T> = (params: T) => any;
type ProviderFunc = <T>(
  params: T,
  processParams: ProcessParamsFunc<T>,
) => Promise<IProviderKieResult>;

const providerMap: Record<
  string,
  [ProviderFunc, Record<ProcessType, ProcessParamsFunc<any>>]
> = {
  providerKie: [
    providerKie,
    {
      processNanoBanana: processNanoBanana,
      processNanoBananaPro: processNanoBananaPro,
      processSeedance10ProFast: processSeedance15Pro,
      processSeedance15Pro: processSeedance15Pro,
    },
  ],
};

// params中可以拿到整个模型的字段
export const executeProvider = async <T>(
  providerName: string,
  params: any,
): Promise<IProviderKieResult> => {
  const provider = providerMap[providerName];

  if (!provider) {
    throw new Error(`不支持的图片生成服务商: ${providerName}`);
  }

  const [providerFunc, processParams] = provider;
  console.log(params, processParams, 888);

  const fn = (processParams as any)[params.process];
  return providerFunc<T>(params, fn);
};

export type { IProviderKieResult };
