import React, { FC } from 'react';
import { MainWrapper, Header, Logo, MenuLink, Content, Profile, SettingsMenu, Footer, MainArea } from './Main.styled';
import GraphComponent from '../../components/graph/Graph';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

interface MainProps {}

const Main: FC<MainProps> = () => (
  <MainWrapper>
    <Content>
      <MainArea>
        <GraphComponent></GraphComponent>
      </MainArea>
      <SettingsMenu>
        <h2>Settings</h2>
        <p>Manage your settings here.</p>
      </SettingsMenu>
    </Content>
  </MainWrapper>
);

export default Main;
