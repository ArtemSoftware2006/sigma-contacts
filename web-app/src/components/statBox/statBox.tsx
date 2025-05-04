import { Box, Heading, Text } from "@chakra-ui/react";

export const StatBox = ({ title, content }: { title: string; content: string }) => (
  <Box minWidth={"320px"} border="1px solid black" padding="10px" borderRadius="10px">
    <Heading size="xs" textTransform="uppercase">
      {title}
    </Heading>
    <Text pt="2" fontSize="sm">
      {content}
    </Text>
  </Box>
);