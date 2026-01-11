"use client";

import { useEffect } from "react";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import classNames from "classnames";

import { useSignIn } from "@clerk/nextjs";
import { Button, Input } from "antd";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // app router 使用

import { useUserInfo } from "@/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import styles from "./styles.module.css";

const { Password } = Input;

interface IProps {
  href: string;
  isShowPassword: boolean;
}

const carouselData: string[] = [
  "/signIn/2.webp",
  "/signIn/3.webp",
  "/signIn/4.webp",
  "/signIn/27.webp",
];

const LoginRegister = (props: IProps) => {
  const { href, isShowPassword } = props;
  const { signIn } = useSignIn();
  const { isLoaded, isSignedIn } = useUserInfo();
  const router = useRouter();

  const providerButtons = [
    {
      label: "Continue with Google",
      icon: "/google.svg",
      onClick: () => {
        signIn?.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sign-in-success",
          redirectUrlComplete: "/",
        });
      },
    },
  ];

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="w-full h-full">
      <div className="w-full shadow-2xl h-full flex items-center max-w-7xl md:flex-row flex-col gap-y-2 rounded-2xl border border-base-300 bg-base-100 p-2">
        <div className="flex flex-1 flex-col p-4 md:px-12 md:py-10">
          <Image
            src="/favicon.ico"
            width={36}
            height={36}
            alt="logo"
            className="mx-auto"
          />

          <h1 className="text-4xl mt-4 text-center font-semibold text-base-content">
            Welcome to AI Image
          </h1>

          <div className="flex mt-12 flex-col gap-3">
            {providerButtons.map((provider) => (
              <Button
                key={provider.label}
                onClick={provider.onClick}
                className={
                  "flex w-full! items-center h-full! justify-center gap-2 rounded-xl px-4! py-3! text-lg font-medium bg-base-content! text-base-100! hover:bg-base-content/80! border-none!"
                }
              >
                <Image
                  src={provider.icon}
                  alt="google"
                  width={20}
                  height={20}
                />
                <span>{provider.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center my-6 gap-4 text-sm">
            <div className="h-px flex-1 bg-base-300" />
            <span className="text-base-content">or</span>
            <div className="h-px flex-1 bg-base-300" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-base-content">Email Address</label>
            <Input
              className="text-base-content! mt-2 bg-base-300/60! border-transparent! shadow-none! focus-within:border-base-content! [&_input::placeholder]:text-base-content/40!"
              size="large"
              type="email"
              placeholder="Enter your email"
              prefix={
                <Mail
                  className="h-5 w-5 text-base-content/60"
                  strokeWidth={1.6}
                />
              }
            />

            {isShowPassword && (
              <>
                <label className="mt-6 text-sm text-base-content">
                  Email Password
                </label>
                <Password
                  className="mt-2 bg-base-300/60! border-transparent! shadow-none! focus-within:border-base-content! [&_input::placeholder]:text-base-content/40! text-base-content!"
                  size="large"
                  placeholder="Enter your password"
                  iconRender={(visible) => {
                    return (
                      <div>
                        {visible ? (
                          <Eye className="text-base-content/60 cursor-pointer" />
                        ) : (
                          <EyeOff className="text-base-content/60 cursor-pointer" />
                        )}
                      </div>
                    );
                  }}
                  prefix={
                    <KeyRound
                      className="h-5 w-5 text-base-content/60"
                      strokeWidth={1.6}
                    />
                  }
                />
              </>
            )}
            <Button
              size="large"
              block
              className="mt-6 rounded-xl border-none! shadow-none! bg-base-300/40! hover:text-base-content! text-base-content/60! hover:bg-base-300/80! text-lg!"
            >
              Continue
            </Button>
          </div>

          <div className="text-center mt-4">
            <span className="text-base-content/60">
              Already have an account?
            </span>
            <Link href={href} className="ml-2 text-primary font-medium">
              Log in here
            </Link>
          </div>
        </div>

        <div className="h-full flex-1">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
              Fade(),
            ]}
            className={classNames("h-full", styles["sign-in-carousel"])}
          >
            <CarouselContent className="ml-0 h-full">
              {carouselData.map((item) => (
                <CarouselItem key={item} className="rounded-xl pl-0 h-full">
                  <Image
                    src={item}
                    alt="sign in"
                    width={400}
                    height={400}
                    className="object-cover h-full w-full rounded-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
