import React from 'react';
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Heading
} from '@chakra-ui/react';
import { Node } from "../../../types/node";
import { CATEGORIES } from '../addNodeForm/AddNodeForm';

interface EditNodeFormProps {
  editNode: Node;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditNodeForm: React.FC<EditNodeFormProps> = ({ editNode, onChange, onSave, onCancel }) => {
  return (
    <Stack spacing={1}>
      <Heading size="md">Редактирование узла</Heading>
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

      <Heading size="md" mt={6}>Редактирование контакта</Heading>

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
              <option key={cat} value={cat}>
                {cat}
              </option>
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

      <Button colorScheme="blue" mt={2} onClick={onSave}>
        Сохранить изменения
      </Button>
      <Button colorScheme="gray" mt={2} onClick={onCancel}>
        Назад
      </Button>
    </Stack>
  );
};

export default EditNodeForm;
