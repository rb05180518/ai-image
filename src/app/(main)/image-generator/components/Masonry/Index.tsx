import { Masonry } from "antd";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const defaultImages = [
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
].map((url) => ({
  img: url,
  id: Math.floor(10000 + Math.random() * 90000),
}));
const images = [
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
].map((url) => ({
  img: url,
  id: Math.floor(10000 + Math.random() * 90000),
}));

const App = () => {
  const [imageList, setImageList] =
    useState<{ img: string; id: number }[]>(images);
  const bottomRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log("到达底部，加载更多");
          // 将imageList打乱
          const newImageList = [...defaultImages];
          newImageList.sort(() => Math.random() - 0.5);
          setImageList([...imageList, ...newImageList]);

          console.log(imageList.length, 1111);
        }
      },
      {
        rootMargin: "100px", // 提前100px触发
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [imageList]);

  return (
    <div>
      <Masonry
        className="mt-20 max-w-360 mx-auto"
        columns={{ xs: 2, sm: 2, md: 3, lg: 5 }}
        gutter={{ xs: 8, sm: 8, md: 8 }}
        items={imageList.map((item, index) => ({
          key: `${item.img}-${index}`,
          data: item.img,
        }))}
        itemRender={({ data }) => (
          <div className="relative cursor-pointer group rounded-lg overflow-hidden">
            <Image
              width={200}
              height={200}
              src={`${data}?w=523&auto=format`}
              alt="sample"
              style={{ width: "100%" }}
            />

            <span className="absolute group-hover:opacity-100 opacity-0 transition-opacity left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-2 backdrop-blur-sm bg-base-content/40 hover:bg-base-content/10 text-base-100 py-2.5 px-3 rounded-xl font-medium">
              Recreate
            </span>
          </div>
        )}
      />

      {/* 底部标记元素 */}
      <div ref={bottomRef} className="h-4 w-full" />
    </div>
  );
};

export default App;
