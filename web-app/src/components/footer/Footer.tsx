import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.100" p={2} textAlign="center">
      <Text>© {new Date().getFullYear()} Социальные графы. Все права защищены.</Text>
    </Box>
  );
};

export default Footer;