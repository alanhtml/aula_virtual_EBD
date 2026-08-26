import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    role: 'estudiantes',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Acceso denegado. Verifique sus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-void-black text-on-surface min-h-screen flex flex-col relative overflow-hidden font-body-md">
      {/* Botón Volver a Landing */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary/70 hover:text-primary hover:scale-105 transition-all duration-500 group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Inicio
      </button>

      {/* Cristal Líquido de Fondo - Animación Dinámica */}
      <div className="ambient-glow glow-purple-blob w-[900px] h-[900px] opacity-30 animate-blob top-[-25%] left-[-25%]"></div>
      <div className="ambient-glow glow-gold-blob w-[700px] h-[700px] opacity-20 animate-blob bottom-[-15%] right-[-15%]" style={{ animationDelay: '-7s' }}></div>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        {/* Card Principal - Diseño Redimensionado y Animación de Entrada */}
        <div className="glass-panel animate-liquid-entrance w-full max-w-[460px] p-10 md:p-14 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/20">

          {/* Animación de Flotado Interno */}
          <div className="animate-float">
            {/* Header con Efecto Lente de Cristal */}
            <div className="flex flex-col items-center mb-12 relative">
              <div className="w-28 h-28 rounded-full glass-panel flex items-center justify-center mb-6 overflow-hidden border-2 border-primary/50 shadow-[0_0_50px_rgba(189,147,249,0.5)] group hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                {/* Logo sin filtros */}
                <div className="flex items-center justify-center w-full h-full p-2">
                  <img
                    alt="Logo"
                    className="w-full h-full object-contain group-hover:rotate-[360deg] transition-transform duration-[2000ms]"
                    src="/logo-ebd.png"
                  />
                </div>
              </div>
              <h1 className="font-headline-md text-5xl text-primary tracking-tighter text-center drop-shadow-[0_0_15px_rgba(189,147,249,0.4)]">Aula Virtual</h1>
              <p className="text-[10px] text-on-surface-variant/50 text-center mt-4 uppercase tracking-[0.5em] font-black">Acceso Sagrado</p>
            </div>

            {error && (
              <div className="mb-8 p-5 rounded-3xl bg-error/10 border border-error/20 text-error text-[11px] text-center animate-[shake_0.6s_ease-in-out]">
                {error}
              </div>
            )}

            {/* Formulario Anti-AutoRelleno */}
            <form className="space-y-7" onSubmit={handleSubmit} autoComplete="off">
              {/* Campo oculto para engañar al auto-completado del navegador */}
              <input type="text" style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />

              {/* Selector de Perfil */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-primary/60 uppercase tracking-widest ml-3" htmlFor="role">Jerarquía</label>
                <div className="relative group">
                  <select
                    className="glass-input w-full rounded-2xl px-6 py-5 text-sm appearance-none outline-none cursor-pointer focus:scale-[1.02]"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option className="bg-[#0a0a0a]" value="estudiantes">Estudiante</option>
                    <option className="bg-[#0a0a0a]" value="docentes">Docente</option>
                    <option className="bg-[#0a0a0a]" value="director">Administración</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-primary/50 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">stat_minus_1</span>
                  </div>
                </div>
              </div>

              {/* Usuario */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-primary/60 uppercase tracking-widest ml-3" htmlFor="username">Identidad</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-primary/30 group-focus-within:text-primary transition-all duration-500">
                    <span className="material-symbols-outlined text-xl">fingerprint</span>
                  </div>
                  <input
                    className="glass-input w-full rounded-2xl pl-16 pr-6 py-5 text-sm outline-none placeholder-white/5"
                    id="username"
                    name="username"
                    placeholder="Matrícula o correo"
                    required
                    type="text"
                    autoComplete="one-time-code"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-3">
                  <label className="block text-[10px] font-bold text-primary/60 uppercase tracking-widest" htmlFor="password">Llave</label>
                  <a className="text-[9px] text-tertiary/40 hover:text-tertiary transition-colors uppercase tracking-widest" href="#">¿Extraviada?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-primary/30 group-focus-within:text-primary transition-all duration-500">
                    <span className="material-symbols-outlined text-xl">key</span>
                  </div>
                  <input
                    className="glass-input w-full rounded-2xl pl-16 pr-16 py-5 text-sm outline-none placeholder-white/5"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Botón de Entrada con Efecto Liquid Glow */}
              <button
                className={`w-full mt-10 relative overflow-hidden bg-primary/20 backdrop-blur-2xl border border-white/30 text-white font-black text-xs py-6 rounded-[2rem] flex justify-center items-center gap-4 hover:shadow-[0_0_50px_rgba(189,147,249,0.6)] transition-all duration-700 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'group'}`}
                type="submit"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_3s_infinite]"></div>
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="tracking-[0.6em] uppercase">Ingresar</span>
                    <span className="material-symbols-outlined text-2xl group-hover:translate-x-3 transition-transform duration-700">arrow_right_alt</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer con Enlaces */}
            <div className="mt-12 text-center border-t border-white/10 pt-10 relative z-10">
              <p className="text-[10px] text-on-surface-variant/30 tracking-[0.2em]">
                ¿ERES NUEVO? <a className="text-tertiary font-black hover:text-glow-gold transition-all ml-2 border-b-2 border-tertiary/20 pb-1" href="#">SOLICITAR ACCESO</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
