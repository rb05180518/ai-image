interface ISeedance15ProParams {
  prompt: string;
  duration: string;
  resolution: string;
  aspectRatio: string;
  outputFormat: string;
}

const processSeedance15Pro = (params: ISeedance15ProParams) => {
  const newParams = {
    model: "bytedance/seedance-1.5-pro",
    input: {
      prompt: params.prompt,
      duration: params.duration,
      resolution: params.resolution,
      aspect_ratio: params.aspectRatio,
      // input_urls: params.
    },
  };

  // 处理参数
  return newParams;
};

export { processSeedance15Pro };
