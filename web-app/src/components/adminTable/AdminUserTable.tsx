import React, { useEffect, useState } from 'react';
import { AdminService } from '../../service/adminService';
import {
  Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, Alert, AlertIcon, Box, Heading
} from '@chakra-ui/react';
import { UserAdminInfo } from '../../types/user';

const AdminUserTable: React.FC = () => {
  const [users, setUsers] = useState<UserAdminInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await AdminService.GetAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleBlock = (nickname: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.nickname === nickname ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box mt={4} ml={6}>
      <Heading size="md" mb={4}>Управление пользователями</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Никнейм</Th>
            <Th>Имя</Th>
            <Th>Фамилия</Th>
            <Th>Роль</Th>
            <Th>Действие</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.nickname}>
              <Td>{user.nickname}</Td>
              <Td>{user.name || '—'}</Td>
              <Td>{user.surname || '—'}</Td>
              <Td>{user.role}</Td>
              <Td>
                {user.role === 'user' && (
                  <Button
                    size="sm"
                    colorScheme={user.isBlocked ? 'green' : 'red'}
                    onClick={() => toggleBlock(user.nickname)}
                  >
                    {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminUserTable;
