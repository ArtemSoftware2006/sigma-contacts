// components/settings/SettingsPanel.tsx
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

interface SettingsPanelProps {
  title: string;
  name: string | undefined;
  size: number | undefined;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ title, name, size }) => {
  return (
    <Box width="300px" backgroundColor="#f7f7f7" border="1px solid #ddd" padding="20px">
      <Heading as="h2" size="md" mb={4}>
        {title}
      </Heading>
      <Text><strong>Название узла:</strong> {name}</Text>
      <Text><strong>Размер:</strong> {size}</Text>
    </Box>
  );
};

export default SettingsPanel;