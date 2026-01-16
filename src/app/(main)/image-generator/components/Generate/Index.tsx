"use client";

import { memo, useMemo, useState } from "react";
import { Upload, Input } from "antd";
import type { UploadProps } from "antd";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import RotatingText from "@/components/RotatingText/Index";
import useTaskStore from "@/store/useTaskStore";
import type { IParams } from "@/store/useTaskStore";
import { AnimatePresence, motion } from "motion/react";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import classNames from "classnames";
import { RandomPrompts } from "@/app/(main)/components/Prompt";

const { TextArea } = Input;

const allModels = [
  {
    provider: "providerKie",
    label: "Nano Banana",
    value: "nano-banana",
    image: "/google.svg",
    aspectRatio: [
      {
        label: "1:1",
        value: "1:1",
      },
      {
        label: "2:3",
        value: "2:3",
      },
      {
        label: "16:9",
        value: "16:9",
      },
      {
        label: "9:16",
        value: "9:16",
      },
    ],
    outputFormat: [
      {
        label: "PNG",
        value: "png",
      },
      {
        label: "JPG",
        value: "jpeg",
      },
    ],
  },
  {
    provider: "providerKie",
    label: "Nano Banana Pro",
    value: "nano-banana-pro",
    image: "/google.svg",
    aspectRatio: [
      {
        label: "1:1",
        value: "1:1",
      },
      {
        label: "4:5",
        value: "4:5",
      },
      {
        label: "16:9",
        value: "16:9",
      },
    ],
    resolution: [
      {
        label: "1K",
        value: "1K",
      },
      {
        label: "2K",
        value: "2K",
      },
      {
        label: "4K",
        value: "4K",
      },
    ],
    outputFormat: [
      {
        label: "PNG",
        value: "png",
      },
      {
        label: "JPG",
        value: "jpg",
      },
    ],
  },
];

type IModelOption = (typeof allModels)[number];

export const ModelComponents = (props: {
  isAutoRotating: boolean;
  params: IParams;
}) => {
  const { isAutoRotating, params } = props;

  const texts = useMemo(() => {
    const currentParams = Object.entries(params)
      .map(([key, value]) => {
        if (key === "prompt") return null;
        return value;
      })
      .filter((item) => item)
      .join(" | ");

    if (isAutoRotating) {
      return allModels.map((model) => model.label);
    } else {
      return [currentParams, currentParams];
    }
  }, [isAutoRotating, params]);

  return (
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
  );
};

