
export interface Edge {
  edgeId: string;
  source: string;
  target: string;
  label?: string;
  color?: string;
  size?: number;
}

export interface AddContactEdge {
  graphId: string
  edge: {
      source: string,
      label: string,
      color: string,
      size: number,
  }
}