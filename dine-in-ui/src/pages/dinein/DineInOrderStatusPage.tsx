import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import {
  fetchOrderDetails,
  updateLocalOrderStatus,
} from "../../features/dinein/dineInOrderSlice";
import OrderTimer from "../../components/dinein/OrderTimer";

const DineInOrderStatusPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, items, createdAt, loading, error } = useSelector(
    (state: RootState) => state.dineInOrder,
  );
  const [sseActive, setSseActive] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));

      // SSE Setup
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const eventSource = new EventSource(
        `${API_BASE}/dinein/orders/${id}/sse`,
        { withCredentials: true },
      );

      setSseActive(true);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          dispatch(updateLocalOrderStatus(data));
        } catch (e) {
          console.error("SSE data parse error:", e);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE Connection Error:", err);
        eventSource.close();
        setSseActive(false);
      };

      return () => {
        eventSource.close();
        setSseActive(false);
      };
    }
  }, [id, dispatch]);

  const getStatusConfig = (s: string | null) => {
    const configs: any = {
      ACTIVE: {
        label: "Received",
        color: "text-indigo-600 bg-indigo-50",
        step: 1,
      },
      PREPARING: {
        label: "Cooking",
        color: "text-amber-600 bg-amber-50",
        step: 2,
      },
      READY: {
        label: "Served",
        color: "text-emerald-600 bg-emerald-50",
        step: 3,
      },
      COMPLETED: { label: "Paid", color: "text-gray-600 bg-gray-50", step: 4 },
      CANCELLED: {
        label: "Cancelled",
        color: "text-rose-600 bg-rose-50",
        step: 0,
      },
    };
    return configs[s || "ACTIVE"] || configs.ACTIVE;
  };

  const currentStatus = getStatusConfig(status);

  if (loading && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => navigate("/dinein")}
          className="text-indigo-600 font-bold underline"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white px-4 py-8 border-b border-gray-100 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
          {status === "READY" ? "🍽️" : status === "PREPARING" ? "👩‍🍳" : "✅"}
        </div>
        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">
          Status: {sseActive ? "LIVE" : "POLLING"}
        </p>
        <h1
          className={`text-4xl font-black tracking-tighter ${currentStatus.color.split(" ")[0]}`}
        >
          {currentStatus.label}
        </h1>
        {createdAt && status !== "COMPLETED" && (
          <OrderTimer createdAt={createdAt} />
        )}
      </header>

      <main className="max-w-xl mx-auto p-4">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between px-6 mb-10 mt-4 relative">
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-gray-200 -z-10 -translate-y-1/2" />
          <div
            className={`absolute top-1/2 left-6 right-6 h-1 bg-indigo-600 -z-10 -translate-y-1/2 transition-all duration-1000`}
            style={{ width: `${(currentStatus.step / 3) * 100}%` }}
          />

          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-4 h-4 rounded-full border-4 border-gray-50 transition-colors duration-500 ${
                currentStatus.step >= step ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
            Order Summary
          </h3>
          <div className="space-y-4">
            {items.map((i: any) => (
              <div key={i._id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded-lg text-[10px] font-black">
                    {i.quantity}×
                  </span>
                  <span className="font-bold text-gray-900">
                    {i.menuItemId?.name || "Item"}
                  </span>
                </div>
                <span className="text-indigo-600 font-black">
                  ₹{i.priceSnapshot * i.quantity}
                </span>
              </div>
            ))}
            <div className="h-px bg-gray-100 w-full my-4" />
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-black">Total</span>
              <span className="text-2xl text-gray-900 font-black">
                ₹{items.reduce((s, i) => s + i.priceSnapshot * i.quantity, 0)}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 z-40">
        <div className="max-w-xl mx-auto">
          {status === "READY" || status === "COMPLETED" ? (
            <button
              onClick={() => navigate(`/dinein/bill/${id}`)}
              className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-transform active:scale-95 flex items-center justify-center gap-3"
            >
              VIEW FULL BILL <span>→</span>
            </button>
          ) : (
            <p className="text-center text-gray-400 text-xs font-medium italic">
              Bill will be available once items are served.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DineInOrderStatusPage;
