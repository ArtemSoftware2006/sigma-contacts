import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.100" p={4} textAlign="center">
      <Text>© {new Date().getFullYear()} My App. All rights reserved.</Text>
    </Box>
  );
};

export default Footer;