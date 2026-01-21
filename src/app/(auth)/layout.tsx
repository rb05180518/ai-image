"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import SplitText from "@/components/SplitText/Index";
import classNames from "classnames";

const Layout = (props: PropsWithChildren) => {
  const { children } = props;

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full md:max-w-5xl md:mx-auto md:py-10 md:bg-base-100 md:backdrop-blur-md">
      <div className="h-full w-full flex flex-col gap-y-6 md:gap-y-12 justify-center items-center">
        <SplitText
          text="We’re about to explore more exciting AI images and videos."
          className={classNames(
            "text-2xl md:text-6xl font-bold text-base-content max-w-7xl block! mx-auto text-center overflow-visible!",
            { "opacity-0": !isShow },
          )}
          delay={100}
          duration={0.1}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <div className="max-w-7xl md:h-150 h-full">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
