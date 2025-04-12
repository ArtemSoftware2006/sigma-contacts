import axios, { AxiosError } from "axios";
import { GraphData,  } from "../types/graph";
import { Edge } from '../types/edge'
import { Node } from '../types/node'
import { AddContactRequest, AddContactNodeResponse, ChangeContactRequest, ChangeContactResponse } from "../types/contact";
import { info } from "../utils/logger";

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

interface ApiError {
    message: string;
    // Дополнительные поля ошибки, если они есть в вашем API
}

interface AuthHeaders {
    Authorization: string
}

export class GraphService {
    static async fetchGraphData(): Promise<GraphData> {
        try {

            const headers = this.setAuthHeaders();

            const response = await axios.get<GraphResponse>(`${API_URL}graph/${process.env.REACT_APP_GRAPH}`, { headers });

            info(response)

            return { nodes: response.data.Nodes, edges: response.data.Edges };
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Get graph failed');
        }
    }

    static setAuthHeaders(): any {
        const token = localStorage.getItem('token');
        info("token ", token)

        const headers = { Authorization: `Bearer ${token}` };

        return headers

    }
}