import React, { createContext, useContext, useState } from 'react';
import Graph from 'graphology';
import { useGraphStore } from '../hook/useGraphStore';
import { GraphData } from '../types/graph';

interface GraphStoreContextType {
  graph: Graph | null;
  vitrualGraph: GraphData | undefined;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  setGraph: (g: Graph) => void;
  focusNodeId: string | null;
  setFocusNodeId: (id: string | null) => void;
  highlightedNodeIds: Set<string> | null;
  setHighlightedNodeIds: (ids: Set<string> | null) => void;
}

const GraphStoreContext = createContext<GraphStoreContextType | null>(null);

export const GraphStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useGraphStore();
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string> | null>(null);

  return (
    <GraphStoreContext.Provider value={{ ...store, focusNodeId, setFocusNodeId, highlightedNodeIds, setHighlightedNodeIds }}>
      {children}
    </GraphStoreContext.Provider>
  );
};

export const useGraphStoreContext = () => {
  const ctx = useContext(GraphStoreContext);
  if (!ctx) throw new Error('useGraphStoreContext must be used within GraphStoreProvider');
  return ctx;
};
