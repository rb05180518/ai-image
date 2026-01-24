import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Video to Video AI",
    description:
      "Transform your videos into 30+ creative animation styles, such as Japanese anime, Disney Pixar, claymation, painting and more.",
    media: "/home/1.jpeg",
    type: "image" as const,
  },
  {
    title: "AI Video Generation",
    description:
      "Create stunning videos from scratch using AI. Generate dynamic content with smooth transitions and professional quality.",
    media: "/home/video/video1.mp4",
    type: "video" as const,
  },
  {
    title: "Image to Image AI",
    description:
      "Convert your images into stunning artwork with various artistic styles, from oil painting to watercolor and digital art.",
    media: "/home/2.png",
    type: "image" as const,
  },
  {
    title: "AI Motion Effects",
    description:
      "Add cinematic motion effects to your content. Create eye-catching animations with AI-powered tools.",
    media: "/home/video/video2.mp4",
    type: "video" as const,
  },
  {
    title: "Text to Image AI",
    description:
      "Generate beautiful images from text descriptions using advanced AI models. Create anything you can imagine.",
    media: "/home/3.png",
    type: "image" as const,
  },
  {
    title: "AI Photo Enhancement",
    description:
      "Enhance your photos with AI-powered tools. Upscale resolution, remove backgrounds, and improve quality instantly.",
    media: "/home/4.png",
    type: "image" as const,
  },
];

const DetailImageType = () => {
  return (
    <ScrollStack
      className="mt-12 md:mt-18"
      useWindowScroll={true}
      itemDistance={50}
    >
      {items.map((item, index) => (
        <ScrollStackItem
          key={index}
          itemClassName="bg-base-200 md:flex-row flex-col h-[500px]! flex justify-between h-full items-center"
        >
          <div className="md:w-1/2">
            <p className="text-xl font-bold md:text-6xl">{item.title}</p>

            <p className="text-f-text-secondary pt-3 text-sm md:text-xl">
              {item.description}
            </p>
            <Link
              href="/image-generator"
              className="group relative inline-flex mt-4 md:mt-7 p-0.5 rounded-full transition-shadow duration-700 hover:shadow-[0_0_15px_#ec4899,0_0_25px_#a855f7,0_0_35px_#06b6d4,0_0_45px_#22c55e]"
              style={{
                background:
                  "linear-gradient(to right, #ec4899, #a855f7, #06b6d4, #22c55e, #eab308, #f97316)",
              }}
            >
              <span className="relative z-1 text-base-100 text-center md:px-12 rounded-full bg-base-content flex items-center justify-center font-semibold text-sm md:text-base py-1.5 md:py-3.5 px-8">
                Try for Free
              </span>
            </Link>
          </div>
          <div className="md:w-1/2 h-full">
            {item.type === "video" ? (
              <video
                className="w-full h-full rounded-2xl object-cover"
                src={item.media}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                width={400}
                height={400}
                className="w-full h-full rounded-2xl object-cover"
                src={item.media}
                alt={item.title}
              />
            )}
          </div>
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
};

export default DetailImageType;
