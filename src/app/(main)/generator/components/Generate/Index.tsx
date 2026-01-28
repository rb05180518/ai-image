"use client";

import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { Upload, Input } from "antd";
import type { UploadProps } from "antd";
import Image from "next/image";
import { Plus, X, Settings2, Send, ChevronDown } from "lucide-react";
import RotatingText from "@/components/RotatingText/Index";
import useTaskStore from "@/store/useTaskStore";
import type { IParams } from "@/store/useTaskStore";
import { AnimatePresence, motion } from "motion/react";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import classNames from "classnames";
import { RandomPrompts } from "@/app/(main)/components/Prompt";
import { allModels, type ModelConfig, type ModelType } from "@/config/model";
import { useUserInfo } from "@/hooks";
import { usePathname } from "next/navigation";

const { TextArea } = Input;

// 根据模型生成默认参数
const getDefaultParams = (model: ModelConfig): IParams => {
  const params: IParams = {
    provider: model.provider,
    process: model.process,
    model: model.value,
    prompt: "",
  };

  model.params.forEach((param) => {
    (params as unknown as Record<string, string>)[param.key] =
      param.options[0].value;
  });

  return params;
};

// 模型滚动组件
export const ModelComponents = (props: {
  className: string;
  isAutoRotating: boolean;
  params: IParams;
  currentModel: ModelConfig;
  modelType: ModelType;
}) => {
  const { className, isAutoRotating, params, currentModel, modelType } = props;

  const texts = useMemo(() => {
    if (isAutoRotating) {
      return allModels[modelType].map((model) => model.label);
    }

    // 将 params 的 value 转换为对应的 label
    const paramLabels = currentModel.params
      .map((paramConfig) => {
        const value = (params as unknown as Record<string, string>)[
          paramConfig.key
        ];
        const option = paramConfig.options.find((opt) => opt.value === value);
        return option?.label ?? value;
      })
      .join(" | ");

    // 模型名称 + 参数
    const displayText = `${currentModel.label} | ${paramLabels}`;
    return [displayText, displayText];
  }, [isAutoRotating, params, currentModel, modelType]);

  return (
    <div className={className}>
      <RotatingText
        texts={texts}
        mainClassName="px-2 sm:px-2 md:px-3 bg-base-300/30 text-base-content/60 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
        staggerFrom={"last"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        auto={isAutoRotating}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />
    </div>
  );
};

const Generate = () => {
  const { submitTask } = useTaskStore();
  const { refreshCredits } = useUserInfo();
  const pathname = usePathname();

  const modelType: ModelType = pathname.includes("image") ? "image" : "video";

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isShowModelSelect, setIsShowModelSelect] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelConfig>(
    allModels[modelType][0],
  );

  const [params, setParams] = useState<IParams>(() =>
    getDefaultParams(allModels[modelType][0]),
  );

  // 当 modelType 变化时，重置 currentModel 和 params
  useEffect(() => {
    const newModel = allModels[modelType][0];

    setCurrentModel(newModel);
    setParams((prev) => ({
      ...getDefaultParams(newModel),
      prompt: prev.prompt, // 保留 prompt
    }));
  }, [modelType]);

  const handleModelClose = () => {
    setIsShowModelSelect(false);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 可以在这里添加文件验证逻辑
      console.log("Selected file:", file);
      return false; // 返回 false 阻止自动上传
    },
    showUploadList: false,
    accept: "image/*",
  };

  // 选择模型 - 切换时重置参数为新模型的默认值
  const handleModelSelect = useCallback((model: ModelConfig) => {
    setCurrentModel(model);
    setParams((prev) => ({
      ...getDefaultParams(model),
      prompt: prev.prompt, // 保留 prompt
    }));
  }, []);

  // 更新单个参数
  const handleParamChange = useCallback((key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 打开模型选择面板
  const handleModelOpen = () => {
    setIsAutoRotating(false);
    setIsShowModelSelect(!isShowModelSelect);
  };

  // 设置随机提示词
  const handleRandomPrompt = useCallback((prompt: string) => {
    setParams((prev) => ({
      ...prev,
      prompt,
    }));
  }, []);

  // 提交生成任务
  const handleSubmit = async () => {
    console.log(params, 8889989);

    // return;
    try {
      if (!params.prompt) return;

      setIsGenerating(true);
      await submitTask(params);

      // 刷新用户积分
      refreshCredits();
      // 重置为当前模型的默认参数
      setIsShowModelSelect(false);
      setParams(getDefaultParams(currentModel));
    } catch (error) {
      alert("提交失败: " + error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* inset-x-0 mx-auto 定位元素中的水平居中 */}
      <div className="flex flex-col fixed bg-transparent bottom-8 md:w-full w-[calc(100vw-16px)] z-51 inset-x-0 mx-auto md:max-w-5xl rounded-2xl">
        {/* 参数选择 */}
        <AnimatePresence>
          {isShowModelSelect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-100 border border-base-300 bg-base-100 flex flex-col relative bottom-3 rounded-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <span className="font-semibold text-base-content text-base">
                  Select Modal Params
                </span>
                <X className="cursor-pointer" onClick={handleModelClose} />
              </div>

              <div className="p-3 h-full grid grid-cols-1 max-md:overflow-y-scroll max-md:overscroll-contain md:grid-cols-2 gap-4">
                {/* 左侧 */}
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-center text-base-content text-xs font-semibold">
                    Select Model
                  </p>

                  <div className="flex mt-4 gap-3">
                    {allModels[modelType].map((item) => {
                      return (
                        <div
                          key={item.value}
                          className="cursor-pointer"
                          onClick={() => handleModelSelect(item)}
                        >
                          <ElectricBorder
                            color="#e3e3e3"
                            speed={0.1}
                            chaos={0.03}
                            borderRadius={8}
                            className={classNames(
                              "w-30 h-15 text-center max-md:rounded-lg! max-md:overflow-hidden flex items-center justify-center md:h-25",
                              {
                                "border-2 border-primary":
                                  currentModel.value === item.value,
                              },
                            )}
                          >
                            <Image
                              src={item.image}
                              alt={item.label}
                              width={80}
                              height={80}
                              className="mx-auto w-6 h-6"
                            />
                            <p className="text-base-content text-xs">
                              {item.label}
                            </p>
                          </ElectricBorder>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 右侧 - 动态渲染当前模型的参数 */}
                <div className="bg-base-200 rounded-lg p-3 space-y-6 overflow-y-auto relative">
                  {currentModel.params.map((paramConfig) => (
                    <div key={paramConfig.key}>
                      <p className="text-base-content/60 text-xs">
                        {paramConfig.label}
                      </p>

                      <Tabs
                        value={
                          (params as unknown as Record<string, string>)[
                            paramConfig.key
                          ]
                        }
                        onValueChange={(value) =>
                          handleParamChange(paramConfig.key, value)
                        }
                        className="mt-2"
                      >
                        <TabsList className="bg-base-content/4 h-full p-1 rounded-xl flex-wrap">
                          {paramConfig.options.map((option) => (
                            <TabsTrigger
                              key={option.value}
                              value={option.value}
                              className="rounded-lg data-[state=active]:bg-base-100 py-2 px-6"
                            >
                              {option.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>
                  ))}

                  {/* 移动端下滑提示箭头 */}
                  <div className="md:hidden block absolute bottom-0 right-2 pointer-events-none">
                    <ChevronDown className="w-6 h-6 text-base-content/40 animate-bounce" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 生成框 */}
        <div className="flex shadow-xs border border-base-300 bg-base-100 items-normal rounded-2xl">
          {/* 左侧：添加图片区域 */}
          <div className="flex flex-col md:p-3 p-2 md:gap-3 gap-2 justify-between">
            {/* 添加图片按钮 - 大正方形 */}
            <Upload {...uploadProps}>
              <button className="w-29 cursor-pointer h-18 rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 transition-colors flex items-center justify-center">
                <Plus
                  className="bg-base-300 rounded-full w-7 p-1 h-7 shadow-2xs text-base-content/30"
                  strokeWidth={1}
                />
              </button>
            </Upload>

            {/* Add image 按钮 */}
            <button className="flex items-center justify-center gap-2 px-1 py-1.5 rounded-full border border-base-300 bg-base-100 hover:bg-base-200 transition-colors">
              <Plus className="w-4 h-4 text-base-content" strokeWidth={2} />
              <span className="text-xs md:text-sm font-medium text-base-content">
                Add image
              </span>
            </button>
          </div>

          {/* 右侧：大的输入框区域 */}
          <div className="flex-1 flex md:p-3 p-2 items-stretch gap-4 border-l border-base-300">
            {/* 提示词和信息区域 */}
            <div className="flex-1 bg-base-100 rounded-2xl flex flex-col justify-between relative">
              {/* 提示词输入框 */}
              <div className="flex-1 flex items-start">
                <TextArea
                  value={params.prompt}
                  onChange={(e) =>
                    setParams((prev) => ({ ...prev, prompt: e.target.value }))
                  }
                  placeholder="Describe what you want to create..."
                  rows={3}
                  variant="borderless"
                  className="text-base-content/90! placeholder:text-base-content/20! text-sm leading-relaxed p-0!"
                />
              </div>

              {/* 底部信息栏 */}
              <div className="flex items-end justify-between md:pt-4 pt-2">
                <div className="flex items-center gap-x-2">
                  <RandomPrompts setPrompt={handleRandomPrompt} />

                  <div
                    className="text-base-content/60 cursor-pointer flex items-center text-sm font-medium"
                    onClick={handleModelOpen}
                  >
                    <ModelComponents
                      className="hidden md:block"
                      isAutoRotating={isAutoRotating}
                      params={params}
                      currentModel={currentModel}
                      modelType={modelType}
                    />
                    <Settings2 className="w-5 h-5 block md:hidden" />
                  </div>
                </div>

                <button
                  disabled={isGenerating}
                  className={classNames(
                    "md:w-30 w-15 h-10 flex items-center justify-center cursor-pointer touch-manipulation bg-primary hover:bg-primary/70 rounded-lg md:rounded-xl text-base-100 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl",
                    {
                      "opacity-50 cursor-not-allowed!": isGenerating,
                    },
                  )}
                  onClick={handleSubmit}
                >
                  {isGenerating ? (
                    <Spinner className="size-6" />
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <span>{currentModel.credits}</span>
                      <span className="hidden md:block btn">Create</span>
                      <Send className="block md:hidden btn" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Generate);
