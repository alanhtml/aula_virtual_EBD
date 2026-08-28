import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import UserModal from './UserModal';
import CursoModal from './CursoModal';
import InscripcionModal from './InscripcionModal';
import PeriodoModal from './PeriodoModal';
import ConfirmModal from './ConfirmModal';
import AsistenciaModal from './AsistenciaModal';
import CalificacionFinalModal from './CalificacionFinalModal';
import MisCalificaciones from './MisCalificaciones';
import HistorialAcademico from './HistorialAcademico';
import ReporteGeneral from './ReporteGeneral';
import EscuelaBiblica from './EscuelaBiblica';
import ServerStats from './ServerStats';
import { DashboardSkeleton, CourseGridSkeleton, UsersTableSkeleton } from './Skeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [users, setUsers] = useState([]);
  const [dynamicStats, setDynamicStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [isInscripcionModalOpen, setIsInscripcionModalOpen] = useState(false);
  const [cursoForInscripcion, setCursoForInscripcion] = useState(null);
  const [isAsistenciaModalOpen, setIsAsistenciaModalOpen] = useState(false);
  const [cursoForAsistencia, setCursoForAsistencia] = useState(null);
  const [isCalificacionFinalModalOpen, setIsCalificacionFinalModalOpen] = useState(false);
  const [cursoForCalificacion, setCursoForCalificacion] = useState(null);
  const [isPeriodoModalOpen, setIsPeriodoModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const [userTab, setUserTab] = useState('estudiantes'); // 'personal' o 'estudiantes'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [periodos, setPeriodos] = useState([]);
  const [periodoActivo, setPeriodoActivo] = useState(null); // El periodo detectado por fecha
  const [cursoFilter, setCursoFilter] = useState({
    periodo: 'ALL',
    año: new Date().getFullYear().toString()
  });

  // State para confirmaciones con diseño
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'danger'
  });

  const showConfirm = (title, message, onConfirm, type = 'danger') => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm, type });
  };

  // Determinar activeView basado en la URL
  const getActiveViewFromPath = () => {
    const path = location.pathname;
    if (path.includes('/usuarios')) return 'usuarios';
    if (path.includes('/cursos')) return 'cursos';
    if (path.includes('/calificaciones')) return 'calificaciones';
    if (path.includes('/plugins')) return 'plugins';
    if (path.includes('/seguridad')) return 'seguridad';
    if (path.includes('/informes')) return 'informes';
    if (path.includes('/escuela-biblica')) return 'escuela-biblica';
    return 'overview';
  };

  const activeView = getActiveViewFromPath();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // Detectar periodo activo por fecha al montar el componente
  useEffect(() => {
    const detectarPeriodo = async () => {
      try {
        const [activoRes, todosRes] = await Promise.all([
          api.get('/periodos/activo'),
          api.get('/periodos')
        ]);
        const activo = activoRes.data;
        const todos = todosRes.data;
        setPeriodos(todos);
        if (activo) {
          setPeriodoActivo(activo);
          // Pre-seleccionar el filtro al periodo vigente
          setCursoFilter({
            periodo: activo.nombre,
            año: activo.año.toString()
          });
        }
      } catch (err) {
        console.warn('No se pudo detectar el periodo activo:', err);
      }
    };
    detectarPeriodo();
  }, []);

  useEffect(() => {
    if (activeView === 'overview') {
      fetchStats();
    }
    if (activeView === 'cursos') {
      fetchCursos();
    } else if (activeView === 'usuarios') {
      fetchUsers();
    }
  }, [activeView]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setDynamicStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cursos');
      setCursos(response.data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      const dataToSend = { ...formData };
      if (selectedUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, dataToSend);
      } else {
        await api.post('/users', dataToSend);
      }

      setIsUserModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error.response?.data || error);
      const message = error.response?.data?.message || 'Error al guardar el usuario.';
      const details = error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join('\n') : '';

      showConfirm('Error de Validación', `${message} ${details}`, () => {}, 'warning');
    }
  };

  const handleDeleteUser = async (userId) => {
    showConfirm(
      '¿Eliminar Usuario?',
      'Esta acción es permanente. El usuario perderá el acceso a la plataforma inmediatamente.',
      async () => {
        try {
          await api.delete(`/users/${userId}`);
          fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      },
      'danger'
    );
  };

  const handleSaveCurso = async (formData) => {
    try {
      if (selectedCurso) {
        await api.put(`/cursos/${selectedCurso.id}`, formData);
      } else {
        await api.post('/cursos', formData);
      }
      setIsCursoModalOpen(false);
      fetchCursos();
    } catch (error) {
      console.error('Error saving curso:', error);
    }
  };

  const handleDeleteCurso = async (cursoId) => {
    showConfirm(
      '¿Eliminar Módulo?',
      'Se borrarán todos los datos asociados a este curso. Esta acción no se puede deshacer.',
      async () => {
        try {
          await api.delete(`/cursos/${cursoId}`);
          fetchCursos();
        } catch (error) {
          console.error('Error deleting curso:', error);
        }
      },
      'danger'
    );
  };

  const openNewCursoModal = () => {
    setSelectedCurso(null);
    setIsCursoModalOpen(true);
  };

  const openEditCursoModal = (curso) => {
    setSelectedCurso(curso);
    setIsCursoModalOpen(true);
  };

  const openInscripcionModal = (curso) => {
    setCursoForInscripcion(curso);
    setIsInscripcionModalOpen(true);
  };

  const openPeriodoModal = async () => {
    setIsPeriodoModalOpen(true);
  };

  const handleSavePeriodo = async (formData) => {
    try {
      if (selectedPeriodo?.id) {
        await api.put(`/periodos/${selectedPeriodo.id}`, formData);
      } else {
        await api.post('/periodos', formData);
      }
      setIsPeriodoModalOpen(false);
      showConfirm('Éxito', 'Las fechas del periodo se han actualizado correctamente.', () => {}, 'success');
    } catch (error) {
      console.error('Error saving periodo:', error);
    }
  };

  const handleAperturaMasiva = async () => {
    showConfirm(
      'Apertura Masiva',
      `¿Deseas crear automáticamente los 5 módulos para el ${cursoFilter.periodo} - ${cursoFilter.año}?`,
      async () => {
        try {
          await api.post('/apertura-masiva', {
            periodo: cursoFilter.periodo,
            año: cursoFilter.año
          });
          fetchCursos();
        } catch (error) {
          console.error('Error en apertura masiva:', error);
        }
      },
      'warning'
    );
  };

  const openNewUserModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = {
    estudiantes: [
      { name: 'Mi Aula Actual', icon: 'menu_book', path: 'cursos' },
      { name: 'Historial Académico', icon: 'history_edu', path: 'calificaciones' },
      { name: 'Tareas Pendientes', icon: 'assignment_turned_in', path: 'tareas' },
    ],
    docentes: [
      { name: 'Mi Discipulado', icon: 'cast_for_education', path: 'cursos' },
      { name: 'Lista de Estudiantes', icon: 'group', path: 'usuarios' },
      { name: 'Calificar', icon: 'grade', path: 'calificaciones' },
      { name: 'Subir Material', icon: 'upload_file', path: 'materiales' },
    ],
    secretaria: [
      { name: 'Inscripciones', icon: 'person_add', path: 'usuarios' },
      { name: 'Horarios', icon: 'schedule', path: 'horarios' },
      { name: 'Reportes', icon: 'description', path: 'informes' },
      { name: 'Pagos', icon: 'payments', path: 'pagos' },
    ],
    director: [
      { name: 'Administración del Sitio', icon: 'settings_suggest', path: '' },
      { name: 'Usuarios', icon: 'manage_accounts', path: 'usuarios' },
      { name: 'Discipulado', icon: 'account_tree', path: 'cursos' },
      { name: 'Escuela Bíblica', icon: 'school', path: 'escuela-biblica' },
      { name: 'Calificaciones', icon: 'analytics', path: 'calificaciones' },
      { name: 'Plugins y Extensiones', icon: 'extension', path: 'plugins' },
      { name: 'Seguridad y Backups', icon: 'security', path: 'seguridad' },
      { name: 'Informes del Servidor', icon: 'monitoring', path: 'informes' },
    ],
  };

  const roleStats = {
    estudiantes: [
      { label: 'Promedio General', value: '9.2', icon: 'grade', color: 'text-primary' },
      { label: 'Tareas Completadas', value: '15/18', icon: 'task_alt', color: 'text-secondary-fixed' },
      { label: 'Módulos Activos', value: '6', icon: 'library_books', color: 'text-primary' },
    ],
    docentes: [
      { label: 'Total Estudiantes', value: '145', icon: 'group', color: 'text-primary' },
      { label: 'Módulos Asignados', value: '4', icon: 'cast_for_education', color: 'text-secondary-fixed' },
      { label: 'Tareas por Corregir', value: '32', icon: 'pending_actions', color: 'text-primary' },
    ],
    secretaria: [
      { label: 'Nuevos Inscritos', value: '28', icon: 'person_add', color: 'text-primary' },
      { label: 'Trámites Pendientes', value: '12', icon: 'hourglass_empty', color: 'text-secondary-fixed' },
      { label: 'Pagos del Mes', value: '$4,200', icon: 'payments', color: 'text-primary' },
    ],
    director: [
      { label: 'Usuarios Activos', value: '1,248', icon: 'person', color: 'text-primary' },
      { label: 'Módulos Creados', value: '86', icon: 'auto_stories', color: 'text-secondary-fixed' },
      { label: 'Estado del Servidor', value: 'Óptimo', icon: 'dns', color: 'text-primary' },
    ],
  };

  const roleActions = {
    estudiantes: [
      { title: 'Ver Horarios', desc: 'Consulta tus próximas clases y salones.', icon: 'schedule', color: 'text-primary' },
      { title: 'Soporte Técnico', desc: 'Reporta problemas con la plataforma.', icon: 'support_agent', color: 'text-secondary-fixed' },
    ],
    docentes: [
      { title: 'Gestionar Módulos', desc: 'Administra el contenido y revisa el progreso.', icon: 'auto_stories', color: 'text-primary' },
      { title: 'Calificaciones', desc: 'Sube las notas finales del periodo.', icon: 'upload_file', color: 'text-secondary-fixed' },
    ],
    director: [
      { title: 'Configurar Apariencia', desc: 'Personaliza temas, logos y estilos del sitio.', icon: 'palette', color: 'text-primary' },
      { title: 'Respaldos y Seguridad', desc: 'Gestiona backups de la base de datos MySQL.', icon: 'backup', color: 'text-secondary-fixed' },
    ],
  };

  const roleTable = {
    estudiantes: {
      title: 'Próximas Entregas',
      headers: ['Tarea', 'Módulo', 'Fecha Límite'],
      rows: [
        { c1: 'Ensayo de Hermenéutica', c2: 'Módulo 101', c3: 'Mañana', status: 'Pendiente', color: 'bg-primary/10 text-primary' },
        { c1: 'Cuestionario de Historia', c2: 'Módulo 202', c3: '25 Ago', status: 'Abierto', color: 'bg-secondary-fixed/10 text-secondary-fixed' },
      ]
    },
    docentes: {
      title: 'Actividad Reciente',
      headers: ['Estudiante', 'Módulo', 'Estado'],
      rows: [
        { c1: 'María Rodríguez', c2: 'Módulo 101', c3: 'Hace 2 min', status: 'En Curso', color: 'bg-secondary-fixed/10 text-secondary-fixed' },
        { c1: 'Juan Gómez', c2: 'Módulo 202', c3: 'Hace 1 hora', status: 'Calificado', color: 'bg-primary/10 text-primary' },
      ]
    },
    director: {
      title: 'Logs del Sistema',
      headers: ['Evento', 'Usuario', 'Hora'],
      rows: [
        { c1: 'Copia de seguridad creada', c2: 'Sistema', c3: '04:30 AM', status: 'Éxito', color: 'bg-primary/10 text-primary' },
        { c1: 'Cambio de permisos', c2: 'admin-director', c3: '02:15 AM', status: 'Info', color: 'bg-secondary-fixed/10 text-secondary-fixed' },
      ]
    }
  };

  if (!user) return null;

  const currentMenu = menuItems[user.role] || menuItems.estudiantes;
  const currentStats = roleStats[user.role] || roleStats.estudiantes;
  const currentActions = roleActions[user.role] || roleActions.estudiantes;
  const currentTable = roleTable[user.role] || roleTable.estudiantes;

  return (
    <div className="font-body-md text-body-md antialiased min-h-screen flex text-on-surface bg-void-black">
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-screen h-screen -z-10 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(215,186,255,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(233,196,0,0.1)_0%,transparent_50%)]"></div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-void-black/80 backdrop-blur-sm z-[45] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={`fixed left-0 top-0 h-full flex flex-col w-64 border-r border-glass-border shadow-[0_0_20px_rgba(189,147,249,0.1)] bg-glass-fill backdrop-blur-[20px] z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex flex-col items-center border-b border-glass-border">
          <div className="w-24 h-24 mb-4 rounded-full overflow-hidden glass-panel flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(189,147,249,0.2)]">
            <div className="flex items-center justify-center w-full h-full p-2">
              <img
                alt="School Logo"
                className="w-20 h-20 object-contain"
                src="/logo-ebd.png"
              />
            </div>
          </div>
          <h1 className="font-headline-md text-xl font-bold text-primary text-center">Escuela Bíblica</h1>
          <p className="font-label-md text-[10px] text-on-surface-variant text-center mt-1 uppercase tracking-widest">Discipulado</p>
        </div>
        {(user.role === 'director' || user.role === 'secretaria') && (
          <div className="p-4">
            <button
              onClick={handleAperturaMasiva}
              className="w-full py-3 px-4 rounded-lg glass-button-primary text-primary-fixed font-label-md text-sm flex items-center justify-center gap-2 hover:bg-opacity-60 transition-all duration-300"
            >
              <span className="material-symbols-outlined">add</span>
              Nuevo Periodo
            </button>
          </div>
        )}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col space-y-1">
            {currentMenu.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path === '' ? '/dashboard' : `/dashboard/${item.path}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-4 px-6 py-3 font-medium transition-all duration-300 scale-95 active:scale-90 text-sm ${
                    (item.path === '' && activeView === 'overview') || (item.path !== '' && activeView === item.path)
                    ? 'bg-primary/10 text-primary border-r-4 border-primary shadow-[inset_-10px_0_20px_-10px_rgba(189,147,249,0.3)]'
                    : 'text-on-surface-variant hover:bg-glass-fill hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto border-t border-glass-border p-4">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-4 px-4 py-2 text-on-surface-variant font-medium hover:bg-glass-fill hover:text-error transition-all duration-300 scale-95 active:scale-90 text-sm rounded-md"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 z-40 bg-glass-fill backdrop-blur-[20px] w-full md:w-[calc(100%-16rem)] h-16 border-b border-glass-border shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-lg bg-glass-fill"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="font-headline-md text-xl font-semibold text-primary hidden md:block tracking-tight">Escuela Bíblica</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                className="glass-input rounded-full py-1.5 pl-9 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary w-48 transition-all duration-300 focus:w-64 placeholder-on-surface-variant"
                placeholder="Buscar..."
                type="text"
              />
            </div>
            <button className="text-secondary-fixed hover:text-primary transition-colors p-2 rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-on-surface">{user.name}</p>
                <p className="text-xs text-on-surface-variant capitalize">{user.role}</p>
              </div>
              <img
                className="w-8 h-8 rounded-full object-cover border border-glass-border"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy4seH82_Os0rUp92sxExEwb1uyba3rSA_EIIGW2-9BAYVjqBIg-A3XZ59KN0-t3hUcCJm4eWGvwqxY57IX9K9J5KW7p0OjZlkyEyeV-iBZ15Ts44GZjJlTzAL1EWfvqV5ovKeIUISKHulXj3tg1XG0nzo3_WGmktRNu4L6SM0jmsIOzDrPWFNrKlvRp2hDMlQPFh11KBv5XiO5beOEnAiA-j1uiEFI208z-77Dw2wfNBX5fiE9uU"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Main Dashboard Canvas */}
        <main className="flex-1 p-6 md:p-10 mt-16 max-w-7xl mx-auto w-full flex flex-col gap-10 pb-24">
          <Routes>
            <Route path="/" element={
              <>
                {/* Welcome Section */}
                {loading ? <DashboardSkeleton /> : (
                  <>
                    <section className="flex flex-col gap-2 mt-8">
                      <h2 className="text-3xl md:text-4xl font-headline-lg text-on-surface">
                        {user.role === 'director' ? 'Administración del Sitio' :
                         user.role === 'docentes' ? 'Panel del Instructor' :
                         'Mi Aula Virtual'}
                      </h2>
                      <p className="text-lg text-on-surface-variant">
                        {user.role === 'director' ? 'Gestión global de la plataforma, usuarios y configuración del entorno.' :
                         `Bienvenido de nuevo, ${user.name.split(' ')[0]}. Revisa tu progreso y actividades.`}
                      </p>
                    </section>

                    {/* Stats Bar */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(dynamicStats.length > 0 ? dynamicStats : currentStats).map((stat, index) => (
                        <div key={index} className="glass-card rounded-xl p-8 relative overflow-hidden group">
                          <div className="flex items-start justify-between relative z-10">
                            <div>
                              <p className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">{stat.label}</p>
                              <h3 className={`text-4xl font-headline-xl ${stat.color}`}>{stat.value}</h3>
                            </div>
                            <div className={`p-3 bg-glass-fill rounded-lg border border-glass-border ${stat.color}`}>
                              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </section>

                    {/* Server Monitoring - ONLY FOR DIRECTOR */}
                    {user.role === 'director' && (
                      <section className="mt-4">
                        <ServerStats />
                      </section>
                    )}

                    {/* Activity Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 glass-card rounded-xl p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-headline-md text-on-surface">{currentTable.title}</h3>
                          <button className="text-primary hover:text-primary-fixed transition-colors text-sm font-medium">Ver todos</button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-glass-border">
                                {currentTable.headers.map((header, i) => (
                                  <th key={i} className="py-3 px-4 text-xs text-on-surface-variant uppercase">{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {currentTable.rows.map((row, i) => (
                                <tr key={i} className="border-b border-glass-border/50 hover:bg-glass-fill transition-colors group">
                                  <td className="py-4 px-4 flex items-center gap-3 text-on-surface group-hover:text-primary transition-colors">{row.c1}</td>
                                  <td className="py-4 px-4 text-on-surface-variant">{row.c2}</td>
                                  <td className="py-4 px-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${row.color}`}>
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex flex-col gap-6">
                        {currentActions.map((action, i) => (
                          <div key={i} className="glass-card rounded-xl p-8 group hover:shadow-[0_0_30px_rgba(189,143,249,0.15)] transition-all cursor-pointer">
                            <div className={`w-12 h-12 rounded-lg bg-glass-fill border border-glass-border flex items-center justify-center mb-4 ${action.color}`}>
                              <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                            </div>
                            <h3 className="text-xl font-headline-md text-on-surface mb-2">{action.title}</h3>
                            <p className="text-sm text-on-surface-variant">{action.desc}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </>
            } />

            <Route path="usuarios" element={
              <section className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-headline-lg text-on-surface">Gestión de Usuarios</h2>
                    <p className="text-sm text-on-surface-variant">Administra el acceso y roles de la institución.</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setIsUserModalOpen(true);
                    }}
                    className="glass-button-primary px-6 py-3 rounded-xl text-primary-fixed flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined">person_add</span>
                    {userTab === 'personal' ? 'Nuevo Personal' : 'Nuevo Estudiante'}
                  </button>
                </div>

                {/* Tabs de Navegación de Usuarios */}
                <div className="flex p-1 bg-glass-fill rounded-2xl border border-glass-border w-full md:w-fit overflow-x-auto scrollbar-hide whitespace-nowrap">
                  <button
                    onClick={() => setUserTab('estudiantes')}
                    className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl transition-all duration-300 font-bold text-xs md:text-sm ${
                      userTab === 'estudiantes'
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 scale-100'
                      : 'text-on-surface-variant hover:text-primary scale-95'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base md:text-lg">school</span>
                    Estudiantes
                    <span className={`ml-1 md:ml-2 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] ${userTab === 'estudiantes' ? 'bg-on-primary/20' : 'bg-glass-fill'}`}>
                      {loading ? '...' : users.filter(u => u.role === 'estudiantes').length}
                    </span>
                  </button>

                  {user.role !== 'docentes' && (
                    <button
                      onClick={() => setUserTab('personal')}
                      className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl transition-all duration-300 font-bold text-xs md:text-sm ${
                        userTab === 'personal'
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 scale-100'
                        : 'text-on-surface-variant hover:text-primary scale-95'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base md:text-lg">admin_panel_settings</span>
                      Personal
                      <span className={`ml-1 md:ml-2 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] ${userTab === 'personal' ? 'bg-on-primary/20' : 'bg-glass-fill'}`}>
                        {loading ? '...' : users.filter(u => u.role !== 'estudiantes').length}
                      </span>
                    </button>
                  )}
                </div>

                {loading ? <UsersTableSkeleton /> : (
                  <div className="glass-card rounded-2xl border border-glass-border shadow-2xl overflow-x-auto overflow-y-hidden">
                    <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
                      <thead className="bg-glass-fill/80 backdrop-blur-md border-b border-glass-border">
                        <tr>
                          <th className="py-4 md:py-6 px-4 md:px-8 text-[9px] md:text-[10px] text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Identidad</th>
                          <th className="py-4 md:py-6 px-4 md:px-8 text-[9px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Acceso</th>
                          {userTab === 'personal' && (
                            <th className="py-4 md:py-6 px-4 md:px-8 text-[9px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Cargo</th>
                          )}
                          <th className="py-4 md:py-6 px-4 md:px-8 text-[9px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-glass-border/20">
                        {users
                          .filter(u => userTab === 'personal' ? u.role !== 'estudiantes' : u.role === 'estudiantes')
                          .map((u) => (
                          <tr key={u.id} className="hover:bg-primary/[0.03] transition-all duration-500 group">
                            <td className="py-4 md:py-5 px-4 md:px-8">
                              <div className="flex items-center gap-3 md:gap-5">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/30 to-transparent border border-primary/20 flex items-center justify-center text-primary text-lg md:text-xl font-headline-md shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                                  {u.name.charAt(0)}
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="text-xs md:text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{u.name}</span>
                                  <span className="text-[9px] md:text-[10px] text-on-surface-variant/60 tracking-wider font-medium truncate">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 md:py-5 px-4 md:px-8">
                              <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-void-black/40 border border-glass-border text-[10px] md:text-[11px] text-on-surface-variant group-hover:border-primary/30 transition-colors">
                                <span className="material-symbols-outlined text-[14px] md:text-[16px] text-primary/70">key</span>
                                {u.username}
                              </div>
                            </td>
                            {userTab === 'personal' && (
                              <td className="py-4 md:py-5 px-4 md:px-8">
                                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${
                                  u.role === 'director' ? 'bg-primary/10 text-primary border-primary/30' :
                                  u.role === 'docentes' ? 'bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/30' :
                                  'bg-tertiary/10 text-tertiary border-tertiary/30'
                                }`}>
                                  {u.role === 'docentes' ? 'Docente' : u.role === 'director' ? 'Director' : 'Secretaría'}
                                </span>
                              </td>
                            )}
                            <td className="py-4 md:py-5 px-4 md:px-8 text-right">
                              <div className="flex justify-end gap-2 md:gap-3">
                                <button
                                  onClick={() => openEditUserModal(u)}
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-glass-border hover:border-primary/40 shadow-sm"
                                  title="Editar"
                                >
                                  <span className="material-symbols-outlined text-lg md:text-xl">edit_square</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-all border border-glass-border hover:border-error/40 shadow-sm"
                                  title="Eliminar"
                                >
                                  <span className="material-symbols-outlined text-lg md:text-xl">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.filter(u => userTab === 'personal' ? u.role !== 'estudiantes' : u.role === 'estudiantes').length === 0 && (
                      <div className="py-32 flex flex-col items-center justify-center text-on-surface-variant/30">
                        <div className="w-20 h-20 rounded-full bg-glass-fill border border-glass-border flex items-center justify-center mb-6">
                          <span className="material-symbols-outlined text-5xl">person_search</span>
                        </div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em]">Sin registros encontrados</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            } />

            <Route path="cursos" element={
              <section className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-headline-lg text-on-surface">Gestión de Discipulado</h2>
                    <p className="text-sm text-on-surface-variant text-primary/70 font-bold uppercase tracking-widest mt-1">
                      {user.role === 'docentes' ? 'Mis Módulos Asignados' : `${cursoFilter.periodo} - ${cursoFilter.año}`}
                    </p>
                  </div>

                  {(user.role === 'director' || user.role === 'secretaria') && (
                    <div className="flex gap-2 flex-wrap">
                      {/* Badge del periodo detectado automáticamente */}
                      {periodoActivo && cursoFilter.periodo === periodoActivo.nombre && cursoFilter.año === periodoActivo.año.toString() && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
                          Ciclo Activo
                        </span>
                      )}
                      <select
                        value={`${cursoFilter.periodo}|${cursoFilter.año}`}
                        onChange={(e) => {
                          const [p, a] = e.target.value.split('|');
                          setCursoFilter({ periodo: p, año: a });
                        }}
                        className="glass-input px-4 py-2 rounded-xl text-xs font-bold border-primary/20"
                      >
                        <option value="ALL|ALL">Todos los Periodos</option>
                        {periodos.length > 0
                          ? periodos.map(p => (
                              <option key={p.id} value={`${p.nombre}|${p.año}`}>
                                {p.nombre} - {p.año}{periodoActivo && p.id === periodoActivo.id ? ' ✦ Activo' : ''}
                              </option>
                            ))
                          : (
                            <>
                              <option value="PI|2026">Periodo I - 2026</option>
                              <option value="PII|2026">Periodo II - 2026</option>
                              <option value="PIII|2026">Periodo III - 2026</option>
                            </>
                          )
                        }
                      </select>
                      <button
                        onClick={openPeriodoModal}
                        className="px-4 py-2 rounded-xl bg-glass-fill border border-glass-border text-xs font-medium hover:text-primary transition-colors flex items-center gap-2"
                        title="Configurar Periodos Académicos"
                      >
                        <span className="material-symbols-outlined text-sm">settings_suggest</span>
                        Configuración
                      </button>
                      <button
                        onClick={openNewCursoModal}
                        className="glass-button-primary px-6 py-2 rounded-xl text-primary-fixed flex items-center gap-2 shadow-lg shadow-primary/20"
                      >
                        <span className="material-symbols-outlined">add_circle</span>
                        Apertura de Módulo
                      </button>
                    </div>
                  )}
                </div>

                {loading ? <CourseGridSkeleton /> : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cursos
                        .filter(c => {
                          if (user.role === 'director' || user.role === 'secretaria') {
                            if (cursoFilter.periodo === 'ALL') return true;
                            // Soporta formato: 101-PI-2026 o PI-101-2026 o MOD-101-2024
                            const periodoStr = cursoFilter.periodo;
                            const añoStr = cursoFilter.año;
                            return c.codigo.includes(periodoStr) && (añoStr === 'ALL' || c.codigo.includes(añoStr));
                          }
                          return true;
                        })
                        .map((curso) => (
                        <div key={curso.id} className="glass-card p-6 rounded-2xl flex flex-col gap-4 border border-glass-border hover:border-primary/50 transition-all">
                          <div className="flex justify-between items-start">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
                              Nivel {curso.nivel}
                            </span>
                            <span className="text-xs text-on-surface-variant">{curso.codigo}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-on-surface mb-1">{curso.nombre}</h3>
                            <p className="text-sm text-on-surface-variant line-clamp-2">{curso.descripcion || 'Sin descripción disponible.'}</p>
                          </div>
                          <div className="flex flex-col gap-2 border-t border-glass-border pt-4">
                            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm">calendar_month</span>
                              <span>{curso.horario} - {curso.semestre}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm">person</span>
                              <span>Docente: {curso.docente ? curso.docente.name : 'No asignado'}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => navigate(`/modulo/${curso.id}`)} className="flex-1 py-2 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors">Aula</button>
                            {user.role === 'docentes' && (
                              <button onClick={() => { setCursoForAsistencia(curso); setIsAsistenciaModalOpen(true); }} className="px-3 py-2 rounded-lg bg-secondary-fixed/20 text-secondary-fixed border border-secondary-fixed/30 text-xs font-bold hover:bg-secondary-fixed/30 transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                              </button>
                            )}
                            <button onClick={() => openInscripcionModal(curso)} className="px-3 py-2 rounded-lg bg-glass-fill border border-glass-border text-xs font-medium hover:text-primary transition-colors flex items-center gap-1"><span className="material-symbols-outlined text-sm">person_add</span></button>
                            <button onClick={() => openEditCursoModal(curso)} className="px-3 py-2 rounded-lg bg-glass-fill border border-glass-border text-xs font-medium hover:text-primary transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                            <button onClick={() => handleDeleteCurso(curso.id)} className="px-3 py-2 rounded-lg bg-glass-fill border border-glass-border text-error hover:bg-error/10 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {cursos.length > 0 && (user.role === 'director' || user.role === 'secretaria') && (
                      cursos.filter(c => {
                        if (cursoFilter.periodo === 'ALL') return true;
                        const periodoStr = cursoFilter.periodo;
                        const añoStr = cursoFilter.año;
                        return c.codigo.includes(periodoStr) && (añoStr === 'ALL' || c.codigo.includes(añoStr));
                      }).length === 0
                    ) && (
                      <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/40 bg-glass-fill rounded-3xl border border-glass-border border-dashed w-full col-span-full">
                        <span className="material-symbols-outlined text-6xl mb-4">manage_search</span>
                        <p className="text-lg font-bold">Módulos no encontrados en este periodo</p>
                        <p className="text-sm mb-6 text-center px-4">
                          El sistema tiene <b>{cursos.length} cursos</b> registrados, pero ninguno coincide con "{cursoFilter.periodo} - {cursoFilter.año}".
                        </p>
                        <button
                          onClick={() => setCursoFilter({ ...cursoFilter, periodo: 'ALL' })}
                          className="px-8 py-3 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                        >
                          Ver los {cursos.length} cursos existentes
                        </button>
                      </div>
                    )}

                    {cursos.length === 0 && (
                      <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/40 bg-glass-fill rounded-3xl border border-glass-border border-dashed w-full col-span-full">
                        <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
                        <p className="text-lg font-bold">Base de datos vacía</p>
                        <p className="text-sm mb-6 text-center px-4">Aún no se han creado cursos en el sistema.</p>
                      </div>
                    )}
                  </>
                )}
              </section>
            } />

            <Route path="escuela-biblica" element={<EscuelaBiblica />} />

            <Route path="calificaciones" element={
              user.role === 'estudiantes' ? <HistorialAcademico /> :
              <section className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
                <h2 className="text-3xl font-headline-lg text-on-surface">Central de Calificaciones</h2>
                <div className="glass-card p-12 rounded-2xl border border-glass-border flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">analytics</span>
                  <p className="text-on-surface-variant">Generando reportes académicos detallados...</p>
                  <p className="text-xs text-primary mt-2">Próximamente: Exportación a PDF y Excel.</p>
                </div>
              </section>
            } />

            <Route path="plugins" element={
              <section className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
                <h2 className="text-3xl font-headline-lg text-on-surface">Plugins y Extensiones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card p-6 rounded-xl border border-glass-border opacity-60">
                    <h3 className="font-bold text-primary mb-2">Videoconferencia Jitsi</h3>
                    <p className="text-sm text-on-surface-variant">Integración para clases en vivo los domingos.</p>
                  </div>
                  <div className="glass-card p-6 rounded-xl border border-glass-border opacity-60">
                    <h3 className="font-bold text-primary mb-2">Editor de Exámenes</h3>
                    <p className="text-sm text-on-surface-variant">Creador de cuestionarios con tiempo límite.</p>
                  </div>
                </div>
              </section>
            } />

            <Route path="seguridad" element={
              <section className="flex flex-col gap-6 mt-8 animate-in fade-in duration-500">
                <h2 className="text-3xl font-headline-lg text-on-surface">Seguridad y Backups</h2>
                <div className="glass-card p-8 rounded-2xl border border-glass-border bg-error/5">
                  <div className="flex items-center gap-4 mb-4 text-error">
                    <span className="material-symbols-outlined">warning</span>
                    <h3 className="font-bold">Estado del Sistema</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-6">Última copia de seguridad de la base de datos MySQL: **Hace 4 horas**.</p>
                  <button className="glass-button-primary px-6 py-2 rounded-lg text-xs">Realizar Backup Ahora</button>
                </div>
              </section>
            } />

            <Route path="informes" element={<ReporteGeneral />} />
          </Routes>
        </main>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        userToEdit={selectedUser}
        defaultRole={userTab === 'personal' ? 'docentes' : 'estudiantes'}
      />
      <CursoModal
        isOpen={isCursoModalOpen}
        onClose={() => setIsCursoModalOpen(false)}
        onSave={handleSaveCurso}
        cursoToEdit={selectedCurso}
        añoActual={cursoFilter.año}
      />
      <InscripcionModal
        isOpen={isInscripcionModalOpen}
        onClose={(refresh) => {
          setIsInscripcionModalOpen(false);
          if (refresh) fetchCursos();
        }}
        curso={cursoForInscripcion}
      />
      <AsistenciaModal
        isOpen={isAsistenciaModalOpen}
        onClose={() => setIsAsistenciaModalOpen(false)}
        curso={cursoForAsistencia}
      />
      <CalificacionFinalModal
        isOpen={isCalificacionFinalModalOpen}
        onClose={() => setIsCalificacionFinalModalOpen(false)}
        curso={cursoForCalificacion}
      />
      <PeriodoModal
        isOpen={isPeriodoModalOpen}
        onClose={() => setIsPeriodoModalOpen(false)}
        añoActual={cursoFilter.año}
      />
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

export default Dashboard;
