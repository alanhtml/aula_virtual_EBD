import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ReporteGeneral = () => {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchReporte();
  }, []);

  const fetchReporte = async () => {
    try {
      const response = await api.get('/reporte-general');
      setReporte(response.data);
    } catch (error) {
      console.error('Error fetching reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarCiclo = async () => {
    // Detectar periodo activo para confirmación precisa
    let periodoLabel = 'el ciclo actual';
    let periodoId = null;

    try {
      const pRes = await api.get('/periodos/activo');
      if (pRes.data) {
        periodoLabel = `${pRes.data.nombre} - ${pRes.data.año}`;
        periodoId = pRes.data.id;
      }
    } catch (e) {}

    if (!window.confirm(`¿Está seguro de cerrar definitivamente el ciclo ${periodoLabel}? \n\nEsto promocionará automáticamente a los estudiantes con nota ≥ 61 al siguiente nivel y marcará el periodo como finalizado.`)) {
      return;
    }

    setIsClosing(true);
    try {
      await api.post('/periodos/cerrar-ciclo', { periodo_id: periodoId });
      alert(`Ciclo ${periodoLabel} cerrado exitosamente. Los estudiantes han sido promocionados.`);
      fetchReporte();
    } catch (error) {
      console.error('Error al cerrar el ciclo:', error);
      alert('Error al procesar el cierre del ciclo.');
    } finally {
      setIsClosing(false);
    }
  };

  const filteredReporte = reporte.filter(est =>
    est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    est.ci?.includes(searchTerm)
  );

  const exportToCSV = () => {
    const headers = ['Nombre', 'CI', 'Email', 'Teléfono', 'Módulo', 'Código', 'Nota', 'Estado'];
    const rows = [];

    reporte.forEach(est => {
      if (est.cursos.length === 0) {
        rows.push([est.nombre, est.ci, est.email, est.telefono, 'N/A', 'N/A', 'N/A', 'N/A']);
      } else {
        est.cursos.forEach(c => {
          rows.push([est.nombre, est.ci, est.email, est.telefono, c.modulo, c.codigo, c.nota, c.estado]);
        } );
      }
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_academico_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">Generando Reporte Consolidado...</p>
    </div>
  );

  return (
    <section className="flex flex-col gap-8 mt-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline-lg text-on-surface">Reporte Académico General</h2>
          <p className="text-sm text-on-surface-variant">Vista global del progreso de todos los estudiantes inscritos.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCerrarCiclo}
            disabled={isClosing}
            className="px-6 py-3 rounded-xl bg-error text-white font-bold flex items-center gap-2 shadow-lg shadow-error/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">lock_reset</span>
            {isClosing ? 'Procesando...' : 'Cerrar Ciclo y Promocionar'}
          </button>
          <button
            onClick={exportToCSV}
            className="glass-button-primary px-6 py-3 rounded-xl text-primary-fixed flex items-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-2">
        <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
                type="text"
                placeholder="Buscar por nombre o CI..."
                className="glass-input w-full pl-12 pr-4 py-3 rounded-2xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-glass-border shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-glass-fill/80 backdrop-blur-md border-b border-glass-border">
              <tr>
                <th className="py-5 px-8 text-[10px] text-primary font-black uppercase tracking-widest">Estudiante</th>
                <th className="py-5 px-8 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Información</th>
                <th className="py-5 px-8 text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Módulos Cursados</th>
                <th className="py-5 px-8 text-[10px] text-on-surface-variant font-black uppercase tracking-widest text-center">Estado Académico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/20">
              {filteredReporte.map((est, idx) => (
                <tr key={idx} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="py-6 px-8">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{est.nombre}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tighter mt-0.5">CI: {est.ci || 'Sin registro'}</p>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span>{est.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>{est.telefono || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    {est.cursos.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {est.cursos.map((c, i) => (
                          <div key={i} className={`px-3 py-1 rounded-lg bg-glass-fill border text-[10px] flex flex-col ${c.nota >= 61 ? 'border-primary/50 bg-primary/5' : 'border-glass-border'}`}>
                            <span className="font-bold text-on-surface">{c.modulo}</span>
                            <span className={`font-bold ${c.nota >= 61 ? 'text-primary' : 'text-primary/70'}`}>{c.nota || '0'} pts</span>
                            {c.nota >= 61 && (
                              <span className="text-[7px] text-primary font-black uppercase mt-0.5 flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[8px]">trending_up</span>
                                Promovible
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/40 italic">Sin cursos registrados</span>
                    )}
                  </td>
                  <td className="py-6 px-8 text-center">
                    <div className="flex flex-col items-center gap-1">
                        {est.cursos.some(c => c.estado === 'cursando') ? (
                            <span className="px-3 py-1 rounded-full bg-secondary-fixed/20 text-secondary-fixed text-[10px] font-bold uppercase border border-secondary-fixed/30">Activo</span>
                        ) : est.cursos.length > 0 ? (
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase border border-primary/30">Completado</span>
                        ) : (
                            <span className="px-3 py-1 rounded-full bg-glass-fill text-on-surface-variant text-[10px] font-bold uppercase border border-glass-border">Inactivo</span>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ReporteGeneral;
