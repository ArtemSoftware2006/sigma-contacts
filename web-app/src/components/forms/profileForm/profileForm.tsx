import { Box, Button, FormControl, FormLabel, Input, Stack, VStack } from "@chakra-ui/react";
import { Profile } from "../../../types/profile";

// Компонент формы редактирования
export const ProfileForm = ({
  profile,
  onInputChange,
  onSave,
  onCancel
}: {
  profile: Profile;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}) => (
  <Box w="100%">
    <VStack spacing={4} align="center">
      <FormControl>
        <FormLabel>Имя</FormLabel>
        <Input
          name="firstName"
          value={profile.firstName}
          onChange={onInputChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Фамилия</FormLabel>
        <Input
          name="lastName"
          value={profile.lastName}
          onChange={onInputChange}
        />
      </FormControl>

      <Stack direction="column" spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={onSave}>
          Сохранить
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </Stack>
    </VStack>
  </Box>
);
