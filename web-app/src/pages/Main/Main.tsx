import React, { FC } from 'react';
import { MainWrapper, Header, Logo, MenuLink, Content, Profile, SettingsMenu, Footer, MainArea } from './Main.styled';
import GraphComponent from '../../components/graph/Graph';
interface MainProps {}

const Main: FC<MainProps> = () => (
  <MainWrapper>
    <Header>
      <Logo>MyApp</Logo>
      <nav>
        <MenuLink href="#home">Home</MenuLink>
      </nav>
      <Profile>Profile</Profile>
    </Header>

    <Content>
      <MainArea>
        <GraphComponent></GraphComponent>
      </MainArea>
      <SettingsMenu>
        <h2>Settings</h2>
        <p>Manage your settings here.</p>
      </SettingsMenu>
    </Content>

    <Footer>
      &copy; {new Date().getFullYear()} MyApp. All rights reserved.
    </Footer>
  </MainWrapper>
);

export default Main;
