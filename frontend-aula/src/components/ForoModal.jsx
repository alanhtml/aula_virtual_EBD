import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ForoModal = ({ isOpen, onClose, cursoId, foroToEdit, secciones }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    seccion_id: ''
  });

  useEffect(() => {
    if (foroToEdit) {
      setFormData({
        titulo: foroToEdit.titulo || '',
        descripcion: foroToEdit.descripcion || '',
        seccion_id: foroToEdit.seccion_id || ''
      });
    } else {
      setFormData({ titulo: '', descripcion: '', seccion_id: '' });
    }
  }, [foroToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        curso_id: cursoId,
        seccion_id: formData.seccion_id || null
      };

      if (foroToEdit) {
        await api.put(`/foros-items/${foroToEdit.id}`, data);
        toast.success('Foro actualizado');
      } else {
        await api.post('/foros-items', data);
        toast.success('Foro creado');
      }
      onClose(true);
    } catch (error) {
      toast.error('Error al guardar el foro');
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-glass-border animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-headline-md mb-6">{foroToEdit ? 'Editar Foro' : 'Nuevo Foro de Debate'}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Título del Foro</label>
            <input
              type="text"
              required
              className="glass-input px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej: Debate sobre el Tema 1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Descripción (Opcional)</label>
            <textarea
              className="glass-input px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Instrucciones para el debate..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Ubicación (Sección)</label>
            <select
              className="glass-input px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary appearance-none"
              value={formData.seccion_id}
              onChange={(e) => setFormData({ ...formData, seccion_id: e.target.value })}
            >
              <option value="" className="bg-[#1a1a1c]">General (Sin Sección)</option>
              {secciones.map(sec => (
                <option key={sec.id} value={sec.id} className="bg-[#1a1a1c]">{sec.titulo}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex-1 px-6 py-3 rounded-xl border border-glass-border text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 glass-button-primary px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
            >
              {foroToEdit ? 'Guardar Cambios' : 'Crear Foro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForoModal;
