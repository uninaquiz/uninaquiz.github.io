import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "#00FF87", color: "#0B132B", border: "none" },
  ghost:   { background: "#1a2850", color: "#fff",    border: "1px solid #1e3060" },
  danger:  { background: "transparent", color: "#ff4d6d", border: "1px solid #ff4d6d" },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 14px",  fontSize: "0.7rem" },
  md: { padding: "10px 20px", fontSize: "0.8rem" },
  lg: { padding: "14px 32px", fontSize: "0.875rem" },
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  style,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-busy={isLoading}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        letterSpacing: "0.05em",
        borderRadius: "8px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.5 : 1,
        transition: "all 0.2s",
        ...style,
      }}
    >
      {isLoading ? "Aguarde..." : children}
    </button>
  );
};
