import React, { useState, useEffect } from 'react';

const TareaModal = ({ isOpen, onClose, onSave, tareaToEdit, secciones = [] }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    fecha_entrega: '',
    puntos: 100,
    seccion_id: ''
  });

  useEffect(() => {
    if (tareaToEdit) {
      setFormData({
        titulo: tareaToEdit.titulo || '',
        contenido: tareaToEdit.contenido || '',
        fecha_entrega: tareaToEdit.fecha_entrega ? tareaToEdit.fecha_entrega.substring(0, 16) : '',
        puntos: tareaToEdit.puntos || 100,
        seccion_id: tareaToEdit.seccion_id || ''
      });
    } else {
      setFormData({
        titulo: '',
        contenido: '',
        fecha_entrega: '',
        puntos: 100,
        seccion_id: ''
      });
    }
  }, [tareaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-black/80 backdrop-blur-md" onClick={() => onClose()}></div>

      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-glass-border shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-glass-border flex justify-between items-center">
          <h2 className="text-xl font-headline-md text-primary">
            {tareaToEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </h2>
          <button onClick={() => onClose()} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Sección (Opcional)</label>
            <select
              className="glass-input rounded-xl px-4 py-2.5 text-sm"
              value={formData.seccion_id}
              onChange={(e) => setFormData({...formData, seccion_id: e.target.value})}
            >
              <option value="" className="bg-[#1a1a1c]">Sin sección (General)</option>
              {secciones.map(s => (
                <option key={s.id} value={s.id} className="bg-[#1a1a1c]">{s.titulo}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Título de la Tarea</label>
            <input
              type="text"
              required
              className="glass-input rounded-xl px-4 py-2.5 text-sm"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              placeholder="Ej: Ensayo sobre el Pentateuco"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Instrucciones / Contenido</label>
            <textarea
              className="glass-input rounded-xl px-4 py-2.5 text-sm min-h-[120px] resize-none"
              value={formData.contenido}
              onChange={(e) => setFormData({...formData, contenido: e.target.value})}
              placeholder="Describe qué deben hacer los estudiantes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Fecha de Entrega</label>
              <input
                type="datetime-local"
                className="glass-input rounded-xl px-4 py-2.5 text-sm"
                value={formData.fecha_entrega}
                onChange={(e) => setFormData({...formData, fecha_entrega: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Puntos</label>
              <input
                type="number"
                className="glass-input rounded-xl px-4 py-2.5 text-sm"
                value={formData.puntos}
                onChange={(e) => setFormData({...formData, puntos: e.target.value})}
              />
            </div>
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
              {tareaToEdit ? 'Guardar Cambios' : 'Publicar Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TareaModal;
