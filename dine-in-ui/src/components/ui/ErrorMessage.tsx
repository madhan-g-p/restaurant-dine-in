interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="card flex items-center justify-between gap-4 px-5 py-4"
      style={{
        borderColor: "var(--color-error)",
        backgroundColor: "rgba(239, 68, 68, 0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ backgroundColor: "var(--color-error)", color: "#fff" }}
        >
          !
        </div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-error)" }}
        >
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary py-1.5! px-3! text-xs shrink-0"
          style={{
            borderColor: "var(--color-error)",
            color: "var(--color-error)",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
