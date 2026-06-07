import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: { background: "#003322", color: "#00FF87" },
  warning: { background: "#332200", color: "#ffb800" },
  danger:  { background: "#330011", color: "#ff4d6d" },
  neutral: { background: "#1a2850", color: "#8899bb" },
};

export const Badge: React.FC<BadgeProps> = ({ variant = "neutral", children, style }) => (
  <span
    style={{
      ...variantStyles[variant],
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      ...style,
    }}
  >
    {children}
  </span>
);
