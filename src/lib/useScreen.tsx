"use client";

import { useEffect, useState } from "react";

const useScreen = () => {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // 首次设置窗口宽度
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 立即调用一次以设置初始值
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 服务器端渲染或首次渲染时返回默认值
  const isMobile = windowWidth !== undefined ? windowWidth <= 768 : false;
  const isTablet =
    windowWidth !== undefined
      ? windowWidth > 768 && windowWidth <= 1024
      : false;
  const isDesktop = windowWidth !== undefined ? windowWidth > 1024 : true;

  return {
    isMobile, // 手机
    isTablet, // 平板
    isDesktop, // 电脑
  };
};

export default useScreen;
