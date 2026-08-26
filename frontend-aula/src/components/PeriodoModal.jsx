import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const PeriodoModal = ({ isOpen, onClose, añoActual }) => {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPeriodos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/periodos');
      // Filtrar por año actual si es necesario, o mostrar todos los del año
      const filtered = response.data.filter(p => p.año.toString() === añoActual.toString());

      // Si no existen los 3, inicializarlos en el estado
      const names = ['PI', 'PII', 'PIII'];
      const completeList = names.map(name => {
        const found = filtered.find(p => p.nombre === name);
        return found || { nombre: name, año: añoActual, fecha_inicio: '', fecha_fin: '', activo: true };
      });

      setPeriodos(completeList);
    } catch (error) {
      console.error('Error fetching periodos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPeriodos();
    }
  }, [isOpen, añoActual]);

  const handleDateChange = (index, field, value) => {
    const updated = [...periodos];
    updated[index][field] = value;
    setPeriodos(updated);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const promises = periodos.map(p => {
        if (p.id) {
          return api.put(`/periodos/${p.id}`, p);
        } else {
          return api.post('/periodos', p);
        }
      });
      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error('Error saving periodos:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl rounded-3xl border border-glass-border shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-glass-border bg-glass-fill/50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-on-surface">Configuraciones de Periodos</h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">Ciclo Lectivo {añoActual}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {periodos.map((p, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-glass-border flex flex-col md:flex-row items-center gap-6 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4 min-w-[120px]">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {p.nombre}
                      </div>
                      <span className="font-bold text-on-surface">
                        {p.nombre === 'PI' ? 'Periodo I' : p.nombre === 'PII' ? 'Periodo II' : 'Periodo III'}
                      </span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-2">Inicio</label>
                        <input
                          type="date"
                          className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                          value={p.fecha_inicio || ''}
                          onChange={(e) => handleDateChange(idx, 'fecha_inicio', e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 ml-2">Fin</label>
                        <input
                          type="date"
                          className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                          value={p.fecha_fin || ''}
                          onChange={(e) => handleDateChange(idx, 'fecha_fin', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-glass-border font-bold text-on-surface-variant hover:bg-glass-fill transition-all uppercase text-[10px] tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="flex-2 py-4 px-12 rounded-2xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-widest"
                >
                  {saving ? 'Guardando...' : 'Guardar Configuraciones'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodoModal;
