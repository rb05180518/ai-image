"use client";

import Generate2 from "./components/Generate2/Index";
import Masonry from "./components/Masonry/Index";

export default function ImageGeneratorPage() {
  return (
    <div className="w-full">
      <Masonry />
      {/* inset-x-0 mx-auto 定位元素中的水平居中 */}
      <Generate2 className="fixed bottom-8 md:w-full w-[calc(100vw-16px)] inset-x-0 mx-auto md:max-w-5xl" />
    </div>
  );
}
