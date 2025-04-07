import React, { FC, useState } from 'react';
import {
  MainWrapper,
  Content,
  MainArea,
  SettingsMenu,
  ToggleButtonWrapper,
} from './Main.styled';
import GraphComponent from '../../components/graph/Graph';
import { IconButton } from '@chakra-ui/react';
import { SettingsIcon, CloseIcon } from '@chakra-ui/icons';
import SettingsPanel from '../../components/settingPanel/SettingsPanel';

const Main: FC = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<{ name: string; size: number } | null>(null);

  const toggleSettings = () => setSettingsOpen(!isSettingsOpen);

  return (
    <MainWrapper>
      <Content>
        <MainArea>
          <GraphComponent 
            onNodeClick={(nodeData) => {
              setSettingsOpen(true)
              setSelectedNode({
                name: nodeData.label,
                size: nodeData.size                
              })
            }} 
          />
        </MainArea>

        {isSettingsOpen && (
          <SettingsPanel
            title='Настройки узла'
            name={selectedNode?.name}
            size={selectedNode?.size}
          />
        )}
      </Content>

      <ToggleButtonWrapper>
        <IconButton
          aria-label="Toggle settings"
          icon={isSettingsOpen ? <CloseIcon /> : <SettingsIcon />}
          onClick={toggleSettings}
          colorScheme="teal"
          size="lg"
          borderRadius="full"
          shadow="lg"
        />
      </ToggleButtonWrapper>
    </MainWrapper>
  );
};

export default Main;
