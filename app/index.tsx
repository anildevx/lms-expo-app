import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { useAuthStore } from "../src/features/auth/store";
import { SplashScreen } from "../src/components/common";
import { STORAGE_KEYS } from "../src/constants";

/**
 * Index route - handles initial routing based on auth state
 */
export default function Index() {
  const { isAuthenticated, setToken } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const [token] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);

      if (token) {
        setToken(token);
      }
    } catch (error) {
      console.log("[Index] Auth check error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return <SplashScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href={"/(tabs)" as any} />;
  }

  return <Redirect href={"/(auth)/login" as any} />;
}
