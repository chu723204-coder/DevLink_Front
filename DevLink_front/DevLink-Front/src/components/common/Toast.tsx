import type { ReactNode, HTMLAttributes } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  variant?: ToastVariant;
  position?: ToastPosition;
  isVisible?: boolean;
  hasCloseButton?: boolean;
  children: ReactNode;
  onClose?: () => void;
}

const variantStyles = {
  success: {
    container: "bg-[#1D4ED8] text-white",
    icon: "text-white",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  error: {
    container: "bg-[#EF4444] text-white",
    icon: "text-white",
    iconPath:
      "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  warning: {
    container: "bg-[#F59E0B] text-white",
    icon: "text-white",
    iconPath:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  },
  info: {
    container: "bg-[#0F172A] text-white",
    icon: "text-white",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
} as const

const positionStyles: Record<ToastPosition, string> = {
  "top-right":     "top-8 right-8",
  "top-center":    "top-8 left-1/2 -translate-x-1/2",
  "top-left":      "top-8 left-8",
  "bottom-right":  "bottom-8 right-8",
  "bottom-center": "bottom-8 left-1/2 -translate-x-1/2",
  "bottom-left":   "bottom-8 left-8",
};

const baseStyle =
  "fixed z-[99999] flex items-center gap-2 px-6 py-3 rounded-full shadow-lg font-bold text-sm whitespace-nowrap transition-all duration-300";

export const Toast = ({
  variant = "info",
  position = "bottom-center",
  isVisible = true,
  hasCloseButton = false,
  children,
  onClose,
  className = "",
  ...props
}: ToastProps) => {

  const { container, icon, iconPath } = variantStyles[variant];

  const combinedClassName = `
    ${baseStyle}
    ${container}
    ${positionStyles[position]}
    ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4 pointer-events-none"
    }
    ${className}
  `;

  return (
    <div role="alert" aria-live="polite" className={combinedClassName} {...props}>
      <svg
        className={`w-4 h-4 shrink-0 ${icon}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={iconPath}
        />
      </svg>
      <span>{children}</span>
      {hasCloseButton && (
        <button
          onClick={onClose}
          aria-label="닫기"
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-1"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};