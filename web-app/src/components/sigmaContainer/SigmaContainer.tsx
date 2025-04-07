import React, { useEffect, useRef } from 'react';
import Sigma from 'sigma';
import { SigmaContainerProps } from '../../types/sigma';

const SigmaContainer: React.FC<SigmaContainerProps> = ({
  graph,
  settings = {},
  className = '',
  style = {},
  onLoad
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaInstance = useRef<Sigma | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;  
    // Инициализация sigma
    sigmaInstance.current = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: settings.renderEdgeLabels,
      // Другие настройки...
    });

    // Вызываем callback при загрузке
    if (onLoad && sigmaInstance.current) {
      onLoad(sigmaInstance.current);
    }

    // Очистка при размонтировании
    return () => {
      if (sigmaInstance.current) {
        sigmaInstance.current.kill();
        sigmaInstance.current = null;
      }
    };
  }, [graph, settings, onLoad]);

  // Обновляем граф при изменении
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