import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const InscripcionModal = ({ isOpen, onClose, curso }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && curso) {
      fetchEstudiantes();
      if (curso.estudiantes) {
        setSelectedIds(curso.estudiantes.map(e => e.id));
      }
    }
  }, [isOpen, curso]);

  const fetchEstudiantes = async () => {
    try {
      const response = await api.get('/users');
      // Filtrar solo usuarios con rol 'estudiantes'
      setEstudiantes(response.data.filter(u => u.role === 'estudiantes'));
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  const handleToggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post(`/cursos/${curso.id}/inscribir`, {
        estudiantes: selectedIds
      });
      onClose(true); // Pasar true para indicar que se guardó exitosamente
    } catch (error) {
      console.error('Error al inscribir estudiantes:', error);
      alert('Error al actualizar la lista de estudiantes.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEstudiantes = estudiantes.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen || !curso) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-void-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-8 rounded-2xl border border-glass-border shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-headline-md text-primary">Inscribir Estudiantes</h3>
            <p className="text-sm text-on-surface-variant">{curso.nombre} - Nivel {curso.nivel}</p>
          </div>
          <button onClick={() => onClose(false)} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            type="text"
            className="glass-input w-full rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary"
            placeholder="Buscar por nombre o matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 gap-2">
            {filteredEstudiantes.map(estudiante => (
              <div
                key={estudiante.id}
                onClick={() => handleToggle(estudiante.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedIds.includes(estudiante.id)
                  ? 'bg-primary/10 border-primary/50 text-primary'
                  : 'bg-glass-fill border-glass-border text-on-surface-variant hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedIds.includes(estudiante.id) ? 'bg-primary text-primary-fixed' : 'bg-glass-border'
                  }`}>
                    {estudiante.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{estudiante.name}</p>
                    <p className="text-[10px] opacity-70">{estudiante.username}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-xl">
                  {selectedIds.includes(estudiante.id) ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>
            ))}
            {filteredEstudiantes.length === 0 && (
              <div className="py-8 text-center text-on-surface-variant">
                No se encontraron estudiantes.
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-glass-border">
          <div className="flex-1 flex items-center text-xs text-on-surface-variant">
            <span className="font-bold text-primary mr-1">{selectedIds.length}</span> seleccionados
          </div>
          <button
            onClick={() => onClose(false)}
            className="px-6 py-2 rounded-xl bg-glass-fill border border-glass-border text-on-surface font-bold hover:bg-glass-fill/80 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2 rounded-xl glass-button-primary text-primary-fixed font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InscripcionModal;
