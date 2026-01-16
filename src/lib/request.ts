interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  timeout?: number;
}

// 基础请求函数
async function baseRequest<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  options?: RequestOptions
): Promise<T> {
  const { timeout = 10000, ...restOptions } = options || {};

  // 超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...restOptions.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
      ...restOptions,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// 导出便捷方法
export const request = {
  get: <T>(url: string, options?: RequestOptions) =>
    baseRequest<T>(url, "GET", undefined, options),

  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    baseRequest<T>(url, "POST", data, options),

  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    baseRequest<T>(url, "PUT", data, options),

  delete: <T>(url: string, options?: RequestOptions) =>
    baseRequest<T>(url, "DELETE", undefined, options),
};
