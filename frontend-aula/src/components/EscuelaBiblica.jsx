import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ConfirmModal from './ConfirmModal';
import EscuelaClaseModal from './EscuelaClaseModal';
import { EscuelaBiblicaSkeleton } from './Skeleton';

const EscuelaBiblica = () => {
  const [clases, setClases] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claseToEdit, setClaseToEdit] = useState(null);
  const [showAddEstudiante, setShowAddEstudiante] = useState(false);
  const [newEstudiante, setNewEstudiante] = useState({ nombre_estudiante: '', edad: '' });
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  const fetchClases = async () => {
    setLoading(true);
    try {
      const response = await api.get('/escuela-clases');
      setClases(response.data);
    } catch (error) {
      console.error('Error fetching clases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users');
      // Filtrar solo docentes
      setTeachers(response.data.filter(u => u.role === 'docentes' || u.role === 'director'));
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchClases();
    if (user.role === 'director') {
      fetchTeachers();
    }
  }, []);

  const handleSaveClase = async (formData) => {
    try {
      if (claseToEdit) {
        await api.put(`/escuela-clases/${claseToEdit.id}`, formData);
      } else {
        await api.post('/escuela-clases', formData);
      }
      setIsModalOpen(false);
      fetchClases();
    } catch (error) {
      console.error('Error saving clase:', error);
    }
  };

  const deleteClase = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Espacio?',
      message: 'Esta acción borrará el espacio y todos los alumnos registrados en él.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/escuela-clases/${id}`);
          fetchClases();
          if (selectedClase?.id === id) setSelectedClase(null);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting clase:', error);
        }
      }
    });
  };

  const handleAddEstudiante = async (e) => {
    e.preventDefault();
    if (!newEstudiante.nombre_estudiante || !newEstudiante.edad) return;

    try {
      await api.post(`/escuela-clases/${selectedClase.id}/estudiantes`, newEstudiante);
      setNewEstudiante({ nombre_estudiante: '', edad: '' });
      fetchClases();
      // Update selectedClase to show the new student immediately
      const response = await api.get('/escuela-clases');
      const updatedClase = response.data.find(c => c.id === selectedClase.id);
      setSelectedClase(updatedClase);
    } catch (error) {
      console.error('Error adding estudiante:', error);
    }
  };

  const removeEstudiante = (claseId, estudianteId) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Estudiante?',
      message: 'Esta acción quitará al estudiante de la lista de esta clase.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/escuela-clases/${claseId}/estudiantes/${estudianteId}`);
          fetchClases();
          const response = await api.get(`/escuela-clases/${claseId}`);
          setSelectedClase(response.data);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error removing student:', error);
        }
      }
    });
  };

  if (loading && clases.length === 0) return <EscuelaBiblicaSkeleton />;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center mt-8">
        <div>
          <h2 className="text-4xl font-headline-lg text-on-surface">Escuela Bíblica Dominical</h2>
          <p className="text-on-surface-variant mt-2 text-lg">Formación espiritual por niveles de edad y etapas de crecimiento.</p>
        </div>
        <div className="flex items-center gap-4">
          {user.role === 'director' && (
            <button
              onClick={() => {
                setClaseToEdit(null);
                setIsModalOpen(true);
              }}
              className="glass-button-primary px-6 py-3 rounded-2xl text-primary-fixed flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add_box</span>
              Nuevo Espacio
            </button>
          )}
          <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl">
            <span className="text-primary font-bold text-sm uppercase tracking-widest">Sin Calificaciones</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clases.map((clase) => (
          <div
            key={clase.id}
            onClick={() => setSelectedClase(clase)}
            className={`glass-card p-8 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative group ${
              selectedClase?.id === clase.id ? 'border-primary shadow-[0_0_30px_rgba(189,147,249,0.2)] scale-[1.02]' : 'border-glass-border hover:border-primary/50'
            }`}
          >
            {user.role === 'director' && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setClaseToEdit(clase);
                    setIsModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-lg bg-glass-fill border border-glass-border flex items-center justify-center text-primary hover:bg-primary/20"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteClase(clase.id);
                  }}
                  className="w-8 h-8 rounded-lg bg-glass-fill border border-glass-border flex items-center justify-center text-error hover:bg-error/20"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            )}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <span className="material-symbols-outlined text-3xl">
                {clase.nombre.toLowerCase().includes('parvulo') ? 'child_care' :
                 clase.nombre.toLowerCase().includes('niño') ? 'face' :
                 clase.nombre.toLowerCase().includes('adolecente') || clase.nombre.toLowerCase().includes('adolescente') ? 'groups' :
                 clase.nombre.toLowerCase().includes('joven') ? 'school' : 'auto_stories'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2">{clase.nombre}</h3>
            <p className="text-primary font-black text-xs uppercase tracking-widest mb-4">{clase.rango_edad}</p>
            <p className="text-sm text-on-surface-variant line-clamp-2 mb-6">{clase.descripcion}</p>

            <div className="flex items-center justify-between border-t border-glass-border pt-4">
              <span className="text-xs text-on-surface-variant font-medium">
                {clase.estudiantes?.length || 0} Estudiantes
              </span>
              <span className="material-symbols-outlined text-primary text-xl">arrow_forward_ios</span>
            </div>
          </div>
        ))}
      </div>

      {selectedClase && (
        <div className="glass-card rounded-3xl border border-glass-border overflow-hidden animate-in slide-in-from-bottom duration-500">
          <div className="p-8 border-b border-glass-border bg-glass-fill/50 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/30">
                {selectedClase.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-on-surface">Lista de Clase: {selectedClase.nombre}</h3>
                <p className="text-on-surface-variant">{selectedClase.rango_edad} • Docente Asignado: {selectedClase.docente?.name || 'Por asignar'}</p>
              </div>
            </div>

            {(user.role === 'docentes' || user.role === 'director') && (
              <button
                onClick={() => setShowAddEstudiante(!showAddEstudiante)}
                className="glass-button-primary px-8 py-3 rounded-2xl text-primary-fixed flex items-center gap-2"
              >
                <span className="material-symbols-outlined">person_add</span>
                Registrar Estudiante
              </button>
            )}
          </div>

          <div className="p-8">
            {showAddEstudiante && (
              <form onSubmit={handleAddEstudiante} className="mb-8 p-6 glass-panel rounded-2xl border border-primary/20 flex gap-4 animate-in fade-in zoom-in duration-300">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 mb-2 block">Nombre del Alumno</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Perez"
                    className="glass-input w-full px-4 py-3 rounded-xl"
                    value={newEstudiante.nombre_estudiante}
                    onChange={(e) => setNewEstudiante({...newEstudiante, nombre_estudiante: e.target.value})}
                  />
                </div>
                <div className="w-32">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 mb-2 block">Edad</label>
                  <input
                    type="number"
                    placeholder="Años"
                    className="glass-input w-full px-4 py-3 rounded-xl"
                    value={newEstudiante.edad}
                    onChange={(e) => setNewEstudiante({...newEstudiante, edad: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="bg-primary text-on-primary h-[50px] px-8 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                    Añadir a Lista
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedClase.estudiantes?.map((est) => (
                <div key={est.id} className="glass-panel p-5 rounded-2xl border border-glass-border flex items-center justify-between group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-void-black flex items-center justify-center text-primary text-sm font-bold border border-glass-border">
                      {est.edad}
                    </div>
                    <span className="font-bold text-on-surface">{est.nombre_estudiante}</span>
                  </div>
                  {(user.role === 'docentes' || user.role === 'director') && (
                    <button
                      onClick={() => removeEstudiante(selectedClase.id, est.id)}
                      className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
              {(!selectedClase.estudiantes || selectedClase.estudiantes.length === 0) && (
                <div className="col-span-full py-20 text-center text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-6xl mb-4">group_off</span>
                  <p className="text-lg font-medium">No hay alumnos registrados en esta clase aún.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({...confirmConfig, isOpen: false})}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />

      <EscuelaClaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClase}
        claseToEdit={claseToEdit}
        teachers={teachers}
      />
    </div>
  );
};

export default EscuelaBiblica;
