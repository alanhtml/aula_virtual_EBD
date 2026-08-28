import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error reading session data:', e);
    }
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="antialiased min-h-screen flex flex-col relative text-on-surface">
      <div className="ambient-glow w-full h-full fixed top-0 left-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-[radial-gradient(circle_at_20%_30%,rgba(189,147,249,0.15)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,215,0,0.1)_0%,transparent_40%)]"></div>
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-16 py-4 max-w-7xl mx-auto left-0 right-0 bg-glass-fill backdrop-blur-xl border-b border-glass-border shadow-[0_0_20px_rgba(189,147,249,0.1)]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full glass-panel flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(189,147,249,0.2)]">
              {/* Logo */}
              <div className="flex items-center justify-center w-full h-full p-1">
                <img
                  alt="Escuela Bíblica Filadelfia Logo"
                  className="h-10 w-10 object-contain"
                  src="/logo-ebd.png"
                />
              </div>
            </div>
            <span className="font-headline-md text-2xl text-primary tracking-tight hidden md:block">Escuela Bíblica</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => scrollToSection('formacion')} className="font-label-md text-primary border-b-2 border-primary pb-1 hover:text-primary transition-all duration-300">Discipulado</button>
            <button onClick={() => scrollToSection('formacion')} className="font-label-md text-on-surface-variant hover:text-primary transition-all duration-300">Aula</button>
            <button onClick={() => scrollToSection('nosotros')} className="font-label-md text-on-surface-variant hover:text-primary transition-all duration-300">Nosotros</button>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="glass-button-primary px-5 py-2 font-label-md text-void-black font-semibold hidden md:flex items-center gap-2 text-center rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Ir al Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="glass-button-primary px-6 py-2 font-label-md text-void-black font-semibold hidden md:block text-center rounded-xl hover:scale-105 transition-all"
              >
                Iniciar Sesión
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-glass-fill border border-glass-border text-primary hover:text-glow-purple md:hidden flex items-center justify-center transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass-fill border border-glass-border hover:border-primary/40 text-on-surface-variant hover:text-primary transition-all"
                  title={`Sesión activa: ${user.name}`}
                >
                  <span className="material-symbols-outlined text-base text-primary">account_circle</span>
                  <span className="text-xs font-bold truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">account_circle</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-glass-border/40 mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {user && (
              <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-primary truncate">{user.name}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider capitalize">{user.role}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => scrollToSection('formacion')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-glass-fill text-left font-medium text-sm text-on-surface hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-lg">auto_stories</span>
              <span>Discipulado y Módulos</span>
            </button>
            <button
              onClick={() => scrollToSection('nosotros')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-glass-fill text-left font-medium text-sm text-on-surface hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-lg">groups</span>
              <span>Sobre Nosotros</span>
            </button>
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl glass-button-primary text-void-black font-bold text-sm text-center shadow-lg shadow-primary/20 mt-1"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>Ir al Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl glass-button-primary text-void-black font-bold text-sm text-center shadow-lg shadow-primary/20 mt-1"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                <span>Acceder al Aula Virtual</span>
              </Link>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow pt-[100px] flex flex-col gap-20 pb-20">
        {/* Hero Section */}
        <section className="relative w-full max-w-7xl mx-auto px-4 md:px-16 min-h-[70vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm z-0"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBhwz-l7Gad2q9oscEaOoV9JVjXSb7VedSn1Lu-5x-zR4OGP3QqbaIbeHKNDno9Fb82RmPdY-vsRaldFv77QXG8bUxNJx52K7KoLgVnsjJfrqvYSPruo-rik75JdPS5sPWsyxNr4byuIof-lhTE99Jqr7JQxcDF1ZMitCxQpj8fEHsBDmz_wurQd-5Fc5f96vxUJj8ywcAehDCFaLDqOq_sTfk38Ats5EEQfvmf5PWx7c6PwslXO2Y')" }}
          ></div>
          <div className="relative z-10 text-center flex flex-col items-center gap-6 glass-card p-8 rounded-xl max-w-3xl">
            <h1 className="font-headline-xl text-4xl md:text-6xl text-on-surface mb-2">
              Equipando líderes con <span className="text-primary">excelencia bíblica</span>
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mb-8">
              Descubre un santuario digital para el aprendizaje bíblico profundo. Transforma tu camino espiritual a través de un estudio estructurado y profundo.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="glass-button-primary px-8 py-3 font-label-md text-void-black font-bold tracking-wide text-center rounded-xl hover:scale-105 transition-all"
              >
                {user ? "Ir a Mi Aula" : "Comenzar Ahora"}
              </Link>
              <button onClick={() => scrollToSection('formacion')} className="glass-button-secondary px-8 py-3 font-label-md text-tertiary-fixed font-bold tracking-wide rounded-xl">
                Explorar Discipulado
              </button>
            </div>
          </div>
        </section>

        {/* Modules Section (Bento Grid) */}
        <section id="formacion" className="w-full max-w-7xl mx-auto px-4 md:px-16 scroll-mt-24">
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface">Nuestra Formación</h2>
            <p className="font-body-md text-base text-on-surface-variant mt-2">Un camino estructurado hacia la madurez espiritual.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mod 101 */}
            <div className="glass-card rounded-lg p-6 flex flex-col gap-4 group hover:shadow-[0_0_30px_rgba(189,147,249,0.15)] transition-all duration-500">
              <div className="flex justify-between items-start">
                <span className="font-label-sm text-xs text-tertiary px-3 py-1 rounded-full bg-white/5 border border-tertiary/30">Módulo 101</span>
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">auto_stories</span>
              </div>
              <h3 className="font-headline-md text-2xl text-on-surface">Fundamentos de la Fe</h3>
              <p className="font-body-md text-base text-on-surface-variant flex-grow">Establece las bases sólidas de tu creencia a través del estudio profundo de las escrituras fundamentales.</p>
              <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full w-[20%]"></div>
              </div>
            </div>
            {/* Mod 201 */}
            <div className="glass-card rounded-lg p-6 flex flex-col gap-4 group hover:shadow-[0_0_30px_rgba(189,147,249,0.15)] transition-all duration-500">
              <div className="flex justify-between items-start">
                <span className="font-label-sm text-xs text-tertiary px-3 py-1 rounded-full bg-white/5 border border-tertiary/30">Módulo 201</span>
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">psychology</span>
              </div>
              <h3 className="font-headline-md text-2xl text-on-surface">Crecimiento Espiritual</h3>
              <p className="font-body-md text-base text-on-surface-variant flex-grow">Desarrolla disciplinas que transformarán tu vida diaria y fortalecerán tu conexión divina.</p>
              <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full w-[0%]"></div>
              </div>
            </div>
            {/* Mod 301 */}
            <div className="glass-card rounded-lg p-6 flex flex-col gap-4 group hover:shadow-[0_0_30px_rgba(189,147,249,0.15)] transition-all duration-500 md:col-span-2 lg:col-span-1">
              <div className="flex justify-between items-start">
                <span className="font-label-sm text-xs text-tertiary px-3 py-1 rounded-full bg-white/5 border border-tertiary/30">Módulo 301</span>
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">groups</span>
              </div>
              <h3 className="font-headline-md text-2xl text-on-surface">Liderazgo y Servicio</h3>
              <p className="font-body-md text-base text-on-surface-variant flex-grow">Aprende a guiar a otros con compasión, sabiduría y excelencia basada en principios bíblicos.</p>
              <div className="w-full bg-surface-container h-1 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full w-[0%]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="nosotros" className="w-full max-w-7xl mx-auto px-4 md:px-16 my-12 scroll-mt-24">
          <div className="glass-card rounded-xl p-8 text-center flex flex-col items-center gap-6 border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 blur-xl z-0"></div>
            <div className="relative z-10">
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Únete a nuestro santuario virtual</h2>
              <p className="font-body-lg text-lg text-on-surface-variant mb-8 max-w-xl mx-auto">Adopta una experiencia educativa transformadora diseñada para el creyente moderno.</p>
              <Link
                to={user ? "/dashboard" : "/login"}
                className="inline-block glass-button-primary px-10 py-4 font-label-md text-void-black font-bold tracking-widest uppercase rounded-xl hover:scale-105 transition-all"
              >
                {user ? "Ir al Dashboard" : "Inscribirse Hoy"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-glass-border py-20 px-4 md:px-16 flex flex-col md:flex-row justify-between items-start gap-6 mt-auto">
        <div className="flex flex-col gap-4">
          <span className="font-headline-lg text-3xl text-on-surface">Escuela Bíblica</span>
          <p className="font-body-md text-base text-on-surface-variant max-w-md">
            © 2024 Escuela Bíblica y Discipulado. Santuario Digital para el Aprendizaje Bíblico.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <a className="font-body-md text-on-surface-variant hover:text-glow-gold hover:underline transition-colors duration-200" href="#">Registros Académicos</a>
          <a className="font-body-md text-tertiary-fixed font-bold hover:text-glow-gold hover:underline transition-colors duration-200" href="#">Portal del Estudiante</a>
          <a className="font-body-md text-on-surface-variant hover:text-glow-gold hover:underline transition-colors duration-200" href="#">Términos de Gracia</a>
          <a className="font-body-md text-on-surface-variant hover:text-glow-gold hover:underline transition-colors duration-200" href="#">Soporte Técnico</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
