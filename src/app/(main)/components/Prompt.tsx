"use client";

import { useState } from "react";
import { Input } from "antd";
import { ImageIcon, ArrowUpIcon, VideoIcon, Dices } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import classNames from "classnames";

const { TextArea } = Input;

interface PromptProps {
  className?: string;
}

type MediaType = "image" | "video";

interface MediaOption {
  type: MediaType;
  label: string;
  icon: LucideIcon;
}

const mediaOptions: MediaOption[] = [
  {
    type: "image",
    label: "Image",
    icon: ImageIcon,
  },
  {
    type: "video",
    label: "Video",
    icon: VideoIcon,
  },
];

export default function Prompt({ className }: PromptProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<MediaType>("image");

  return (
    <div className={`w-full max-w-4xl mx-auto mt-2 md:mt-3 ${className}`}>
      {/* 标题部分 */}
      <div className="text-center">
        <p className="text-base-content/40 text-sm md:text-lg">
          Type your prompt - turn ideas into stunning AI visuals instantly.
        </p>
      </div>

      {/* 输入框部分 */}
      <div className="mt-12 relative bg-base-100 rounded-3xl shadow-lg border border-base-300 p-4">
        {/* 文本输入区域 */}
        <TextArea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write what you want to create..."
          autoSize={{ minRows: 2, maxRows: 6 }}
          variant="borderless"
          className="text-base placeholder:text-base-content/40!"
          style={{
            resize: "none",
            padding: 0,
          }}
        />

        {/* 底部工具栏 */}
        <div className="flex items-center justify-between mt-4">
          {/* 左侧按钮组 - 药丸形状容器 */}
          <div className="flex justify-center items-center gap-x-2">
            <div className="flex items-center gap-0 bg-base-300 rounded-full p-1">
              {mediaOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setSelectedType(option.type)}
                    className={classNames(
                      "flex cursor-pointer items-center gap-2 px-2 py-1 md:px-4 md:py-2 rounded-full transition-colors hover:bg-base-300",
                      {
                        "bg-base-100/30 shadow-sm":
                          selectedType === option.type,
                      }
                    )}
                  >
                    <Icon className="w-3 h-3 md:w-4 md:h-4 text-base-content" />
                    <span className="text-xs md:text-sm font-medium text-base-content">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 随机图标 */}
            <button
              className="flex cursor-pointer items-center justify-center w-10 h-10 hover:bg-base-300/80 rounded-lg transition-colors"
              aria-label="Random"
            >
              <Dices className="w-4 h-4 md:w-5 md:h-5 text-base-content" />
            </button>
          </div>

          {/* 右侧提交按钮 */}
          <button className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary/90 hover:bg-primary rounded-full transition-colors shadow-lg hover:shadow-xl">
            <ArrowUpIcon className="w-4 h-4 md:w-5 md:h-5 text-base-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
