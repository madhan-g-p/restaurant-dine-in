import React from "react";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@features/orders/ordersApi";
import { CheckCircle2, Clock, ChefHat, BellRing } from "lucide-react";
import Button from "@components/ui/Button";
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";

const AdminOrdersPage: React.FC = () => {
  const {
    data: activeOrders = [],
    error,
    isLoading,
  } = useGetAdminOrdersQuery(undefined, {
    pollingInterval: 5000,
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  if (error) {
    return (
      <div className="p-10 font-bold text-red-500 bg-red-100 rounded">
        Error loading orders: {JSON.stringify(error)}
      </div>
    );
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus({ id, status }).unwrap();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-primary">Orders Monitor</h2>
          <p className="text-muted font-bold mt-1 text-sm tracking-normal">
            Live feed of all active table sessions and orders.
          </p>
        </div>
        <Badge
          variant="active"
          className="bg-emerald-50! dark:bg-emerald-900/20! text-emerald-600! border-emerald-100 dark:border-emerald-800/50! animate-pulse px-6! py-4! rounded-2xl!"
        >
          <BellRing size={18} strokeWidth={3} className="mr-3" /> LIVE FEED
          ACTIVE
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {activeOrders?.map((o: any) => (
          <Card
            key={o.order._id}
            className="p-0 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-surface-200/50 dark:shadow-black/30 border-none"
          >
            <div className="p-8 bg-surface-100 border-b border-color flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                <Clock size={100} />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-surface rounded-3xl shadow-xl border border-color flex items-center justify-center text-3xl font-black text-primary group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {o.order.tableId.tableNumber}
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">
                    Session UID
                  </p>
                  <p className="text-xs font-black text-primary tracking-tight">
                    #{o.order._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  o.order.status === "READY"
                    ? "success"
                    : o.order.status === "PREPARING"
                      ? "warning"
                      : "active"
                }
                className="px-4! py-2! rounded-xl! relative z-10 shadow-sm"
              >
                {o.order.status}
              </Badge>
            </div>

            <div className="p-8 flex-1 space-y-8 bg-surface">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1">
                  Requested Items
                </h4>
                <div className="space-y-3">
                  {o.items.map((i: any) => (
                    <div
                      key={i._id}
                      className="flex justify-between items-center bg-surface-100 p-5 rounded-2xl border border-color group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="bg-primary-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-black shadow-lg shadow-primary-500/20">
                          {i.quantity}×
                        </span>
                        <span className="text-sm font-black text-primary tracking-tight">
                          {i.menuItemId.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 flex justify-between items-center border-t border-color border-dashed">
                <div className="flex items-center gap-3 text-muted font-black">
                  <Clock
                    size={18}
                    strokeWidth={3}
                    className="text-primary-400"
                  />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    {new Date(o.order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">
                    Total Amount
                  </p>
                  <span className="text-3xl font-black text-primary tracking-tighter">
                    ₹
                    {o.items.reduce(
                      (s: any, i: any) => s + i.priceSnapshot * i.quantity,
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-100 border-t border-color grid grid-cols-1 gap-4">
              {o.order.status === "ACTIVE" && (
                <Button
                  onClick={() => updateStatus(o.order._id, "PREPARING")}
                  className="w-full py-5 text-xs tracking-widest"
                >
                  <ChefHat size={20} strokeWidth={3} className="mr-3" /> BEGIN
                  PREPARATION
                </Button>
              )}
              {o.order.status === "PREPARING" && (
                <Button
                  onClick={() => updateStatus(o.order._id, "READY")}
                  className="w-full py-5 text-xs tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                >
                  <CheckCircle2 size={20} strokeWidth={3} className="mr-3" />{" "}
                  MARK AS READY
                </Button>
              )}
              {o.order.status === "READY" && (
                <div className="text-center text-[10px] font-black text-muted uppercase py-5 border-2 border-dashed border-color rounded-2xl bg-surface animate-pulse">
                  Await Payment Clearance
                </div>
              )}
              <Button
                variant="ghost"
                onClick={() => updateStatus(o.order._id, "CANCELLED")}
                className="text-error font-black uppercase text-[10px] tracking-[0.3em] hover:bg-error/10 transition-all py-3"
              >
                ABORT SESSION
              </Button>
            </div>
          </Card>
        ))}

        {activeOrders.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center opacity-40">
            <div className="text-8xl mb-8">🏜️</div>
            <h3 className="text-2xl font-black text-primary tracking-tighter">
              No active table sessions detected right now.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
