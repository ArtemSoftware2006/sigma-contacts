import axios, { AxiosError } from "axios";
import { Edge } from "../types/edge";
import { Node, NodeChange } from '../types/node'
import { info } from "../utils/logger";
import { ApiErrorResponse, BaseResponse } from "../types/response";
import { AuthService } from "./authService";

const API_URL = process.env.REACT_APP_API_URL;

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
export class NodeService {

    static async ChangeNode(graphId : string, changeNode: NodeChange): Promise<BaseResponse | Error> {
        try {
            const authHeaders = AuthService.getAuthHeader();

            const headers = {
                'Content-Type': 'application/json',  
                ...authHeaders
            };

            const response = await axios.put<BaseResponse>(`${API_URL}/node/${graphId}`, changeNode, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;
            throw new Error(axiosError.response?.data?.message || 'Put node failed');
        }
    }
}