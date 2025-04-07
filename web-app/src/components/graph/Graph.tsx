import React, { useEffect, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import SigmaContainer from '../sigmaContainer/SigmaContainer';
import { GraphService } from '../../service/graphService';
import './Graph.css';

interface GraphComponentProps {
  onNodeClick?: (nodeData: { label: string; size: number }) => void;
  onNodeRightClick?: () => void;
}

const GraphComponent: React.FC<GraphComponentProps> = ({ onNodeClick }) => {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {

        const apiData = await GraphService.fetchGraphData();
        const processedData = await GraphService.processGraph(apiData);

        console.log(processedData)
        
        const newGraph = new Graph();
        newGraph.clear();

        // Добавляем узлы
        processedData.nodes.forEach(node => {
          newGraph.addNode(node.id, {
            label: node.label,
            x: node.x,
            y: node.y,
            size: node.size,
            color: node.color,
            type: node.type
          });
        });
        
        // Добавляем ребра
        processedData.edges.forEach(edge => {
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
    };

    loadData();
  }, []);

  const handleSigmaLoad = (sigma: Sigma) => {
    if (!initialAnimationDone) {
      sigma.getCamera().animate({
        x: 0.5,
        y: 0.5,
        angle: 0,
        ratio: 1.5, 
      }, {
        duration: 1000,
      }, 
      () => setInitialAnimationDone(true));
    }

    sigma.on("clickNode", ({ node }) => {
      const nodeAttributes = sigma.getGraph().getNodeAttributes(node);
      console.log("Клик по узлу:", node, nodeAttributes);

      if (onNodeClick) {
        onNodeClick({
          label: nodeAttributes.label,
          size: nodeAttributes.size,
        });
      }
    });

    sigma.on("rightClickNode", ({ node }) => {
      const nodeAttributes = sigma.getGraph().getNodeAttributes(node);
      console.log("Правая кнопка по узлу:", node, nodeAttributes);
    });
  };

  if (loading) return <div className="graph-status">Loading graph...</div>;
  if (error) return <div className="graph-status error">Error: {error}</div>;
  if (!graph) return <div className="graph-status">No graph data available</div>;

  return (
    <div className="graph-wrapper">
      <SigmaContainer
        graph={graph}
        settings={{
          renderEdgeLabels: true,
          edgeLabelSize: 'proportional',
          minEdgeSize: 0.5,
          maxEdgeSize: 3
        }}
        style={{ width: '100%', height: '100%' }}
        onLoad={handleSigmaLoad}
      />
    </div>
  );
};

export default GraphComponent;