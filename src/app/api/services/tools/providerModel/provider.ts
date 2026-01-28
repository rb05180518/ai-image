/* eslint-disable @typescript-eslint/no-explicit-any */
import { providerKie } from "./index";
import type { IProviderKieResult, providerType } from "./index";
import type { ProcessType } from "@/config/model";
import type { IParams } from "@/store/useTaskStore";

import {
  processNanoBanana,
  processNanoBananaPro,
} from "../processParams/processImageParams";
import { processSeedance15Pro } from "../processParams/processVideoParams";

type ProcessParamsFunc = (params: any) => any;
type ProviderFunc = <T>(
  params: T,
  processParams: ProcessParamsFunc,
) => Promise<IProviderKieResult>;

const providerMap: Partial<
  Record<
    providerType,
    [ProviderFunc, Partial<Record<ProcessType, ProcessParamsFunc>>]
  >
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
export const executeProvider = async <T extends IParams>(
  providerName: providerType,
  params: T,
): Promise<IProviderKieResult> => {
  const provider = providerMap[providerName];

  if (!provider) {
    throw new Error(`不支持的图片生成服务商: ${providerName}`);
  }

  const [providerFunc, processParams] = provider;

  const fn = (processParams as any)[params.process];
  return providerFunc<IParams>(params, fn);
};

export type { IProviderKieResult };
