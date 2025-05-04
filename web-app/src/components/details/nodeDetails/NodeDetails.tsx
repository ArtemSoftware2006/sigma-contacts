import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Node } from "../../../types/node";
import { SettingPanelState } from '../../../enums/settingPanelMode';

interface NodeDetailsProps {
  node: Node;
  onEditClick: (node: Node) => void;
  onDeleteClick: (node: Node) => void;
  onStateChange?: (newState: SettingPanelState) => void;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({
  node,
  onEditClick,
  onDeleteClick,
  onStateChange
}) => {
  return (
    <>
      {/* <Box>
        <Text><strong>Id:</strong> {node.id}</Text>
        <Text><strong>Название узла:</strong> {node.label}</Text>
        <Text><strong>Размер:</strong> {node.size}</Text>
        <Text><strong>Цвет:</strong> {node.color}</Text>
        <Text><strong>Тип узла:</strong> {node.type}</Text>
      </Box> */}

      {node.contact ? (
        <Box>
          <Heading size="sm" mt={4}>Контакт</Heading>
          <Text><strong>Id:</strong> {node.contact.contactId}</Text>
          <Text><strong>Имя:</strong> {node.contact.name}</Text>
          <Text><strong>Фамилия:</strong> {node.contact.surname}</Text>
          <Text><strong>Телефон:</strong> {node.contact.phone}</Text>
          <Text><strong>Telegram ID:</strong> {node.contact.telegramId}</Text>
        </Box>
      ) : (
        <Heading size="sm" mt={4}>Добавьте Контакт</Heading>
      )}

      <Button
        colorScheme="blue"
        mt={4}
        onClick={() => {
          if (onStateChange) {
            onEditClick(node);
            onStateChange(SettingPanelState.Edit);
          }
        }}
      >
        Редактировать
      </Button>

      <Button
        colorScheme="red"
        mt={4}
        onClick={() => onDeleteClick(node)}
      >
        Удалить
      </Button>
    </>
  );
};

export default NodeDetails;
