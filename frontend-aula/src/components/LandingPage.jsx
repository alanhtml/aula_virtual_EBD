import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="antialiased min-h-screen flex flex-col relative text-on-surface">
      <div className="ambient-glow w-full h-full fixed top-0 left-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-[radial-gradient(circle_at_20%_30%,rgba(189,147,249,0.15)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,215,0,0.1)_0%,transparent_40%)]"></div>
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-16 py-4 max-w-7xl mx-auto left-0 right-0 bg-glass-fill backdrop-blur-xl border-b border-glass-border shadow-[0_0_20px_rgba(189,147,249,0.1)]">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full glass-panel flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(189,147,249,0.2)]">
            {/* Logo sin filtros */}
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
          <a className="font-label-md text-primary border-b-2 border-primary pb-1 hover:text-primary transition-all duration-300" href="#">Discipulado</a>
          <a className="font-label-md text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Aula</a>
          <a className="font-label-md text-on-surface-variant hover:text-primary transition-all duration-300" href="#">Nosotros</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="glass-button-primary px-6 py-2 font-label-md text-void-black font-semibold hidden md:block text-center">
            Login
          </Link>
          <span className="material-symbols-outlined text-primary cursor-pointer hover:text-glow-purple md:hidden">menu</span>
          <div className="hidden md:flex gap-2">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">school</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">account_circle</span>
          </div>
        </div>
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
              <button className="glass-button-primary px-8 py-3 font-label-md text-void-black font-bold tracking-wide">Comenzar Ahora</button>
              <button className="glass-button-secondary px-8 py-3 font-label-md text-tertiary-fixed font-bold tracking-wide">Explorar Discipulado</button>
            </div>
          </div>
        </section>

        {/* Modules Section (Bento Grid) */}
        <section className="w-full max-w-7xl mx-auto px-4 md:px-16">
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
        <section className="w-full max-w-7xl mx-auto px-4 md:px-16 my-12">
          <div className="glass-card rounded-xl p-8 text-center flex flex-col items-center gap-6 border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-tertiary/10 blur-xl z-0"></div>
            <div className="relative z-10">
              <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-4">Únete a nuestro santuario virtual</h2>
              <p className="font-body-lg text-lg text-on-surface-variant mb-8 max-w-xl mx-auto">Adopta una experiencia educativa transformadora diseñada para el creyente moderno.</p>
              <button className="glass-button-primary px-10 py-4 font-label-md text-void-black font-bold tracking-widest uppercase">Inscribirse Hoy</button>
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
