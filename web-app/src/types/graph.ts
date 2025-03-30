export interface Node {
    id: string;
    label: string;
    x?: number;
    y?: number;
    size: number;
    color: string;
    type: string;
  }
  
  export interface Edge {
    id: string;
    source: string;
    target: string;
    label?: string;
    color?: string;
    size?: number;
  }
  
  export interface GraphData {
    nodes: Node[];
    edges: Edge[];
  }
  
  export type ApiGraphItem = Node | Edge;