import { Webhook } from "@creem_io/nextjs";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/creem";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async (data) => {
    const { customer, subscription, product, metadata } = data;
    const userId = metadata?.referenceId as string | undefined;

    // 根据产品 ID 查找积分数量
    const productConfig = Object.values(PRODUCTS).find(p => p.id === product.id);
    const credits = productConfig?.credits || 0;

    if (!userId) {
      console.error("checkout.completed: 缺少 userId");
      return;
    }

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        creemCustomerId: customer?.id,
        creemSubscriptionId: subscription?.id,
        productId: product.id,
        status: "active",
        credits,
      },
      update: {
        creemCustomerId: customer?.id,
        creemSubscriptionId: subscription?.id,
        productId: product.id,
        status: "active",
        credits: { increment: credits },
      },
    });

    console.log(`用户 ${userId} 支付成功，增加 ${credits} 积分`);
  },

  onSubscriptionActive: async (data) => {
    const { id, customer, current_period_start_date, current_period_end_date, metadata } = data;
    const userId = metadata?.referenceId as string | undefined;

    if (!userId) {
      console.error("subscription.active: 缺少 userId");
      return;
    }

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        creemCustomerId: customer.id,
        creemSubscriptionId: id,
        status: "active",
        currentPeriodStart: current_period_start_date,
        currentPeriodEnd: current_period_end_date,
      },
      update: {
        status: "active",
        currentPeriodStart: current_period_start_date,
        currentPeriodEnd: current_period_end_date,
      },
    });

    console.log(`用户 ${userId} 订阅已激活`);
  },

  onSubscriptionCanceled: async (data) => {
    const { metadata } = data;
    const userId = metadata?.referenceId as string | undefined;

    if (!userId) {
      console.error("subscription.canceled: 缺少 userId");
      return;
    }

    await prisma.subscription.update({
      where: { userId },
      data: { status: "canceled" },
    });

    console.log(`用户 ${userId} 订阅已取消`);
  },
});
