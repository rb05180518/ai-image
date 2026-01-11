// 同步用户信息到数据库
import { useUserInfo } from "./index";
import { useEffect, useRef } from "react";

const useSyncUser = () => {
  const { isLoaded, isSignedIn } = useUserInfo();
  const hasSynced = useRef(false);

  // 同步用户到数据库
  useEffect(() => {
    if (isLoaded && isSignedIn && !hasSynced.current) {
      hasSynced.current = true;

      const syncUser = async () => {
        try {
          console.log("开始同步用户到数据库...");
          const response = await fetch("/api/sync-user", {
            method: "POST",
          });

          const data = await response.json();

          if (data.success) {
            console.log("✅ 用户同步成功:", data.user);
          } else {
            console.error("❌ 用户同步失败:", data.error);
          }
        } catch (error) {
          console.error("❌ 同步用户时出错:", error);
        }
      };

      syncUser();
    }
  }, [isLoaded, isSignedIn]);
};

export default useSyncUser;
