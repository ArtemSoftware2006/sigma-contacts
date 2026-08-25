import { useState } from 'react';
import {
  Box,
  Button,
  useToast,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../../hook/useAuth';
import { Profile } from '../../types/profile';
import { ProfileForm } from '../../components/forms/profileForm/profileForm';
import { ProfileHeader } from '../../components/profileHeader/profileHeader';
import { info } from '../../utils/logger';
import { UserService } from '../../service/userService';
import { ApiErrorResponse } from '../../types/response';
import { UserUpdate } from '../../types/user';
import AnalyticsPanel from '../../components/analyticsPanel/AnalyticsPanel';

const ProfileActions = ({
  onEdit,
  onLogout
}: {
  onEdit: () => void;
  onLogout: () => void;
}) => (
  <Stack direction="column" spacing={3} width="180px">
    <Button colorScheme="blue" size="sm" onClick={onEdit}>
      Редактировать профиль
    </Button>
    <Button variant="outline" size="sm" onClick={onLogout}>
      Выйти
    </Button>
  </Stack>
);

const ProfilePage = () => {
  const user: UserUpdate = JSON.parse(localStorage.getItem('user') || '{}');

  const [profile, setProfile] = useState<Profile>({
    firstName: user.name,
    lastName: user.surname,
    avatarUrl: 'https://bit.ly/dan-abramov'
  });

  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await UserService.update({
        name: profile.firstName,
        surname: profile.lastName,
      });
      info(response);
      user.name = profile.firstName;
      user.surname = profile.lastName;
      localStorage.setItem('user', JSON.stringify(user));
      setIsEditing(false);
      toast({ title: 'Профиль обновлён', status: 'success', duration: 2000 });
    } catch (error) {
      const axiosError = error as ApiErrorResponse;
      console.error(axiosError.message);
    }
  };

  return (
    <Flex height="calc(100vh - 80px)" overflow="hidden">
      {/* ── Sidebar ── */}
      <Box
        width="240px"
        flexShrink={0}
        borderRight="1px solid"
        borderColor="gray.200"
        bg="white"
        p={6}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={6}
      >
        <ProfileHeader {...profile} />
        {isEditing ? (
          <ProfileForm
            profile={profile}
            onInputChange={handleInputChange}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileActions
            onEdit={() => setIsEditing(true)}
            onLogout={logout}
          />
        )}
      </Box>

      {/* ── Analytics ── */}
      <Box flex="1" overflowY="auto">
        <AnalyticsPanel />
      </Box>
    </Flex>
  );
};

export default ProfilePage;
