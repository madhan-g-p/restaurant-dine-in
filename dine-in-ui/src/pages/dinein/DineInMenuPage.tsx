import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { initDineInSession } from '../../features/dinein/sessionSlice';
import { fetchDineInMenu, fetchHeatmap } from '../../features/dinein/dineInMenuSlice';
import { addItem } from '../../features/dinein/dineInCartSlice';
import HeatmapBadge from '../../components/dinein/HeatmapBadge';
import FoodTypeBadge from '../../components/dinein/FoodTypeBadge';

const DineInMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const tableNumber = searchParams.get('table');
  const session = useSelector((state: RootState) => state.dineInSession);
  const { categories, heatmap, loading, error } = useSelector((state: RootState) => state.dineInMenu);
  const cart = useSelector((state: RootState) => state.dineInCart);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!tableNumber) {
      // Fallback to localStorage if available, or error
      const savedTable = localStorage.getItem('dinein_table_number');
      if (!savedTable) {
        return; // Handled in UI below
      }
    } else {
      dispatch(initDineInSession(tableNumber));
    }
    
    dispatch(fetchDineInMenu());
    dispatch(fetchHeatmap());
  }, [tableNumber, dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].category._id);
    }
  }, [categories, activeCategory]);

  const cartTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  if (!tableNumber && !localStorage.getItem('dinein_table_number')) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid QR Code</h2>
          <p className="text-gray-500 mb-6">Please scan the QR code module on your table to view the menu.</p>
        </div>
      </div>
    );
  }

  if (session.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-extrabold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {tableNumber ? `Table ${tableNumber}` : 'Dine-In'}
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              {session.seatCount ? `${session.seatCount} SEATS` : 'AUTHENTICATING...'}
            </p>
          </div>
          {heatmap && <HeatmapBadge level={heatmap.level} rate={heatmap.occupancyRate} />}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.category._id}
              onClick={() => setActiveCategory(cat.category._id)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                activeCategory === cat.category._id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-indigo-200'
              }`}
            >
              {cat.category.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories
            .find((c) => c.category._id === activeCategory)
            ?.items.map((item: any) => (
              <div key={item._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all active:scale-[0.98]">
                <div className="w-24 h-24 bg-gray-50 rounded-xl shrink-0 flex items-center justify-center text-3xl">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : '🍽️'}
                </div>
                <div className="grow min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate flex items-center gap-1.5">
                      <FoodTypeBadge type={item.foodType} />
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-600">₹{item.price}</span>
                    <button
                      onClick={() => dispatch(addItem({ menuItemId: item._id, name: item.name, price: item.price, quantity: 1 }))}
                      className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-black hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}
      </main>

      {/* Sticky Bottom Footer */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
          <button
            onClick={() => navigate('/dinein/cart')}
            className="w-full max-w-4xl mx-auto bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-between animate-in slide-in-from-bottom duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-2.5 py-1 rounded-lg text-xs font-black">
                {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}
              </div>
              <div className="font-black text-lg">₹{cartTotal}</div>
            </div>
            <div className="flex items-center gap-2 font-black tracking-tight">
              VIEW CART <span>→</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default DineInMenuPage;
