import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading,
  icon,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-error",
    ghost:
      "text-muted hover:text-primary hover:bg-surface-100 transition-all px-4 py-2 rounded-xl",
  };

  const baseClass =
    variant === "ghost"
      ? "inline-flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest disabled:opacity-50 active:scale-95"
      : "";

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className} cursor-pointer`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
