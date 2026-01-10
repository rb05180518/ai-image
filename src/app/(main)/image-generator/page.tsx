"use client";

import Tab from "./components/Tab/Index";
import Masonry from "./components/Masonry/Index";
import Generate2 from "./components/Generate2/Index";
import { useState } from "react";

export default function ImageGeneratorPage() {
  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className="w-full">
      <Tab onChange={handleTabChange} />
      <Masonry activeKey={activeKey} />
      {/* inset-x-0 mx-auto 定位元素中的水平居中 */}
      <Generate2 className="fixed bottom-8 md:w-full w-[calc(100vw-16px)] inset-x-0 mx-auto md:max-w-5xl" />
    </div>
  );
}
