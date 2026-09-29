"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  glowOpacity?: number;
}

export function GlowCard({
  children,
  glowColor = "#ffdf00",
  className,
  glowOpacity = 0.15,
  ...props
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

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
        "relative rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-xl p-5 overflow-hidden transition-all duration-300 group hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Follower Radial Glow */}
      {isHovered && mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}25, transparent 70%)`,
          }}
        />
      )}

      {/* Subtle Top Border Ambient Highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}60, transparent)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
