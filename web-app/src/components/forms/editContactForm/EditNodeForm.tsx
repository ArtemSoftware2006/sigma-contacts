import React from 'react';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Node } from "../../../types/node";
import { CATEGORIES } from '../addNodeForm/AddNodeForm';
import { EDGE_TYPES } from '../../../types/edge';

interface EditNodeFormProps {
  editNode: Node;
  editEdgeType: string;
  editEdgeWeight: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEdgeTypeChange: (v: string) => void;
  onEdgeWeightChange: (v: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditNodeForm: React.FC<EditNodeFormProps> = ({
  editNode,
  editEdgeType,
  editEdgeWeight,
  onChange,
  onEdgeTypeChange,
  onEdgeWeightChange,
  onSave,
  onCancel,
}) => {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Heading size="md" mb={3}>Редактирование узла</Heading>

      <Box overflowY="auto" flex="1" pr={1}>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Цвет</FormLabel>
            <Input
              type="color"
              name="color"
              value={editNode.color}
              onChange={onChange}
              width="100%"
              p={0}
              border="none"
            />
          </FormControl>

          <Heading size="sm" color="gray.600" mt={2}>Контакт</Heading>

          {!editNode.isGroup && (
            <FormControl>
              <FormLabel>Категория</FormLabel>
              <Select
                name="category"
                value={editNode.category || ''}
                onChange={onChange}
                placeholder="Выберите категорию"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Имя</FormLabel>
            <Input
              name={editNode.isGroup ? 'label' : 'contact.name'}
              value={editNode.isGroup ? (editNode.label || '') : (editNode.contact?.name || '')}
              onChange={onChange}
              placeholder="Введите имя"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Фамилия</FormLabel>
            <Input
              name="contact.surname"
              value={editNode.contact?.surname || ''}
              onChange={onChange}
              placeholder="Введите фамилию"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Телефон</FormLabel>
            <Input
              name="contact.phone"
              value={editNode.contact?.phone || ''}
              onChange={onChange}
              placeholder="Введите номер телефона"
            />
          </FormControl>

          <FormControl>
            <FormLabel>VK ID</FormLabel>
            <Input
              name="contact.vkId"
              value={editNode.contact?.vkId || ''}
              onChange={onChange}
              placeholder="Введите VK ID"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Telegram ID</FormLabel>
            <Input
              name="contact.telegramId"
              value={editNode.contact?.telegramId || ''}
              onChange={onChange}
              placeholder="Введите Telegram ID"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Комментарий</FormLabel>
            <Input
              name="contact.comment"
              value={editNode.contact?.comment || ''}
              onChange={onChange}
              placeholder="Введите комментарий"
            />
          </FormControl>

          {!editNode.isGroup && (
            <>
              <Heading size="sm" color="gray.600" mt={2}>Связь</Heading>

              <FormControl>
                <FormLabel>Тип связи</FormLabel>
                <Select
                  value={editEdgeType}
                  onChange={(e) => onEdgeTypeChange(e.target.value)}
                  placeholder="Выберите тип"
                >
                  {EDGE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Сила связи (1–5)</FormLabel>
                <NumberInput
                  min={1}
                  max={5}
                  value={editEdgeWeight}
                  onChange={(_, v) => onEdgeWeightChange(isNaN(v) ? 1 : v)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </>
          )}
        </Stack>
      </Box>

      <Box pt={3} borderTop="1px solid" borderColor="gray.200" mt={3}>
        <Button colorScheme="blue" width="100%" mb={2} onClick={onSave}>
          Сохранить изменения
        </Button>
        <Button colorScheme="gray" width="100%" onClick={onCancel}>
          Назад
        </Button>
      </Box>
    </Box>
  );
};

export default EditNodeForm;
