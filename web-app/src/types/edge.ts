
export interface Edge {
  edgeId: string;
  source: string;
  target: string;
  label?: string;
  color?: string;
  size?: number;
  type?: string;
  weight?: number;
}

export interface AddContactEdge {
  source: string,
  label: string,
  color: string,
  size: number,
  type: string,
  weight: number,
}

export const EDGE_TYPES = ['дружба', 'работа', 'родство', 'знакомство', 'бизнес'] as const;
export type EdgeType = typeof EDGE_TYPES[number];