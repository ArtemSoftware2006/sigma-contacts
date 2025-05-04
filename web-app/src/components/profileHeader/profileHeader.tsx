import { Avatar, Box, Heading, Text } from "@chakra-ui/react";
import { Profile } from "../../types/profile";

// Компонент заголовка профиля
export const ProfileHeader = ({ firstName, lastName, avatarUrl }: Profile) => {
  return <Box>
    <Heading as="h1" size="xl" mb={6} textAlign="center">
      Мой профиль
    </Heading>
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Avatar
        maxWidth="256px"
        borderRadius={"10px"}
        name={`${firstName} ${lastName}`}
        src={avatarUrl}
        mb={4}
      />
      <Text fontSize="2xl" fontWeight="bold">
        {firstName} {lastName}
      </Text>
    </Box>
  </Box>
};