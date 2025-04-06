import { Box } from '@chakra-ui/react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = () => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" padding={"0px"}>
      <Header />
      <Box flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;