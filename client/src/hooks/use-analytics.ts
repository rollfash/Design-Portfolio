import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

function getSessionId(): string {
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("_sid", id);
  }
  return id;
}

export function useAnalytics() {
  const [location] = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();
    const currentPath = location;

    // Send duration for previous page if we navigated
    if (lastPathRef.current && lastPathRef.current !== currentPath) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      navigator.sendBeacon(
        "/api/analytics/pageview",
        JSON.stringify({ path: lastPathRef.current, sessionId, duration })
      );
    }

    // Record this page view
    startTimeRef.current = Date.now();
    lastPathRef.current = currentPath;

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: currentPath, sessionId }),
    }).catch(() => {});

    // Send duration when leaving
    const handleUnload = () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      navigator.sendBeacon(
        "/api/analytics/pageview",
        JSON.stringify({ path: currentPath, sessionId, duration })
      );
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [location]);
}
