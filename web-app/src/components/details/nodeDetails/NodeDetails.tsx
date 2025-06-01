import React from 'react';
import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react';
import { Node } from "../../../types/node";
import { SettingPanelState } from '../../../enums/settingPanelMode';
import { useGraphStore } from '../../../hook/useGraphStore';

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

  const { graph, vitrualGraph ,loading, error, refresh, setGraph } = useGraphStore();

  const isGroupNode = () : Node | undefined => {
    return vitrualGraph?.nodes.find(virtualNode => virtualNode.id == node.id && virtualNode.isGroup)
  }

  return (
    <>

      {!isGroupNode() ? (
        <Box>
          <Heading size="sm" mt={4} mb={5}>Контакт</Heading>
          <Stack>
            <Text><strong>Имя:</strong> {node.contact.name}</Text>
            <Text><strong>Фамилия:</strong> {node.contact.surname}</Text>
            <Text><strong>Телефон:</strong> {node.contact.phone}</Text>
            <Text><strong>Telegram:</strong> {node.contact.telegramId}</Text>
            <Text><strong>VK:</strong> {node.contact.vkId}</Text>
          </Stack>
        </Box>
      ) : (
        <Box>
          <Heading size="sm" mt={4} mb={5}>Узел группа</Heading>
          <Stack>
            <Text><strong>Имя группы:</strong> {node.label}</Text>
          </Stack>
        </Box>
      )}

      <Button
        colorScheme="blue"
        mt={2}
        onClick={() => {
          if (onStateChange) {
            onEditClick(node);
            onStateChange(SettingPanelState.Edit);
          }
        }}
      >
        Редактировать
      </Button>

      { !node.isGroup ? (
        <Button
          colorScheme="red"
          mt={2}
          onClick={() => onDeleteClick(node)}
        >
          Удалить
        </Button>
        ) : <></>
      }
    </>
  );
};

export default NodeDetails;
