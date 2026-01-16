import { create } from "zustand";
import { request } from "@/lib/request";

export interface IParams {
  provider: string;
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
  fetchUsages: () => Promise<void>;
  submitTask: (params: IParams) => Promise<string | null>;
  startPolling: () => void;
  stopPolling: () => void;
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

    fetchUsages: async () => {
      const res = await request.get<IUsagesResponse>("/api/usages");
      if (res.success) {
        // 更新usages
        set({ usages: res.usages });

        // 自动停止轮询
        const hasActive = res.usages.some(
          (u: Usage) => u.queueState === "waiting" || u.queueState === "active"
        );

        // 如果没有了正在处理的任务或者等待的任务。并且轮询在轮询的时候，停止轮询
        if (!hasActive && get().isPolling) {
          get().stopPolling();
        }
      }
    },

    submitTask: async (params: IParams) => {
      const data = await request.post<ISubmitResponse>(
        "/api/task/submit",
        params
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
