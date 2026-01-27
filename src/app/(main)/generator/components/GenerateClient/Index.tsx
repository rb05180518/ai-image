"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Masonry from "../Masonry/Index";
import useTaskStore from "@/store/useTaskStore";

const tabsOptions = [
  { key: "1", label: "My Creations" },
  { key: "2", label: "Explore Creations" },
];

interface IProps {
  initialUsages: unknown[];
}

export default function ImageGeneratorClient({ initialUsages }: IProps) {
  const [activeKey, setActiveKey] = useState("1");

  // 监听 store 中的 usages 变化（当 Generate 提交新任务时）,Zustand只会订阅返回值，并且自定更新
  const storeUsages = useTaskStore((state) => {
    // 可以在更新的过程中做一些其它操作
    return state.usages;
  });

  // 优先使用 store 的数据，如果 store 为空则使用 initialUsages
  const usages = storeUsages.length > 0 ? storeUsages : initialUsages;

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <>
      <Tabs defaultValue="1" className="max-w-360 mt-18 mx-auto w-full">
        <TabsList className="bg-base-200 h-full p-1.5 rounded-full max-md:w-full">
          {tabsOptions.map((item) => {
            return (
              <TabsTrigger
                key={item.label}
                value={item.key}
                className="rounded-2xl data-[state=active]:bg-base-100 py-2 px-3 md:px-6 flex-1"
                onClick={() => handleTabChange(item.key)}
              >
                {item.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <Masonry activeKey={activeKey} usages={usages} />
    </>
  );
}
