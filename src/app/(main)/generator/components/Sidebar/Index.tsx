"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Image, Video } from "lucide-react";
import classNames from "classnames";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: Image,
    label: "Image",
    href: "/generator/image",
  },
  {
    icon: Video,
    label: "Video",
    href: "/generator/video",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed flex flex-col items-center gap-6 py-6 px-3 bg-base-100 h-screen border-r border-base-300/40 z-50">
      {sidebarItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={classNames(
              "flex flex-col items-center gap-2 rounded-lg transition-colors",
              isActive
                ? "text-base-content"
                : "text-base-content/60 hover:text-base-content",
            )}
          >
            <div
              className={classNames(
                "rounded-xl w-10 h-10 flex justify-center items-center transition-colors",
                isActive ? "bg-base-300" : "hover:bg-base-300/50",
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
