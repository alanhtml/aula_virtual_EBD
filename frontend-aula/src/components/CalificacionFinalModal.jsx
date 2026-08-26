import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CalificacionFinalModal = ({ isOpen, onClose, curso, onSave }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [formData, setFormData] = useState({
    nota_final: '',
    retroalimentacion: '',
    estado: 'aprobado'
  });

  useEffect(() => {
    if (isOpen && curso) {
      fetchEstudiantes();
    }
  }, [isOpen, curso]);

  const fetchEstudiantes = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/cursos/${curso.id}`);
      setEstudiantes(response.data.estudiantes || []);
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEstudiante = (est) => {
    setSelectedEstudiante(est);
    setFormData({
      nota_final: est.pivot.nota_final || '',
      retroalimentacion: est.pivot.retroalimentacion || '',
      estado: est.pivot.estado || 'aprobado'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEstudiante) return;

    try {
      await api.post(`/cursos/${curso.id}/calificar`, {
        user_id: selectedEstudiante.id,
        ...formData
      });
      fetchEstudiantes();
      setSelectedEstudiante(null);
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving qualification:', error);
      alert('Error al guardar la calificación');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-black/90 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl glass-card rounded-3xl border border-glass-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-glass-fill/50">
          <div>
            <h2 className="text-2xl font-headline-md text-primary">Calificaciones Finales</h2>
            <p className="text-sm text-on-surface-variant">{curso?.nombre} - {curso?.codigo}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-glass-fill hover:text-primary transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Estudiantes List */}
          <div className="w-1/3 border-r border-glass-border overflow-y-auto bg-glass-fill/20">
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant animate-pulse uppercase tracking-widest text-xs">Cargando lista...</div>
            ) : (
              <div className="flex flex-col">
                {estudiantes.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => handleSelectEstudiante(est)}
                    className={`p-4 text-left border-b border-glass-border/30 transition-all hover:bg-primary/5 ${
                      selectedEstudiante?.id === est.id ? 'bg-primary/10 border-l-4 border-l-primary shadow-inner' : ''
                    }`}
                  >
                    <p className={`text-sm font-bold ${selectedEstudiante?.id === est.id ? 'text-primary' : 'text-on-surface'}`}>{est.name}</p>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">CI: {est.ci || 'N/A'}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            est.pivot.estado === 'aprobado' ? 'bg-primary/20 text-primary' :
                            est.pivot.estado === 'reprobado' ? 'bg-error/20 text-error' :
                            'bg-glass-fill text-on-surface-variant'
                        }`}>
                            {est.pivot.nota_final || 'S/N'}
                        </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calificar Form */}
          <div className="w-2/3 p-8 overflow-y-auto">
            {selectedEstudiante ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border border-primary/30">
                        {selectedEstudiante.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-on-surface">{selectedEstudiante.name}</h3>
                        <p className="text-sm text-on-surface-variant">{selectedEstudiante.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Nota Final (0-100)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="glass-input rounded-xl px-4 py-3 text-2xl font-bold text-center text-primary"
                      value={formData.nota_final}
                      onChange={(e) => setFormData({...formData, nota_final: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Estado Académico</label>
                    <select
                      className="glass-input rounded-xl px-4 py-3 text-sm font-bold"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    >
                      <option value="cursando">Cursando</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="reprobado">Reprobado</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="retirado">Retirado</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Retroalimentación Académica</label>
                  <textarea
                    className="glass-input rounded-xl px-4 py-3 text-sm min-h-[150px] resize-none"
                    placeholder="Escriba el resumen del desempeño del estudiante..."
                    value={formData.retroalimentacion}
                    onChange={(e) => setFormData({...formData, retroalimentacion: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 glass-button-primary py-4 rounded-xl text-primary-fixed font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Registrar Calificación
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-6xl mb-4">person_check</span>
                <p className="font-bold uppercase tracking-[0.2em] text-sm">Seleccione un estudiante para calificar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalificacionFinalModal;
