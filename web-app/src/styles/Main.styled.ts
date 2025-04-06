import styled from 'styled-components';

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const MainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #282c34;
  color: white;
  padding: 10px 20px;
`;

export const Footer = styled.footer`
  background-color: #f1f1f1;
  padding: 10px 20px;
  text-align: center;
`;

export const Content = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const MainArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
`;

export const SettingsMenu = styled.div`
  width: 300px;
  background-color: #f7f7f7;
  border-left: 1px solid #ddd;
  padding: 20px;
`;

export const Logo = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`;

export const Profile = styled.div`
  font-size: 1em;
`;

export const MenuLink = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1em;
  margin: 0 10px;

  &:hover {
    text-decoration: underline;
  }
`;