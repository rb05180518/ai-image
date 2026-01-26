"use client";

import { useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SunMoon, Menu, X } from "lucide-react";
import { Button } from "antd";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUserInfo } from "@/hooks";

interface NavItem {
  label: string;
  href: string;
}

type TabType = "/" | "/image-generator" | "/pricing";

export interface IProps {
  className?: string;
  items?: NavItem[];
}

const Header = (props: IProps) => {
  const pathname = usePathname() as TabType;
  const { theme, setTheme } = useTheme();

  const { credits } = useUserInfo();

  const {
    className = "",
    items = [
      { label: "Home", href: "/" },
      { label: "Image Generator", href: "/image-generator" },
      { label: "Pricing", href: "/pricing" },
    ],
  } = props;

  const [activeTab, setActiveTab] = useState<TabType>(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: TabType) => {
    setActiveTab(href);
    setMobileMenuOpen(false);
  };

  const handleChangeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      {/* 桌面端导航栏 */}
      <div
        className={classNames(
          className,
          "hidden h-14 md:flex flex-row items-center justify-between px-6 py-1 transition-colors duration-300",
          {
            "bg-base-200": scrollY > 60,
          },
        )}
      >
        <div className="flex items-center gap-2">
          <div className="text-lg gap-x-2 font-semibold text-base-content flex items-center">
            <Image
              src="/logo/home.webp"
              className="rounded-full"
              width={30}
              height={30}
              alt="logo"
            />
            <span>AI IMAGE</span>
          </div>
        </div>
        <nav className="flex relative mx-auto">
          <ul className="flex gap-8 list-none p-0 px-4 m-0 relative">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => handleClick(item.href as TabType)}
                  className={classNames(
                    "py-[0.6em] px-[1em] hover:text-primary text-base-content",
                    { "border-b": activeTab === item.href },
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mr-6 flex items-center">
          {/* SignedOut是在用户没有登录才显示 */}
          <SignedOut>
            <Button
              className="px-2.5! py-1.5! rounded-[10px]! bg-base-content text-base-100"
              color="default"
              variant="solid"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </SignedOut>

          {/* 登录后显示 */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {credits}
        <button
          className="btn cursor-pointer text-base-content"
          onClick={handleChangeTheme}
        >
          <SunMoon />
        </button>
      </div>

      {/* 移动端导航栏 */}
      <div
        className={classNames(
          className,
          "md:hidden flex flex-col overflow-hidden transition-all duration-300 py-3 px-4",
          {
            "bg-base-200": scrollY > 60,
          },
        )}
      >
        {/* 顶部栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/home.webp"
              className="rounded-xs"
              width={30}
              height={30}
              alt="logo"
            />
            <span className="text-lg font-semibold text-base-content">
              AI IMAGE
            </span>
          </div>

          {/* SignedOut是在用户没有登录才显示 */}
          <SignedOut>
            <Button
              className="px-2.5! py-1.5! rounded-[10px]! bg-base-content text-base-100"
              color="default"
              variant="solid"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </SignedOut>

          {/* 登录后显示 */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          <button
            className="btn cursor-pointer text-base-content"
            onClick={handleChangeTheme}
          >
            <SunMoon />
          </button>

          <button
            className=" border border-base-300  cursor-pointer text-base-content w-10 h-10 flex items-center justify-center rounded-full hover:bg-base-300 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* 展开的导航项 */}
        {mobileMenuOpen && (
          <div className="mt-3">
            {/* 菜单导航项容器 - 带阴影的卡片 */}
            <div className="bg-base-100 rounded-3xl shadow-lg p-4">
              <nav>
                <ul className="flex flex-col gap-1 list-none p-0 m-0">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => handleClick(item.href as TabType)}
                        className={classNames(
                          "block px-4 py-2 rounded-xl text-md font-medium transition-colors",
                          {
                            "bg-neutral/15 text-base-content":
                              activeTab === item.href,
                            "text-base-content/60 hover:bg-base-200/30":
                              activeTab !== item.href,
                          },
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
