import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { debugLog } from "@/lib/_core/debug-log";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

type UseAuthOptions = {
  autoFetch?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  const fetchUser = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isCurrentRequest = () =>
      mountedRef.current && requestIdRef.current === requestId;
    debugLog("[useAuth] fetchUser called");
    try {
      if (!isCurrentRequest()) return;
      setLoading(true);
      setError(null);

      // Web platform: use cookie-based auth, fetch user from API
      if (Platform.OS === "web") {
        debugLog("[useAuth] Web platform: fetching user from API...");
        const apiUser = await Api.getMe();
        debugLog("[useAuth] API user response:", apiUser);

        if (!isCurrentRequest()) return;
        if (apiUser) {
          const userInfo: Auth.User = {
            id: apiUser.id,
            openId: apiUser.openId,
            name: apiUser.name,
            email: apiUser.email,
            loginMethod: apiUser.loginMethod,
            lastSignedIn: new Date(apiUser.lastSignedIn),
          };
          setUser(userInfo);
          // Cache user info in localStorage for faster subsequent loads
          await Auth.setUserInfo(userInfo);
          debugLog("[useAuth] Web user set from API:", userInfo);
        } else {
          debugLog("[useAuth] Web: No authenticated user from API");
          setUser(null);
          await Auth.clearUserInfo();
        }
        return;
      }

      // Native platform: use token-based auth
      debugLog("[useAuth] Native platform: checking for session token...");
      const sessionToken = await Auth.getSessionToken();
      if (!isCurrentRequest()) return;
      debugLog(
        "[useAuth] Session token:",
        sessionToken
          ? `present (${sessionToken.substring(0, 20)}...)`
          : "missing",
      );
      if (!sessionToken) {
        debugLog("[useAuth] No session token, setting user to null");
        setUser(null);
        return;
      }

      // Use cached user info for native (token validates the session)
      const cachedUser = await Auth.getUserInfo();
      if (!isCurrentRequest()) return;
      debugLog("[useAuth] Cached user:", cachedUser);
      if (cachedUser) {
        debugLog("[useAuth] Using cached user info");
        setUser(cachedUser);
      } else {
        debugLog("[useAuth] No cached user, setting user to null");
        setUser(null);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch user");
      console.error("[useAuth] fetchUser error:", error);
      if (isCurrentRequest()) {
        setError(error);
        setUser(null);
      }
    } finally {
      if (!isCurrentRequest()) return;
      setLoading(false);
      debugLog("[useAuth] fetchUser completed, loading:", false);
    }
  }, []);

  const logout = useCallback(async () => {
    requestIdRef.current += 1;
    try {
      await Api.logout();
    } catch (err) {
      console.error("[Auth] Logout API call failed:", err);
      // Continue with logout even if API call fails
    } finally {
      await Auth.removeSessionToken();
      await Auth.clearUserInfo();
      if (!mountedRef.current) return;
      setUser(null);
      setError(null);
    }
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    mountedRef.current = true;
    let active = true;
    debugLog(
      "[useAuth] useEffect triggered, autoFetch:",
      autoFetch,
      "platform:",
      Platform.OS,
    );
    if (autoFetch) {
      if (Platform.OS === "web") {
        // Web: fetch user from API directly (user will login manually if needed)
        debugLog("[useAuth] Web: fetching user from API...");
        void fetchUser();
      } else {
        // Native: check for cached user info first for faster initial loads.
        void Auth.getUserInfo()
          .then((cachedUser) => {
            if (!active) return;
            debugLog("[useAuth] Native cached user check:", cachedUser);
            if (cachedUser) {
              debugLog("[useAuth] Native: setting cached user immediately");
              setUser(cachedUser);
              setLoading(false);
            } else {
              // No cached user, check session token.
              void fetchUser();
            }
          })
          .catch(() => {
            if (!active) return;
            // A corrupted or unavailable cache should not block session recovery.
            void fetchUser();
          });
      }
    } else {
      debugLog("[useAuth] autoFetch disabled, setting loading to false");
      setLoading(false);
    }
    return () => {
      active = false;
      mountedRef.current = false;
    };
  }, [autoFetch, fetchUser]);

  useEffect(() => {
    debugLog("[useAuth] State updated:", {
      hasUser: !!user,
      loading,
      isAuthenticated,
      error: error?.message,
    });
  }, [user, loading, isAuthenticated, error]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    refresh: fetchUser,
    logout,
  };
}
