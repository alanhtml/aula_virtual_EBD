import React, { useState, useEffect } from 'react';

const EscuelaClaseModal = ({ isOpen, onClose, onSave, claseToEdit, teachers }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    rango_edad: '',
    descripcion: '',
    docente_id: ''
  });

  useEffect(() => {
    if (claseToEdit) {
      setFormData({
        nombre: claseToEdit.nombre || '',
        rango_edad: claseToEdit.rango_edad || '',
        descripcion: claseToEdit.descripcion || '',
        docente_id: claseToEdit.docente_id || ''
      });
    } else {
      setFormData({
        nombre: '',
        rango_edad: '',
        descripcion: '',
        docente_id: ''
      });
    }
  }, [claseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-glass-border shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-glass-border bg-glass-fill/50 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-on-surface">
            {claseToEdit ? 'Editar Espacio' : 'Nuevo Espacio de Clase'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Nombre del Espacio</label>
            <input
              type="text"
              required
              placeholder="Ej. Jóvenes, Niños, etc."
              className="glass-input w-full px-4 py-3 rounded-xl"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Rango de Edad</label>
            <input
              type="text"
              required
              placeholder="Ej. 18-25 años"
              className="glass-input w-full px-4 py-3 rounded-xl"
              value={formData.rango_edad}
              onChange={(e) => setFormData({ ...formData, rango_edad: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Docente Asignado</label>
            <select
              className="glass-input w-full px-4 py-3 rounded-xl appearance-none"
              value={formData.docente_id}
              onChange={(e) => setFormData({ ...formData, docente_id: e.target.value })}
            >
              <option value="">Seleccionar Docente</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Descripción</label>
            <textarea
              placeholder="Breve descripción del espacio..."
              className="glass-input w-full px-4 py-3 rounded-xl min-h-[100px] resize-none"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-glass-border font-bold text-on-surface-variant hover:bg-glass-fill transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-2 py-4 px-8 rounded-2xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              {claseToEdit ? 'Guardar Cambios' : 'Crear Espacio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscuelaClaseModal;