const Generate = () => {
  const { submitTask } = useTaskStore();

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isShowModelSelect, setIsShowModelSelect] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentModel, setCurrentModel] = useState<IModelOption>(allModels[0]);

  const [params, setParams] = useState<IParams>({
    provider: "providerKie",
    model: currentModel.label,
    prompt: "",
    resolution: currentModel.resolution ? currentModel.resolution[0].value : "",
    aspectRatio: currentModel.aspectRatio[0].value,
    outputFormat: currentModel.outputFormat[0].value,
  });

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

  // 选择模型
  const handleModelSelect = (item: IModelOption) => {
    setCurrentModel(item);

    setParams((prev) => {
      return {
        ...prev,
        model: item.label,
      };
    });
  };

  // 打开模型选择面板
  const handleModelOpen = () => {
    setIsAutoRotating(false);
    setIsShowModelSelect(!isShowModelSelect);
  };

  // 设置随机提示词
  const handleRandomPrompt = (prompt: string) => {
    setParams((prev) => ({
      ...prev,
      prompt,
    }));
  };

  // 提交生成任务
  const handleSubmit = async () => {
    try {
      if (!params.prompt) return;

      setIsGenerating(true);
      await submitTask(params);

      setParams({
        provider: "providerKie",
        model: currentModel.label,
        prompt: "",
        resolution: currentModel.resolution
          ? currentModel.resolution[0].value
          : "",
        aspectRatio: currentModel.aspectRatio[0].value,
        outputFormat: currentModel.outputFormat[0].value,
      });
    } catch (error) {
      alert("提交失败: " + error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* inset-x-0 mx-auto 定位元素中的水平居中 */}
      <div className="flex flex-col fixed bottom-8 md:w-full w-[calc(100vw-16px)] z-22 inset-x-0 mx-auto md:max-w-5xl rounded-2xl">
        {/* 参数选择 */}
        <AnimatePresence>
          {isShowModelSelect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-100 bg-base-100 flex flex-col relative bottom-3 rounded-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <span className="font-semibold text-base-content text-base">
                  Select Modal Params
                </span>
                <X className="cursor-pointer" onClick={handleModelClose} />
              </div>

              <div className="p-3 h-full grid grid-cols-2 gap-4">
                {/* 左侧 */}
                <div className="bg-base-200 rounded-lg p-3">
                  <p className="text-center text-base-content text-xs font-semibold">
                    Select Model
                  </p>

                  <div className="flex mt-4 gap-3">
                    {allModels.map((item) => {
                      return (
                        <div
                          key={item.value}
                          className="cursor-pointer"
                          onClick={() => handleModelSelect(item)}
                        >
                          <ElectricBorder
                            color="#e3e3e3"
                            speed={0.8}
                            chaos={0.03}
                            className={classNames(
                              "w-30 text-center flex items-center justify-center h-25",
                              {
                                "border-2 border-primary":
                                  currentModel.value === item.value,
                              }
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

                {/* 右侧 */}
                <div className="bg-base-200 rounded-lg p-3 space-y-6">
                  <div>
                    <p className="text-base-content/60 text-xs">
                      Select Output Format
                    </p>

                    <Tabs defaultValue="png" className="mt-2">
                      <TabsList className="bg-base-content/4 h-full p-1 rounded-xl">
                        {currentModel.outputFormat.map((item) => {
                          return (
                            <TabsTrigger
                              key={item.label}
                              value={item.value}
                              className="rounded-lg data-[state=active]:bg-base-100 py-2 px-6"
                              onClick={() =>
                                setParams((prev) => ({
                                  ...prev,
                                  outputFormat: item.value,
                                }))
                              }
                            >
                              {item.label}
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </Tabs>
                  </div>

                  {currentModel.resolution && (
                    <div>
                      <p className="text-base-content/60 text-xs">
                        Select Image Resolution
                      </p>

                      <Tabs defaultValue="1K" className="mt-2">
                        <TabsList className="bg-base-content/4 h-full p-1 rounded-xl">
                          {currentModel.resolution.map((item) => {
                            return (
                              <TabsTrigger
                                key={item.label}
                                value={item.value}
                                className="rounded-lg data-[state=active]:bg-base-100 py-2 px-6"
                                onClick={() =>
                                  setParams((prev) => ({
                                    ...prev,
                                    resolution: item.value,
                                  }))
                                }
                              >
                                {item.label}
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                      </Tabs>
                    </div>
                  )}

                  <div>
                    <p className="text-base-content/60 text-xs">
                      Select Aspect Ratio
                    </p>

                    <Tabs defaultValue="1:1" className="mt-2">
                      <TabsList className="bg-base-content/4 h-full p-1 rounded-xl">
                        {currentModel.aspectRatio.map((item) => {
                          return (
                            <TabsTrigger
                              key={item.label}
                              value={item.value}
                              className="rounded-lg data-[state=active]:bg-base-100 py-2 px-6"
                              onClick={() =>
                                setParams((prev) => ({
                                  ...prev,
                                  aspectRatio: item.value,
                                }))
                              }
                            >
                              {item.label}
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 生成框 */}
        <div className="flex bg-base-100 items-normal rounded-2xl">
          {/* 左侧：添加图片区域 */}
          <div className="flex flex-col p-3 gap-3">
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
              <span className="text-sm font-medium text-base-content">
                Add image
              </span>
            </button>
          </div>

          {/* 右侧：大的输入框区域 */}
          <div className="flex-1 flex p-3 items-stretch gap-4 border-l border-base-300">
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
                  rows={1}
                  variant="borderless"
                  className="text-base-content/90 placeholder:text-base-content/80! text-sm leading-relaxed p-0!"
                />
              </div>

              {/* 底部信息栏 */}
              <div className="flex items-end justify-between pt-4">
                <div className="flex items-center gap-x-2">
                  <RandomPrompts setPrompt={handleRandomPrompt} />

                  <div
                    className="text-base-content/60 cursor-pointer flex items-center text-sm font-medium"
                    onClick={handleModelOpen}
                  >
                    <ModelComponents
                      isAutoRotating={isAutoRotating}
                      params={params}
                    />
                  </div>
                </div>

                <button
                  disabled={isGenerating}
                  className={classNames(
                    "w-30 h-12 flex items-center justify-center cursor-pointer touch-manipulation bg-primary hover:bg-primary/70 rounded-xl text-base-100 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl",
                    {
                      "opacity-50 cursor-not-allowed!": isGenerating,
                    }
                  )}
                  onClick={handleSubmit}
                >
                  {isGenerating ? (
                    <Spinner className="size-6" />
                  ) : (
                    <span className="btn">Create</span>
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
