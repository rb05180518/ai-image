"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { notification } from "antd";
import type { NotificationInstance } from "antd/es/notification/interface";

interface NotificationContextType {
  api: NotificationInstance;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// 全局通知 API 引用（供 store 使用）
let globalNotificationApi: NotificationInstance | null = null;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  // 将 API 保存到全局变量
  useEffect(() => {
    globalNotificationApi = api;
    return () => {
      globalNotificationApi = null;
    };
  }, [api]);

  return (
    <NotificationContext.Provider value={{ api }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// 组件中使用
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  const open = () => {
    context.api.open({
      message: "任务完成",
      description: "您的图片已生成完成！",
      showProgress: true,
      pauseOnHover: false,
    });
  };

  return { open };
};

// 供 store 使用的全局通知函数
export const showTaskCompletedNotification = () => {
  if (globalNotificationApi) {
    globalNotificationApi.open({
      message: "任务完成",
      description: "您的图片已生成完成！",
      showProgress: true,
      pauseOnHover: false,
    });
  }
};
