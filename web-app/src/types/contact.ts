import { AddContactEdge, Edge } from "./edge"
import { AddContactNode, NodeChange } from "./node"
import { BaseResponse } from "./response"

export interface AddContactNodeResponse {
    node: {
        idNode: string
    }
    edge: {
        idEdge: string
    }
}

export interface AddContactRequest {
    node: AddContactNode
    edge: AddContactEdge
}
export interface ChangeContactRequest {
    graphId: string
    node: NodeChange
    edge: Edge
}

export interface DeleteContactRequest {
    graphId: string
    nodeId: string
    edgeId: string
}

export interface DeleteContactResponse extends BaseResponse {
}



export interface ChangeContactResponse extends BaseResponse {

}