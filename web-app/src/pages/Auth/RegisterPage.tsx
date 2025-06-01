import React, { useState } from 'react';
import { useAuth } from '../../hook/useAuth';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Input,
  Button,
  Heading,
  Text,
  IconButton,
  FormLabel,
  FormControl,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Stack,
  Alert,
  AlertIcon,
  ScaleFade,
  useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

const RegisterPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, error, loading } = useAuth();
  const toast = useToast();

  // Цветовая схема
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const inputBg = useColorModeValue('white', 'gray.600');
  const primaryColor = 'black';
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const minWidth = '100%';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: "The passwords you entered don't match",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    register(nickname, password);
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      px={4}
      py={8}
    >
      <Box
        p={8}
        maxW="md"
        w="full"
        borderRadius="xl"
        boxShadow="xl"
        bg={cardBg}
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <Box textAlign="center" mb={8}>
          <Heading
            as="h1"
            size="xl"
            mb={3}
            color={`${primaryColor}.500`}
            fontWeight="bold"
          >
            Создание аккаунта
          </Heading>
          <Text fontSize="md" color={mutedTextColor}>
            Присоединяйтесь к нам, чтобы начать
          </Text>
        </Box>

        {error && (
          <ScaleFade in={!!error}>
            <Alert
              status="error"
              mb={6}
              display={"flex"}
              justifyContent={"center"}
              borderRadius="md"
              variant="subtle"
            >
              <AlertIcon
                maxHeight={'32px'}
                maxWidth={'32px'}
                marginRight={'10px'}
              />
              {error}
            </Alert>
          </ScaleFade>
        )}

        <Stack spacing={6}>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!error}>
              <FormLabel
                htmlFor="nickname"
                fontSize="sm"
                color={textColor}
                fontWeight="medium"
                mb={2}
              >
                Nickname
              </FormLabel>
              <Input
                id="nickname"
                type="text"
                boxSizing='border-box'
                placeholder="blulum_123"
                padding={'0px'}
                paddingLeft={'2px'}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                minWidth={minWidth}
                bg={inputBg}
                focusBorderColor={`${primaryColor}.500`}
                size="lg"
                height="48px"
                borderRadius="lg"
                _hover={{ borderColor: `${primaryColor}.300` }}
                _placeholder={{ color: mutedTextColor }}
              />
            </FormControl>

            <FormControl mt={6} isInvalid={!!error}>
              <FormLabel
                htmlFor="password"
                fontSize="sm"
                color={textColor}
                fontWeight="medium"
                mb={2}
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  minWidth={minWidth}
                  padding={'0px'}
                  paddingLeft={'2px'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg={inputBg}
                  focusBorderColor={`${primaryColor}.500`}
                  size="lg"
                  height="48px"
                  borderRadius="lg"
                  boxSizing='border-box'
                  _hover={{ borderColor: `${primaryColor}.300` }}
                  _placeholder={{ color: mutedTextColor }}
                />
                <InputRightElement h="full" pr={2}>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    color={mutedTextColor}
                    _hover={{ color: `${primaryColor}.500`, bg: 'transparent' }}
                    onClick={() => setShowPassword(!showPassword)}
                    position={"relative"}
                    left={"-3px"}
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl mt={6} isInvalid={!!error}>
              <FormLabel
                htmlFor="confirmPassword"
                fontSize="sm"
                color={textColor}
                fontWeight="medium"
                mb={2}
              >
                Подтвердите Password
              </FormLabel>
              <InputGroup>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  minWidth={minWidth}
                  padding={'0px'}
                  paddingLeft={'2px'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg={inputBg}
                  focusBorderColor={`${primaryColor}.500`}
                  size="lg"
                  height="48px"
                  borderRadius="lg"
                  boxSizing='border-box'
                  _hover={{ borderColor: `${primaryColor}.300` }}
                  _placeholder={{ color: mutedTextColor }}
                />
                <InputRightElement h="full" pr={2}>
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    color={mutedTextColor}
                    _hover={{ color: `${primaryColor}.500`, bg: 'transparent' }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    position={"relative"}
                    left={"-3px"}
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              width="full"
              mt={8}
              colorScheme={"gray"}
              type="submit"
              size="lg"
              height="48px"
              minWidth={minWidth}
              fontSize="md"
              fontWeight="bold"
              borderRadius="lg"
              isLoading={loading}
              loadingText="Registering..."
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.2s"
            >
              Регистрация
            </Button>
          </form>

          <Box textAlign="center" pt={2}>
            <Text fontSize="sm" color={mutedTextColor}>
              Уже есть аккаунт?{' '}
              <Link to="/login">
                <Button
                  as="span"
                  variant="link"
                  color={`${primaryColor}.500`}
                  fontWeight="semibold"
                  _hover={{
                    color: `${primaryColor}.600`,
                    textDecoration: 'underline',
                  }}
                >
                  Вход
                </Button>
              </Link>
            </Text>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;