import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SeccionModal = ({ isOpen, onClose, cursoId, seccionToEdit }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (seccionToEdit) {
      setTitulo(seccionToEdit.titulo);
      setDescripcion(seccionToEdit.descripcion || '');
    } else {
      setTitulo('');
      setDescripcion('');
    }
  }, [seccionToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (seccionToEdit) {
        await api.put(`/secciones/${seccionToEdit.id}`, {
          titulo,
          descripcion,
        });
      } else {
        await api.post('/secciones', {
          titulo,
          descripcion,
          curso_id: cursoId,
          orden: 0
        });
      }
      onClose(true);
    } catch (error) {
      console.error('Error saving seccion:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-glass-border animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-headline-md mb-6">{seccionToEdit ? 'Editar Sección' : 'Nueva Sección'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Título de la Sección</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ej: Unidad 1: Introducción"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Descripción (Opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="glass-input w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
              placeholder="Breve descripción de lo que se verá en esta sección..."
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-glass-fill border border-glass-border hover:bg-glass-border transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Sección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeccionModal;
