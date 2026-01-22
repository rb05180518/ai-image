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
    <div className="h-screen">
      <div className="h-full">
        <SplitText
          text="We don't produce images, we simply deliver AI-generated art."
          className={classNames(
            "mt-12 md:mt-18 text-4xl md:text-6xl font-bold text-base-content max-w-7xl block! mx-auto text-center overflow-visible!",
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
    </div>
  );
}
