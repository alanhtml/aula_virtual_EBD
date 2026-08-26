import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CalificacionModal from './CalificacionModal';

const ListaEntregasModal = ({ isOpen, onClose, tarea }) => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [isCalificarOpen, setIsCalificarOpen] = useState(false);

  useEffect(() => {
    if (isOpen && tarea) {
      fetchEntregas();
    }
  }, [isOpen, tarea]);

  const fetchEntregas = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/entregas?tarea_id=${tarea.id}`);
      setEntregas(response.data);
    } catch (error) {
      console.error('Error fetching entregas for task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalificar = async (calificacionData) => {
    try {
      await api.post(`/entregas/${selectedEntrega.id}/calificar`, calificacionData);
      setIsCalificarOpen(false);
      fetchEntregas();
    } catch (error) {
      console.error('Error calificando entrega:', error);
    }
  };

  if (!isOpen || !tarea) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-void-black/80 backdrop-blur-md" onClick={() => onClose()}></div>

      <div className="relative w-full max-w-4xl glass-card rounded-2xl border border-glass-border shadow-2xl animate-in slide-in-from-bottom-8 duration-300 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-glass-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-headline-md text-primary">Entregas Recibidas</h2>
            <p className="text-xs text-on-surface-variant mt-1">{tarea.titulo} • {entregas.length} entregas</p>
          </div>
          <button onClick={() => onClose()} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20 text-primary">Cargando entregas...</div>
          ) : entregas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">person_off</span>
              <p>Ningún estudiante ha entregado esta tarea todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {entregas.map((e) => (
                <div key={e.id} className="p-5 rounded-xl bg-glass-fill border border-glass-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {e.user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{e.user?.name}</p>
                      <p className="text-xs text-on-surface-variant">Entregado el {new Date(e.fecha_entrega).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">Archivo:</span>
                        <a href={e.archivo_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate max-w-[200px]">
                            {e.archivo_url}
                        </a>
                    </div>
                    {e.comentario_estudiante && (
                        <p className="text-[11px] text-on-surface-variant italic line-clamp-1">"{e.comentario_estudiante}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className={`text-lg font-black ${e.calificacion !== null ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {e.calificacion !== null ? e.calificacion : '--'}<span className="text-[10px] font-normal">/100</span>
                        </p>
                        <p className="text-[9px] uppercase tracking-tighter text-on-surface-variant">Calificación</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEntrega(e);
                        setIsCalificarOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:scale-105 transition-all shadow-md shadow-primary/20"
                    >
                      {e.calificacion !== null ? 'Re-calificar' : 'Calificar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CalificacionModal
        isOpen={isCalificarOpen}
        onClose={() => setIsCalificarOpen(false)}
        onSave={handleCalificar}
        entrega={selectedEntrega}
      />
    </div>
  );
};

export default ListaEntregasModal;
