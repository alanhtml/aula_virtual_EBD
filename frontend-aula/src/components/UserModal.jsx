import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../api/axios';

const userSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico no válido'),
  username: z.string().min(4, 'El usuario debe tener al menos 4 caracteres'),
  role: z.string(),
  password: z.string().optional().or(z.literal('')),
  fecha_nacimiento: z.string().optional(),
  ci: z.string().optional(),
  telefono: z.string().optional(),
  curso_id: z.string().optional(),
}).refine((data) => {
  if (data.role === 'estudiantes') {
    return !!data.ci && !!data.telefono && !!data.fecha_nacimiento;
  }
  return true;
}, {
  message: "Campos de estudiante obligatorios",
  path: ["ci"]
});

const UserModal = ({ isOpen, onClose, onSave, userToEdit, defaultRole = 'docentes' }) => {
  const [cursosList, setCursosList] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: defaultRole
    }
  });

  const currentRole = watch('role');

  useEffect(() => {
    if (userToEdit) {
      reset({
        ...userToEdit,
        password: '',
        curso_id: userToEdit.curso_id?.toString() || ''
      });
    } else {
      reset({
        name: '',
        email: '',
        username: '',
        role: defaultRole,
        password: '',
        fecha_nacimiento: '',
        ci: '',
        telefono: '',
        curso_id: '',
      });
    }
  }, [userToEdit, isOpen, defaultRole, reset]);

  useEffect(() => {
    if (isOpen && currentRole === 'estudiantes') {
      fetchCursos();
    }
  }, [isOpen, currentRole]);

  const fetchCursos = async () => {
    try {
      const response = await api.get('/cursos');
      setCursosList(response.data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }
  };

  const onSubmit = (data) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 bg-void-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl p-6 md:p-8 rounded-2xl border border-glass-border shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-xl md:text-2xl font-headline-md text-primary">
            {userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 overflow-y-auto px-1 pr-2 scrollbar-thin scrollbar-thumb-primary/20 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nombre Completo</label>
              <input
                {...register('name')}
                className={`glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${errors.name ? 'border-error/50 ring-error/20' : 'focus:ring-primary/50'}`}
                placeholder="Ej. Juan Pérez"
              />
              {errors.name && <span className="text-[10px] text-error font-bold ml-1">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Correo Electrónico</label>
              <input
                {...register('email')}
                className={`glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${errors.email ? 'border-error/50 ring-error/20' : 'focus:ring-primary/50'}`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && <span className="text-[10px] text-error font-bold ml-1">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nombre de Usuario</label>
              <input
                {...register('username')}
                className={`glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none transition-all ${errors.username ? 'border-error/50 ring-error/20' : 'focus:ring-primary/50'}`}
                placeholder="usuario123"
              />
              {errors.username && <span className="text-[10px] text-error font-bold ml-1">{errors.username.message}</span>}
            </div>

            {currentRole === 'estudiantes' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Cédula de Identidad (CI)</label>
                  <input
                    {...register('ci')}
                    className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="1234567"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Teléfono / WhatsApp</label>
                  <input
                    {...register('telefono')}
                    className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="70000000"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    {...register('fecha_nacimiento')}
                    className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Asignar a Módulo</label>
                  <div className="relative">
                    <select
                      {...register('curso_id')}
                      className="glass-input w-full rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none pr-10"
                    >
                      <option value="" className="bg-[#1a1a1c] text-on-surface">Seleccionar módulo...</option>
                      {cursosList.map(curso => (
                        <option key={curso.id} value={curso.id} className="bg-[#1a1a1c] text-on-surface">
                          {curso.nombre} ({curso.codigo})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                      expand_more
                    </span>
                  </div>
                </div>
              </>
            )}

            <div className={currentRole === 'estudiantes' ? 'md:col-span-2' : ''}>
              {currentRole !== 'estudiantes' ? (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Rol Administrativo</label>
                  <div className="relative">
                    <select
                      {...register('role')}
                      className="glass-input w-full rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none pr-10"
                    >
                      <option value="docentes" className="bg-[#1a1a1c] text-on-surface">Docente</option>
                      <option value="secretaria" className="bg-[#1a1a1c] text-on-surface">Secretaría</option>
                      <option value="director" className="bg-[#1a1a1c] text-on-surface">Administración (Director)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                      expand_more
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2 px-4 bg-primary/10 border border-primary/20 rounded-xl mb-2">
                  <p className="text-xs text-primary font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">school</span>
                    Perfil de Estudiante
                  </p>
                </div>
              )}
            </div>

            <div className={`flex flex-col gap-1 ${currentRole === 'estudiantes' ? 'md:col-span-2' : ''}`}>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                Contraseña {userToEdit && <span className="text-[10px] normal-case opacity-60">(Dejar en blanco para no cambiar)</span>}
              </label>
              <input
                type="password"
                {...register('password')}
                className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-glass-fill border border-glass-border text-on-surface font-bold hover:bg-glass-fill/80 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl glass-button-primary text-primary-fixed font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {userToEdit ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
