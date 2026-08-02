import React, { useState, useRef, useEffect } from 'react';
import Sigma from 'sigma';
import SigmaContainer from '../sigmaContainer/SigmaContainer';
import { Node  } from '../../types/node';
import { NodeContextMenu } from '../nodeContextMenu/NodeContextMenu';
import { useGraphStoreContext } from '../../context/GraphStoreContext';
import { info } from '../../utils/logger'
import './Graph.css';
import { newEmptyContact } from '../../types/contact';

interface GraphComponentProps {
  onNodeClick?: (nodeData: Node) => void;
  onAddNode?: (parentNodeId: string) => void; 
}

const GraphComponent: React.FC<GraphComponentProps> = ({ onNodeClick, onAddNode }) => {
  const { graph, vitrualGraph, loading, error, refresh, setGraph, focusNodeId, setFocusNodeId, highlightedNodeIds } = useGraphStoreContext();

  const sigmaRef = useRef<Sigma | null>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);

  useEffect(() => {
    if (!focusNodeId || !sigmaRef.current || !graph) return;
    const sigma = sigmaRef.current;
    if (!graph.hasNode(focusNodeId)) return;
    const nodeDisplayData = sigma.getNodeDisplayData(focusNodeId);
    if (!nodeDisplayData) return;
    sigma.getCamera().animate(
      { x: nodeDisplayData.x, y: nodeDisplayData.y, ratio: 0.3 },
      { duration: 500 }
    );
    setFocusNodeId(null);
  }, [focusNodeId, graph, setFocusNodeId]);

  useEffect(() => {
    if (!sigmaRef.current) return;
    const sigma = sigmaRef.current;

    if (!highlightedNodeIds || highlightedNodeIds.size === 0) {
      sigma.setSetting('nodeReducer', null);
      sigma.setSetting('edgeReducer', null);
      sigma.refresh();
      return;
    }

    sigma.setSetting('nodeReducer', (node: string, data: any) => {
      if (highlightedNodeIds.has(node)) {
        return { ...data, highlighted: true, size: data.size * 1.4, zIndex: 1 };
      }
      return { ...data, color: '#d0d0d0', label: '', size: data.size * 0.8, zIndex: 0 };
    });

    sigma.setSetting('edgeReducer', (edge: string, data: any) => {
      if (!graph) return data;
      const src = graph.source(edge);
      const tgt = graph.target(edge);
      if (highlightedNodeIds.has(src) || highlightedNodeIds.has(tgt)) {
        return data;
      }
      return { ...data, color: '#e8e8e8', size: data.size * 0.5 };
    });

    sigma.refresh();
  }, [highlightedNodeIds, graph]);

  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    nodeId: string | null;
  }>({ show: false, x: 0, y: 0, nodeId: null });

  const handleSigmaLoad = (sigma: Sigma) => {
    sigmaRef.current = sigma;
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
          parentId: nodeAttributes.parentId,
          category: vitrualGraph?.nodes.find(node => node.id == nodeId)?.category ?? '',
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