// 产品配置
export const PRODUCTS = {
  // 测试套餐 - $1
  basic: {
    id: "prod_5il6SKjnu4GTFVhwtHBJCQ",
    credits: 100,
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
