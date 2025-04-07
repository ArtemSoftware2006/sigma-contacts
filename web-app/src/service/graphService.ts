import axios, { AxiosError } from "axios";
import { ApiGraphItem, Edge, GraphData, Node } from "../types/graph";

//TODO: Use ENV variables
const API_URL = 'http://localhost:8080/api/graph';

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

export class GraphService {
    static async fetchGraphDataMock(): Promise<ApiGraphItem[]> {
        return [
            { id: 'n1', label: 'Node 1', x: 1, y: 0, size: 10, color: '#FF5733', type: 'circle' },
            { id: 'n2', label: 'Node 2', x: 1, y: 1, size: 10, color: '#33FF57', type: 'circle' },
            { id: 'n3', label: 'Node 3', x: -1, y: 1, size: 10, color: '#3357FF', type: 'circle' },
            { id: 'n4', label: 'Node 4', x: 0, y: -1, size: 10, color: '#F033FF', type: 'circle' },
            { id: 'e1', source: 'n1', target: 'n2', label: 'knows', color: '#666', size: 2 },
            { id: 'e2', source: 'n1', target: 'n3', label: 'visited', color: '#666', size: 1 },
            { id: 'e3', source: 'n2', target: 'n4', label: 'sells', color: '#666', size: 3 },
            { id: 'e4', source: 'n3', target: 'n4', label: 'contains', color: '#666', size: 1 }
        ];
    }

    static async fetchGraphData(): Promise<GraphData> {
        try {

            const token = localStorage.getItem('token');
            console.log("token ", token)

            // Настроим заголовки для авторизации, если токен существует
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get<GraphResponse>(`${API_URL}/67f2cfdcc30845147a641e42`, { headers });

            return { nodes: response.data.Nodes, edges: response.data.Edges };
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Get graph failed');
        }
    }

    static async processGraph(graphData: GraphData): Promise<GraphData> {
        //TODO: А зачем нужна обработка, если я и так возвращаю по сути GraphData??? 
        // Я из одного GraphData перекладываю данные в другой GraphData )))
        const graph: GraphData = {
            edges: [],
            nodes: []
        };

        graphData.edges.forEach(item => {
            graph.edges.push({
                id: item.id,
                source: item.source,
                target: item.target,
                label: item.label,
                color: item.color,
                size: item.size
            });
        })
        graphData.nodes.forEach(item => {
            graph.nodes.push({
                id: item.id,
                label: item.label,
                x: item.x,
                y: item.y,
                size: item.size,
                color: item.color,
                type: item.type
            });
        })
        return graph;
    }
}