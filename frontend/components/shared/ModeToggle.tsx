"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
    const {theme, setTheme} = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all"/>
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all"/>
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
