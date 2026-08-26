import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const MisCalificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalificaciones();
  }, []);

  const fetchCalificaciones = async () => {
    try {
      const response = await api.get('/mis-calificaciones');
      setCalificaciones(response.data);
    } catch (error) {
      console.error('Error fetching calificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-primary">Cargando reporte de notas...</div>;

  return (
    <section className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline-lg text-on-surface">Mis Calificaciones</h2>
          <p className="text-sm text-on-surface-variant">Historial académico y retroalimentación de docentes.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl">
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Promedio General</p>
          <p className="text-2xl font-headline-md text-primary">
            {calificaciones.length > 0
              ? (calificaciones.reduce((acc, c) => acc + parseFloat(c.calificacion), 0) / calificaciones.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-glass-border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-glass-fill/80 backdrop-blur-md border-b border-glass-border">
            <tr>
              <th className="py-5 px-6 text-[10px] text-primary font-black uppercase tracking-widest">Módulo / Curso</th>
              <th className="py-5 px-6 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Actividad Evaluada</th>
              <th className="py-5 px-6 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Puntaje</th>
              <th className="py-5 px-6 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Retroalimentación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border/20">
            {calificaciones.map((c) => (
              <tr key={c.id} className="hover:bg-primary/[0.02] transition-colors">
                <td className="py-4 px-6">
                  <p className="text-sm font-bold text-on-surface">{c.tarea?.curso?.nombre}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Nivel {c.tarea?.curso?.nivel}</p>
                </td>
                <td className="py-4 px-6 text-sm text-on-surface-variant">
                  {c.tarea?.titulo}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-headline-md ${parseFloat(c.calificacion) >= 61 ? 'text-primary' : 'text-error'}`}>
                      {c.calificacion}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/40">/ 100</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="text-xs text-on-surface-variant italic max-w-xs">
                    {c.comentario_profesor || 'Sin observaciones.'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {calificaciones.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/30">
            <span className="material-symbols-outlined text-5xl mb-2">history_edu</span>
            <p className="text-sm font-bold uppercase tracking-widest">Aún no tienes notas registradas</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MisCalificaciones;
