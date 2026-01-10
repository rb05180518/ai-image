"use client";

import { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SunMoon, Menu, X } from "lucide-react";
import { Button } from "antd";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

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
          "hidden md:flex flex-row items-center justify-between rounded-full border border-base-100 bg-base-200 px-6 py-3 shadow-[0_12px_40px_oklch(from_var(--base-300)_l_c_h)] backdrop-blur-md"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-base-content">
            🔵 YELLOW IMAGE
          </span>
        </div>
        <nav className="flex relative mx-auto">
          <ul className="flex gap-8 list-none p-0 px-4 m-0 relative">
            {items.map((item) => (
              <li
                key={item.href}
                className={classNames(
                  "rounded-full relative cursor-pointer transition-all duration-300 ease",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-lg before:bg-black before:opacity-0 before:scale-0 before:transition-all before:duration-300 before:-z-10",
                  {
                    "text-shadow-none before:opacity-100 before:scale-100":
                      activeTab === item.href,
                  }
                )}
              >
                <Link
                  href={item.href}
                  onClick={() => handleClick(item.href as TabType)}
                  className={classNames(
                    "outline-none py-[0.6em] px-[1em] inline-block text-base-content",
                    { "text-neutral-content": activeTab === item.href }
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
        <button
          className="cursor-pointer text-base-content"
          onClick={handleChangeTheme}
        >
          <SunMoon />
        </button>
      </div>

      {/* 移动端导航栏 */}
      <div
        className={classNames(
          className,
          "md:hidden flex flex-col rounded-3xl border border-base-100 bg-base-200 shadow-[0_12px_40px_oklch(from_var(--base-300)_l_c_h)] backdrop-blur-md overflow-hidden transition-all duration-300 py-3 px-4"
        )}
      >
        {/* 顶部栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-base-content">
              🔵 YELLOW IMAGE
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
            className="cursor-pointer text-base-content"
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
                          }
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
