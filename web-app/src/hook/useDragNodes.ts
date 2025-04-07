import { useCallback, useRef } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';

export const useDragNodes = (graph: Graph) => {
  const draggedNode = useRef<string | null>(null);
  const isDragging = useRef(false);

  const handleDragStart = useCallback((sigma: Sigma, event: { x: number; y: number }) => {
    // Используем новый метод для поиска узлов
    const node = findNodeByExactCoords(sigma.getGraph(), event.x, event.y)
    if (node) {
      draggedNode.current = node;
      isDragging.current = true;
      // Отключаем стандартное поведение мыши
      sigma.getMouseCaptor().kill();
    }
  }, []);

  const handleDrag = useCallback((sigma: Sigma, event: { x: number; y: number }) => {
    if (!isDragging.current || !draggedNode.current) return;
    
    // Преобразуем координаты экрана в координаты графа
    const coords = sigma.viewportToGraph({ x: event.x, y: event.y });
    
    // Обновляем позицию узла в графе
    graph.setNodeAttribute(draggedNode.current, 'x', coords.x);
    graph.setNodeAttribute(draggedNode.current, 'y', coords.y);
    
    // Обновляем отображение
    sigma.refresh();
  }, [graph]);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    draggedNode.current = null;
  }, []);

  return { handleDragStart, handleDrag, handleDragEnd };
};

function findNodeByExactCoords(graph: Graph, x: number, y: number): string | null {
    return graph.findNode((node) => {
      const nodeX = graph.getNodeAttribute(node, 'x');
      const nodeY = graph.getNodeAttribute(node, 'y');
      return nodeX === x && nodeY === y;
    }) || null;
  }