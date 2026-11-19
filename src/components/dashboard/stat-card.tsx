import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: "indigo" | "blue" | "amber" | "emerald" | "purple" | "rose" | "cyan";
  onClick?: () => void;
}

const colorStyles = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    glow: "hover:border-indigo-500/40",
    iconBg: "bg-indigo-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "hover:border-blue-500/40",
    iconBg: "bg-blue-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "hover:border-amber-500/40",
    iconBg: "bg-amber-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "hover:border-purple-500/40",
    iconBg: "bg-purple-500/20",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    glow: "hover:border-rose-500/40",
    iconBg: "bg-rose-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "hover:border-cyan-500/40",
    iconBg: "bg-cyan-500/20",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "indigo",
  onClick,
}: StatCardProps) {
  const styles = colorStyles[accentColor];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-xl bg-[#121620] border border-[#1e2536] transition-all duration-150 select-none",
        styles.glow,
        onClick && "cursor-pointer active:scale-[0.99]"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn("p-2 rounded-lg", styles.iconBg)}>
          <Icon className={cn("w-4 h-4", styles.text)} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">
          {value}
        </span>
        {trend && (
          <span className="text-[11px] font-medium text-slate-400">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
