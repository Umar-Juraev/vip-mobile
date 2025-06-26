
import { ThemedView } from "@/components/ThemedView";
import { getLocalUserInfo } from "@/utils/storage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function HomeScreen() {
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await getLocalUserInfo();
      if (storedToken) {
        router.replace("/(tabs)/scanner");
      } else {
        router.push("/(tabs)/login");
      }
    };
    checkToken();
  }, []);

  return <ThemedView />;
}
