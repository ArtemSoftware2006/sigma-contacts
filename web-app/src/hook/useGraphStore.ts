import { useState, useEffect, useCallback } from 'react';
import Graph from 'graphology';
import { GraphService } from '../service/graphService';
import { info } from '../utils/logger'

export const useGraphStore = () => {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //TODO: Меняет граф локально
  const loadGraphLocal = useCallback(async () => {

  }, []);

  // Подгружает граф с бека
  const loadGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiData = await GraphService.fetchGraphData();

      info("Load Graph")
      info(apiData)
      
      const newGraph = new Graph();
      apiData.nodes.forEach(node => {
        newGraph.addNode(node.id, {
          label: node.label,
          x: node.x,
          y: node.y,
          size: node.size,
          color: node.color,
          type: node.type
        });
      });
      
      apiData.edges.forEach(edge => {
        newGraph.addEdge(edge.source, edge.target, {
          label: edge.label,
          size: edge.size,
          color: edge.color
        });
      });
      
      setGraph(newGraph);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    info("Load Graph fron useEffect")
    loadGraph();
  }, [loadGraph]);

  return {
    graph,
    loading,
    error,
    refresh: loadGraph,
    refreshLocal: loadGraphLocal,
    setGraph // Добавляем возможность обновления графа
  };
};