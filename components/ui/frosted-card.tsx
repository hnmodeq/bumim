"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FrostedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  accentGlow?: string;
  className?: string;
  interactive?: boolean;
}

export function FrostedCard({
  children,
  accentGlow = "rgba(255, 223, 0, 0.15)",
  className,
  interactive = true,
  ...props
}: FrostedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [interactive]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos(null);
      }}
      className={cn(
        "relative rounded-3xl border border-white/[0.1] bg-zinc-950/40 backdrop-blur-2xl p-6 overflow-hidden transition-all duration-300",
        "shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]",
        interactive && "hover:border-white/[0.2] hover:bg-zinc-950/50 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.25)]",
        className
      )}
      {...props}
    >
      {/* Specular Top Reflection line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Ambient background diffuse lighting */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-40 transition-opacity duration-500"
        style={{ background: accentGlow }}
      />

      {/* Dynamic Cursor Light Sheen */}
      {interactive && isHovered && mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
