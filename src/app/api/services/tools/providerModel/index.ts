import { providerKie, type IProviderKieResult } from "./providerKie";
import {
  providerApiMart,
  type IProviderApiMartResult,
} from "./providerApiMart";

type providerType = "providerKie" | "providerApiMart";

export type { IProviderKieResult, IProviderApiMartResult, providerType };

export { providerKie, providerApiMart };
