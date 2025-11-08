"use client"

import { useCallback, useMemo, useState } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

type RatingProps = {
    value?: number
    defaultValue?: number
    max?: number
    readOnly?: boolean
    disabled?: boolean
    onChange?: (value: number) => void
    className?: string
    size?: number
    ariaLabel?: string
}

export default function Rating({
    value,
    defaultValue = 0,
    max = 5,
    readOnly = false,
    disabled = false,
    onChange,
    className,
    size = 22,
    ariaLabel = "Đánh giá bằng sao"
}: RatingProps) {
    const isControlled = typeof value === "number";
    const [internalValue, setInternalValue] = useState<number>(defaultValue);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const current = isControlled ? (value ?? 0) : internalValue;
    const effectiveValue = hoverValue ?? current;

    const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);

    const handleSelect = useCallback((newValue: number) => {
        if (readOnly || disabled) return;
        if (!isControlled) setInternalValue(newValue);
        onChange?.(newValue);
    }, [disabled, isControlled, onChange, readOnly]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (readOnly || disabled) return;
        const key = e.key;
        if (key === "ArrowRight" || key === "ArrowUp") {
            e.preventDefault();
            const next = Math.min(max, current + 1);
            handleSelect(next);
        } else if (key === "ArrowLeft" || key === "ArrowDown") {
            e.preventDefault();
            const prev = Math.max(0, current - 1);
            handleSelect(prev);
        } else if (key === "Home") {
            e.preventDefault();
            handleSelect(0);
        } else if (key === "End") {
            e.preventDefault();
            handleSelect(max);
        } else if (key === " ") {
            e.preventDefault();
            handleSelect(current);
        }
    }, [current, disabled, handleSelect, max, readOnly]);

    return (
        <div
            role="slider"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={current}
            aria-readonly={readOnly || undefined}
            aria-disabled={disabled || undefined}
            tabIndex={readOnly || disabled ? -1 : 0}
            onKeyDown={handleKeyDown}
            className={`inline-flex items-center gap-1 select-none ${disabled ? "opacity-60 cursor-not-allowed" : (!readOnly ? "cursor-pointer" : "")
                } ${className ?? ""}`}
            onMouseLeave={() => setHoverValue(null)}
        >
            {stars.map((star) => {
                const filled = star <= effectiveValue;
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={disabled}
                        aria-label={`${star} ${star === 1 ? "sao" : "sao"}`}
                        onMouseEnter={() => !readOnly && setHoverValue(star)}
                        onFocus={() => undefined}
                        onClick={() => handleSelect(star)}
                        className={`p-0.5 ${readOnly ? "cursor-default" : (!disabled ? "cursor-pointer" : "")}`}
                    >
                        {filled ? (
                            <IoStar size={size} className="text-yellow-400 drop-shadow-sm" />
                        ) : (
                            <IoStarOutline size={size} className="text-yellow-400" />
                        )}
                    </button>
                )
            })}
        </div>
    );
}


