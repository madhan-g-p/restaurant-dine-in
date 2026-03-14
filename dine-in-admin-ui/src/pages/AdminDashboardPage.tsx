import React, { useState } from "react";
import { useGetAdminTablesQuery } from "@features/tables/tablesApi";
import FloorLayout from "@components/admin/FloorLayout";
import OrderPanel from "@components/admin/OrderPanel";
import { Layers } from "lucide-react";

const AdminDashboardPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [floor, setFloor] = useState(1);
  const {
    data: tables = [],
    error,
    isLoading: loading,
  } = useGetAdminTablesQuery(floor, {
    pollingInterval: 10000,
  });

  if (error) {
    return (
      <div className="p-10 font-bold text-red-500 bg-red-100 rounded">
        Error loading tables: {JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-primary ">
            Restaurant Floor
          </h2>
          <p className="text-muted font-bold mt-1 text-sm  tracking-normal">
            Real-time table status and order monitor.
          </p>
        </div>

        <div className="flex bg-surface p-1 rounded-2xl border border-color shadow-sm">
          <button
            onClick={() => setFloor(1)}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${floor === 1 ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" : "text-muted hover:text-primary hover:bg-surface-hover"}`}
          >
            FLOOR 1
          </button>
          <button
            onClick={() => setFloor(2)}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${floor === 2 ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" : "text-muted hover:text-primary hover:bg-surface-hover"}`}
          >
            FLOOR 2
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Floor View */}
        <div className="lg:col-span-3 bg-surface rounded-[2.5rem] border border-color shadow-2xl shadow-surface-200/40 dark:shadow-black/20 overflow-hidden relative min-h-[680px] border-b-4 border-b-color">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]">
            <Layers size={14} strokeWidth={3} />
            Live Floor View
          </div>

          <FloorLayout
            tables={tables}
            onTableClick={(table: any) => setSelectedTable(table)}
            loading={loading}
          />

          {/* Legend */}
          <div className="absolute bottom-8 left-8 flex gap-6 bg-surface/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-color shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
              <span className="text-[10px] font-black text-muted uppercase tracking-wider">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-gray-700 rounded-full bg-error shadow-sm shadow-error/20" />
              <span className="text-[10px] font-black text-muted uppercase tracking-wider">
                Occupied
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/20" />
              <span className="text-[10px] font-black text-muted uppercase tracking-wider">
                Reserved
              </span>
            </div>
          </div>
        </div>

        {/* Side Panel for single table details */}
        <div className="lg:col-span-1">
          {selectedTable ? (
            <OrderPanel
              table={selectedTable}
              onClose={() => setSelectedTable(null)}
            />
          ) : (
            <div className="bg-surface-100 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-10 text-center animate-pulse border border-color">
              <div className="w-24 h-24 bg-surface rounded-2xl shadow-2xl shadow-surface-200/50 dark:shadow-black/20 flex items-center justify-center text-5xl mb-8 border border-color">
                📍
              </div>
              <h3 className="font-black text-primary text-xl tracking-tighter mb-2">
                No Selection
              </h3>
              <p className="text-[10px] text-muted font-black leading-relaxed max-w-[150px]">
                Click any table to manage session details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
