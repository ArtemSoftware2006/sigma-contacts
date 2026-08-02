import { useState, useEffect, useCallback } from 'react';
import Graph from 'graphology';
import { GraphService } from '../service/graphService';
import { info } from '../utils/logger'
import { GraphData } from '../types/graph';
import { toast } from 'react-toastify';

export const useGraphStore = () => {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [vitrualGraph, setVirtualGraph] = useState<GraphData>();
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
      const graphResponse : GraphData = await GraphService.fetchGraphData();
      info("Load Graph (apiData)\n")
      info(graphResponse)
      setVirtualGraph(graphResponse)

      const newGraph = new Graph();
      graphResponse.nodes.forEach(node => {
        //TODO: Добавление узла в граф Graphology. Тут нет поля Contact, поэтому создаю Виртуальный граф

        let nodeLabel = node.contact.name

        if (graphResponse?.nodes.find(virtualNode => virtualNode.isGroup == true && virtualNode.id == node.id)) {
          nodeLabel = node.label
        }

        newGraph.addNode(node.id, {
          label: nodeLabel,
          x: node.x,
          y: node.y,
          size: node.size,
          color: node.color,
          type: node.type,
          isGroup: node.isGroup,
          parentId: node.parentId,
        });
      });
      
      graphResponse.edges.forEach(edge => {
        newGraph.addEdgeWithKey(edge.edgeId, edge.source, edge.target, {
          id: edge.edgeId,
          label: edge.label,
          size: edge.size,
          color: edge.color
        });
      });
      
      setGraph(newGraph);
    } catch (err) {
      console.error("UseGraphStore Error ", (err as Error).message)
      if ((err as Error).message.includes("mongo")) {
        try {
          await GraphService.CreateUserGraph()          
        } catch (error) {
          console.error(error)
        }
        return
      }
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
    vitrualGraph,
    loading,
    error,
    refresh: loadGraph,
    refreshLocal: loadGraphLocal,
    setGraph // Добавляем возможность обновления графа
  };
};