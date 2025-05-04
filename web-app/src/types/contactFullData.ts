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

export interface AddContactFullDataRequest {
    graphId: string
    node: AddContactNode
    edge: AddContactEdge
}
export interface ChangeContactFullDataRequest {
    graphId: string
    node: NodeChange
    edge: Edge
}

export interface DeleteContactFullDataRequest {
    graphId: string
    nodeId: string
    edgeId: string
}

export interface DeleteContactFullDataResponse extends BaseResponse {
}



export interface ChangeContactFullDataResponse extends BaseResponse {

}