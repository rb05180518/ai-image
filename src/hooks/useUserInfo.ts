import { useUser } from "@clerk/nextjs";
import useSWR from "swr";
import { request } from "@/lib/request";

interface CreditsResponse {
  credits: number;
}

const useUserInfo = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const { data, error, isLoading, mutate } = useSWR<CreditsResponse>(
    isSignedIn ? "/api/credits" : null,
    (url: string) => request.get<CreditsResponse>(url),
  );

  return {
    isLoaded,
    isSignedIn,
    user,
    credits: data?.credits ?? 0,
    creditsLoading: isLoading,
    creditsError: error,
    refreshCredits: mutate,
  };
};

export default useUserInfo;
