import React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack
} from '@chakra-ui/react';
import { Node } from '../../../types/node';

interface AddNodeFormProps {
  newNode: Omit<Node, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

const AddNodeForm: React.FC<AddNodeFormProps> = ({
  newNode,
  onInputChange,
  onCheckboxChange,
  onAddClick
}) => {
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
          colorScheme="blue"        // отвечает за цвет галочки и рамки
          size="md"
        >
          Это группа
        </Checkbox>
      </FormControl>

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
        isDisabled={!newNode.label.trim()}
      >
        Добавить узел
      </Button>
    </Stack>
  );
};

export default AddNodeForm;
