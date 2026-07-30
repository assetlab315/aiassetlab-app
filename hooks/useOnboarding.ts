"use client";

import { useCallback, useEffect, useState } from "react";

export const ONBOARDING_STORAGE_KEY = "aiassetlab:onboarding:v1";

export function useOnboarding() {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem(ONBOARDING_STORAGE_KEY) === "completed";
      setIsOpen(!hasSeen);
    } catch {
      setIsOpen(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  const complete = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "completed");
    } catch {
      // Keep the UI usable even when localStorage is unavailable.
    }
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {
      // Future help entry points can still call open() if storage is unavailable.
    }
    setIsOpen(true);
  }, []);

  return {
    isReady,
    isOpen,
    complete,
    skip: complete,
    open,
    reset,
  };
}
