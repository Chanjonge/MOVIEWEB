"use client";

import { Star } from "lucide-react";
import clsx from "clsx";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  colorClassName?: string;
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 22,
  colorClassName = "text-gold",
}: StarRatingProps) {
  return (
    <div
      className="flex items-center gap-0.5"
      role={readOnly ? undefined : "radiogroup"}
      aria-label="평점"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n === value ? 0 : n)}
            aria-label={`${n}점`}
            aria-pressed={filled}
            className={clsx(
              "transition",
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              size={size}
              className={filled ? colorClassName : "text-muted/40"}
              fill={filled ? "currentColor" : "none"}
              strokeWidth={filled ? 0 : 1.5}
              style={filled ? { filter: "drop-shadow(0 0 4px currentColor)" } : undefined}
            />
          </button>
        );
      })}
    </div>
  );
}
