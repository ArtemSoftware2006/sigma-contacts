import React, { useState, KeyboardEvent } from 'react';
import { Box, Input, Tag, TagLabel, TagCloseButton, Wrap, WrapItem } from '@chakra-ui/react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder = 'Тег + Enter' }) => {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const value = raw.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={2}
      bg="white"
      _focusWithin={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
    >
      <Wrap spacing={1} mb={tags.length > 0 ? 2 : 0}>
        {tags.map((tag) => (
          <WrapItem key={tag}>
            <Tag size="sm" colorScheme="blue" borderRadius="full">
              <TagLabel>#{tag}</TagLabel>
              <TagCloseButton onClick={() => removeTag(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <Input
        variant="unstyled"
        size="sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={placeholder}
        pl={1}
      />
    </Box>
  );
};

export default TagInput;
