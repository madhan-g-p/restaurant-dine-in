import React, { useState, useEffect } from 'react';

interface OrderTimerProps {
  createdAt: string;
}

const OrderTimer: React.FC<OrderTimerProps> = ({ createdAt }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(createdAt).getTime();
    
    const update = () => {
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-1.5 mt-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-xl w-fit mx-auto">
      <span className="text-lg">⏱️</span>
      <span className="font-black text-indigo-600 font-mono tracking-tighter text-xl">
        {mm}:{ss}
      </span>
    </div>
  );
};

export default OrderTimer;
