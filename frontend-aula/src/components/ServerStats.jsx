import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ServerStats = () => {
  const [serverInfo, setServerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServerInfo();
  }, []);

  const fetchServerInfo = async () => {
    try {
      const response = await api.get('/dashboard/server-info');
      console.log("Datos del Servidor:", response.data); // Depuración
      setServerInfo(response.data);
    } catch (error) {
      console.error('Error fetching server info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="p-8 glass-card rounded-2xl animate-pulse">
      <div className="h-4 bg-glass-fill w-1/4 mb-4 rounded"></div>
      <div className="space-y-3">
        <div className="h-8 bg-glass-fill rounded"></div>
        <div className="h-8 bg-glass-fill rounded"></div>
      </div>
    </div>
  );

  if (!serverInfo) return null;

  return (
    <div className="glass-card rounded-2xl p-8 border border-glass-border shadow-2xl overflow-hidden relative group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="material-symbols-outlined text-9xl">dns</span>
      </div>

      <div className="flex items-center gap-3 mb-8 border-b border-glass-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">monitoring</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface">Estado del Servidor</h3>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-black">Monitoreo en Tiempo Real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Almacenamiento primero para que sea imposible no verlo */}
        <StatItem
          label="Almacenamiento"
          value={serverInfo.disk_usage || 'Calculando...'}
          icon="storage"
          subValue={serverInfo.disk_total ? `Total: ${serverInfo.disk_total} (${serverInfo.disk_percentage}%)` : 'Obteniendo límite...'}
          color="text-primary"
        />
        <StatItem label="SO Servidor" value={serverInfo.server_os} icon="terminal" />
        <StatItem label="PHP Version" value={serverInfo.php_version} icon="php" />
        <StatItem label="Laravel" value={serverInfo.laravel_version} icon="rocket" />
        <StatItem
            label="Uso de Memoria"
            value={serverInfo.memory_usage}
            icon="memory"
            subValue={serverInfo.limit_warning}
            isWarning={true}
        />
        <StatItem label="Base de Datos" value={serverInfo.database_driver} icon="database" />
        <StatItem label="Entorno" value={serverInfo.environment} icon="cloud" />
        <StatItem label="Uptime" value={serverInfo.uptime} icon="timer" color="text-secondary-fixed" />
      </div>

      <div className="mt-8 p-4 rounded-xl bg-void-black/40 border border-glass-border flex items-start gap-4">
        <span className="material-symbols-outlined text-primary">info</span>
        <p className="text-xs text-on-surface-variant leading-relaxed">
            Estás operando en un entorno de <span className="text-primary font-bold">{serverInfo.environment.toUpperCase()}</span>.
            Recuerda que si el uso de recursos excede los límites del plan, el servidor podría reiniciarse.
        </p>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, icon, subValue, isWarning, color = 'text-on-surface' }) => (
  <div className="flex flex-col gap-1 p-4 rounded-xl bg-glass-fill border border-glass-border/30 hover:border-primary/40 transition-all">
    <div className="flex items-center gap-2 mb-1">
      <span className={`material-symbols-outlined text-sm ${color}`}>{icon}</span>
      <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    {subValue && (
        <div className={`text-[9px] font-bold uppercase tracking-tighter ${isWarning ? 'text-error' : 'text-on-surface-variant'}`}>
            {subValue}
        </div>
    )}
  </div>
);

export default ServerStats;
