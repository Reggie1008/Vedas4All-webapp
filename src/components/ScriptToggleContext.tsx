"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "v4a-show-devanagari";

const ScriptToggleContext = createContext<{
  showDevanagari: boolean;
  toggle: () => void;
} | null>(null);

export function ScriptToggleProvider({ children }: { children: React.ReactNode }) {
  const [showDevanagari, setShowDevanagari] = useState(false);

  useEffect(() => {
    setShowDevanagari(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function toggle() {
    setShowDevanagari((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <ScriptToggleContext.Provider value={{ showDevanagari, toggle }}>
      {children}
    </ScriptToggleContext.Provider>
  );
}

export function useScriptToggle() {
  const ctx = useContext(ScriptToggleContext);
  if (!ctx) throw new Error("useScriptToggle must be used within ScriptToggleProvider");
  return ctx;
}
