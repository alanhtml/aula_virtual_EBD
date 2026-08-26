import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MaterialModal from './MaterialModal';
import TareaModal from './TareaModal';
import ForoModal from './ForoModal';
import EntregaModal from './EntregaModal';
import ListaEntregasModal from './ListaEntregasModal';
import SeccionModal from './SeccionModal';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';
import { ModuleSkeleton } from './Skeleton';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ModuleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contenidos');
  const [secciones, setSecciones] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [foros, setForos] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [openSections, setOpenSections] = useState(['general']);

  // Modales ... (mantener igual)
  const [isSeccionModalOpen, setIsSeccionModalOpen] = useState(false);
  // ...

  const toggleSection = (sectionId) => {
    setOpenSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const calculateProgress = () => {
    if (tareas.length === 0) return 0;
    const completed = tareas.filter(t => getEntregaForTarea(t.id)).length;
    return Math.round((completed / tareas.length) * 100);
  };
  const [selectedSeccion, setSelectedSeccion] = useState(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
  const [isForoModalOpen, setIsForoModalOpen] = useState(false);
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [selectedForo, setSelectedForo] = useState(null);
  const [selectedForoParaChat, setSelectedForoParaChat] = useState(null);
  const [isEntregaModalOpen, setIsEntregaModalOpen] = useState(false);
  const [selectedTareaForEntrega, setSelectedTareaForEntrega] = useState(null);
  const [isListaEntregasOpen, setIsListaEntregasOpen] = useState(false);
  const [selectedTareaForViewEntregas, setSelectedTareaForViewEntregas] = useState(null);

  // Estado para ConfirmModal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event, sectionId) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sId = sectionId === 'general' ? null : sectionId;
      const items = getSectionItems(sId);
      const oldIndex = items.findIndex(i => i.dragId === active.id);
      const newIndex = items.findIndex(i => i.dragId === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      const updatedMateriales = [...materiales];
      const updatedTareas = [...tareas];
      const updatedForos = [...foros];

      reorderedItems.forEach((item, index) => {
        if (item.itemType === 'material') {
          const idx = updatedMateriales.findIndex(m => m.id === item.id);
          if (idx !== -1) updatedMateriales[idx] = { ...updatedMateriales[idx], orden: index };
        } else if (item.itemType === 'tarea') {
          const idx = updatedTareas.findIndex(t => t.id === item.id);
          if (idx !== -1) updatedTareas[idx] = { ...updatedTareas[idx], orden: index };
        } else if (item.itemType === 'foro') {
          const idx = updatedForos.findIndex(f => f.id === item.id);
          if (idx !== -1) updatedForos[idx] = { ...updatedForos[idx], orden: index };
        }
      });

      setMateriales(updatedMateriales);
      setTareas(updatedTareas);
      setForos(updatedForos);
      toast.success("Orden actualizado");
    }
  };

  const getSectionItems = (sectionId) => {
    const sectionMateriales = materiales
      .filter(m => (sectionId === null ? !m.seccion_id : m.seccion_id === sectionId))
      .map(m => ({ ...m, dragId: `m-${m.id}`, itemType: 'material' }));

    const sectionTareas = tareas
      .filter(t => (sectionId === null ? !t.seccion_id : t.seccion_id === sectionId))
      .map(t => ({ ...t, dragId: `t-${t.id}`, itemType: 'tarea' }));

    const sectionForos = foros
      .filter(f => (sectionId === null ? !f.seccion_id : f.seccion_id === sectionId))
      .map(f => ({ ...f, dragId: `f-${f.id}`, itemType: 'foro' }));

    return [...sectionMateriales, ...sectionTareas, ...sectionForos].sort((a, b) => (a.orden || 0) - (b.orden || 0));
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const isDocente = user?.role === 'docentes' || user?.role === 'director';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCursoDetails(),
      fetchSecciones(),
      fetchMateriales(),
      fetchTareas(),
      fetchForos(),
      fetchEntregas(),
      fetchMensajes()
    ]);
    setLoading(false);
  };

  const fetchCursoDetails = async () => {
    try {
      const response = await api.get(`/cursos/${id}`);
      setCurso(response.data);
    } catch (error) {
      console.error('Error fetching curso details:', error);
      navigate('/dashboard');
    }
  };

  const fetchSecciones = async () => {
    try {
      const response = await api.get(`/secciones?curso_id=${id}`);
      setSecciones(response.data);
    } catch (error) {
      console.error('Error fetching secciones:', error);
    }
  };

  const fetchMateriales = async () => {
    try {
      const response = await api.get(`/materiales?curso_id=${id}`);
      setMateriales(response.data);
    } catch (error) {
      console.error('Error fetching materiales:', error);
    }
  };

  const fetchTareas = async () => {
    try {
      const response = await api.get(`/tareas?curso_id=${id}`);
      setTareas(response.data);
    } catch (error) {
      console.error('Error fetching tareas:', error);
    }
  };

  const fetchForos = async () => {
    try {
      const response = await api.get(`/foros-items?curso_id=${id}`);
      setForos(response.data);
    } catch (error) {
      console.error('Error fetching foros:', error);
    }
  };

  const fetchEntregas = async () => {
    try {
      const response = await api.get('/entregas');
      setEntregas(response.data);
    } catch (error) {
      console.error('Error fetching entregas:', error);
    }
  };

  const fetchMensajes = async (foroId = null) => {
    try {
      const url = foroId ? `/foro?curso_id=${id}&foro_id=${foroId}` : `/foro?curso_id=${id}`;
      const response = await api.get(url);
      setMensajes(response.data);
    } catch (error) {
      console.error('Error fetching mensajes:', error);
    }
  };

  const handleSaveTarea = async (formData) => {
    try {
      if (selectedTarea) {
        await api.put(`/tareas/${selectedTarea.id}`, formData);
      } else {
        await api.post('/tareas', { ...formData, curso_id: id });
      }
      setIsTareaModalOpen(false);
      fetchTareas();
    } catch (error) {
      console.error('Error saving tarea:', error);
    }
  };

  const handleDeleteSeccion = (sId) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Sección?',
      message: 'Esta acción eliminará la sección y todos los materiales y tareas asociados permanentemente.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/secciones/${sId}`);
          toast.success('Sección eliminada');
          fetchSecciones();
        } catch (error) {
          console.error('Error deleting seccion:', error);
        }
      }
    });
  };

  const handleDeleteMaterial = (mId) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Material?',
      message: 'El recurso será removido del aula virtual.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/materiales/${mId}`);
          toast.success('Material eliminado');
          fetchMateriales();
        } catch (error) {
          console.error('Error deleting material:', error);
        }
      }
    });
  };

  const handleDeleteTarea = (tId) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Tarea?',
      message: 'Se perderán todas las entregas y calificaciones asociadas a esta tarea.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/tareas/${tId}`);
          toast.success('Tarea eliminada');
          fetchTareas();
        } catch (error) {
          console.error('Error deleting tarea:', error);
        }
      }
    });
  };

  const handleDeleteForo = (fId) => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar Foro?',
      message: 'Se eliminarán todos los mensajes y debates de este foro permanentemente.',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/foros-items/${fId}`);
          toast.success('Foro eliminado');
          fetchForos();
        } catch (error) {
          console.error('Error deleting foro:', error);
        }
      }
    });
  };

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      await api.post('/foro', {
        contenido: nuevoMensaje,
        curso_id: id,
        foro_id: selectedForoParaChat?.id || null
      });
      setNuevoMensaje('');
      fetchMensajes(selectedForoParaChat?.id);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const getEntregaForTarea = (tareaId) => {
    return entregas.find(e => e.tarea_id === parseInt(tareaId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void-black text-on-surface font-body-md">
        <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(215,186,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(233,196,0,0.03)_0%,transparent_50%)]"></div>
        <header className="sticky top-0 z-50 bg-glass-fill backdrop-blur-xl border-b border-glass-border px-6 py-4 shadow-lg">
           <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-glass-fill animate-pulse"></div>
               <div className="w-48 h-8 bg-glass-fill animate-pulse rounded-lg"></div>
             </div>
           </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">
           <ModuleSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-black text-on-surface font-body-md">
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(215,186,255,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(233,196,0,0.03)_0%,transparent_50%)]"></div>

      <header className="sticky top-0 z-50 bg-glass-fill backdrop-blur-xl border-b border-glass-border px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                Nivel {curso.nivel}
              </span>
              <h1 className="text-xl md:text-2xl font-headline-md text-on-surface mt-1">{curso.nombre}</h1>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end text-right">
            <p className="text-sm font-bold text-primary">{curso.docente?.name || 'Sin docente'}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter font-bold">{curso.horario}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Estilo Moodle */}
        <aside className="lg:col-span-1 flex flex-col gap-2">
           <button
             onClick={() => setActiveTab('contenidos')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contenidos' ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10' : 'hover:bg-glass-fill text-on-surface-variant'}`}
           >
             <span className="material-symbols-outlined">dashboard</span>
             <span className="font-bold text-sm">Contenidos del Curso</span>
           </button>
           <button
             onClick={() => setActiveTab('foro')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'foro' ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10' : 'hover:bg-glass-fill text-on-surface-variant'}`}
           >
             <span className="material-symbols-outlined">forum</span>
             <span className="font-bold text-sm">Foro de Consultas</span>
           </button>
           <button
             onClick={() => setActiveTab('estudiantes')}
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'estudiantes' ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10' : 'hover:bg-glass-fill text-on-surface-variant'}`}
           >
             <span className="material-symbols-outlined">groups</span>
             <span className="font-bold text-sm">Compañeros</span>
           </button>

           {isDocente && (
             <button
               onClick={() => setActiveTab('calificaciones')}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calificaciones' ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10' : 'hover:bg-glass-fill text-on-surface-variant'}`}
             >
               <span className="material-symbols-outlined">grade</span>
               <span className="font-bold text-sm">Cuadro de Notas</span>
             </button>
           )}

           {isDocente && activeTab === 'contenidos' && (
             <div className="mt-8 flex flex-col gap-2 p-4 rounded-2xl bg-primary/5 border border-primary/10">
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Panel del Docente</p>
               <button
                 onClick={() => { setSelectedSeccion(null); setIsSeccionModalOpen(true); }}
                 className="flex items-center gap-2 text-xs font-bold text-on-surface hover:text-primary transition-colors"
               >
                 <span className="material-symbols-outlined text-sm">add_circle</span> Crear Sección
               </button>
               <button
                 onClick={() => setIsMaterialModalOpen(true)}
                 className="flex items-center gap-2 text-xs font-bold text-on-surface hover:text-primary transition-colors"
               >
                 <span className="material-symbols-outlined text-sm">upload_file</span> Subir Material
               </button>
               <button
                 onClick={() => { setSelectedTarea(null); setIsTareaModalOpen(true); }}
                 className="flex items-center gap-2 text-xs font-bold text-on-surface hover:text-primary transition-colors"
               >
                 <span className="material-symbols-outlined text-sm">add_task</span> Nueva Tarea
               </button>
               <button
                 onClick={() => { setSelectedForo(null); setIsForoModalOpen(true); }}
                 className="flex items-center gap-2 text-xs font-bold text-on-surface hover:text-primary transition-colors"
               >
                 <span className="material-symbols-outlined text-sm">campaign</span> Crear Foro
               </button>
             </div>
           )}
        </aside>

        {/* Contenido Principal */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {activeTab === 'contenidos' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Barra de Progreso General (Solo Estudiantes) */}
              {!isDocente && (
                <div className="glass-card p-6 rounded-2xl border border-glass-border bg-primary/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Progreso del Módulo</span>
                    <span className="text-sm font-black text-primary">{calculateProgress()}%</span>
                  </div>
                  <div className="h-2 w-full bg-void-black/40 rounded-full overflow-hidden border border-glass-border">
                    <div
                      className="h-full bg-primary shadow-[0_0_15px_rgba(189,147,249,0.5)] transition-all duration-1000"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Materiales y Tareas Sin Sección (General) */}
              <div className="glass-card rounded-2xl border border-glass-border overflow-hidden">
                <button
                  onClick={() => toggleSection('general')}
                  className="w-full p-6 flex justify-between items-center hover:bg-white/5 transition-colors"
                >
                  <h2 className="text-lg font-headline-sm text-primary flex items-center gap-3">
                    <span className="material-symbols-outlined">info</span> General
                  </h2>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openSections.includes('general') ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {openSections.includes('general') && (
                  <div className="p-6 pt-0 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(e) => handleDragEnd(e, 'general')}
                    >
                      <SortableContext
                        items={getSectionItems(null).map(i => i.dragId)}
                        strategy={verticalListSortingStrategy}
                      >
                        {getSectionItems(null).map((item) => (
                          <SortableItem key={item.dragId} id={item.dragId} disabled={!isDocente}>
                            {item.itemType === 'material' ? (
                              <MaterialItem material={item} isDocente={isDocente} onDelete={handleDeleteMaterial} />
                            ) : item.itemType === 'tarea' ? (
                              <TareaItem
                                tarea={item}
                                isDocente={isDocente}
                                onDelete={handleDeleteTarea}
                                onEdit={(t) => { setSelectedTarea(t); setIsTareaModalOpen(true); }}
                                onEntrega={(t) => { setSelectedTareaForEntrega(t); setIsEntregaModalOpen(true); }}
                                onViewEntregas={(t) => { setSelectedTareaForViewEntregas(t); setIsListaEntregasOpen(true); }}
                                entrega={getEntregaForTarea(item.id)}
                              />
                            ) : (
                              <ForoItem
                                foro={item}
                                isDocente={isDocente}
                                onDelete={handleDeleteForo}
                                onEdit={(f) => { setSelectedForo(f); setIsForoModalOpen(true); }}
                                onOpen={(f) => {
                                  setSelectedForoParaChat(f);
                                  setActiveTab('foro');
                                  fetchMensajes(f.id);
                                }}
                              />
                            )}
                          </SortableItem>
                        ))}
                      </SortableContext>
                    </DndContext>

                     {getSectionItems(null).length === 0 && (
                       <div className="py-8 flex flex-col items-center opacity-30">
                          <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
                          <p className="text-xs italic">No hay contenido general todavía.</p>
                       </div>
                     )}
                  </div>
                )}
              </div>

              {/* Secciones Dinámicas */}
              {secciones.map((sec) => (
                <div key={sec.id} className="glass-card rounded-2xl border border-glass-border overflow-hidden">
                  <div className="w-full flex items-stretch">
                    <button
                      onClick={() => toggleSection(sec.id)}
                      className="flex-1 p-6 flex justify-between items-center hover:bg-white/5 transition-colors"
                    >
                      <div className="flex flex-col items-start text-left">
                        <h2 className="text-xl font-headline-md text-on-surface">{sec.titulo}</h2>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{sec.descripcion}</p>
                      </div>
                      <span className={`material-symbols-outlined transition-transform duration-300 ${openSections.includes(sec.id) ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isDocente && (
                      <div className="flex border-l border-glass-border">
                        <button onClick={() => { setSelectedSeccion(sec); setIsSeccionModalOpen(true); }} className="w-12 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border-r border-glass-border">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => handleDeleteSeccion(sec.id)} className="w-12 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {openSections.includes(sec.id) && (
                    <div className="p-6 pt-0 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, sec.id)}
                      >
                        <SortableContext
                          items={getSectionItems(sec.id).map(i => i.dragId)}
                          strategy={verticalListSortingStrategy}
                        >
                          {getSectionItems(sec.id).map((item) => (
                            <SortableItem key={item.dragId} id={item.dragId} disabled={!isDocente}>
                              {item.itemType === 'material' ? (
                                <MaterialItem material={item} isDocente={isDocente} onDelete={handleDeleteMaterial} />
                              ) : item.itemType === 'tarea' ? (
                                <TareaItem
                                  tarea={item}
                                  isDocente={isDocente}
                                  onDelete={handleDeleteTarea}
                                  onEdit={(t) => { setSelectedTarea(t); setIsTareaModalOpen(true); }}
                                  onEntrega={(t) => { setSelectedTareaForEntrega(t); setIsEntregaModalOpen(true); }}
                                  onViewEntregas={(t) => { setSelectedTareaForViewEntregas(t); setIsListaEntregasOpen(true); }}
                                  entrega={getEntregaForTarea(item.id)}
                                />
                              ) : (
                                <ForoItem
                                  foro={item}
                                  isDocente={isDocente}
                                  onDelete={handleDeleteForo}
                                  onEdit={(f) => { setSelectedForo(f); setIsForoModalOpen(true); }}
                                  onOpen={(f) => {
                                    setSelectedForoParaChat(f);
                                    setActiveTab('foro');
                                    fetchMensajes(f.id);
                                  }}
                                />
                              )}
                            </SortableItem>
                          ))}
                        </SortableContext>
                      </DndContext>

                      {getSectionItems(sec.id).length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-glass-border rounded-xl">
                          <span className="material-symbols-outlined text-4xl mb-2">library_add</span>
                          <p className="text-xs font-bold uppercase tracking-widest">Sección Vacía</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'foro' && (
            <div className="glass-card p-8 rounded-2xl border border-glass-border flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-headline-md">{selectedForoParaChat ? `Foro: ${selectedForoParaChat.titulo}` : 'Foro de Consultas'}</h2>
                  {selectedForoParaChat && (
                    <button
                      onClick={() => { setSelectedForoParaChat(null); fetchMensajes(); }}
                      className="text-[10px] font-black uppercase text-primary hover:underline"
                    >
                      Volver al General
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar flex flex-col gap-4">
                  {mensajes.map((msg) => (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.user_id === user.id ? 'self-end' : 'self-start'}`}>
                      <div className={`p-4 rounded-2xl border ${msg.user_id === user.id ? 'bg-primary/10 border-primary/30 rounded-tr-none' : 'bg-glass-fill border-glass-border rounded-tl-none'}`}>
                        <p className="text-[10px] font-bold text-primary mb-1">{msg.user?.name}</p>
                        <p className="text-sm text-on-surface">{msg.contenido}</p>
                        <p className="text-[9px] text-on-surface-variant text-right mt-2">{new Date(msg.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleEnviarMensaje} className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe una consulta..."
                    className="flex-1 glass-input rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                  <button type="submit" className="glass-button-primary w-12 h-12 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
            </div>
          )}

          {activeTab === 'estudiantes' && (
             <div className="glass-card p-8 rounded-2xl border border-glass-border animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-headline-md">Lista de Clase</h2>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{curso.estudiantes?.length || 0} Estudiantes</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {curso.estudiantes?.map(est => (
                    <div key={est.id} className="flex items-center justify-between p-4 rounded-xl bg-glass-fill border border-glass-border hover:border-primary/30 transition-all group">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                           {est.name.charAt(0)}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{est.name}</p>
                           <div className="flex gap-3 mt-0.5">
                              <span className="text-[10px] text-on-surface-variant">CI: {est.ci}</span>
                              <a href={`https://wa.me/${est.telefono}`} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">chat</span> WhatsApp
                              </a>
                           </div>
                         </div>
                       </div>
                       {isDocente && (
                         <button
                           onClick={() => {
                             setConfirmConfig({
                               isOpen: true,
                               title: 'Desvincular Estudiante',
                               message: `¿Estás seguro de quitar a ${est.name} de este curso?`,
                               type: 'warning',
                               onConfirm: async () => {
                                 try {
                                   await api.post(`/cursos/${id}/inscribir`, {
                                     estudiantes: curso.estudiantes.filter(e => e.id !== est.id).map(e => e.id)
                                   });
                                   toast.success('Estudiante removido');
                                   fetchCursoDetails();
                                 } catch (e) { toast.error('Error al remover estudiante'); }
                               }
                             });
                           }}
                           className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all"
                         >
                           <span className="material-symbols-outlined text-sm">person_remove</span>
                         </button>
                       )}
                    </div>
                  ))}
                </div>
             </div>
          )}

          {activeTab === 'calificaciones' && isDocente && (
            <div className="glass-card p-8 rounded-2xl border border-glass-border animate-in fade-in slide-in-from-bottom-4 overflow-x-auto">
              <h2 className="text-2xl font-headline-md mb-6">Cuadro de Calificaciones</h2>
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="py-4 px-4 text-[10px] font-black uppercase text-primary tracking-widest">Estudiante</th>
                    {tareas.map(t => (
                      <th key={t.id} className="py-4 px-4 text-[10px] font-black uppercase text-on-surface-variant tracking-widest text-center">
                        {t.titulo}
                      </th>
                    ))}
                    <th className="py-4 px-4 text-[10px] font-black uppercase text-primary tracking-widest text-center">Promedio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border/20">
                  {curso.estudiantes?.map(est => {
                    let totalPuntos = 0;
                    return (
                      <tr key={est.id} className="hover:bg-primary/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <p className="text-xs font-bold text-on-surface">{est.name}</p>
                        </td>
                        {tareas.map(t => {
                          const entrega = entregas.find(e => e.tarea_id === t.id && e.user_id === est.id);
                          const nota = entrega?.calificacion ?? '-';
                          if (typeof nota === 'number') totalPuntos += nota;
                          return (
                            <td key={t.id} className="py-4 px-4 text-center">
                              <span className={`text-xs font-bold ${typeof nota === 'number' ? (nota >= 61 ? 'text-primary' : 'text-error') : 'text-on-surface-variant/40'}`}>
                                {nota}
                              </span>
                            </td>
                          );
                        })}
                        <td className="py-4 px-4 text-center">
                          <span className="text-sm font-black text-primary">
                            {tareas.length > 0 ? (totalPuntos / tareas.length).toFixed(1) : '0.0'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <SeccionModal isOpen={isSeccionModalOpen} onClose={(refetch) => { setIsSeccionModalOpen(false); if(refetch) fetchSecciones(); }} cursoId={id} seccionToEdit={selectedSeccion} />
      <MaterialModal isOpen={isMaterialModalOpen} onClose={(refetch) => { setIsMaterialModalOpen(false); if(refetch) fetchMateriales(); }} cursoId={id} secciones={secciones} />
      <TareaModal isOpen={isTareaModalOpen} onClose={() => setIsTareaModalOpen(false)} onSave={handleSaveTarea} tareaToEdit={selectedTarea} secciones={secciones} />
      <ForoModal isOpen={isForoModalOpen} onClose={(refresh) => { setIsForoModalOpen(false); if(refresh) fetchForos(); }} cursoId={id} foroToEdit={selectedForo} secciones={secciones} />
      <EntregaModal isOpen={isEntregaModalOpen} onClose={() => setIsEntregaModalOpen(false)} onSave={async (fd) => {
          try {
            await api.post('/entregas', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Tarea entregada con éxito');
            setIsEntregaModalOpen(false);
            fetchEntregas();
          } catch(e) { toast.error('Error al entregar la tarea'); }
      }} tarea={selectedTareaForEntrega} />
      <ListaEntregasModal isOpen={isListaEntregasOpen} onClose={() => { setIsListaEntregasOpen(false); fetchEntregas(); }} tarea={selectedTareaForViewEntregas} />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div>
  );
};

// Componentes Auxiliares para DND
const SortableItem = ({ id, children, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center gap-2 group">
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="w-6 h-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg">drag_indicator</span>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};

// Componentes Pequeños para Items con Interacción Mejorada
const MaterialItem = ({ material, isDocente, onDelete }) => {
  const getIcon = (tipo) => {
    switch(tipo) {
      case 'pdf': return 'picture_as_pdf';
      case 'video': return 'play_circle';
      case 'link': return 'link';
      default: return 'description';
    }
  };

  const getColors = (tipo) => {
    switch(tipo) {
      case 'pdf': return 'text-error bg-error/10 border-error/20';
      case 'video': return 'text-primary bg-primary/10 border-primary/20';
      case 'link': return 'text-tertiary bg-tertiary/10 border-tertiary/20';
      default: return 'text-on-surface-variant bg-glass-fill border-glass-border';
    }
  };

  return (
    <div className="group relative p-4 rounded-xl bg-glass-fill/30 border border-glass-border flex items-center justify-between hover:bg-white/5 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 ${getColors(material.tipo)}`}>
          <span className="material-symbols-outlined text-xl">{getIcon(material.tipo)}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{material.titulo}</p>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-[10px] uppercase font-black tracking-widest opacity-40">{material.tipo}</span>
             <span className="w-1 h-1 rounded-full bg-glass-border"></span>
             <p className="text-[11px] text-on-surface-variant line-clamp-1">{material.descripcion || 'Sin descripción'}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={material.url.startsWith('http') ? material.url : `${import.meta.env.VITE_BASE_URL}${material.url}`}
          target="_blank"
          rel="noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-void-black/40 text-on-surface-variant hover:text-primary hover:bg-primary/20 transition-all"
          title="Abrir Material"
        >
          <span className="material-symbols-outlined text-[20px]">open_in_new</span>
        </a>
        {isDocente && (
          <button
            onClick={() => onDelete(material.id)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-void-black/40 text-on-surface-variant hover:text-error hover:bg-error/20 transition-all"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

const TareaItem = ({ tarea, isDocente, onDelete, onEdit, onEntrega, onViewEntregas, entrega }) => {
  const isExpired = tarea.fecha_entrega && new Date(tarea.fecha_entrega) < new Date();

  return (
    <div className={`group relative p-5 rounded-xl border transition-all duration-300 flex flex-col gap-4 ${
      entrega ? 'bg-primary/5 border-primary/20' : 'bg-glass-fill/20 border-glass-border hover:border-primary/40'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-lg transition-transform group-hover:rotate-3 ${
            entrega ? 'bg-primary text-on-primary border-primary/50' : 'bg-void-black text-primary border-glass-border'
          }`}>
            <span className="material-symbols-outlined text-2xl">assignment</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">{tarea.titulo}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                <span className="material-symbols-outlined text-[12px]">grade</span>
                {tarea.puntos} Ptos
              </span>
              <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isExpired && !entrega ? 'text-error' : 'text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                {tarea.fecha_entrega ? new Date(tarea.fecha_entrega).toLocaleDateString() : 'Sin fecha'}
              </span>
            </div>
          </div>
        </div>

        {/* Badge de Estado */}
        {entrega ? (
          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-tighter border border-primary/30">
              {entrega.calificacion !== null ? 'Calificado' : 'Entregado'}
            </span>
            {entrega.calificacion !== null && (
              <span className="text-xl font-black text-primary drop-shadow-[0_0_8px_rgba(189,147,249,0.4)]">
                {entrega.calificacion}<span className="text-[10px] opacity-50">/{tarea.puntos}</span>
              </span>
            )}
          </div>
        ) : (
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
            isExpired ? 'bg-error/10 text-error border-error/20' : 'bg-void-black text-on-surface-variant border-glass-border'
          }`}>
            {isExpired ? 'Vencida' : 'Pendiente'}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-glass-border/30">
        <p className="text-[11px] text-on-surface-variant line-clamp-1 max-w-[60%] italic">
          {tarea.descripcion || 'Sin instrucciones adicionales.'}
        </p>

        <div className="flex gap-2">
          {isDocente ? (
            <>
              <button onClick={() => onViewEntregas(tarea)} className="glass-button-primary px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Revisar
              </button>
              <button onClick={() => onEdit(tarea)} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button onClick={() => onDelete(tarea.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </>
          ) : (
            !entrega && (
              <button
                onClick={() => onEntrega(tarea)}
                disabled={isExpired}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                  isExpired
                    ? 'bg-glass-fill text-on-surface-variant cursor-not-allowed'
                    : 'bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-primary/20'
                }`}
              >
                {isExpired ? 'Plazo Cerrado' : 'Realizar Entrega'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const ForoItem = ({ foro, isDocente, onDelete, onEdit, onOpen }) => {
  return (
    <div className="group relative p-4 rounded-xl bg-glass-fill/30 border border-glass-border flex items-center justify-between hover:bg-white/5 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 text-primary transition-transform group-hover:scale-110">
          <span className="material-symbols-outlined text-xl">forum</span>
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{foro.titulo}</p>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-[10px] uppercase font-black tracking-widest text-primary opacity-60">Debate</span>
             <span className="w-1 h-1 rounded-full bg-glass-border"></span>
             <p className="text-[11px] text-on-surface-variant line-clamp-1">{foro.descripcion || 'Sin descripción'}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onOpen(foro)}
          className="glass-button-primary px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
        >
          Participar
        </button>
        {isDocente && (
          <>
            <button
              onClick={() => onEdit(foro)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-void-black/40 text-on-surface-variant hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button
              onClick={() => onDelete(foro.id)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-void-black/40 text-on-surface-variant hover:text-error transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleView;
