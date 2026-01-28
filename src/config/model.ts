// 参数选项类型
interface ParamOption {
  readonly label: string;
  readonly value: string;
}

// 模型参数配置类型
interface ModelParamConfig {
  readonly key: string;
  readonly label: string;
  readonly options: readonly ParamOption[];
}

// 模型类型
interface ModelConfig {
  readonly provider: string;
  readonly process: string;
  readonly label: string;
  readonly value: string;
  readonly image: string;
  readonly credits: number;
  readonly params: readonly ModelParamConfig[];
}

const imageModels = [
  {
    provider: "providerKie",
    process: "processNanoBanana",
    label: "Nano Banana",
    value: "nano-banana",
    image: "/google.svg",
    credits: 10,
    params: [
      {
        key: "aspectRatio",
        label: "Aspect Ratio",
        options: [
          { label: "1:1", value: "1:1" },
          { label: "2:3", value: "2:3" },
          { label: "16:9", value: "16:9" },
          { label: "9:16", value: "9:16" },
        ],
      },
      {
        key: "outputFormat",
        label: "Output Format",
        options: [
          { label: "PNG", value: "png" },
          { label: "JPG", value: "jpeg" },
        ],
      },
    ],
  },
  {
    provider: "providerKie",
    process: "processNanoBananaPro",
    label: "Nano Banana Pro",
    value: "nano-banana-pro",
    image: "/google.svg",
    credits: 20,
    params: [
      {
        key: "aspectRatio",
        label: "Aspect Ratio",
        options: [
          { label: "1:1", value: "1:1" },
          { label: "4:5", value: "4:5" },
          { label: "16:9", value: "16:9" },
        ],
      },
      {
        key: "resolution",
        label: "Resolution",
        options: [
          { label: "1K", value: "1K" },
          { label: "2K", value: "2K" },
          { label: "4K", value: "4K" },
        ],
      },
      {
        key: "outputFormat",
        label: "Output Format",
        options: [
          { label: "PNG", value: "png" },
          { label: "JPG", value: "jpg" },
        ],
      },
    ],
  },
] as const;

const videoModels = [
  {
    provider: "providerKie",
    process: "processSeedance15Pro",
    label: "Seedance 1.5 Pro",
    value: "seedance1.5",
    image: "/bytedance.png",
    credits: 40,
    params: [
      {
        key: "aspectRatio",
        label: "Aspect Ratio",
        options: [
          { label: "1:1", value: "1:1" },
          { label: "4:3", value: "4:3" },
          { label: "3:4", value: "3:4" },
          { label: "16:9", value: "16:9" },
          { label: "9:16", value: "9:16" },
          { label: "21:9", value: "21:9" },
        ],
      },
      {
        key: "duration",
        label: "Duration",
        options: [
          { label: "5", value: "5" },
          { label: "8", value: "8" },
          { label: "12", value: "12" },
        ],
      },
      {
        key: "resolution",
        label: "Resolution",
        options: [
          { label: "480P", value: "480p" },
          { label: "720P", value: "720p" },
        ],
      },
    ],
  },
  {
    provider: "providerKie",
    process: "processSeedance10ProFast",
    label: "Seedance 1.0 Pro Fast",
    value: "seedance1.0",
    image: "/bytedance.png",
    credits: 30,
    params: [
      {
        key: "aspectRatio",
        label: "Aspect Ratio",
        options: [
          { label: "1:1", value: "1:1" },
          { label: "4:3", value: "4:3" },
          { label: "3:4", value: "3:4" },
          { label: "16:9", value: "16:9" },
          { label: "9:16", value: "9:16" },
          { label: "21:9", value: "21:9" },
        ],
      },
      {
        key: "duration",
        label: "Duration",
        options: [
          { label: "4", value: "4" },
          { label: "8", value: "8" },
          { label: "12", value: "12" },
        ],
      },
      {
        key: "resolution",
        label: "Resolution",
        options: [
          { label: "720P", value: "720p" },
          { label: "1080P", value: "1080p" },
        ],
      },
    ],
  },
] as const;

// 模型配置 - 每个模型有自己独立的参数定义
const allModels = {
  image: imageModels,
  video: videoModels,
};

// 模型类型 key
type ModelType = keyof typeof allModels;

export type { ModelConfig, ModelType };

// 从所有模型中提取 process 值的联合类型
type ProcessType =
  | (typeof imageModels)[number]["process"]
  | (typeof videoModels)[number]["process"];

export type { ProcessType };

export { allModels };
