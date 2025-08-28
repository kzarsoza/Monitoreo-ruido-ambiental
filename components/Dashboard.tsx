import React, { useState, useEffect, useCallback } from 'react';
import { ProcessedMeasurement, FirebaseData, User } from '../types';
import { listenToRealtimeMeasurements, auth, logout } from '../services/firebaseService';
import { parseFirebaseData, getStatusColor } from '../utils/helpers';
import DashboardCard from './DashboardCard';
import HistoryChart from './HistoryChart';
import HistoryTable from './HistoryTable';
import NodeSelector from './NodeSelector'; // Importar el nuevo componente
import { Bell, Zap, Activity, LogOut } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [measurements, setMeasurements] = useState<ProcessedMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNode) return;

    setIsLoading(true);
    const unsubscribe = listenToRealtimeMeasurements(selectedNode, (data: FirebaseData) => {
      if (data && Object.keys(data).length > 0) {
        const processedData = parseFirebaseData(data);
        setMeasurements(processedData);
        setIsConnected(true);
      } else {
        setMeasurements([]);
        setIsConnected(false);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [selectedNode]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
  }, []);

  const handleLogout = () => {
    logout(auth).catch(error => console.error('Logout failed', error));
  };

  const latestMeasurement = measurements[0] || null;
  const isLive = isConnected && !isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-gray-900 p-4 lg:border-r border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Nodos</h1>
            <button 
              onClick={handleLogout}
              className="lg:hidden flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <NodeSelector selectedNode={selectedNode} onNodeSelect={handleNodeSelect} />
          <div className="mt-6 hidden lg:block">
             <span className="text-sm text-gray-400 block truncate">{user.email}</span>
             <button 
              onClick={handleLogout}
              className="w-full mt-2 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Dashboard de Monitoreo Ambiental
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium text-gray-400">{isLive ? `En vivo - ${selectedNode}` : 'Desconectado'}</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="Nivel de Ruido"
                value={latestMeasurement ? latestMeasurement.noise.toFixed(2) : '...'}
                unit="dB"
                icon={<Bell className="w-8 h-8 text-cyan-400" />}
              />
              <DashboardCard
                title="Vibración"
                value={latestMeasurement ? latestMeasurement.vibration.toFixed(4) : '...'}
                unit="m/s²"
                icon={<Zap className="w-8 h-8 text-purple-400" />}
              />
              <DashboardCard
                title="Estado General"
                value={latestMeasurement ? latestMeasurement.status : '...'}
                unit=""
                icon={<Activity className="w-8 h-8 text-amber-400" />}
                contentClass={latestMeasurement ? `${getStatusColor(latestMeasurement.status)} text-white font-bold` : 'bg-gray-700'}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Historial de Mediciones (Últimas 20)</h2>
                {isLoading ? (
                  <div className="flex items-center justify-center h-80 text-gray-500">Cargando datos del nodo...</div>
                ) : measurements.length > 0 ? (
                  <HistoryChart data={measurements.slice(0, 20).reverse()} />
                ) : (
                  <div className="flex items-center justify-center h-80 text-gray-500">No hay datos para mostrar.</div>
                )}
              </div>
              <div className="xl:col-span-1 bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Datos Históricos</h2>
                {isLoading ? (
                   <div className="flex items-center justify-center h-80 text-gray-500">Cargando...</div>
                ) : measurements.length > 0 ? (
                  <HistoryTable data={measurements} />
                ) : (
                  <div className="flex items-center justify-center h-80 text-gray-500">No hay datos.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
