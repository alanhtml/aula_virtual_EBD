import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AsistenciaModal = ({ isOpen, onClose, curso }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [asistencias, setAsistencias] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (isOpen && curso) {
      fetchEstudiantes();
      fetchAsistenciasPrevias();
    }
  }, [isOpen, curso, fecha]);

  const fetchEstudiantes = async () => {
    try {
      const response = await api.get(`/cursos/${curso.id}`);
      setEstudiantes(response.data.estudiantes || []);

      // Inicializar estado de asistencia si no existe
      const initialAsistencias = {};
      response.data.estudiantes.forEach(est => {
        initialAsistencias[est.id] = { estado: 'presente', observaciones: '' };
      });
      setAsistencias(prev => ({ ...initialAsistencias, ...prev }));
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  const fetchAsistenciasPrevias = async () => {
    try {
      const response = await api.get(`/asistencias/curso/${curso.id}?fecha=${fecha}`);
      if (response.data.length > 0) {
        const prevAsistencias = {};
        response.data.forEach(asist => {
          prevAsistencias[asist.user_id] = {
            estado: asist.estado,
            observaciones: asist.observaciones || ''
          };
        });
        setAsistencias(prev => ({ ...prev, ...prevAsistencias }));
      }
    } catch (error) {
      console.error('Error fetching asistencias previas:', error);
    }
  };

  const handleEstadoChange = (userId, nuevoEstado) => {
    setAsistencias(prev => ({
      ...prev,
      [userId]: { ...prev[userId], estado: nuevoEstado }
    }));
  };

  const handleObservacionChange = (userId, obs) => {
    setAsistencias(prev => ({
      ...prev,
      [userId]: { ...prev[userId], observaciones: obs }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        curso_id: curso.id,
        fecha: fecha,
        asistencias: Object.keys(asistencias).map(userId => ({
          user_id: userId,
          estado: asistencias[userId].estado,
          observaciones: asistencias[userId].observaciones
        }))
      };
      await api.post('/asistencias', payload);
      setMensaje({ type: 'success', text: 'Asistencia guardada correctamente' });
      setTimeout(() => {
        setMensaje(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error saving asistencia:', error);
      setMensaje({ type: 'error', text: 'Error al guardar la asistencia' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-void-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-3xl p-8 rounded-2xl border border-glass-border shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-headline-md text-primary">Control de Asistencia</h3>
            <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">{curso.nombre} ({curso.codigo})</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Fecha de Clase (Domingo)</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="glass-input rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            />
          </div>
          {mensaje && (
            <div className={`px-4 py-2 rounded-xl text-xs font-bold animate-pulse ${mensaje.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
              {mensaje.text}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-primary/20 pr-2">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#1a1a1c] z-10">
              <tr className="border-b border-glass-border">
                <th className="py-4 px-2 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Estudiante</th>
                <th className="py-4 px-2 text-[10px] text-on-surface-variant font-black uppercase tracking-widest text-center">Estado de Asistencia</th>
                <th className="py-4 px-2 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Observaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/20">
              {estudiantes.map((est) => (
                <tr key={est.id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="py-4 px-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{est.name}</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-medium">CI: {est.ci || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleEstadoChange(est.id, 'presente')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          asistencias[est.id]?.estado === 'presente'
                          ? 'bg-primary text-on-primary shadow-lg shadow-primary/40 scale-110'
                          : 'bg-glass-fill text-on-surface-variant hover:text-primary'
                        }`}
                        title="Presente"
                      >
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                      </button>
                      <button
                        onClick={() => handleEstadoChange(est.id, 'ausente')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          asistencias[est.id]?.estado === 'ausente'
                          ? 'bg-error text-white shadow-lg shadow-error/40 scale-110'
                          : 'bg-glass-fill text-on-surface-variant hover:text-error'
                        }`}
                        title="Ausente"
                      >
                        <span className="material-symbols-outlined text-xl">cancel</span>
                      </button>
                      <button
                        onClick={() => handleEstadoChange(est.id, 'justificado')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          asistencias[est.id]?.estado === 'justificado'
                          ? 'bg-secondary-fixed text-on-secondary-fixed shadow-lg shadow-secondary-fixed/40 scale-110'
                          : 'bg-glass-fill text-on-surface-variant hover:text-secondary-fixed'
                        }`}
                        title="Justificado"
                      >
                        <span className="material-symbols-outlined text-xl">info</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="text"
                      placeholder="Ej. Llegó tarde..."
                      value={asistencias[est.id]?.observaciones || ''}
                      onChange={(e) => handleObservacionChange(est.id, e.target.value)}
                      className="w-full bg-void-black/40 border border-glass-border rounded-lg px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {estudiantes.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant/40">
              <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
              <p className="text-xs font-bold uppercase tracking-widest">No hay estudiantes inscritos</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-glass-fill border border-glass-border text-on-surface font-bold hover:bg-glass-fill/80 transition-all"
          >
            Cerrar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || estudiantes.length === 0}
            className="flex-1 py-3 rounded-xl glass-button-primary text-primary-fixed font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Registrar Asistencia'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaModal;
