import { useState } from 'react';
import {
  Box,
  Avatar,
  Text,
  Button,
  Heading,
  useToast,
  VStack,
  Stack,
} from '@chakra-ui/react';
import { useAuth } from '../../hook/useAuth';
import { StatsCard } from '../../components/statsCard/statsCard';
import { Profile } from '../../types/profile';
import { ProfileForm } from '../../components/forms/profileForm/profileForm';
import { ProfileHeader } from '../../components/profileHeader/profileHeader';

// Компонент действий профиля
const ProfileActions = ({
  onEdit,
  onLogout
}: {
  onEdit: () => void;
  onLogout: () => void;
}) => (
  <Stack direction="column" spacing={4} width="200px">
    <Button colorScheme="blue" onClick={onEdit}>
      Редактировать профиль
    </Button>
    <Button variant="outline" onClick={onLogout}>
      Выйти
    </Button>
  </Stack>
);

// Основной компонент профиля
const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({
    firstName: 'Иван',
    lastName: 'Иванов',
    avatarUrl: 'https://bit.ly/dan-abramov'
  });

  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Профиль обновлен',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <Box p={6} maxW="md" mx="auto" mt={10} display={"flex"} flexDirection={"row"}>
      <Stack minWidth={"50vh"} alignItems={"center"}>
        <ProfileHeader {...profile} />
        <ProfileActions
          onEdit={() => setIsEditing(true)}
          onLogout={logout}
        />
      </Stack>

      <VStack spacing={6} align="center" borderLeft="1px solid black">
        {isEditing ? (
          <ProfileForm
            profile={profile}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Stack direction={"column"} alignItems={"center"} justifyContent={"center"}>
            <StatsCard />
          </Stack>
        )}
      </VStack>
    </Box>
  );
};

export default ProfilePage;