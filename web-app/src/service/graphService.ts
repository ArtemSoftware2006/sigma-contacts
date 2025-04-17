import axios, { AxiosError } from "axios";
import { CreateUserGraphResponse, GraphData, GraphResponse, } from "../types/graph";
import { Edge } from '../types/edge'
import { Node } from '../types/node'
import { info } from "../utils/logger";

const API_URL = process.env.REACT_APP_API_URL

interface ApiError {
    error: string;
    // Дополнительные поля ошибки, если они есть в вашем API
}

interface AuthHeaders {
    Authorization: string
}

export class GraphService {
    static async fetchGraphData(): Promise<GraphData> {
        try {
            const headers = this.setAuthHeaders();

            const response = await axios.get<GraphResponse>(`${API_URL}graph/userGraph`, { headers });

            localStorage.setItem("graphId", response.data.id);

            return { nodes: response.data.nodes, edges: response.data.edges };

        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.error || 'Get graph failed');
        }
    }

    static setAuthHeaders(): any {
        const token = localStorage.getItem('token');

        const headers = { Authorization: `Bearer ${token}` };

        return headers
    }

    static GetGraphId(): string | Error {
        const graphId: string | null = localStorage.getItem("graphId")
        if (graphId == null) {
            return Error("graphId is null")
        }

        return graphId
    }

    static async CreateUserGraph(): Promise<string | Error> {
        try {
            const headers = this.setAuthHeaders();

            //TODO: name надо передавать в аргементе
            const response = await axios.post<CreateUserGraphResponse>(`${API_URL}graph/userGraph`, { name: "Test Graph" }, { headers });

            localStorage.setItem("graphId", response.data.graphId);

            return response.data.graphId
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            return error as Error
        }
    }
}