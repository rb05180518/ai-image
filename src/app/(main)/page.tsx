"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";

import SplitText from "@/components/SplitText/Index";
import Prompt from "./components/Prompt";
import Carousel from "./components/Carousel";
import DetailImageType from "./components/DetailImageType";

import { useSyncUser } from "@/hooks/index";

export default function Home() {
  const [isShow, setIsShow] = useState(false);

  useSyncUser();

  const handleAnimationComplete = () => {
    // console.log("All letters have animated!");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="">
      <div
        className="h-screen bg-cover -top-20 md:-top-14 bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/home/bg.png')" }}
      >
        {/* 底部虚化遮罩 */}
        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-linear-to-t from-base-100 to-transparent pointer-events-none" />
        <div className="w-[calc(100vw-32px)] md:w-full absolute left-1/2 -translate-1/2 top-1/2">
          <SplitText
            text="We don't produce images, we simply deliver AI-generated art."
            className={classNames(
              "text-4xl md:text-6xl font-bold text-base-content max-w-7xl block! mx-auto text-center overflow-visible!",
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
            onLetterAnimationComplete={handleAnimationComplete}
          />

          <Prompt />
        </div>
      </div>

      {/* <BounceCards
          className="custom-bounceCards mx-auto mt-18"
          images={images}
          containerWidth={500}
          containerHeight={250}
          animationDelay={1}
          animationStagger={0.08}
          easeType="elastic.out(1, 0.5)"
          transformStyles={transformStyles}
          enableHover={true}
        /> */}
      <Carousel className="mt-12 md:mt-18" />

      <DetailImageType />
    </div>
  );
}
