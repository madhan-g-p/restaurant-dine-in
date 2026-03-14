interface LoaderProps {
  message?: string;
  size?: "xsm" | "sm" | "md" | "lg";
}

export default function Loader({ message, size = "md" }: LoaderProps) {
  const sizeClasses = {
    xsm: "w-5 h-5 border-1",
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`${size === "xsm" ? "py-3" : "py-12"} flex flex-col items-center justify-center gap-3`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{
          borderColor: "var(--border-color)",
          borderTopColor: "var(--btn-primary-bg)",
        }}
      />
      {message && (
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
