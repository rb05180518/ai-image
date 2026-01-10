"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-4">
        {/* 加载动画 */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-base-300 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* 加载文本 */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-base-content">Signing you in...</h2>
          <p className="text-sm text-base-content/60 mt-2">Please wait a moment</p>
        </div>
      </div>

      {/* Clerk 的回调处理组件 - 隐藏 */}
      <div className="hidden">
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
