"use client";

import { useState } from "react";
import { XIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Free-form multi-value input rendered as removable chips (used for languages,
 * industries, and preferred project types). Add with Enter or comma; remove
 * with the × button.
 */
export function TagInput({
  value,
  onChange,
  placeholder,
  suggestions = [],
  maxItems = 20,
  id,
  className,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxItems?: number;
  id?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().replace(/,+$/, "");
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft("");
      return;
    }
    if (value.length >= maxItems) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  const remainingSuggestions = suggestions.filter((s) => !value.includes(s));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border bg-accent px-2.5 py-1 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <XIcon className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <span className="text-xs text-muted-foreground">{placeholder}</span>
        )}
      </div>

      <div className="flex gap-1.5">
        <Input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(draft);
            } else if (e.key === "Backspace" && draft === "" && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={placeholder}
          className="h-9"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => addTag(draft)}
          aria-label="Add"
        >
          <PlusIcon className="size-4" aria-hidden />
        </Button>
      </div>

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remainingSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
