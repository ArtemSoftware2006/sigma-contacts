import React, { useState } from 'react';
import Sigma from 'sigma';
import SigmaContainer from '../sigmaContainer/SigmaContainer';
import { Node  } from '../../types/node';
import { NodeContextMenu } from '../nodeContextMenu/NodeContextMenu';
import { useGraphStore } from '../../hook/useGraphStore';
import { info } from '../../utils/logger'
import './Graph.css';
import { newEmptyContact } from '../../types/contact';

interface GraphComponentProps {
  onNodeClick?: (nodeData: Node) => void;
  onAddNode?: (parentNodeId: string) => void; 
}

const GraphComponent: React.FC<GraphComponentProps> = ({ onNodeClick, onAddNode }) => {
  // Используем наш хук для управления состоянием графа
  const { graph, vitrualGraph ,loading, error, refresh, setGraph } = useGraphStore();

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

    sigma.on("clickNode", ({ node: nodeId }) => {
      const nodeAttributes = sigma.getGraph().getNodeAttributes(nodeId);
      info("Клик по узлу:", nodeId, nodeAttributes);

      if (onNodeClick) {
        const resultNode: Node = {
          label: nodeAttributes.label,
          id: nodeId,
          size: nodeAttributes.size,
          color: nodeAttributes.color,
          x: nodeAttributes.x,
          y: nodeAttributes.y,
          isGroup: nodeAttributes.isGroup,
          type: nodeAttributes.type,
          parentId : nodeAttributes.parentId,
          contact: vitrualGraph?.nodes.find(node => node.id == nodeId)?.contact || newEmptyContact()
        };
        info("Click, virtualGraph\n")
        info(vitrualGraph?.nodes)
        onNodeClick(resultNode);
      }
      setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
    });

    sigma.on("enterNode", ({ node, event }) => {
      //event.preventDefault();
      const nodeAttributes = sigma.getGraph().getNodeAttributes(node);
      //info("Правая кнопка по узлу:", node, nodeAttributes);

      let isShowContextMenu = false
      if (vitrualGraph?.nodes.find(virtualNode => virtualNode.id == node && virtualNode.isGroup)) {
        isShowContextMenu= true
      }
      setContextMenu({
        show: isShowContextMenu,
        x: event.x - 120,
        y: event.y + 20,
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