/* eslint-disable @typescript-eslint/no-explicit-any */
import { Masonry } from "antd";
import Image from "next/image";
import { useRef, useMemo, useEffect } from "react";
import type { IQueueState } from "@/store/useTaskStore";
import useTaskStore from "@/store/useTaskStore";

// 生成模糊占位图的 base64 SVG
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const exploreImages = [
  "https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f",
  "https://images.unsplash.com/photo-1507513319174-e556268bb244",
  "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2",
  "https://images.unsplash.com/photo-1492778297155-7be4c83960c7",
  "https://images.unsplash.com/photo-1508062878650-88b52897f298",
  "https://images.unsplash.com/photo-1506158278516-d720e72406fc",
  "https://images.unsplash.com/photo-1552203274-e3c7bd771d26",
  "https://images.unsplash.com/photo-1528163186890-de9b86b54b51",
  "https://images.unsplash.com/photo-1727423304224-6d2fd99b864c",
  "https://images.unsplash.com/photo-1675090391405-432434e23595",
  "https://images.unsplash.com/photo-1554196967-97a8602084d9",
  "https://images.unsplash.com/photo-1491961865842-98f7befd1a60",
  "https://images.unsplash.com/photo-1721728613411-d56d2ddda959",
  "https://images.unsplash.com/photo-1731901245099-20ac7f85dbaa",
  "https://images.unsplash.com/photo-1617694455303-59af55af7e58",
  "https://images.unsplash.com/photo-1709198165282-1dab551df890",
];

const sizeMap = {
  "5:4": 5 / 4,
  "4:5": 4 / 5,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1 / 1,
  "2:3": 2 / 3,
};

type SizeMapKey = keyof typeof sizeMap;

interface IProps {
  activeKey: string;
  usages: any[];
}

const App = (props: IProps) => {
  const { activeKey, usages } = props;

  const { fetchUsages, startPolling, stopPolling } = useTaskStore();

  const bottomRef = useRef(null);

  useEffect(() => {
    fetchUsages();

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 检测是否有进行中的任务，自动轮询（当有正在处理中的任务，即使刷新页面也会正常轮询）
  useEffect(() => {
    const hasActiveTask = usages.some(
      (u) => u.queueState === "waiting" || u.queueState === "active",
    );
    if (hasActiveTask) {
      startPolling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usages]);

  // 根据 activeKey 切换数据源
  const imageList = useMemo(() => {
    if (activeKey === "1") {
      // 我的生成 - 显示 usages 中已完成的图片
      return usages.map((item) => ({
        ...item,
        url: item.outputMeta?.imageUrl as string,
        status: item.queueState as IQueueState,
        progress: item.progress,
        prompt: item.inputMeta?.params?.prompt,
        aspect:
          sizeMap[
            (item.inputMeta.params?.aspect_ratio as SizeMapKey) ||
              (item.inputMeta.params?.image_size as SizeMapKey)
          ],
      }));
    } else {
      // 探索 - 显示 exploreImages
      return exploreImages.map((url) => ({
        url,
        status: "completed" as IQueueState,
        progress: 100,
        prompt: "",
        aspect: 16 / 9,
      }));
    }
  }, [activeKey, usages]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         console.log("到达底部，加载更多");
  //         // 将imageList打乱
  //         const newImageList = [...defaultImages];
  //         newImageList.sort(() => Math.random() - 0.5);
  //         setImageList([...imageList, ...newImageList]);

  //         console.log(imageList.length, 1111);
  //       }
  //     },
  //     {
  //       rootMargin: "100px", // 提前100px触发
  //     }
  //   );

  //   if (bottomRef.current) {
  //     observer.observe(bottomRef.current);
  //   }

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [imageList]);

  return (
    <>
      <Masonry
        fresh
        className="mt-6 max-w-360 mx-auto min-h-screen"
        columns={{ xs: 2, sm: 2, md: 3, lg: 5 }}
        gutter={{ xs: 8, sm: 8, md: 8 }}
        items={imageList.map((item, index) => ({
          key: `${item.url}-${index}`,
          data: item,
        }))}
        itemRender={(item) => (
          <>
            {/* 完成态 */}
            {item.data.status === "completed" && (
              <div className="relative cursor-pointer group rounded-lg overflow-hidden bg-base-300">
                {/* 动态导入的图片必须设置宽高和fill */}
                <Image
                  width={200}
                  height={200}
                  src={`${item.data.url}?w=523&auto=format`}
                  alt="image"
                  loading="eager"
                  quality={75}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(200, 200),
                  )}`}
                  unoptimized={true}
                  onError={(e) => {
                    // 图片加载失败时，尝试加载原图
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("&retry=1")) {
                      target.src = `${item.data.url}?w=400&auto=format&retry=1`;
                    } else if (!target.src.includes("&retry=2")) {
                      // 第二次重试，加载更小的图片
                      target.src = `${item.data.url}?w=300&retry=2`;
                    }
                  }}
                  style={{
                    width: "100%",
                  }}
                />

                <span className="absolute group-hover:opacity-100 opacity-0 transition-opacity left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-2 backdrop-blur-sm bg-base-content/40 hover:bg-base-content/10 text-base-100 py-2.5 px-3 rounded-xl font-medium">
                  Recreate
                </span>
              </div>
            )}

            {/* 处理中 */}
            {(item.data.status === "waiting" ||
              item.data.status === "active" ||
              item.data.status === "delayed") && (
              <div
                className="relative rounded-lg p-[2px] overflow-hidden"
                style={{ aspectRatio: item.data.aspect }}
              >
                {/* 旋转的彩色边框 */}
                <div
                  className="absolute inset-[-50%] animate-spin"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(0,255,0,0.6), rgba(0,255,255,0.6), rgba(0,128,255,0.6))",
                    animationDuration: "2s",
                  }}
                />
                {/* 内容区域 */}
                <div className="relative bg-base-300 rounded-md w-full h-full flex justify-center items-center">
                  Processing...
                </div>
              </div>
            )}

            {/* 失败状态 */}
            {item.data.status === "failed" && (
              <div className="bg-base-300 h-75 animate-pulse rounded-lg overflow-hidden flex justify-center items-center">
                Failed...
              </div>
            )}
          </>
        )}
      />

      {/* 底部标记元素 */}
      <div ref={bottomRef} className="h-4 w-full" />
    </>
  );
};

export default App;
