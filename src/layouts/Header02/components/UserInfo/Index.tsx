"use client";

import { useState, useRef } from "react";
import { useClerk } from "@clerk/nextjs";
import { Settings, CreditCard, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUserInfo } from "@/hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const UserInfo = () => {
  const { signOut, openUserProfile } = useClerk();
  const { credits, user } = useUserInfo();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  };

  if (!user) return null;

  const avatarUrl = user.imageUrl;
  const displayName = user.fullName || user.username || "User";
  const email = user.primaryEmailAddress?.emailAddress || "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <button className="w-9 cursor-pointer h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition duration-200">
            <Image
              src={avatarUrl}
              alt={displayName}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-72 p-0 bg-base-200 rounded-2xl border-base-300 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <Image
                src={avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base-content truncate">
                {displayName}
              </p>
              <p className="text-sm text-base-content/60 truncate">{email}</p>
            </div>
            <button
              onClick={() => {
                openUserProfile();
                setOpen(false);
              }}
              className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-content/20 transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-base-content" />
            </button>
          </div>

          <div className="border-t border-base-300" />

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-base-content" />
              <span className="text-2xl font-bold">{credits ?? 0}</span>
              <span className="text-base-content/60">Credits Left</span>
            </div>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block w-full py-2.5 bg-base-300 rounded-xl text-center font-medium hover:bg-base-content/20 transition-colors"
            >
              Upgrade
            </Link>
          </div>

          <div className="border-t border-base-300" />

          <div className="py-2">
            <Link
              href="/billing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-base-300 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span>Billing & Subscription</span>
            </Link>
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-base-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          <div className="border-t border-base-300 flex">
            <Link
              href="/terms"
              className="flex-1 py-3 text-center text-sm hover:bg-base-300 transition-colors"
            >
              Terms
            </Link>
            <div className="w-px bg-base-300" />
            <Link
              href="/privacy"
              className="flex-1 py-3 text-center text-sm hover:bg-base-300 transition-colors"
            >
              Privacy
            </Link>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default UserInfo;
