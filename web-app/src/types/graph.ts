import { Node } from '../types/node'
import { Edge } from './edge';
import { BaseResponse } from './response';

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export type ApiGraphItem = Node | Edge;

export interface GraphResponse {
  Status: string,
  Message: string,
  id: string,
  UserId: string,
  Name: string,
  CreatedAt: string,
  nodes: Node[],
  edges: Edge[]
}

export interface CreateUserGraphResponse extends BaseResponse {
    graphId: string,
}