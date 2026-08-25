import React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Node } from '../../../types/node';
import { EDGE_TYPES } from '../../../types/edge';

export const CATEGORY_COLORS: Record<string, string> = {
  'Коллеги':      '#4A90D9',
  'Родственники': '#E74C3C',
  'Школа':        '#2ECC71',
  'Соседи':       '#F39C12',
  'Университет':  '#9B59B6',
  'Знакомые':     '#1ABC9C',
  'Искусство':    '#E91E63',
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);

interface AddNodeFormProps {
  newNode: Omit<Node, 'id'>;
  edgeType: string;
  edgeWeight: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: string) => void;
  onEdgeTypeChange: (v: string) => void;
  onEdgeWeightChange: (v: number) => void;
  onAddClick: () => void;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({
  newNode,
  edgeType,
  edgeWeight,
  onInputChange,
  onCheckboxChange,
  onCategoryChange,
  onEdgeTypeChange,
  onEdgeWeightChange,
  onAddClick
}) => {
  // Для контактного узла кнопка активна когда заполнено Имя
  // Для группы — когда заполнено Название
  const isAddDisabled = newNode.isGroup
    ? !newNode.label.trim()
    : !newNode.contact.name.trim();

  return (
    <Stack spacing={4}>
      <Heading size="sm" mt={4}>
        {newNode.isGroup ? 'Добавление группы' : 'Добавление контакта'}
      </Heading>

      <FormControl>
        <Checkbox
          name="isGroup"
          isChecked={newNode.isGroup}
          onChange={onCheckboxChange}
          colorScheme="blue"
          size="md"
        >
          Это группа
        </Checkbox>
      </FormControl>

      {/* Поля для группы */}
      {newNode.isGroup && (
        <FormControl>
          <FormLabel>Название группы</FormLabel>
          <Input
            name="label"
            value={newNode.label}
            onChange={onInputChange}
            placeholder="Введите название группы"
          />
        </FormControl>
      )}

      {/* Поля для контакта */}
      {!newNode.isGroup && (
        <>
          <FormControl>
            <FormLabel>Категория</FormLabel>
            <Select
              name="category"
              value={newNode.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="Выберите категорию"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Имя</FormLabel>
            <Input
              name="contact.name"
              value={newNode.contact.name}
              onChange={onInputChange}
              placeholder="Введите имя"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Фамилия</FormLabel>
            <Input
              name="contact.surname"
              value={newNode.contact.surname}
              onChange={onInputChange}
              placeholder="Введите фамилию"
            />
          </FormControl>

          <Heading size="xs" mt={2} color="gray.500">Связь</Heading>

          <FormControl>
            <FormLabel>Тип связи</FormLabel>
            <Select
              value={edgeType}
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
              value={edgeWeight}
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

      <FormControl>
        <FormLabel>Цвет</FormLabel>
        <Input
          type="color"
          name="color"
          value={newNode.color}
          onChange={onInputChange}
          width="100%"
          p={0}
          border="none"
        />
      </FormControl>

      <Button
        colorScheme="blue"
        mt={4}
        onClick={onAddClick}
        isDisabled={isAddDisabled}
      >
        Добавить узел
      </Button>
    </Stack>
  );
};

export default AddNodeForm;
