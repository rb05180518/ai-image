interface INanoBananaParams {
  prompt: string;
  resolution: string;
  aspectRatio: string;
  outputFormat: string;
}

interface INanoBananaProParams {
  prompt: string;
  resolution: string;
  aspectRatio: string;
  outputFormat: string;
}

const processNanoBanana = (params: INanoBananaParams) => {
  const newParams = {
    model: "google/nano-banana",
    input: {
      prompt: params.prompt,
      image_size: params.aspectRatio,
      output_format: params.outputFormat,
    },
  };

  // 处理参数
  return newParams;
};

const processNanoBananaPro = (params: INanoBananaProParams) => {
  const newParams = {
    model: "nano-banana-pro",
    input: {
      prompt: params.prompt,
      resolution: params.resolution,
      aspect_ratio: params.aspectRatio,
      output_format: params.outputFormat,
    },
  };

  // 处理参数
  return newParams;
};

export { processNanoBanana, processNanoBananaPro };
