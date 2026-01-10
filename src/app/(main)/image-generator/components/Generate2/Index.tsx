"use client";

import { memo, useState } from "react";
import { Upload, Input } from "antd";
import type { UploadProps } from "antd";
import { Plus } from "lucide-react";
import RotatingText from "@/components/RotatingText/Index";
import classNames from "classnames";

const { TextArea } = Input;

export const ModelComponents = (props: { isAuto: boolean }) => {
  const { isAuto } = props;

  return (
    <RotatingText
      texts={["Seedream V4.5", "Nano Banana", "Nano Banana Pro", "Chatgpt 1.5"]}
      mainClassName="px-2 sm:px-2 md:px-3 bg-base-300/30 text-base-content/60 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
      staggerFrom={"last"}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      auto={isAuto}
      exit={{ y: "-120%" }}
      staggerDuration={0.025}
      splitLevelClassName="overflow-hidden"
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      rotationInterval={2000}
    />
  );
};

interface Generate2Props {
  className?: string;
}

const Generate2 = ({ className }: Generate2Props) => {
  console.log(3333);

  const [prompt, setPrompt] = useState("");
  const [isAuto, setIsAuto] = useState(true);

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 可以在这里添加文件验证逻辑
      console.log("Selected file:", file);
      return false; // 返回 false 阻止自动上传
    },
    showUploadList: false,
    accept: "image/*",
  };

  const handleModelSelect = () => {
    setIsAuto(false);
  };

  return (
    <div
      className={classNames(
        "flex items-normal bg-base-100 rounded-2xl",
        className
      )}
    >
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              rows={1}
              variant="borderless"
              className="text-base-content/90 placeholder:text-base-content/80! text-sm leading-relaxed p-0!"
            />
          </div>

          {/* 底部信息栏 */}
          <div className="flex items-end justify-between pt-4">
            <div
              className="text-base-content/60 cursor-pointer flex items-center text-sm font-medium"
              onClick={handleModelSelect}
            >
              <ModelComponents isAuto={isAuto} />
            </div>

            <button className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-2xl text-base-100 font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Generate2);
