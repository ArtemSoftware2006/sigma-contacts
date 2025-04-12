// components/settings/SettingsPanel.tsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack
} from '@chakra-ui/react';
import { Node } from "../../types/node";
import { SettingPanelState } from '../../enums/settingPanelMode';

interface SettingsPanelProps {
  title: string;
  node: Node | null;
  settingPanelState: SettingPanelState;
  onStateChange?: (newState: SettingPanelState) => void; // Колбэк для изменения состояния
  onAddNode?: (nodeData: Omit<Node, 'id'>) => void; // Колбэк с данными нового узла
  onEditNode?: (editNode: Node) => void; 
  onDeleteNode?: (deletedNode: Node) => void; 
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
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
    parentId : "",
    x: 0,
    y: 0
  });
  const [editNode, setEditNode] = useState<Node>({
    id: node?.id || "",
    label: node?.label || "",
    x: node?.x || 0,
    y: node?.y || 0,
    size: node?.size || 0,
    type: node?.type || "",
    color: node?.color || "#666",
    parentId : node?.parentId || ""
  });

  const [deletedNode, setDeletedNode] = useState<Node>({
    id: node?.id || "",
    label: node?.label || "",
    x: node?.x || 0,
    y: node?.y || 0,
    size: node?.size || 0,
    type: node?.type || "",
    color: node?.color || "#666",
    parentId : node?.parentId || ""
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewNode(prev => ({
      ...prev,
      [name]: name === 'size' ? Number(value) : value
    }));
  };

  const handleInputChangeEditForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditNode(prev => ({
      ...prev,
      [name]: name === 'size' ? Number(value) : value
    }));
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
        parentId : "",
        x: 0,
        y: 0
      });
    }
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
      <Heading as="h2" size="md" mb={4}>
        {title}
      </Heading>

      {settingPanelState == SettingPanelState.Add && (
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Название узла</FormLabel>
            <Input
              name="label"
              value={newNode.label}
              onChange={handleInputChange}
              placeholder="Введите название"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Размер</FormLabel>
            <Input
              type="number"
              name="size"
              value={newNode.size}
              onChange={handleInputChange}
              min="1"
              max="50"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Цвет</FormLabel>
            <Input
              type="color"
              name="color"
              value={newNode.color}
              onChange={handleInputChange}
              width="100%"
              p={0}
              border="none"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Тип узла</FormLabel>
            <Select
              name="type"
              value={newNode.type}
              onChange={handleInputChange}
            >
              <option value="default">По умолчанию</option>
              <option value="important">Важный</option>
              <option value="group">Группа</option>
            </Select>
          </FormControl>

          <Button
            colorScheme="blue"
            mt={4}
            onClick={handleAddClick}
            isDisabled={!newNode.label.trim()}
          >
            Добавить узел
          </Button>
        </Stack>
      )}
      {settingPanelState == SettingPanelState.View && node ? (
        <>
          <Text><strong>Id:</strong> {node.id}</Text>
          <Text><strong>Название узла:</strong> {node.label}</Text>
          <Text><strong>Размер:</strong> {node.size}</Text>
          <Text><strong>Цвет:</strong> {node.color}</Text>
          <Text><strong>Тип узла:</strong> {node.type}</Text>
          <Button
            colorScheme="blue"
            mt={4}
            onClick={() => {
              if (onStateChange) {
                setEditNode(node!)
                onStateChange(SettingPanelState.Edit);
              }
            }}
          >
            Редактировать
          </Button>
          <Button
            colorScheme="blue"
            mt={4}
            onClick={hendleDeleteClick}
          >
            Удалить
          </Button>
        </>
      ) : null
      }

      {settingPanelState == SettingPanelState.Edit && node ? (
        <>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Название узла</FormLabel>
              <Input
                name="label"
                value={editNode?.label}
                onChange={handleInputChangeEditForm}
                placeholder="Введите название"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Размер</FormLabel>
              <Input
                type="number"
                name="size"
                value={editNode?.size}
                onChange={handleInputChangeEditForm}
                min="1"
                max="50"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Цвет</FormLabel>
              <Input
                type="color"
                name="color"
                value={editNode?.color}
                onChange={handleInputChangeEditForm}
                width="100%"
                p={0}
                border="none"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Тип узла</FormLabel>
              <Select
                name="type"
                value={editNode?.type}
                onChange={handleInputChangeEditForm}
              >
                <option value="default">По умолчанию</option>
                <option value="important">Важный</option>
                <option value="group">Группа</option>
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              mt={4}
              onClick={handleEditClick}
            >
              Изменить
            </Button>
            <Button
              colorScheme="blue"
              mt={4}
              onClick={() => {
                if (onStateChange) {
                  onStateChange(SettingPanelState.View);
                }
              }}
            >
              Назад
            </Button>
          </Stack>
        </>
      ) : null
      }

    </Box>
  );
};

export default SettingsPanel;