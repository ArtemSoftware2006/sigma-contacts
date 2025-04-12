import { Node } from '../types/node'
import { Edge } from './edge';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export type ApiGraphItem = Node | Edge;