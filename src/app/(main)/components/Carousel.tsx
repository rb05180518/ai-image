"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface CarouselProps {
  className?: string;
}

interface Item {
  id: number;
  title: string;
  image: string;
}

const carouselData: Item[] = [
  {
    id: 1,
    title: "Seedance 1.5 Pro",
    image: "/home/1.jpeg",
  },
  {
    id: 2,
    title: "Imagine Upscale",
    image: "/home/2.png",
  },
  {
    id: 3,
    title: "GPT Image 1.5",
    image: "/home/3.png",
  },
  {
    id: 4,
    title: "Wan 2.6",
    image: "/home/4.png",
  },
  {
    id: 5,
    title: "Seedance 1.5 Pro",
    image: "/home/1.jpeg",
  },
  {
    id: 6,
    title: "Imagine Upscale",
    image: "/home/2.png",
  },
  {
    id: 7,
    title: "GPT Image 1.5",
    image: "/home/3.png",
  },
  {
    id: 8,
    title: "Wan 2.6",
    image: "/home/4.png",
  },
];

export default function CarouselComponent({ className }: CarouselProps) {
  // 用于控制上下切换
  const [api, setApi] = useState<CarouselApi>();

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    onSelect(); // 初始调用
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className={`w-full ${className}`}>
      {/* 标题 */}
      <h2 className="text-xl font-medium text-base-content ">
        What&apos;s new
      </h2>

      {/* 轮播图容器 */}
      <div className="relative mt-4">
        {/* 左箭头按钮 - 仅桌面端显示 */}
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute cursor-pointer left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-base-100/90 rounded-full shadow-lg items-center justify-center hover:bg-base-100 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-base-content" />
          </button>
        )}

        {/* 右箭头按钮 - 仅桌面端显示 */}
        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-base-100/90 rounded-full shadow-lg items-center justify-center hover:bg-base-100 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-base-content" />
          </button>
        )}

        {/* Embla Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {carouselData.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 basis-[80%] md:basis-[24%]"
              >
                <div className="group cursor-pointer">
                  {/* 图片容器 */}
                  <div className="relative aspect-video rounded-2xl border border-base-300 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {/* 标题 */}
                  <h3 className="mt-2 text-sm font-medium text-base-content/60">
                    {item.title}
                  </h3>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
