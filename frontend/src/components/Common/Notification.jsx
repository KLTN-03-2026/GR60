import React, { useState, useEffect, useCallback } from 'react';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    const handleShowNotification = (event) => {
      const { message, type = 'info' } = event.detail;
      const id = Date.now();
      
      setNotifications((prev) => [...prev, { id, message, type }]);

      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        removeNotification(id);
      }, 2200);
    };

    window.addEventListener('show-notification', handleShowNotification);
    return () => window.removeEventListener('show-notification', handleShowNotification);
  }, [removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`
            pointer-events-auto
            flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border
            animate-in slide-in-from-right-full duration-500
            ${n.type === 'success' 
              ? 'bg-emerald-500/90 border-emerald-400/50 text-white' 
              : n.type === 'error'
              ? 'bg-rose-500/90 border-rose-400/50 text-white'
              : 'bg-slate-800/90 border-slate-700/50 text-white'}
          `}
        >
          <div className="flex-shrink-0">
            {n.type === 'success' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {n.type === 'error' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {n.type === 'info' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <p className="text-sm font-bold tracking-wide uppercase">{n.message}</p>
          <button 
            onClick={() => removeNotification(n.id)}
            className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;

// Helper function để gọi từ bất cứ đâu
export const showToast = (message, type = 'info') => {
  window.dispatchEvent(new CustomEvent('show-notification', { 
    detail: { message, type } 
  }));
};
