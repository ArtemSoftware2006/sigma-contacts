import styled from 'styled-components';

export const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  position: relative; /* для позиционирования кнопки */
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

export const ToggleButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
`;
