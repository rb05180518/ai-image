import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import Image from "next/image";

const DetailImageType = () => {
  return (
    <ScrollStack useWindowScroll={true} itemDistance={50}>
      <ScrollStackItem>
        <div className="flex justify-between items-center">
          <div>
            <p>Video to Video AI</p>

            <p>
              Transform your videos into 30+ creative animation styles, such as
              Japanese anime, Disney Pixar, claymation, painting and more.
            </p>
            <div>Try for Free</div>
          </div>
          <div>
            <Image
              width={400}
              height={300}
              src="/home/1.jpeg"
              alt="Video to Video AI"
            />
          </div>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className="flex flex-row-reverse justify-between items-center">
          <div>
            <p>Video to Video AI</p>

            <p>
              Transform your videos into 30+ creative animation styles, such as
              Japanese anime, Disney Pixar, claymation, painting and more.
            </p>
            <div>Try for Free</div>
          </div>
          <div>
            <Image
              width={400}
              height={300}
              src="/home/1.jpeg"
              alt="Video to Video AI"
            />
          </div>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className="flex justify-between items-center">
          <div>
            <p>Video to Video AI</p>

            <p>
              Transform your videos into 30+ creative animation styles, such as
              Japanese anime, Disney Pixar, claymation, painting and more.
            </p>
            <div>Try for Free</div>
          </div>
          <div>
            <Image
              width={400}
              height={300}
              src="/home/1.jpeg"
              alt="Video to Video AI"
            />
          </div>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className="flex justify-between items-center">
          <div>
            <p>Video to Video AI</p>

            <p>
              Transform your videos into 30+ creative animation styles, such as
              Japanese anime, Disney Pixar, claymation, painting and more.
            </p>
            <div>Try for Free</div>
          </div>
          <div>
            <Image
              width={400}
              height={300}
              src="/home/1.jpeg"
              alt="Video to Video AI"
            />
          </div>
        </div>
      </ScrollStackItem>
      <ScrollStackItem>
        <div className="flex justify-between items-center">
          <div>
            <p>Video to Video AI</p>

            <p>
              Transform your videos into 30+ creative animation styles, such as
              Japanese anime, Disney Pixar, claymation, painting and more.
            </p>
            <div>Try for Free</div>
          </div>
          <div>
            <Image
              width={400}
              height={300}
              src="/home/1.jpeg"
              alt="Video to Video AI"
            />
          </div>
        </div>
      </ScrollStackItem>
    </ScrollStack>
  );
};

export default DetailImageType;
