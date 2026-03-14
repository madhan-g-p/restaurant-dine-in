import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dineInApi from '../../api/dinein';

const DineInBillPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<'UPI' | 'CASH'>('UPI');

  useEffect(() => {
    if (id) {
      dineInApi.getBill(id)
        .then(res => setBill(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Bill Not Found</h2>
        <button onClick={() => navigate('/dinein')} className="text-indigo-600 font-bold underline">Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <header className="bg-white px-6 py-8 border-b border-gray-100 text-center">
          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Payable</p>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900">₹{bill.totalAmount}</h1>
       </header>

       <main className="max-w-xl mx-auto p-4 w-full grow">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Itemized Bill</h3>
             <table className="w-full text-sm">
                <thead>
                   <tr className="text-gray-400 border-b border-gray-50">
                      <th className="text-left font-bold pb-2 uppercase text-[10px]">Item</th>
                      <th className="text-center font-bold pb-2 uppercase text-[10px]">Qty</th>
                      <th className="text-right font-bold pb-2 uppercase text-[10px]">Total</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {bill.items.map((i: any, idx: number) => (
                      <tr key={idx} className="text-gray-900">
                         <td className="py-3 font-bold">{i.name}</td>
                         <td className="py-3 text-center">{i.quantity}</td>
                         <td className="py-3 text-right font-black">₹{i.subtotal}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Payment Method</h3>
             
             <div className="flex gap-3 mb-8">
                <button 
                  onClick={() => setMethod('UPI')}
                  className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    method === 'UPI' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-2xl">📱</span>
                  <span className="font-black text-[10px] uppercase">UPI / QR</span>
                </button>
                <button 
                   onClick={() => setMethod('CASH')}
                   className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                    method === 'CASH' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <span className="text-2xl">💵</span>
                  <span className="font-black text-[10px] uppercase">CASH</span>
                </button>
             </div>

             {method === 'UPI' ? (
                <div className="text-center">
                   <div className="bg-gray-100 w-48 h-48 mx-auto rounded-2xl mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                      {bill.upiQrUrl ? (
                        <img src={bill.upiQrUrl} alt="UPI QR" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center p-4">
                           <span className="text-4xl">🏁</span>
                           <p className="text-[10px] font-black text-gray-400 mt-2 uppercase">Order #{bill.orderId.slice(-6)}</p>
                        </div>
                      )}
                   </div>
                   <p className="text-xs text-gray-400 font-medium px-4">
                      Scan the QR or use any UPI app to pay. Inform staff once done.
                   </p>
                </div>
             ) : (
                <div className="text-center py-6 px-4">
                   <div className="text-4xl mb-4">🤝</div>
                   <p className="text-sm font-bold text-gray-900 mb-1">Manual Cash Payment</p>
                   <p className="text-xs text-gray-400">Please visit the counter or ask a server to collect cash and close your session.</p>
                </div>
             )}
          </div>
       </main>

       <footer className="p-6 text-center text-[10px] font-black tracking-widest text-gray-300 uppercase">
          Thank you for dining with us!
       </footer>
    </div>
  );
};

export default DineInBillPage;
