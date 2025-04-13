import React, { useEffect, useRef } from 'react';
import Sigma from 'sigma';
import { SigmaContainerProps } from '../../types/sigma';
import { NodeChange } from '../../types/node';
import { NodeService } from '../../service/nodeService';

const SigmaContainer: React.FC<SigmaContainerProps> = ({
  graph,
  settings = {},
  className = '',
  style = {},
  onLoad
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaInstance = useRef<Sigma | null>(null);
  const draggedNode = useRef<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: settings.renderEdgeLabels,
    });

    sigmaInstance.current = renderer;

    // Зажатие узла
    renderer.on("downNode", (e) => {
      draggedNode.current = e.node;
    });

    // Перемещение мыши по канве
    renderer.getMouseCaptor().on("mousemovebody", (e) => {
      if (!draggedNode.current) return;
      const pos = renderer.viewportToGraph(e);
      graph.setNodeAttribute(draggedNode.current, "x", pos.x);
      graph.setNodeAttribute(draggedNode.current, "y", pos.y);
    });

    // Отпускание мыши
    renderer.getMouseCaptor().on("mouseup", () => {
      if (!draggedNode.current) return;

      const nodeId = draggedNode.current;
      const nodeAttrs = graph.getNodeAttributes(nodeId);

      const nodeChange: NodeChange = {
        id: nodeId,
        label: nodeAttrs.label,
        x: nodeAttrs.x,
        y: nodeAttrs.y,
        size: nodeAttrs.size,
        color: nodeAttrs.color,
        type: nodeAttrs.type,
        isSpecial: nodeAttrs.isSpecial || false,
        children: nodeAttrs.children || [],
        parentId: nodeAttrs.parentId || ''
      };

      NodeService.ChangeNode(process.env.REACT_APP_GRAPH, nodeChange)

      draggedNode.current = null;
    });

    // Вызываем onLoad при инициализации
    if (onLoad) onLoad(renderer);

    return () => {
      renderer.kill();
      sigmaInstance.current = null;
    };
  }, [graph, settings, onLoad]);

  useEffect(() => {
    if (sigmaInstance.current) {
      sigmaInstance.current.refresh();
    }
  }, [graph]);

  return (
    <div
      ref={containerRef}
      className={`sigma-container ${className}`}
      style={style}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default SigmaContainer;
