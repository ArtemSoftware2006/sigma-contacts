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

interface EditNodeFormProps {
  editNode: Node;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditNodeForm: React.FC<EditNodeFormProps> = ({ editNode, onChange, onSave, onCancel }) => {
  return (
    <Stack spacing={4}>
      {/* <Heading size="md">Редактирование узла</Heading> */}

      <FormControl>
        <FormLabel>Название узла</FormLabel>
        <Input
          name="label"
          value={editNode.label}
          onChange={onChange}
          placeholder="Введите название"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Размер</FormLabel>
        <Input
          type="number"
          name="size"
          value={editNode.size}
          onChange={onChange}
          min="1"
          max="50"
        />
      </FormControl>

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

      <FormControl>
        <FormLabel>Тип узла</FormLabel>
        <Select
          name="type"
          value={editNode.type}
          onChange={onChange}
        >
          <option value="default">По умолчанию</option>
          <option value="important">Важный</option>
          <option value="group">Группа</option>
        </Select>
      </FormControl>

      {/* Добавление формы контакта */}
      <Heading size="md" mt={6}>Редактирование контакта</Heading>

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
        <FormLabel>Имя</FormLabel>
        <Input
          name="contact.name"
          value={editNode.contact?.name || ''}
          onChange={onChange}
          placeholder="Введите имя"
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
        <FormLabel>WhatsApp Телефон</FormLabel>
        <Input
          name="contact.whatsAppPhone"
          value={editNode.contact?.whatsAppPhone || ''}
          onChange={onChange}
          placeholder="Введите телефон для WhatsApp"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Github</FormLabel>
        <Input
          name="contact.github"
          value={editNode.contact?.github || ''}
          onChange={onChange}
          placeholder="Введите ссылку на Github"
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

      {/* Кнопки сохранения / отмены */}
      <Button colorScheme="blue" mt={14} onClick={onSave}>
        Сохранить изменения
      </Button>
      <Button colorScheme="gray" mt={2} onClick={onCancel}>
        Назад
      </Button>
    </Stack>
  );
};

export default EditNodeForm;
