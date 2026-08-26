import React, { useState, useEffect } from 'react';

const CalificacionModal = ({ isOpen, onClose, onSave, entrega }) => {
  const [formData, setFormData] = useState({
    calificacion: '',
    comentario_profesor: ''
  });

  useEffect(() => {
    if (entrega) {
      setFormData({
        calificacion: entrega.calificacion || '',
        comentario_profesor: entrega.comentario_profesor || ''
      });
    }
  }, [entrega, isOpen]);

  if (!isOpen || !entrega) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-black/90 backdrop-blur-sm" onClick={() => onClose()}></div>

      <div className="relative w-full max-w-md glass-card rounded-2xl border border-glass-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-glass-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-headline-md text-primary">Calificar Entrega</h2>
            <p className="text-xs text-on-surface-variant mt-1">Estudiante: {entrega.user?.name}</p>
          </div>
          <button onClick={() => onClose()} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Calificación (0-100)</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              className="glass-input rounded-xl px-4 py-2.5 text-lg font-bold text-primary text-center"
              value={formData.calificacion}
              onChange={(e) => setFormData({...formData, calificacion: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Retroalimentación</label>
            <textarea
              className="glass-input rounded-xl px-4 py-2.5 text-sm min-h-[100px] resize-none"
              value={formData.comentario_profesor}
              onChange={(e) => setFormData({...formData, comentario_profesor: e.target.value})}
              placeholder="Escribe tus observaciones para el estudiante..."
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 py-3 rounded-xl bg-glass-fill border border-glass-border text-sm font-bold hover:bg-glass-fill/80 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Guardar Nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalificacionModal;
