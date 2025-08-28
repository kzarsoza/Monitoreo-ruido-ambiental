
import { FirebaseData, ProcessedMeasurement, FirebaseMeasurement } from '../types';

export const parseFirebaseData = (data: FirebaseData): ProcessedMeasurement[] => {
  if (!data) return [];
  return Object.entries(data)
    .map(([id, measurement]: [string, FirebaseMeasurement]) => ({
      id,
      fecha: measurement.fecha,
      noise: parseFloat(measurement.nivel_dB) || 0,
      vibration: parseFloat(measurement.vibracion_ms2) || 0,
      status: getStatus(measurement.estado),
    }))
    .sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Sort by timestamp descending (newest first)
};

const getStatus = (status: string): ProcessedMeasurement['status'] => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'verde') return 'Verde';
  if (lowerStatus === 'amarillo') return 'Amarillo';
  if (lowerStatus === 'rojo') return 'Rojo';
  return 'Desconocido';
};

export const getStatusColor = (status: ProcessedMeasurement['status']): string => {
  switch (status) {
    case 'Verde':
      return 'bg-green-500';
    case 'Amarillo':
      return 'bg-yellow-500';
    case 'Rojo':
      return 'bg-red-500';
    default:
      return 'bg-gray-600';
  }
};

export const getStatusRingColor = (status: ProcessedMeasurement['status']): string => {
  switch (status) {
    case 'Verde':
      return 'ring-green-400';
    case 'Amarillo':
      return 'ring-yellow-400';
    case 'Rojo':
      return 'ring-red-400';
    default:
      return 'ring-gray-500';
  }
};
