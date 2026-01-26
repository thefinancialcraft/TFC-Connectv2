import { useState, useEffect } from 'react';

/**
 * Global Offline Overlay component
 * Shows a blurred background with an illustration when internet is lost.
 */
const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial state
    if (typeof window !== 'undefined') {
      setIsOffline(!window.navigator.onLine);

      const handleOnline = () => {
        console.log("🌐 [Status] Online");
        setIsOffline(false);
      };
      
      const handleOffline = () => {
        console.log("❌ [Status] Offline");
        setIsOffline(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!isOffline) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-md bg-black/60 transition-all duration-500"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="bg-white rounded-[32px] p-8 max-w-[450px] w-[70%] text-center shadow-2xl scale-in-center border border-white/20">
        <div className="mb-6 overflow-hidden rounded-2xl h-[200px]">
          <img 
            src="/offline-illustration.png" 
            alt="Internet Disconnected" 
            className="w-full h-full object-cover animate-pulse"
          />
        </div>

        
        <h2 className="text-2xl font-bold text-[#263238] mb-2">
          Oops! Connection Lost
        </h2>
        
        <p className="text-[#787E9D] text-sm leading-relaxed mb-6">
          It looks like your internet connection is currently unstable or disconnected. 
          Please check your router or network settings.
        </p>

        <div className="flex items-center justify-center gap-2">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
           <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">
             Waiting for network...
           </span>
        </div>
      </div>

      <style jsx>{`
        .scale-in-center {
          animation: scale-in-center 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        @keyframes scale-in-center {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default OfflineOverlay;
