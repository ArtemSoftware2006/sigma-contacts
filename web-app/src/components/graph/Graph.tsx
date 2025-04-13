import React, { useState } from 'react';
import Sigma from 'sigma';
import SigmaContainer from '../sigmaContainer/SigmaContainer';
import { Node as MyNode } from '../../types/node';
import { NodeContextMenu } from '../nodeContextMenu/NodeContextMenu';
import { useGraphStore } from '../../hook/useGraphStore';
import { info } from '../../utils/logger'
import './Graph.css';

interface GraphComponentProps {
  onNodeClick?: (nodeData: MyNode) => void;
  onAddNode?: (parentNodeId: string) => void; 
}

const GraphComponent: React.FC<GraphComponentProps> = ({ onNodeClick, onAddNode }) => {
  // Используем наш хук для управления состоянием графа
  const { graph, loading, error, refresh, setGraph } = useGraphStore();

  //refresh()
  
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    nodeId: string | null;
  }>({ show: false, x: 0, y: 0, nodeId: null });

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
      info("Клик по узлу:", node, nodeAttributes);

      if (onNodeClick) {
        const resultNode: MyNode = {
          label: nodeAttributes.label,
          id: node,
          size: nodeAttributes.size,
          color: nodeAttributes.color,
          x: nodeAttributes.x,
          y: nodeAttributes.y,
          type: nodeAttributes.type,
          parentId : nodeAttributes.parentId
        };
        onNodeClick(resultNode);
      }
      setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
    });

    sigma.on("enterNode", ({ node, event }) => {
      //event.preventDefault();
      const nodeAttributes = sigma.getGraph().getNodeAttributes(node);
      //info("Правая кнопка по узлу:", node, nodeAttributes);
      
      setContextMenu({
        show: true,
        x: event.x - 100,
        y: event.y + 30,
        nodeId: node
      });
    });

    sigma.on("leaveNode", ({ node, event }) => {
      info("Leave Node")
      setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
    });

    sigma.on("clickStage", () => {
      setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
    });
  };

  const handleAddNode = () => {
    if (contextMenu.nodeId && onAddNode) {
      onAddNode(contextMenu.nodeId);
      // После добавления узла можно обновить граф:
      // setGraph(updatedGraph);
    }
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
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

      {contextMenu.show && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onAddNode={handleAddNode}
          onClose={() => setContextMenu({ show: false, x: 0, y: 0, nodeId: null })}
        />
      )}
    </div>
  );
};

export default GraphComponent;