import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      text: 'text-error',
      bg: 'bg-error/10',
      border: 'border-error/20',
      button: 'bg-error/20 hover:bg-error/30 text-error border-error/30',
      icon: 'delete_forever'
    },
    warning: {
      text: 'text-tertiary',
      bg: 'bg-tertiary/10',
      border: 'border-tertiary/20',
      button: 'bg-tertiary/20 hover:bg-tertiary/30 text-tertiary border-tertiary/30',
      icon: 'warning'
    },
    info: {
      text: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      button: 'glass-button-primary text-primary-fixed',
      icon: 'info'
    }
  };

  const config = colors[type] || colors.info;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-sm p-8 rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-in zoom-in duration-300 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${config.bg}`}></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full ${config.bg} ${config.border} border flex items-center justify-center mb-6 shadow-lg`}>
            <span className={`material-symbols-outlined text-4xl ${config.text}`}>
              {config.icon}
            </span>
          </div>

          <h3 className="text-2xl font-headline-md text-on-surface mb-3 tracking-tight">
            {title}
          </h3>

          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed px-2">
            {message}
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-glass-fill border border-glass-border text-on-surface font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${config.button}`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
