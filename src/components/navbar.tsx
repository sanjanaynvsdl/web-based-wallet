"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BsWallet2 } from "react-icons/bs";

export const NavBar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.classList.contains("dark");
    setIsDark(currentTheme);
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.remove("dark");
    } else {
      htmlElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <BsWallet2 className="text-foreground font-bold" size={24} />
          <p className="sm:text-2xl  text-lg font-bold tracking-tighter text-foreground">wallet xyz.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-md text-foreground font-bold">{isDark ? "Dark" : "Light"}</span>
          <button
            onClick={toggleTheme}
            className={cn(
              "relative w-14 h-7 cursor-pointer rounded-full p-1 transition-colors bg-primary dark:bg-primary hover:opacity-80"
            )}
            aria-label="Toggle theme"
          >
            <div
              className={cn(
                "absolute top-1 left-1 w-5 h-5 bg-background rounded-full transition-transform duration-300 flex items-center justify-center",
                isDark ? "translate-x-7" : ""
              )}
            >
              {isDark ? (
                <svg className="w-3 h-3 fill-foreground" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 fill-primary" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
