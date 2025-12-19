import { useEffect } from 'react';

export interface DialogOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

interface DialogProps extends DialogOptions {
  isOpen: boolean;
  onClose: () => void;
}

export default function Dialog({
  isOpen,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  onClose,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: '#10B981',
          iconColor: '#FFFFFF',
          borderColor: '#10B981',
          icon: '✓',
        };
      case 'error':
        return {
          iconBg: '#EF4444',
          iconColor: '#FFFFFF',
          borderColor: '#EF4444',
          icon: '✕',
        };
      case 'warning':
        return {
          iconBg: '#F59E0B',
          iconColor: '#FFFFFF',
          borderColor: '#F59E0B',
          icon: '⚠',
        };
      default:
        return {
          iconBg: '#4b33e8',
          iconColor: '#FFFFFF',
          borderColor: '#4b33e8',
          icon: 'ℹ',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={onClose}
      >
        {/* Dialog Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '90%',
            width: '420px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            zIndex: 9999,
            animation: 'slideUp 0.3s ease-out',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon and Title Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: typeStyles.iconBg,
                color: typeStyles.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {typeStyles.icon}
            </div>

            {/* Title and Message */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#263238',
                    fontFamily: "'Poppins', sans-serif",
                    marginBottom: '8px',
                    marginTop: 0,
                  }}
                >
                  {title}
                </h2>
              )}
              <p
                style={{
                  fontSize: '14px',
                  color: '#787E9D',
                  fontFamily: "'Roboto', sans-serif",
                  lineHeight: '1.6',
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px',
            }}
          >
            {showCancel && (
              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '2px solid #DCDEE3',
                  backgroundColor: '#FFFFFF',
                  color: '#263238',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                  e.currentTarget.style.borderColor = '#787E9D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#DCDEE3';
                }}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: typeStyles.iconBg,
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

