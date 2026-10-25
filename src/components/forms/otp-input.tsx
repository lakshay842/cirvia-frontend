"use client";

import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

export function OtpInput({ value, onChange, length = 6, className }: OtpInputProps) {
  const digits = value.padEnd(length, " ").split("").slice(0, length);

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={digits[i]?.trim() ?? ""}
          className="h-12 w-10 rounded-[12px] border border-border bg-surface/50 text-center text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, "").slice(-1);
            const arr = value.split("");
            arr[i] = char;
            const next = arr.join("").slice(0, length);
            onChange(next);
            if (char && i < length - 1) {
              const nextInput = e.target.parentElement?.children[i + 1] as HTMLInputElement | undefined;
              nextInput?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i]?.trim() && i > 0) {
              const prev = e.currentTarget.parentElement?.children[i - 1] as HTMLInputElement | undefined;
              prev?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}
