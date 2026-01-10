import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义需要登录才能访问的路由
const isProtectedRoute = createRouteMatcher([
  '/image-generator(.*)',
  '/pricing(.*)',
  // 添加其他需要保护的路由
]);

export default clerkMiddleware(async (auth, req) => {
  // 如果是受保护的路由，要求用户登录
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
