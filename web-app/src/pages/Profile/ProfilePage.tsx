import { useState } from 'react';
import {
  Box,
  Avatar,
  Text,
  Input,
  Button,
  Flex,
  Heading,
  useToast,
  FormControl,
  FormLabel,
  VStack,
  Stack
} from '@chakra-ui/react';
import { useAuth } from '../../hook/useAuth';

type Profile = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

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
      isClosable: true,
    });
  };

  return (
    <Box p={6} maxW="md" mx="auto" mt={10}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Мой профиль
      </Heading>
      
      <VStack spacing={6} align="center">
        <Avatar
          size="2xl"
          name={`${profile.firstName} ${profile.lastName}`}
          src={profile.avatarUrl}
          mb={4}
        />
        
        {isEditing ? (
          <Box w="100%">
            <VStack spacing={4} align="center">
              <FormControl>
                <FormLabel>Имя</FormLabel>
                <Input
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Фамилия</FormLabel>
                <Input
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <Stack direction="column" spacing={4} mt={4}>
                <Button 
                  colorScheme="blue" 
                  onClick={handleSave}
                >
                  Сохранить
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Отмена
                </Button>
              </Stack>
            </VStack>
          </Box>
        ) : (
          <VStack spacing={6} align="center">
            <Text fontSize="2xl" fontWeight="bold">
              {profile.firstName} {profile.lastName}
            </Text>
            
            <Stack direction="column" spacing={4} w="100%">
              <Button
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
              >
                Редактировать профиль
              </Button>
              <Button
                variant="outline"
                onClick={() => logout()}
              >
                Выйти
              </Button>
            </Stack>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default ProfilePage;