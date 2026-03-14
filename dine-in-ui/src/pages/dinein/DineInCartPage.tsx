import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { updateQuantity, removeItem, clearCart } from '../../features/dinein/dineInCartSlice';
import { placeDineInOrder } from '../../features/dinein/dineInOrderSlice';

const DineInCartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.dineInCart);
  const session = useSelector((state: RootState) => state.dineInSession);
  const order = useSelector((state: RootState) => state.dineInOrder);

  const cartTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) return;
    
    const items = cart.items.map(i => ({
      menuItemId: i.menuItemId,
      quantity: i.quantity,
    }));

    try {
      const resultAction = await dispatch(placeDineInOrder(items));
      if (placeDineInOrder.fulfilled.match(resultAction)) {
        dispatch(clearCart());
        navigate(`/dinein/order/${resultAction.payload.order._id}`);
      }
    } catch (err) {
      console.error('Failed to place order:', err);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Looks like you haven't added anything to your order yet.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-transform active:scale-95"
        >
          GO BACK TO MENU
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
       {/* Header */}
       <header className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-2xl">←</span>
          </button>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Review Order</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4">
        {/* Table Info Card */}
        <div className="bg-indigo-600 rounded-3xl p-6 text-white mb-6 shadow-xl shadow-indigo-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">DINE-IN ORDER</p>
              <h2 className="text-3xl font-black">Table {session.tableNumber || '...'}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <span className="text-2xl">🪑</span>
            </div>
          </div>
          <div className="h-px bg-white/10 w-full mb-4" />
          <p className="text-sm text-indigo-100 font-medium opacity-80">
            Order will be prepared once confirmed by staff.
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.menuItemId} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
              <div className="grow">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-indigo-600 font-black text-sm mt-0.5">₹{item.price}</p>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button 
                  onClick={() => dispatch(updateQuantity({ menuItemId: item.menuItemId, quantity: item.quantity - 1 }))}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-black text-gray-400 active:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="font-black text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                <button 
                  onClick={() => dispatch(updateQuantity({ menuItemId: item.menuItemId, quantity: item.quantity + 1 }))}
                  className="w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-lg shadow-sm font-black text-white active:bg-indigo-700 transition-colors shadow-indigo-100"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bill Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 z-40">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-6 px-1">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Grand Total</span>
            <span className="text-3xl font-black text-gray-900">₹{cartTotal}</span>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            disabled={order.loading}
            className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:bg-indigo-300 transition-transform active:scale-95"
          >
            {order.loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>CONFIRM ORDER <span>→</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DineInCartPage;
