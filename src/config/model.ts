// 参数选项类型
interface ParamOption {
  label: string;
  value: string;
}

// 模型参数配置类型
interface ModelParamConfig {
  key: string;
  label: string;
  options: ParamOption[];
}

// 模型类型
interface ModelConfig {
  provider: string;
  label: string;
  value: string;
  image: string;
  params: ModelParamConfig[];
}

// 模型配置 - 每个模型有自己独立的参数定义
const allModels: ModelConfig[] = [
  {
    provider: "providerKie",
    label: "Nano Banana",
    value: "nano-banana",
    image: "/google.svg",
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
    label: "Nano Banana Pro",
    value: "nano-banana-pro",
    image: "/google.svg",
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
];

export type { ModelConfig };

export { allModels };
