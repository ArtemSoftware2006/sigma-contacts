import React from "react";
import { Box, Button, Portal } from "@chakra-ui/react";

interface NodeContextMenuProps {
  x: number;
  y: number;
  onAddNode: () => void;
  onClose: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ 
  x, 
  y, 
  onAddNode, 
  onClose 
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <Portal>
      <Box
        ref={menuRef}
        position="absolute"
        left={`${x + 15}px`}
        top={`${y}px`}
        zIndex={9999}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        p={2}
      >
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => {
            onAddNode();
            onClose();
          }}
        >
          Добавить узел
        </Button>
      </Box>
    </Portal>
  );
};