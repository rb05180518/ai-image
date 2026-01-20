"use client";

import { useState } from "react";
import { Input } from "antd";
import { ImageIcon, ArrowUpIcon, VideoIcon, Dices } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import useTaskStore from "@/store/useTaskStore";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRandom } from "@/hooks";

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

export const RandomPrompts = (props: {
  setPrompt: (prompt: string) => void;
}) => {
  const pickRandomPrompt = useRandom([
    "A futuristic city skyline at sunset",
    "A serene landscape with mountains and a river",
    "A close-up of a flower with dew drops",
    "A bustling market street in a foreign country",
    "A cozy cabin in the woods during winter",
  ]);

  const handleRandomPrompt = () => {
    const randomPrompt = pickRandomPrompt();
    props.setPrompt(randomPrompt);
  };

  return (
    <button
      className="btn flex cursor-pointer items-center justify-center w-10 h-10 hover:bg-base-300/80 rounded-lg transition-colors"
      aria-label="Random"
      onClick={handleRandomPrompt}
    >
      <Dices className="w-4 h-4 md:w-5 md:h-5 text-base-content" />
    </button>
  );
};

export default function Prompt({ className }: PromptProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<MediaType>("image");

  const { submitTask } = useTaskStore();

  const router = useRouter();

  // 提交任务
  const handleSubmit = () => {
    if (!prompt) return;

    submitTask({
      provider: "providerKie",
      prompt,
    });
    setPrompt("");
    router.push("/image-generator");
  };
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
            <Tabs defaultValue="image">
              <TabsList className="bg-base-content/4 h-full p-1 rounded-full">
                {mediaOptions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TabsTrigger
                      key={item.label}
                      value={item.type}
                      className="flex cursor-pointer items-center gap-2 px-2 py-1 md:px-4 md:py-2 rounded-full transition-colors data-[state=active]:bg-base-100"
                      onClick={() => setSelectedType(item.type)}
                    >
                      <Icon className="w-3 h-3 md:w-4 md:h-4 text-base-content" />

                      <span className="text-xs md:text-sm font-medium text-base-content">
                        {item.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            <RandomPrompts setPrompt={setPrompt} />
          </div>

          {/* 右侧提交按钮 */}
          <button
            className="flex items-center cursor-pointer justify-center w-10 h-10 md:w-12 md:h-12 bg-primary/90 hover:bg-primary rounded-full transition-colors shadow-lg hover:shadow-xl"
            onClick={handleSubmit}
          >
            <ArrowUpIcon className="btn w-4 h-4 md:w-6 md:h-6 text-base-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
