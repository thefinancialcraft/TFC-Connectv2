import { useEffect, useState } from 'react';

interface ErrorNotificationProps {
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function ErrorNotification({ 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ErrorNotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onClose();
        }, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  if (!message) return null;

  return (
    <div
      id="error-message"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgb(255, 72, 72)',
        color: '#FFFFFF',
        padding: '12px 20px',
        fontSize: '14px',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '500',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        animation: isExiting ? 'slideUp 0.3s ease-out forwards' : 'slideDown 0.3s ease-out',
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            padding: '0',
            marginLeft: '5px',
            lineHeight: '1',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ×
        </button>
      )}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

