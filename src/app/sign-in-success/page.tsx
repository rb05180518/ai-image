"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useUserInfo } from "@/hooks/index";

export default function SSOCallback() {
  const hasRedirected = useRef(false);
  const { isLoaded, isSignedIn } = useUserInfo();

  useEffect(() => {
    // 当用户登录成功后，硬刷新跳转到首页
    if (isLoaded && isSignedIn && !hasRedirected.current) {
      hasRedirected.current = true;
      // 使用 window.location.href 强制刷新，确保 Cookie 同步到后端
      window.location.href = "/";
    }
  }, [isLoaded, isSignedIn]);

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
          <p className="text-sm text-base-content/60 mt-2">loading...</p>
        </div>
      </div>

      {/* Clerk 认证回调组件，认证完成后继续停留在这个页面，让useEffect去处理跳转到首页 */}
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/sign-in-success"
        signUpForceRedirectUrl="/sign-in-success"
      />
      <div id="clerk-captcha" />
    </div>
  );
}
