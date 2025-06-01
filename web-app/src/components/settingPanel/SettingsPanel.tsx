// components/settings/SettingsPanel.tsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
} from '@chakra-ui/react';
import { produce } from 'immer';
import { Node } from "../../types/node";
import { SettingPanelState } from '../../enums/settingPanelMode';
import { Contact, newEmptyContact } from '../../types/contact';
import EditNodeForm from '../forms/editContactForm/EditNodeForm';
import NodeDetails from '../details/nodeDetails/NodeDetails';
import AddNodeForm from '../forms/addNodeForm/AddNodeForm';

interface SettingsPanelProps {
  node: Node | null;
  settingPanelState: SettingPanelState;
  onStateChange?: (newState: SettingPanelState) => void; // Колбэк для изменения состояния
  onAddNode?: (nodeData: Omit<Node, 'id'>) => void; // Колбэк с данными нового узла
  onEditNode?: (editNode: Node) => void;
  onDeleteNode?: (deletedNode: Node) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  node,
  settingPanelState,
  onAddNode,
  onStateChange,
  onEditNode,
  onDeleteNode
}) => {
  const [newNode, setNewNode] = useState<Omit<Node, 'id'>>({
    label: '',
    size: 10,
    color: '#3182CE',
    type: 'default',
    parentId: "",
    x: 0,
    y: 0,
    isGroup: false,
    contact: newEmptyContact()
  });
  const [editNode, setEditNode] = useState<Node>({
    id: node?.id || "",
    label: node?.label || "",
    x: node?.x || 0,
    y: node?.y || 0,
    size: node?.size || 0,
    type: node?.type || "",
    color: node?.color || "#666",
    parentId: node?.parentId || "",
    isGroup: node?.isGroup || false,
    contact: node?.contact || newEmptyContact()
  });

  const [deletedNode, setDeletedNode] = useState<Node>({
    id: node?.id || "",
    label: node?.label || "",
    x: node?.x || 0,
    y: node?.y || 0,
    size: node?.size || 0,
    type: node?.type || "",
    color: node?.color || "#666",
    parentId: node?.parentId || "",
    isGroup: node?.isGroup || false,
    contact: node?.contact || newEmptyContact()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value)
    setNewNode(prev => ({
      ...prev,
      [name]: name === 'size' ? Number(value) : value
    }));
  };

  const handleInputChangeEditForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setEditNode(
      produce((draft: Node) => {
        if (name.startsWith('contact.')) {
          const field = name.split('.')[1] as keyof Contact;
          draft.contact = draft.contact || {} as Contact;
          draft.contact[field] = value;
        } else {
          const key = name as keyof Node;
          draft[key] = (key === 'size' ? Number(value) : value) as never;
        }
      })
    );
  };

  const handleAddClick = () => {
    if (onAddNode) {
      onAddNode(newNode);
      // Сброс формы после добавления
      setNewNode({
        label: '',
        size: 10,
        color: '#3182CE',
        type: 'default',
        parentId: "",
        x: 0,
        y: 0,
        isGroup: false,
        contact: newEmptyContact()
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(name, checked)
    setNewNode(prev => ({ ...prev, [name]: checked }));
  };

  const handleEditClick = () => {
    if (onEditNode) {
      onEditNode(editNode);
    }
  };

  const hendleDeleteClick = () => {
    if (onDeleteNode) {
      setDeletedNode(node!)
      onDeleteNode(deletedNode);
    }
  };

  return (
    <Box
      width="300px"
      backgroundColor="#f7f7f7"
      border="1px solid #ddd"
      padding="20px"
      display="flex"
      flexDirection="column"
      gap={4}
    >

      {settingPanelState == SettingPanelState.Add && (
        <AddNodeForm
          newNode={newNode}
          onCheckboxChange={handleCheckboxChange}
          onInputChange={handleInputChange}
          onAddClick={handleAddClick}
        />
      )}
      {settingPanelState == SettingPanelState.View && node ? (
        <NodeDetails
          node={node}
          onEditClick={(node) => setEditNode(node)}
          onDeleteClick={(node) => {
            setDeletedNode(node);
            hendleDeleteClick();
          }}
          onStateChange={onStateChange}
        />
      ) : null
      }

      {settingPanelState == SettingPanelState.Edit && node ? (
        <>
          <EditNodeForm
            editNode={editNode}
            onChange={handleInputChangeEditForm}
            onSave={handleEditClick}
            onCancel={() => {
              if (onStateChange) {
                onStateChange(SettingPanelState.View);
              }
            }}
          />
        </>
      ) : null
      }

    </Box>
  );
};

export default SettingsPanel;