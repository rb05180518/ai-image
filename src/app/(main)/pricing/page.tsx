"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PRODUCTS, type ProductKey } from "@/lib/creem";
import { useUser } from "@clerk/nextjs";

const plans = [
  {
    key: "basic" as ProductKey,
    name: "Basic",
    price: "$1",
    credits: 100,
    popular: true,
    features: ["100 积分", "所有模型访问", "标准生成速度", "邮件支持"],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">选择你的套餐</h1>
        <p className="text-base-content/60 text-center mb-12">
          选择适合你的套餐，开始创作之旅
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PricingCard key={plan.key} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

function PricingCard({ plan }: { plan: (typeof plans)[0] }) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const product = PRODUCTS[plan.key];

  const handleCheckout = () => {
    if (!user?.id) return;
    setLoading(true);
    const params = new URLSearchParams({
      productId: product.id,
      referenceId: user.id,
    });
    window.location.href = `/api/checkout?${params.toString()}`;
  };

  return (
    <div
      className={`relative rounded-2xl p-6 border ${
        plan.popular
          ? "border-primary bg-primary/5 shadow-lg"
          : "border-base-300 bg-base-100"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-xs px-3 py-1 rounded-full">
          最受欢迎
        </span>
      )}

      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{plan.price}</span>
        <span className="text-base-content/60">/月</span>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={loading || !user}
        className={`w-full py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
          plan.popular
            ? "bg-primary text-primary-content hover:bg-primary/90"
            : "bg-base-200 hover:bg-base-300"
        } ${loading ? "opacity-50" : ""}`}
      >
        {loading ? "跳转中..." : "立即购买"}
      </button>
    </div>
  );
}

export default Pricing;
