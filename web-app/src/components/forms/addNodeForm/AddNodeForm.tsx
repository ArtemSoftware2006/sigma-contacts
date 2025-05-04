// components/forms/addNodeForm/AddNodeForm.tsx
import React from 'react';
import { Button, FormControl, FormLabel, Heading, Input, Select, Stack } from '@chakra-ui/react';
import { Node } from '../../../types/node';

interface AddNodeFormProps {
  newNode: Omit<Node, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddClick: () => void;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({ newNode, onInputChange, onAddClick }) => {
  return (
    <Stack spacing={4}>
      <Heading size="sm" mt={4}>Добавление контакта</Heading>
      
      <FormControl>
        <FormLabel>Название узла</FormLabel>
        <Input
          name="label"
          value={newNode.label}
          onChange={onInputChange}
          placeholder="Введите название"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Размер</FormLabel>
        <Input
          type="number"
          name="size"
          value={newNode.size}
          onChange={onInputChange}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
        >
          <option value="default">По умолчанию</option>
          <option value="important">Важный</option>
          <option value="group">Группа</option>
        </Select>
      </FormControl>

      <Button
        colorScheme="blue"
        mt={4}
        onClick={onAddClick}
        isDisabled={!newNode.label.trim()}
      >
        Добавить узел
      </Button>
    </Stack>
  );
};

export default AddNodeForm;
