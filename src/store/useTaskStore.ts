import { create } from "zustand";
import { request } from "@/lib/request";
import { showTaskCompletedNotification } from "@/contexts/NotificationContext";

export interface IParams {
  provider: string;
  process: string;
  prompt: string;
  model?: string;
  resolution?: string;
  aspectRatio?: string;
  outputFormat?: string;
}

export type IQueueState =
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "delayed";

interface Usage {
  id: string;
  taskId: string;
  inputMeta: {
    params: { prompt: string; aspect_ratio: string; image_size?: string };
  };
  outputMeta?: { imageUrl: string };
  queueState: IQueueState;
  progress: number;
}

interface TaskStore {
  usages: Usage[];
  isPolling: boolean;
  pollingTimer: NodeJS.Timeout | null;
  previousUsages: Map<string, IQueueState>; // 记录上一次的任务状态
  fetchUsages: () => Promise<void>;
  submitTask: (params: IParams) => Promise<string | null>;
  startPolling: () => void;
  stopPolling: () => void;
  onTaskCompleted?: (taskId: string, usage: Usage) => void; // 任务完成回调
}

interface IUsagesResponse {
  success: boolean;
  usages: Usage[];
}

interface ISubmitResponse {
  success: boolean;
  taskId: string;
}

const useTaskStore = create<TaskStore>((set, get) => {
  return {
    usages: [],
    isPolling: false, // 是否在轮询
    pollingTimer: null, // 轮询的定时器
    previousUsages: new Map<string, IQueueState>(), // 记录上一次的任务状态

    fetchUsages: async () => {
      const res = await request.get<IUsagesResponse>("/api/usages");
      if (res.success) {
        const { previousUsages, onTaskCompleted } = get();

        // 检测状态变化：从 active/waiting 变为 completed
        res.usages.forEach((usage: Usage) => {
          const previousState = previousUsages.get(usage.taskId);

          // 只有当任务从 active 或 waiting 变为 completed 时才通知
          if (
            usage.queueState === "completed" &&
            previousState &&
            (previousState === "active" || previousState === "waiting")
          ) {
            // 直接调用通知函数
            showTaskCompletedNotification();

            // 触发回调（如果有的话）
            if (onTaskCompleted) {
              onTaskCompleted(usage.taskId, usage);
            }
          }

          // 更新状态记录
          previousUsages.set(usage.taskId, usage.queueState);
        });

        // 更新usages
        set({ usages: res.usages, previousUsages });

        // 自动停止轮询
        const hasActive = res.usages.some(
          (u: Usage) => u.queueState === "waiting" || u.queueState === "active",
        );

        // 如果没有了正在处理的任务或者等待的任务。并且轮询在轮询的时候，停止轮询
        if (!hasActive && get().isPolling) {
          get().stopPolling();
        }
      }
    },

    submitTask: async (params: IParams) => {
      console.log(params, 66);

      const data = await request.post<ISubmitResponse>(
        "/api/task/submit",
        params,
      );

      if (data.success) {
        await get().fetchUsages();
        get().startPolling();
        return data.taskId;
      }
      return null;
    },

    // 开始轮询
    startPolling: () => {
      if (get().isPolling) return;

      const timer = setInterval(() => get().fetchUsages(), 5000);
      set({ isPolling: true, pollingTimer: timer });
    },

    // 停止轮询
    stopPolling: () => {
      const { pollingTimer } = get();
      if (pollingTimer) clearInterval(pollingTimer);
      set({ isPolling: false, pollingTimer: null });
    },
  };
});

export default useTaskStore;
