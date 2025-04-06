import { Box, Heading, Flex, Spacer, Button, flexbox } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { MainWrapper, MainHeader, Logo, MenuLink, Content, Profile, SettingsMenu, Footer, MainArea } from '../../styles/Main.styled';
import { Link as ChakraLink } from '@chakra-ui/react';


const Header = () => {
  return (
    <Box bg="teal.500" color="white" display="flex" flexDirection={"column"}>
      <MainHeader>
        <Logo>MyApp</Logo>
        <nav>
          <ChakraLink
            as={RouterLink}
            to="/"
            _hover={{ textDecoration: 'none' }}
            color={"white"}
          >
            Home
          </ChakraLink>
        </nav>
        <Profile>
          <ChakraLink
            as={RouterLink}
            to="/profile"
            _hover={{ textDecoration: 'none' }}
            color={"white"}
          >
            Profile
          </ChakraLink>
        </Profile>
      </MainHeader>
    </Box>
  );
};

export default Header;