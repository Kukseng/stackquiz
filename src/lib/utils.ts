import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//  merge class names safely
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

//  format currency with type-safe options
export function formatCurrency(
    amount: number,
    currency: string = "USD",
    options: Intl.NumberFormatOptions = {}
): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        ...options,
    }).format(amount);
}

//  unique id generator
export function generateUniqueId(prefix: string = "id"): string {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

//  truncate text safely
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
}

//  format date with options
export function formatDate(
    date: Date,
    options: Intl.DateTimeFormatOptions = {}
): string {
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...options,
    }).format(date);
}

//  debounce function
export function debounce<F extends (...args: unknown[]) => void>(
    func: F,
    wait: number
): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function (...args: Parameters<F>): void {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}


export function throttle<F extends (...args: unknown[]) => void>(
    func: F,
    limit: number
): (...args: Parameters<F>) => void {
    let inThrottle = false;
    return function (...args: Parameters<F>): void {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
