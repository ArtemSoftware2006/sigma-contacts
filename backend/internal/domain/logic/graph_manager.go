package logic

import (
	"errors"
	"sigma-contacts/internal/domain/entities"
)

type GraphManager struct {
	Graph *entities.Graph
}

func NewGraphManager(graph *entities.Graph) *GraphManager {
	return &GraphManager{Graph: graph}
}

func (m *GraphManager) FindGroupNode(groupID string) (*entities.Node, error) {
	for i := range m.Graph.Nodes {
		node := &m.Graph.Nodes[i]
		if node.ID == groupID && node.IsGroup {
			return node, nil
		}
	}
	return nil, errors.New("групповой узел не найден")
}

func (m *GraphManager) GetContactNodesInGroup(groupID string) []*entities.Node {
	var result []*entities.Node
	for i := range m.Graph.Nodes {
		if m.Graph.Nodes[i].ParentId == groupID && !m.Graph.Nodes[i].IsGroup {
			result = append(result, &m.Graph.Nodes[i])
		}
	}
	return result
}

func (m *GraphManager) PropagateGroupColor(groupID, newColor string) {
	for i := range m.Graph.Nodes {
		if m.Graph.Nodes[i].ParentId == groupID {
			m.Graph.Nodes[i].Color = newColor
		}
	}
	for i := range m.Graph.Edges {
		if m.Graph.Edges[i].Source == groupID {
			m.Graph.Edges[i].Color = newColor
		}
	}
}
