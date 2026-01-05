"use client";

import BounceCards from "@/components/BounceCards/Index";
import SplitText from "@/components/SplitText/Index";
import Prompt from "./components/Prompt";
import Carousel from "./components/Carousel";

const images = [
  "/home/1.jpeg",
  "/home/2.png",
  "/home/3.png",
  "/home/4.png",
  "/home/5.png",
  "/home/2.png",
  "/home/3.png",
  "/home/4.png",
  "/home/5.png",
];

const transformStyles = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(-5deg)",
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)",
];

export default function Home() {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="h-screen">
      <div className="h-full">
        <SplitText
          text="We don't produce images, we simply deliver AI-generated art."
          className="mt-12 md:mt-18 text-4xl md:text-6xl font-bold text-base-content mx-auto text-center overflow-visible!"
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
      </div>
    </div>
  );
}
