import Graph from "graphology";
import Sigma from 'sigma';

export interface SigmaContainerProps {
  graph: Graph;
  settings?: SigmaSettings;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (sigma: Sigma) => void;
}

export interface SigmaSettings {
  renderEdgeLabels?: boolean;
  edgeLabelSize?: 'fixed' | 'proportional';
  minEdgeSize?: number;
  maxEdgeSize?: number;
  zoomToSizeRatioFunction?: (ratio: number) => number;
}

export interface SigmaCoordinates {
  x: number;
  y: number;
}

// Типы для событий
export type SigmaNodeEventPayload = {
  node: string;
  event: MouseEvent;
};

export type SigmaMouseEvent = SigmaCoordinates & {
  event: MouseEvent;
};