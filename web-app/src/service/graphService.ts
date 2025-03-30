import { ApiGraphItem, GraphData } from "../types/graph";

export class GraphService {
    static async fetchGraphDataMock() : Promise<ApiGraphItem[]> {
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

    static async processGraph(graphData : ApiGraphItem[]) : Promise<GraphData> {
        const graph : GraphData = {
            edges : [],
            nodes : []
        };

        graphData.forEach(item => {
            if ('source' in item && 'target' in item) {
                // Это ребро
                graph.edges.push({
                    id: item.id,
                    source: item.source,
                    target: item.target,
                    label: item.label,
                    color: item.color,
                    size: item.size
                });
                } else {
                // Это узел
                graph.nodes.push({
                    id: item.id,
                    label: item.label,
                    x: item.x,
                    y: item.y,
                    size: item.size,
                    color: item.color,
                    type: item.type
                });
            }
        });

        return graph;
    } 
}