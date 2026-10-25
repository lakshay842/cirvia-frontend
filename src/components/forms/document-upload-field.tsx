"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Label } from "@/components/core/label";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

interface DocumentUploadFieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function DocumentUploadField({
  id,
  label,
  hint,
  required,
  value,
  onChange,
  error,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    setLocalError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLocalError("Use JPG, PNG, or WebP.");
      onChange(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("File must be under 10 MB.");
      onChange(null);
      return;
    }
    onChange(file);
  };

  const displayError = error ?? localError ?? undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-[18px] border border-dashed border-border bg-background/40 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5",
          displayError && "border-danger/50",
        )}
      >
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 shrink-0" aria-hidden />
          {value ? value.name : "Choose image"}
        </span>
        {value && (
          <span className="text-xs text-success">Selected</span>
        )}
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {displayError && <p className="text-xs text-danger">{displayError}</p>}
    </div>
  );
}
