import { Webhook } from "@creem_io/nextjs";
import { prisma } from "@/lib/prisma";
import { PRODUCTS } from "@/lib/creem";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async (data) => {
    const { customer, subscription, product, metadata, order } = data;
    const userId = metadata?.referenceId as string | undefined;
    const subscriptionId = metadata?.subscriptionId as string | undefined;

    if (!userId) {
      console.error("checkout.completed: 缺少 userId");
      return;
    }

    // 查找产品配置获取积分
    const productConfig = Object.values(PRODUCTS).find((p) => p.id === product.id);
    const credits = productConfig?.credits || 0;

    // 更新交易记录状态
    if (subscriptionId) {
      await prisma.subscription.update({
        where: { id: BigInt(subscriptionId) },
        data: {
          creemCustomerId: customer?.id,
          creemSubscriptionId: subscription?.id,
          amount: order?.amount ?? 0,
          currency: order?.currency ?? "USD",
          status: "completed",
          paidAt: new Date(),
        },
      });
    }

    // 更新用户积分
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        totalCredits: { increment: credits },
        hasPurchased: true,
      },
    });

    console.log(`用户 ${userId} 支付成功，增加 ${credits} 积分`);
  },
});
