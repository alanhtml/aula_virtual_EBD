import React, { useState } from 'react';

const EntregaModal = ({ isOpen, onClose, onSave, tarea }) => {
  const [formData, setFormData] = useState({
    comentario_estudiante: '',
    archivo: null
  });

  if (!isOpen || !tarea) return null;

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.archivo) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    let archivoFinal = formData.archivo;
    // Si es una imagen, comprimirla
    if (formData.archivo.type.startsWith('image/')) {
      archivoFinal = await compressImage(formData.archivo);
    }

    const data = new FormData();
    data.append('tarea_id', tarea.id);
    data.append('comentario_estudiante', formData.comentario_estudiante);
    data.append('archivo', archivoFinal);

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-black/80 backdrop-blur-md" onClick={() => onClose()}></div>

      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-glass-border shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-glass-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-headline-md text-primary">Entregar Tarea</h2>
            <p className="text-xs text-on-surface-variant mt-1">{tarea.titulo}</p>
          </div>
          <button onClick={() => onClose()} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
            <p className="text-xs text-on-surface-variant mb-2">Instrucciones del docente:</p>
            <p className="text-sm text-on-surface italic">{tarea.contenido || 'Sin instrucciones adicionales.'}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Archivo del Trabajo</label>
            <div className="relative group">
              <input
                type="file"
                required
                className="hidden"
                id="file-upload"
                onChange={(e) => setFormData({...formData, archivo: e.target.files[0]})}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-3 glass-input rounded-xl px-4 py-3 text-sm cursor-pointer hover:bg-white/10 transition-all border-dashed border-2 border-glass-border group-hover:border-primary/50"
              >
                <span className="material-symbols-outlined text-primary">upload_file</span>
                <span className="truncate flex-1">
                  {formData.archivo ? formData.archivo.name : 'Seleccionar archivo (PDF, DOCX, ZIP...)'}
                </span>
              </label>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">Máximo 10MB.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Comentario Adicional</label>
            <textarea
              className="glass-input rounded-xl px-4 py-2.5 text-sm min-h-[80px] resize-none"
              value={formData.comentario_estudiante}
              onChange={(e) => setFormData({...formData, comentario_estudiante: e.target.value})}
              placeholder="Alguna nota para el profesor..."
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
              Enviar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntregaModal;
