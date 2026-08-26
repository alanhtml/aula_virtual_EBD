import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CursoModal = ({ isOpen, onClose, onSave, cursoToEdit, añoActual }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nivel: '101',
    periodo: 'PI', // PI, PII, PIII
    año: añoActual || new Date().getFullYear().toString(),
    horario: 'Domingo 08:00 - 12:00',
    descripcion: '',
    codigo: '',
    docentes: [], // Array de IDs de docentes
  });

  const [docentesList, setDocentesList] = useState([]);
  const [configPeriodos, setConfigPeriodos] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Mapeo base de meses
  const getMonthName = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleString('es-ES', { month: 'short' }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await api.get('/periodos');

      const names = ['PI', 'PII', 'PIII'];
      const year = formData.año;
      const dynamicList = names.map(name => {
        const found = response.data.find(p => p.nombre === name && p.año.toString() === year.toString());
        let label = name === 'PI' ? 'Periodo I' : name === 'PII' ? 'Periodo II' : 'Periodo III';

        if (found && found.fecha_inicio && found.fecha_fin) {
          const start = getMonthName(found.fecha_inicio);
          const end = getMonthName(found.fecha_fin);
          label += ` (${start}-${end})`;
        } else {
          // Fallback labels si no hay configuración
          if (name === 'PI') label += ' (Feb-May)';
          if (name === 'PII') label += ' (Jun-Sep)';
          if (name === 'PIII') label += ' (Oct-Ene)';
        }

        return { id: name, name: label, data: found };
      });

      setConfigPeriodos(dynamicList);
    } catch (error) {
      console.error('Error fetching periodos config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchDocentes = async () => {
    try {
      const response = await api.get('/users');
      const filteredDocentes = response.data.filter(u => u.role === 'docentes');
      setDocentesList(filteredDocentes);
    } catch (error) {
      console.error('Error fetching docentes:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocentes();
      fetchConfig();
    }
  }, [isOpen, formData.año]);

  useEffect(() => {
    const newCodigo = `${formData.nivel}-${formData.periodo}-${formData.año}`;
    setFormData(prev => ({
      ...prev,
      codigo: newCodigo,
      nombre: `Módulo ${formData.nivel}`
    }));
  }, [formData.nivel, formData.periodo, formData.año]);

  useEffect(() => {
    if (cursoToEdit && isOpen) {
      const codeParts = cursoToEdit.codigo?.split('-') || [];
      const periodoId = codeParts[1] || 'PI';
      const añoVal = codeParts[2] || añoActual || new Date().getFullYear().toString();

      setFormData({
        nombre: cursoToEdit.nombre || '',
        nivel: cursoToEdit.nivel || '101',
        periodo: periodoId,
        año: añoVal.toString(),
        horario: cursoToEdit.horario || 'Domingo 08:00 - 12:00',
        descripcion: cursoToEdit.descripcion || '',
        codigo: cursoToEdit.codigo || '',
        docentes: cursoToEdit.docentes?.map(d => d.id) || (cursoToEdit.docente_id ? [cursoToEdit.docente_id] : []),
      });
    } else if (!cursoToEdit && isOpen) {
      setFormData(prev => ({
        ...prev,
        año: añoActual || new Date().getFullYear().toString(),
        docentes: []
      }));
    }
  }, [cursoToEdit, isOpen, añoActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocenteToggle = (docenteId) => {
    setFormData(prev => {
      const isSelected = prev.docentes.includes(docenteId);
      if (isSelected) {
        return { ...prev, docentes: prev.docentes.filter(id => id !== docenteId) };
      } else {
        if (prev.docentes.length >= 3) return prev;
        return { ...prev, docentes: [...prev.docentes, docenteId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeConfig = configPeriodos.find(p => p.id === formData.periodo);
    const periodoFull = activeConfig ? activeConfig.name + " " + formData.año : `Periodo ${formData.periodo} ${formData.año}`;

    onSave({
      ...formData,
      semestre: periodoFull,
      docente_id: formData.docentes[0] || null,
      docentes: formData.docentes,
      fecha_inicio: activeConfig?.data?.fecha_inicio || null,
      fecha_fin: activeConfig?.data?.fecha_fin || null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-void-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-8 rounded-2xl border border-glass-border shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h3 className="text-2xl font-headline-md text-primary">
              {cursoToEdit ? 'Editar Módulo' : 'Nueva Apertura de Módulo'}
            </h3>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mt-1">Configuración del Ciclo Académico</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-black text-primary/70 uppercase tracking-widest ml-1">Nombre del Módulo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              className="glass-input rounded-xl px-4 py-4 text-sm bg-primary/5 text-primary font-bold border-primary/20 outline-none cursor-not-allowed w-full"
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Código Identificador</label>
            <div className="relative">
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                className="glass-input rounded-xl px-4 py-4 text-sm bg-primary/5 text-primary font-bold border-primary/20 outline-none cursor-not-allowed w-full"
                readOnly
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 text-sm">lock</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Nivel del Módulo</label>
            <select
              name="nivel"
              value={formData.nivel}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
              required
            >
              {['101', '201', '301', '401', '501'].map(n => (
                <option key={n} value={n} className="bg-[#131313]">Módulo {n}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Periodo Anual</label>
            <select
              name="periodo"
              value={formData.periodo}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
              required
            >
              {configPeriodos.map(p => (
                <option key={p.id} value={p.id} className="bg-[#131313]">{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Año Lectivo</label>
            <div className="relative">
              <input
                type="text"
                name="año"
                value={formData.año}
                className="glass-input rounded-xl px-4 py-4 text-sm bg-primary/5 text-primary font-bold border-primary/20 outline-none cursor-not-allowed w-full"
                readOnly
              />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 text-sm">lock</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">
              Docentes Asignados ({formData.docentes.length}/3)
            </label>
            <div className="glass-input rounded-xl p-2 min-h-[56px] flex flex-wrap gap-2 items-center relative group">
              {formData.docentes.length === 0 && (
                <span className="text-on-surface-variant/40 text-xs ml-2">Selecciona docentes...</span>
              )}
              {formData.docentes.map(docId => {
                const doc = docentesList.find(d => d.id === docId);
                return (
                  <div key={docId} className="flex items-center gap-1 bg-primary/20 text-primary-fixed text-[10px] font-bold px-2 py-1 rounded-lg border border-primary/30 animate-in zoom-in duration-200">
                    {doc?.name}
                    <button type="button" onClick={() => handleDocenteToggle(docId)} className="hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                );
              })}

              {formData.docentes.length < 3 && (
                <div className="relative ml-auto">
                  <select
                    className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8 z-10"
                    onChange={(e) => {
                      if (e.target.value) handleDocenteToggle(parseInt(e.target.value));
                      e.target.value = "";
                    }}
                  >
                    <option value="" className="bg-[#1a1a1a]"> + </option>
                    {docentesList
                      .filter(d => !formData.docentes.includes(d.id))
                      .map(doc => (
                        <option key={doc.id} value={doc.id} className="bg-[#1a1a1a] text-on-surface py-2">
                          {doc.name}
                        </option>
                      ))
                    }
                  </select>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary/20 transition-all">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Horario Sugerido</label>
            <input
              type="text"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="glass-input rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              placeholder="Ej. Domingo 08:00"
              required
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Descripción y Objetivos</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="2"
              className="glass-input rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              placeholder="Detalles sobre el contenido del módulo..."
            ></textarea>
          </div>

          <div className="flex gap-4 mt-6 md:col-span-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-glass-fill border border-glass-border text-on-surface font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl glass-button-primary text-primary-fixed font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {cursoToEdit ? 'Guardar Cambios' : 'Confirmar Apertura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoModal;
