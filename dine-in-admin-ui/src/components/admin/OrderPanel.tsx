import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useVerifyPaymentMutation,
} from "@features/orders/ordersApi";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import Button from "@ui/Button";
import Badge from "@ui/Badge";

interface OrderPanelProps {
  table: any;
  onClose: () => void;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ table, onClose }) => {
  const { data: activeOrders = [], isLoading: loading } =
    useGetAdminOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [verifyPaymentMutation] = useVerifyPaymentMutation();

  const activeOrder = activeOrders.find(
    (o: any) => o.order.tableId._id === table._id,
  );

  const handleUpdateStatus = async (status: string) => {
    if (!activeOrder) return;
    try {
      await updateOrderStatus({ id: activeOrder.order._id, status }).unwrap();
      onClose();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const verifyPayment = async () => {
    if (!activeOrder) return;
    try {
      await verifyPaymentMutation(activeOrder.order._id).unwrap();
      onClose();
    } catch (err) {
      alert("Payment verification failed");
    }
  };

  return (
    <div className="bg-surface rounded-[2.5rem] border border-color shadow-2xl shadow-surface-200/50 dark:shadow-black/20 overflow-hidden flex flex-col h-full animate-in slide-in-from-right-8 duration-500 border-b-4 border-b-color">
      <div className="p-5 bg-surface-mild  border-b border-color flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-3 right-25 p-4 opacity-9 rotate-12">
          <div className="text-8xl font-black">#</div>
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-primary tracking-tighter">
            Table {table.tableNumber}
          </h3>
          <Badge
            variant={
              table.status === "AVAILABLE"
                ? "success"
                : table.status === "OCCUPIED"
                  ? "error"
                  : "warning"
            }
            className="mt-2 px-3! py-1! rounded-lg!"
          >
            {table.status}
          </Badge>
        </div>
        <button
          onClick={onClose}
          className="p-3 text-muted hover:text-primary transition-all hover:bg-surface-200 rounded-2xl relative z-10"
        >
          <XCircle size={32} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-surface">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 opacity-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary-600 mb-6"></div>
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">
              Live Syncing...
            </span>
          </div>
        ) : activeOrder ? (
          <div className="space-y-10">
            <div className="bg-primary-600 p-8 rounded-4xl text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                <Clock size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary-100 mb-4">
                  <Clock size={16} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Active Session
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1">
                      Total Bill
                    </span>
                    <span className="text-4xl font-black tracking-tighter">
                      ₹
                      {activeOrder.items.reduce(
                        (s: any, i: any) => s + i.priceSnapshot * i.quantity,
                        0,
                      )}
                    </span>
                  </div>
                  <Badge
                    variant="neutral"
                    className="bg-white/20 border-none text-white px-4 py-2 rounded-xl text-[10px]! font-black"
                  >
                    {activeOrder.order.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1 flex items-center justify-between">
                <span>Ordered Delicacies</span>
                <span className="h-px grow bg-color ml-4"></span>
              </h4>
              {activeOrder.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-5 bg-surface-100 rounded-2xl border border-color transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="bg-surface text-primary-600 border border-color px-2.5 py-1 rounded-lg text-[10px] font-black shadow-sm">
                      {item.quantity}×
                    </span>
                    <span className="font-black text-primary text-sm tracking-tight">
                      {item.menuItemId.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-muted">
                    ₹{item.priceSnapshot * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center opacity-40">
            <div className="text-7xl mb-6">🌿</div>
            <p className="text-lg font-black text-primary tracking-tighter">
              Pure Serenity
            </p>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-2">
              No active session on this table
            </p>
          </div>
        )}
      </div>

      {activeOrder && (
        <div className="p-10 bg-surface-100 border-t border-color space-y-4">
          {activeOrder.order.status === "ACTIVE" && (
            <Button
              onClick={() => handleUpdateStatus("PREPARING")}
              className="w-full py-5 text-xs tracking-widest uppercase font-black"
            >
              START PREPARATION <span className="ml-2">🔥</span>
            </Button>
          )}
          {activeOrder.order.status === "PREPARING" && (
            <Button
              onClick={() => handleUpdateStatus("READY")}
              className="w-full py-5 text-xs tracking-widest uppercase font-black bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
            >
              MARK AS READY <span className="ml-2">🍳</span>
            </Button>
          )}
          {activeOrder.order.status === "READY" && (
            <Button
              onClick={verifyPayment}
              className="w-full py-5 text-xs tracking-widest uppercase font-black shadow-primary-500/20"
            >
              CLEARANCE & CLOSE
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => handleUpdateStatus("CANCELLED")}
            className="w-full text-error hover:bg-error/10 font-black uppercase text-[10px] tracking-[0.2em] py-4"
          >
            ABORT SESSION
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderPanel;
