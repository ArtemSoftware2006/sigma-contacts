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
import AddNodeForm, { CATEGORY_COLORS } from '../forms/addNodeForm/AddNodeForm';

interface SettingsPanelProps {
  node: Node | null;
  settingPanelState: SettingPanelState;
  onStateChange?: (newState: SettingPanelState) => void;
  onAddNode?: (nodeData: Omit<Node, 'id'>) => void;
  onEditNode?: (editNode: Node) => void;
  onDeleteNode?: (deletedNode: Node) => void;
}

const EMPTY_NEW_NODE: Omit<Node, 'id'> = {
  label: '',
  size: 10,
  color: '#3182CE',
  type: 'default',
  parentId: '',
  x: 0,
  y: 0,
  isGroup: false,
  category: '',
  contact: newEmptyContact(),
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  node,
  settingPanelState,
  onAddNode,
  onStateChange,
  onEditNode,
  onDeleteNode
}) => {
  const [newNode, setNewNode] = useState<Omit<Node, 'id'>>(EMPTY_NEW_NODE);

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
    category: node?.category || "",
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
    category: node?.category || "",
    contact: node?.contact || newEmptyContact()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1] as keyof Contact;
      setNewNode(prev => ({
        ...prev,
        contact: { ...prev.contact, [field]: value }
      }));
    } else {
      setNewNode(prev => ({
        ...prev,
        [name]: name === 'size' ? Number(value) : value
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    const color = CATEGORY_COLORS[category] ?? newNode.color;
    setNewNode(prev => ({ ...prev, category, color }));
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
      setNewNode(EMPTY_NEW_NODE);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
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
          onCategoryChange={handleCategoryChange}
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
