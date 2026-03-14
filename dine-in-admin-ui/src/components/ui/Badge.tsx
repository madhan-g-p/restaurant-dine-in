import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "active" | "success" | "warning" | "error" | "neutral";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  className = "",
}) => {
  const variants = {
    active: "badge-active",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
    neutral: "bg-surface-50 text-surface-400 border-surface-100",
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
