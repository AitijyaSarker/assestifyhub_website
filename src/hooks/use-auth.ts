import { useCallback, useEffect, useState } from "react";
import { cmsStore } from "@/lib/cms-store";

export interface UserSession {
  email: string;
  name: string;
  role: "Super Admin" | "Admin" | "Editor" | "Viewer";
  token: string;
}

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("assetify_admin_session");
    if (!stored) {
      setSessionChecked(true);
      return;
    }
    let savedSession: UserSession;
    try {
      savedSession = JSON.parse(stored) as UserSession;
    } catch {
      localStorage.removeItem("assetify_admin_session");
      setSessionChecked(true);
      return;
    }
    if (!savedSession.token) {
      localStorage.removeItem("assetify_admin_session");
      setSessionChecked(true);
      return;
    }

    const controller = new AbortController();
    fetch("/api/auth/session", {
      headers: { Authorization: `Bearer ${savedSession.token}` },
      signal: controller.signal,
    }).then((response) => {
      if (!response.ok) {
        localStorage.removeItem("assetify_admin_session");
      } else {
        setSession(savedSession);
      }
    }).catch((error: unknown) => {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Could not validate the admin session", error);
      }
    }).finally(() => {
      if (!controller.signal.aborted) setSessionChecked(true);
    });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json() as {
        success?: boolean;
        token?: string;
        user?: Omit<UserSession, "token">;
        error?: string;
      };
      if (!response.ok || !payload.success || !payload.token || !payload.user) {
        return { success: false as const, error: payload.error || "Admin sign-in failed." };
      }
      const newSession: UserSession = { ...payload.user, token: payload.token };
      setSession(newSession);
      localStorage.setItem("assetify_admin_session", JSON.stringify(newSession));
      await cmsStore.refreshRemoteContent();
      return { success: true as const };
    } catch (error) {
      console.error("Admin sign-in request failed", error);
      return {
        success: false as const,
        error: "Cannot reach the admin API. Start the API server and check its database connection.",
      };
    }
  }, []);

  const logout = () => {
    setSession(null);
    localStorage.removeItem("assetify_admin_session");
    void cmsStore.refreshRemoteContent();
  };

  return { session, isAuthenticated: Boolean(session), isLoadingSession: !sessionChecked, login, logout };
}
