import axios, { AxiosError } from "axios";
import { Edge } from "../types/edge";
import { Node, NodeChange } from '../types/node'
import { AddContactFullDataRequest, AddContactNodeResponse, ChangeContactFullDataRequest, ChangeContactFullDataResponse } from "../types/contactFullData";
import { info } from "../utils/logger";
import { BaseResponse } from "../types/response";

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

interface ApiError {
    message: string;
    // Дополнительные поля ошибки, если они есть в вашем API
}

interface AuthHeaders {
    Authorization: string
}

export class NodeService {

    static setAuthHeaders(): any {
        const token = localStorage.getItem('token');
        info("token ", token)

        const headers = { Authorization: `Bearer ${token}` };

        return headers

    }

    static async ChangeNode(graphId : string, changeNode: NodeChange): Promise<BaseResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  
                ...authHeaders
            };

            const response = await axios.put<BaseResponse>(`${API_URL}node/${graphId}`, changeNode, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Put node failed');
        }
    }
}