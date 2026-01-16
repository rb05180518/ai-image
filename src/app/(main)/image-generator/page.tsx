"use client";

import { useState } from "react";

import Masonry from "./components/Masonry/Index";
import Generate from "./components/Generate/Index";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabsOptions = [
  { key: "1", label: "My Creations" },
  { key: "2", label: "Explore Interesting Creations" },
];

export default function ImageGeneratorPage() {
  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className="w-full px-5">
      <Tabs defaultValue="1" className="max-w-360 mt-18 mx-auto w-full">
        <TabsList className="bg-base-200 h-full p-1.5 rounded-full">
          {tabsOptions.map((item) => {
            return (
              <TabsTrigger
                key={item.label}
                value={item.key}
                className="rounded-2xl data-[state=active]:bg-base-100 py-2 px-6"
                onClick={() => handleTabChange(item.key)}
              >
                {item.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <Masonry activeKey={activeKey} />
      <Generate />
    </div>
  );
}
