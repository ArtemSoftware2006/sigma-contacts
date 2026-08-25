import React, { FC, useState } from 'react';
import {
  MainWrapper,
  Content,
  MainArea,
  ToggleButtonWrapper,
} from './Main.styled';
import GraphComponent from '../../components/graph/Graph';
import { IconButton } from '@chakra-ui/react';
import { SettingsIcon, CloseIcon } from '@chakra-ui/icons';
import SettingsPanel from '../../components/settingPanel/SettingsPanel';
import { Node, NodeChange } from '../../types/node'
import { Edge } from '../../types/edge';
import { useGraphStoreContext } from '../../context/GraphStoreContext';
import { AddContactFullDataRequest, ChangeContactFullDataRequest, DeleteContactFullDataRequest } from '../../types/contactFullData';
import { info } from '../../utils/logger'
import { SettingPanelState } from '../../enums/settingPanelMode';
import { NodeService } from '../../service/nodeService';
import { ContactFullDataService } from '../../service/contactFullDataService';
import { GraphService } from '../../service/graphService';
import AdminUserTable from '../../components/adminTable/AdminUserTable';
import { isUserAdmin } from '../../types/user';

const Main: FC = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [settingPanelState, setSettingPanelState] = useState(SettingPanelState.View);
  const [parentNodeId, setParentNodeId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const { graph, vitrualGraph, refresh } = useGraphStoreContext();
  const [graphVersion, setGraphVersion] = useState(0);

  const toggleSettings = () => setSettingsOpen(!isSettingsOpen);

  const handleEditNode = async (editNode: Node, edgeType: string, edgeWeight: number) => {
    setSettingPanelState(SettingPanelState.Edit)

    const graphId = GraphService.GetGraphId();
    if (graphId == typeof (Error)) {
      info(graphId.toString())
      return
    }

    const nodeChange: NodeChange = {
      id: editNode.id,
      label: editNode.label,
      x: editNode.x,
      y: editNode.y,
      color: editNode.color,
      type: editNode.type || 'circle',
      size: editNode.size,
      parentId: editNode.parentId,
      contact: editNode.contact,
      isGroup: editNode.isGroup,
      category: editNode.category,
      children: []
    }

    if (!editNode.isGroup && selectedEdge?.edgeId) {
      const changeRequest: ChangeContactFullDataRequest = {
        graphId: graphId as string,
        node: nodeChange,
        edge: {
          ...selectedEdge,
          type: edgeType,
          weight: edgeWeight,
          size: edgeWeight,
        }
      }
      await ContactFullDataService.ChangeContact(changeRequest)
    } else {
      await NodeService.ChangeNode(graphId as string, nodeChange)
    }

    setGraphVersion(graphVersion + 1)
    refresh()
  }

  const handleDeleteNode = async (deletedNode: Node) => {
    setSettingPanelState(SettingPanelState.Delete)

    // Найдем первое ребро, у которого target совпадает с nodeId
    const edgeId = graph?.edges().find(edgeId => graph.target(edgeId) === deletedNode.id);

    if (edgeId == undefined) {
      const virtualDeletedNode = vitrualGraph?.nodes.find(node => node.id == deletedNode.id)

      info("VirtDelNode")
      info(virtualDeletedNode)

      if (virtualDeletedNode?.isGroup) {
        console.log(`Удаление Группового узла. NodeId : `, deletedNode.id);
        await NodeService.DeleteNode(deletedNode.id)
        refresh()
        setGraphVersion(graphVersion + 1)
        return
      }
      console.log(`Ребро не найдено! Его ID: ${edgeId}`);
      return
    }

    const graphId = GraphService.GetGraphId();
    if (graphId == typeof (Error)) {
      info(graphId.toString())
      return
    }

    const contactDeleted: DeleteContactFullDataRequest = {
      graphId: graphId as string,
      nodeId: deletedNode.id,
      edgeId: edgeId!
    }

    info(contactDeleted)

    const resposne = await ContactFullDataService.DeleteContact(contactDeleted)
    setGraphVersion(graphVersion + 1)
    refresh()
  }

  const handleAddNode = async (nodeData: Omit<Node, "id">, edgeType: string = '', edgeWeight: number = 1) => {
    if (!graph) return;

    const graphId = GraphService.GetGraphId();
    if (graphId == typeof (Error)) {
      info(graphId.toString())
      return
    }

    // edgeSource — откуда идёт ребро (кликнутый узел)
    // nodeGroupId — к какой группе относится новый узел (для статистики и цвета)
    let edgeSource = parentNodeId;
    let nodeGroupId = parentNodeId;
    let resolvedColor = nodeData.color;

    const clickedVirtualNode = vitrualGraph?.nodes.find(n => n.id === parentNodeId);

    if (clickedVirtualNode && !clickedVirtualNode.isGroup) {
      // Добавление от контактного узла — наследуем группу и цвет от его родителя-группы
      const parentGroup = vitrualGraph?.nodes.find(n => n.id === clickedVirtualNode.parentId && n.isGroup);
      if (parentGroup) {
        nodeGroupId = parentGroup.id;
        resolvedColor = parentGroup.color;
      }
      // edgeSource остаётся = контактный узел (ребро идёт от контакта к новому контакту)
    } else if (nodeData.category && vitrualGraph) {
      // Категория переопределяет группу
      const groupNode = vitrualGraph.nodes.find(n => n.isGroup && n.label === nodeData.category);
      if (groupNode) {
        edgeSource = groupNode.id;
        nodeGroupId = groupNode.id;
        resolvedColor = groupNode.color;
      }
    }

    if (!edgeSource) {
      console.error("Не задан родительский узел");
      return;
    }

    if (!graph.hasNode(edgeSource)) {
      console.error("Source node does not exist:", edgeSource);
      return;
    }

    const nodeSize = nodeData.isGroup ? 20 : 10;

    // Для контакта label = contact.name (имя человека), для группы = nodeData.label
    const nodeLabel = nodeData.isGroup ? nodeData.label : nodeData.contact.name;

    const addContactRequest: AddContactFullDataRequest = {
      graphId: `${graphId as string}`,
      node: {
        label: nodeLabel,
        x: Math.floor(Math.random() * 7) - 3,
        y: Math.floor(Math.random() * 7) - 3,
        size: nodeSize,
        type: "circle",
        color: resolvedColor,
        contact: nodeData.contact,
        IsGroup: nodeData.isGroup,
        parentId: nodeGroupId ?? '',
        category: nodeData.category,
      },
      edge: {
        source: edgeSource,
        label: "",
        color: resolvedColor,
        size: edgeWeight,
        type: edgeType,
        weight: edgeWeight,
      }
    }

    console.log("Add Contact Request Main.tsx")
    console.log(addContactRequest)

    const response = await ContactFullDataService.AddContact(addContactRequest)
    setGraphVersion(graphVersion + 1)

    refresh()
  };

  return (
    <>
      {!isUserAdmin() ? (
        <MainWrapper>
          <Content>
            <MainArea>
              <GraphComponent
                key={graphVersion}
                onNodeClick={(nodeData) => {
                  setSettingsOpen(true)
                  setSettingPanelState(SettingPanelState.View)
                  setSelectedNode(nodeData)
                  const edge = vitrualGraph?.edges.find(e => e.target === nodeData.id) || null;
                  setSelectedEdge(edge);
                  info(nodeData)
                }}
                onAddNode={(parentNodeId: string) => {
                  setSettingPanelState(SettingPanelState.Add)
                  info(settingPanelState)
                  setParentNodeId(parentNodeId)
                  setSettingsOpen(true)
                }}
              />
            </MainArea>

            {isSettingsOpen && (
              <SettingsPanel
                node={selectedNode}
                nodeEdge={selectedEdge}
                settingPanelState={settingPanelState}
                onStateChange={setSettingPanelState}
                onAddNode={handleAddNode}
                onEditNode={handleEditNode}
                onDeleteNode={handleDeleteNode}
              />
            )}
          </Content>

          <ToggleButtonWrapper>
            <IconButton
              aria-label="Toggle settings"
              icon={isSettingsOpen ? <CloseIcon /> : <SettingsIcon />}
              onClick={toggleSettings}
              colorScheme="teal"
              size="lg"
              borderRadius="full"
              shadow="lg"
            />
          </ToggleButtonWrapper>
        </MainWrapper>
      ) : (
        <AdminUserTable/>
      )}
    </>
  );
};

export default Main;
