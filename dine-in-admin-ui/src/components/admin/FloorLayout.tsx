import React from "react";

interface FloorLayoutProps {
  tables: any[];
  onTableClick: (table: any) => void;
  loading: boolean;
}

const FloorLayout: React.FC<FloorLayoutProps> = ({
  tables,
  onTableClick,
  loading,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-500 shadow-emerald-500/20";
      case "OCCUPIED":
        return "bg-error shadow-error/20 animate-pulse";
      case "RESERVED":
        return "bg-amber-500 shadow-amber-500/20";
      default:
        return "bg-surface-300 dark:bg-surface-700 shadow-surface-500/10";
    }
  };

  if (loading && tables.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/60 backdrop-blur-md z-10 font-black text-[10px] text-muted uppercase tracking-[0.3em] animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-primary-600 border-t-transparent animate-spin mb-6"></div>
        Syncing Floor Layout...
      </div>
    );
  }

  return (
    <div className="w-full h-fit p-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-16 overflow-auto no-scrollbar">
      {tables.map((table) => (
        <button
          key={table._id}
          onClick={() => onTableClick(table)}
          className="group relative flex flex-col items-center outline-none"
        >
          {/* Table Circle */}
          <div
            className={`
            w-32 h-32 rounded-full flex items-center justify-center text-white
            transition-all duration-500 transform group-hover:scale-110 group-active:scale-95 shadow-2xl border-4 border-surface dark:border-surface-800
            ${getStatusColor(table.status)}
          `}
          >
            <span className="text-4xl font-black drop-shadow-2xl">
              {table.tableNumber}
            </span>

            {/* Small indicator for active order */}
            {table.status === "OCCUPIED" && (
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-surface text-error rounded-2xl flex items-center justify-center text-2xl shadow-2xl border border-color animate-bounce">
                🍜
              </div>
            )}
          </div>

          {/* Table Labels */}
          <div className="mt-2 text-center">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">
              {table.seatCount} SEATS
            </p>
            <div
              className={`text-[10px] px-4 py-1.5 rounded-xl font-black uppercase tracking-widest border dark:text-black transition-all ${table.status === "OCCUPIED" ? "bg-gray-700 dark:text-white" : "bg-amber-500 dark:text-black"}`}
            >
              {table.status}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FloorLayout;
