import axios, { AxiosError } from "axios";
import { CreateUserGraphResponse, GraphData, GraphResponse, } from "../types/graph";
import { ApiErrorResponse } from "../types/response";
import { AuthService } from "./authService";
import { info } from "../utils/logger";

const API_URL = process.env.REACT_APP_API_URL

export class GraphService {
    static async fetchGraphData(): Promise<GraphData> {
        try {
            const headers = AuthService.getAuthHeader();

            const response = await axios.get<GraphResponse>(`${API_URL}/graph/userGraph`, { headers });

            localStorage.setItem("graphId", response.data.id);

            info("GRAPH\n", response)

            return { nodes: response.data.nodes, edges: response.data.edges };

        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;

            console.log(axiosError)
            throw new Error(axiosError.response?.data?.message || 'Get graph failed');
        }
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
            const headers = AuthService.getAuthHeader();

            //TODO: name надо передавать в аргементе
            const response = await axios.post<CreateUserGraphResponse>(`${API_URL}/graph/userGraph`, { name: "Test Graph" }, { headers });

            localStorage.setItem("graphId", response.data.graphId);

            return response.data.graphId
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;

            console.log(axiosError)
            throw new Error(axiosError.response?.data?.message || 'Create graph for user id failed');
        }
    }
}