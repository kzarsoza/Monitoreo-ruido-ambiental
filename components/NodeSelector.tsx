import React, { useState, useEffect } from 'react';
import { getSensorNodes } from '../services/firebaseService';
import { ChevronRight, Database } from 'lucide-react';

interface NodeSelectorProps {
  selectedNode: string | null;
  onNodeSelect: (nodeId: string) => void;
}

const NodeSelector: React.FC<NodeSelectorProps> = ({ selectedNode, onNodeSelect }) => {
  const [nodes, setNodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getSensorNodes((nodeNames) => {
      setNodes(nodeNames);
      if (nodeNames.length > 0 && !selectedNode) {
        onNodeSelect(nodeNames[0]);
      }
      setIsLoading(false);
    });
  }, [onNodeSelect, selectedNode]);

  if (isLoading) {
    return <div className="text-gray-400">Cargando nodos...</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Database className="w-6 h-6 mr-2 text-cyan-400" />
        Nodos Esclavos
      </h2>
      <ul className="space-y-2">
        {nodes.map((node) => (
          <li key={node}>
            <button
              onClick={() => onNodeSelect(node)}
              className={`w-full text-left flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 ${selectedNode === node ? 'bg-cyan-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
              <span>{node}</span>
              {selectedNode === node && <ChevronRight className="w-5 h-5" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NodeSelector;
