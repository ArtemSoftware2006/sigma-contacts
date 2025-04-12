export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  parentId: string
}

export interface AddContactNode {
  graphId: string
  node: {
    label: string,
    x: number,
    y: number,
    color: string,
    size: number,
    type: string,
    isSpecial: boolean,
    parentId: string
  }
}

export interface NodeChange {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  isSpecial: boolean,
  children: string[],
  parentId: string
}
