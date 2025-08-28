import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProcessedMeasurement } from '../types';

interface HistoryChartProps {
  data: ProcessedMeasurement[];
}

const ChartTemplate: React.FC<{ data: any[], dataKey: string, name: string, color: string, unit: string }> = ({ data, dataKey, name, color, unit }) => (
  <div style={{ width: '100%', height: 250 }}>
    <h3 className="text-lg font-semibold text-gray-300 mb-3">{name}</h3>
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="time" stroke="#A0AEC0" fontSize={12} />
        <YAxis stroke="#A0AEC0" fontSize={12} unit={unit} />
        <Tooltip
          contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5568', borderRadius: '0.75rem' }}
          labelStyle={{ color: '#E2E8F0' }}
        />
        <Legend wrapperStyle={{ color: '#E2E8F0' }} />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const formattedData = data.map(m => ({
    ...m,
    time: new Date(Number(m.id) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }));

  return (
    <div className="space-y-8">
      <ChartTemplate 
        data={formattedData} 
        dataKey="noise" 
        name="Nivel de Ruido"
        color="#38BDF8"
        unit="dB"
      />
      <ChartTemplate 
        data={formattedData} 
        dataKey="vibration" 
        name="Vibración"
        color="#A78BFA"
        unit="m/s²"
      />
    </div>
  );
};

export default HistoryChart;