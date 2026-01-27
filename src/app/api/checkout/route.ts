import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/creem";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  // 查找产品配置
  const productConfig = Object.values(PRODUCTS).find((p) => p.id === productId);
  const credits = productConfig?.credits ?? 0;

  // 创建待支付的交易记录
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      productId,
      credits,
      status: "pending",
    },
  });

  // 跳转到 Creem checkout 路由
  const params = new URLSearchParams({
    productId,
    referenceId: userId,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    metadata: JSON.stringify({ subscriptionId: subscription.id.toString() }),
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/creem-checkout?${params.toString()}`,
  );
}
