import axios, { AxiosError } from "axios";
import { GraphData,  } from "../types/graph";
import { Edge } from '../types/edge'
import { Node } from '../types/node'
import { AddContactFullDataRequest, AddContactNodeResponse, ChangeContactFullDataRequest, ChangeContactFullDataResponse, DeleteContactFullDataRequest, DeleteContactFullDataResponse } from "../types/contactFullData";
import { info } from "../utils/logger";
import { Contact } from "../types/contact";

const API_URL = process.env.REACT_APP_API_URL

interface GraphResponse {
    Status: string,
    Message: string,
    ID: string,
    UserID: string,
    Name: string,
    CreatedAt: string,
    Nodes: Node[],
    Edges: Edge[]
}

export class ContactService {

//     static GetContactForNode(nodeId: string): Contact {
        
//     }    
}