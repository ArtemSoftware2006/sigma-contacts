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
import { useGraphStore } from '../../hook/useGraphStore';
import { GraphService } from '../../service/graphService';
import { AddContactRequest, DeleteContactRequest } from '../../types/contact';
import { info } from '../../utils/logger'
import { SettingPanelState } from '../../enums/settingPanelMode';
import { NodeService } from '../../service/nodeService';
import { ContactService } from '../../service/contactService';

const Main: FC = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [settingPanelState, setSettingPanelState] = useState(SettingPanelState.View);
  const [parentNodeId, setParentNodeId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { graph, loading, error, refresh, setGraph } = useGraphStore();
  const [graphVersion, setGraphVersion] = useState(0);

  const settingNodeText = "Настройка узла"
  const addNodeText = "Добавление узла"
  const [titleSettingsPanel, setTitleSettingsPanel] = useState(settingNodeText);

  const toggleSettings = () => setSettingsOpen(!isSettingsOpen);

  const handleEditNode = async (editNode: Node) => {
    setSettingPanelState(SettingPanelState.Edit)

    const nodeChange: NodeChange = {
      id: editNode.id,
      label: editNode.label,
      x: editNode.x,
      y: editNode.y,
      color: editNode.color,
      type: editNode.type || 'circle',
      size: editNode.size,
      parentId: editNode.parentId,
      isSpecial: false,
      children: []
    }

    const resposne = await NodeService.ChangeNode(process.env.REACT_APP_GRAPH, nodeChange)
    setGraphVersion(graphVersion + 1)

    info(resposne)

    refresh()
  }

  const handleDeleteNode = async (deletedNode: Node) => {
    setSettingPanelState(SettingPanelState.Delete)

    // Найдем первое ребро, у которого target совпадает с nodeId
    const edgeId = graph?.edges().find(edgeId => graph.target(edgeId) === deletedNode.id);

    info("EDGES")
    graph?.edges().forEach(edge => {
      info(edge)
    })

    if (edgeId == undefined) {
      console.log(`Ребро не найдено! Его ID: ${edgeId}`);
      return
    } 

    const contactDeleted : DeleteContactRequest = {
      graphId: process.env.REACT_APP_GRAPH,
      nodeId: deletedNode.id,
      edgeId: edgeId!
    }

    info(contactDeleted)

    const resposne = await ContactService.DeleteContact(contactDeleted)
    setGraphVersion(graphVersion + 1)

    info(resposne)

    refresh()
  }

  const handleAddNode = async (nodeData: Omit<Node, "id">) => {
    if (!graph || !parentNodeId) return;

    const newGraph = graph.copy();

    // Проверка существования родительского узла
    if (!newGraph.hasNode(parentNodeId)) {
      console.error("Parent node does not exist:", parentNodeId);
      return;
    }

    const addContactRequest: AddContactRequest = {
      node: {
        graphId: `${process.env.REACT_APP_GRAPH}`,
        node: {
          label: nodeData.label,
          x: Math.floor(Math.random() * 7) - 3,
          y: Math.floor(Math.random() * 7) - 3,
          size: nodeData.size,
          type: "circle",
          color: nodeData.color,
          isSpecial: false,
          parentId: parentNodeId
        }
      },
      edge: {
        graphId: `${process.env.REACT_APP_GRAPH}`,
        edge: {
          source: parentNodeId,
          label: "TEST",
          color: nodeData.color,
          size: 1,
        }
      }
    }

    const response = await ContactService.AddContact(addContactRequest)
    setGraphVersion(graphVersion + 1)

    refresh()
  };

  return (
    <MainWrapper>
      <Content>
        <MainArea>
          <GraphComponent
            key={graphVersion}
            onNodeClick={(nodeData) => {
              setSettingsOpen(true)
              setSettingPanelState(SettingPanelState.View)
              info(settingPanelState)
              setTitleSettingsPanel(settingNodeText)
              setSelectedNode(nodeData)
              info(nodeData)
            }}
            onAddNode={(parentNodeId: string) => {
              setSettingPanelState(SettingPanelState.Add)
              info(settingPanelState)
              setParentNodeId(parentNodeId)
              setSettingsOpen(true)
              setTitleSettingsPanel(addNodeText)
            }}
          />
        </MainArea>

        {isSettingsOpen && (
          <SettingsPanel
            title={titleSettingsPanel}
            node={selectedNode}
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
  );
};

export default Main;
