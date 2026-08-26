import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const HistorialAcademico = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      const response = await api.get('/historial-academico');
      setHistorial(response.data);
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'aprobado': return 'bg-primary/20 text-primary border-primary/30';
      case 'reprobado': return 'bg-error/20 text-error border-error/30';
      case 'cursando': return 'bg-secondary-fixed/20 text-secondary-fixed border-secondary-fixed/30';
      case 'inactivo': return 'bg-glass-fill text-on-surface-variant border-glass-border';
      default: return 'bg-glass-fill text-on-surface-variant border-glass-border';
    }
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 animate-pulse">
        <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">history_edu</span>
        <p className="text-primary font-bold uppercase tracking-[0.2em] text-sm">Cargando Historial Académico...</p>
    </div>
  );

  return (
    <section className="flex flex-col gap-8 mt-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-headline-lg text-on-surface">Historial Académico</h2>
          <p className="text-sm text-on-surface-variant mt-2 max-w-md">
            Registro oficial de todos los módulos cursados, calificaciones finales y retroalimentación institucional.
          </p>
        </div>
        <div className="flex gap-4">
            <div className="glass-card px-6 py-4 rounded-2xl border border-glass-border flex flex-col items-center">
                <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Módulos</span>
                <span className="text-2xl font-headline-md text-primary">{historial.length}</span>
            </div>
            <div className="glass-card px-6 py-4 rounded-2xl border border-glass-border flex flex-col items-center">
                <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Aprobados</span>
                <span className="text-2xl font-headline-md text-primary-fixed">
                    {historial.filter(c => c.pivot.estado === 'aprobado').length}
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {historial.length > 0 ? (
          historial.map((curso) => (
            <div key={curso.id} className="glass-card p-6 rounded-2xl border border-glass-border hover:border-primary/40 transition-all group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 bg-void-black text-[10px] font-black text-primary border border-primary/20 rounded uppercase tracking-tighter">
                      Nivel {curso.nivel}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">{curso.codigo}</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface group-hover:text-primary transition-colors">{curso.nombre}</h3>
                  <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">person</span>
                        <span>Docente: {curso.docente?.name || 'Varios'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event</span>
                        <span>{curso.semestre}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:border-l border-glass-border/30 md:pl-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1">Nota Final</span>
                    <div className="flex items-baseline gap-0.5">
                        <span className={`text-3xl font-headline-lg ${parseFloat(curso.pivot.nota_final) >= 61 ? 'text-primary' : 'text-error'}`}>
                            {curso.pivot.nota_final || '0'}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/40">/100</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center min-w-[100px]">
                    <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-2">Resultado</span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(curso.pivot.estado)}`}>
                      {curso.pivot.estado}
                    </span>
                  </div>
                </div>
              </div>

              {curso.pivot.retroalimentacion && (
                <div className="mt-6 p-4 rounded-xl bg-glass-fill/30 border border-glass-border/20">
                    <p className="text-[10px] text-primary-fixed font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">comment</span>
                        Retroalimentación del Docente
                    </p>
                    <p className="text-sm text-on-surface-variant italic leading-relaxed">
                        "{curso.pivot.retroalimentacion}"
                    </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-on-surface-variant/30 glass-card rounded-3xl border border-glass-border">
            <div className="w-24 h-24 rounded-full bg-glass-fill border border-glass-border flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-6xl">layers_clear</span>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em]">No hay registros en el historial</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorialAcademico;
