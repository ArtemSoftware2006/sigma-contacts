import { Contact } from "./contact";

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: string;
  parentId: string
  contact : Contact
}

export interface AddContactNode {
  label: string,
  x: number,
  y: number,
  color: string,
  size: number,
  type: string,
  isSpecial: boolean,
  parentId: string,
  contact: Contact,
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
  contact: Contact,
  children: string[],
  parentId: string
}
