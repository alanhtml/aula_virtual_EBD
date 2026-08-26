import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MaterialModal = ({ isOpen, onClose, cursoId, secciones = [] }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'pdf',
    url: '',
    archivo: null,
    seccion_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'archivo') {
      setFormData(prev => ({ ...prev, archivo: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('titulo', formData.titulo);
    data.append('descripcion', formData.descripcion);
    data.append('tipo', formData.tipo);
    data.append('curso_id', cursoId);
    if (formData.seccion_id) {
        data.append('seccion_id', formData.seccion_id);
    }

    if (formData.tipo === 'pdf' || formData.tipo === 'otro' || formData.tipo === 'imagen') {
      if (!formData.archivo) {
        toast.error('Por favor selecciona un archivo');
        setLoading(false);
        return;
      }
      data.append('archivo', formData.archivo);
    } else {
      data.append('url', formData.url);
    }

    try {
      await api.post('/materiales', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Material publicado con éxito');
      onClose(true);
    } catch (error) {
      console.error('Error al subir material:', error);
      // El interceptor de axios ya maneja la mayoría de los errores,
      // pero podemos añadir contexto específico aquí si es necesario.
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-void-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl border border-glass-border shadow-2xl animate-in fade-in zoom-in duration-300">
        <h3 className="text-2xl font-headline-md text-primary mb-6">Subir Material Didáctico</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sección (Opcional)</label>
            <select
              name="seccion_id"
              value={formData.seccion_id}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-3 text-sm"
            >
              <option value="" className="bg-[#1a1a1c]">Sin sección (General)</option>
              {secciones.map(s => (
                <option key={s.id} value={s.id} className="bg-[#1a1a1c]">{s.titulo}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-3 text-sm"
              placeholder="Ej. Guía de Estudio Semana 1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipo de Contenido</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-3 text-sm"
            >
              <option value="pdf" className="bg-[#1a1a1c]">Archivo PDF (Lectura)</option>
              <option value="video" className="bg-[#1a1a1c]">Video (YouTube/Vimeo)</option>
              <option value="imagen" className="bg-[#1a1a1c]">Imagen / Infografía</option>
              <option value="enlace" className="bg-[#1a1a1c]">Enlace Externo / Web</option>
              <option value="otro" className="bg-[#1a1a1c]">Otro Recurso</option>
            </select>
          </div>

          {(formData.tipo === 'pdf' || formData.tipo === 'otro' || formData.tipo === 'imagen') ? (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Archivo (Máx. 10MB)</label>
              <input
                type="file"
                name="archivo"
                onChange={handleChange}
                accept={formData.tipo === 'pdf' ? '.pdf' : formData.tipo === 'imagen' ? 'image/*' : '*'}
                className="glass-input rounded-xl px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-fixed hover:file:bg-primary/80"
                required
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="https://..."
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Descripción (Opcional)</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-3 text-sm resize-none"
              rows="2"
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={() => onClose(false)} className="flex-1 py-3 rounded-xl bg-glass-fill border border-glass-border">Cancelar</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl glass-button-primary text-primary-fixed font-bold disabled:opacity-50"
            >
              {loading ? 'Subiendo...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
