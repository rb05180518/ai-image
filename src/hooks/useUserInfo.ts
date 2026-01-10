import { useUser } from "@clerk/nextjs";

const useUserInfo = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  return {
    isLoaded,
    isSignedIn,
    user,
  };
};

export default useUserInfo;
