// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Вместо него используется ХУК!!!!!!!!!

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Graph from 'graphology';
import { GraphService } from '../service/graphService';

type GraphState = {
  graph: Graph | null;
  loading: boolean;
  error: string | null;
};

type GraphAction =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: Graph }
  | { type: 'ERROR'; payload: string };

const initialState: GraphState = {
  graph: null,
  loading: true,
  error: null
};

const reducer = (state: GraphState, action: GraphAction): GraphState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, graph: action.payload, loading: false };
    case 'ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const GraphContext = createContext<{
  state: GraphState;
  dispatch: React.Dispatch<GraphAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadGraph = async () => {
      dispatch({ type: 'LOADING' });
      try {
        const apiData = await GraphService.fetchGraphData();
        //const processedData = await GraphService.processGraph(apiData);
        
        const graph = new Graph();
        apiData.nodes.forEach(node => {
          graph.addNode(node.id, {
            label: node.label,
            x: node.x,
            y: node.y,
            size: node.size,
            color: node.color,
            type: node.type
          });
        });
        
        apiData.edges.forEach(edge => {
          graph.addEdge(edge.source, edge.target, {
            label: edge.label,
            size: edge.size,
            color: edge.color
          });
        });
        
        dispatch({ type: 'SUCCESS', payload: graph });
      } catch (err) {
        dispatch({ type: 'ERROR', payload: err instanceof Error ? err.message : 'Unknown error' });
      }
    };

    loadGraph();
  }, []);

  return (
    <GraphContext.Provider value={{ state, dispatch }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = () => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
};