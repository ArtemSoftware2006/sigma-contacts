import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Input, List, ListItem, Text,
  Wrap, WrapItem, Tag, TagLabel,
  Button, IconButton, Heading,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { MainHeader, Logo, Profile } from '../../styles/Main.styled';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useGraphStoreContext } from '../../context/GraphStoreContext';
import { Node } from '../../types/node';
import { CATEGORY_COLORS } from '../forms/addNodeForm/AddNodeForm';

const Header = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Node[]>([]);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { vitrualGraph, setFocusNodeId, setHighlightedNodeIds } = useGraphStoreContext();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Element)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryFilter = (cat: string) => {
    if (!vitrualGraph) return;
    if (activeCategory === cat) {
      setActiveCategory(null);
      setHighlightedNodeIds(null);
      return;
    }
    setActiveCategory(cat);
    setQuery('');
    setResults([]);
    setOpen(false);
    const matched = vitrualGraph.nodes.filter((n) => !n.isGroup && n.category === cat);
    setHighlightedNodeIds(matched.length > 0 ? new Set(matched.map((n) => n.id)) : null);
  };

  const handleSearch = (value: string) => {
    setActiveCategory(null);
    setQuery(value);
    if (!value.trim() || !vitrualGraph) {
      setResults([]);
      setOpen(false);
      setHighlightedNodeIds(null);
      return;
    }
    const q = value.toLowerCase();
    const filtered = vitrualGraph.nodes.filter((node) => {
      const name = (node.contact?.name || '').toLowerCase();
      const surname = (node.contact?.surname || '').toLowerCase();
      const label = (node.label || '').toLowerCase();
      return name.includes(q) || surname.includes(q) || label.includes(q);
    });
    setResults(filtered);
    setOpen(true);
    setHighlightedNodeIds(filtered.length > 0 ? new Set(filtered.map((n) => n.id)) : null);
  };

  const handleSelect = (node: Node) => {
    setQuery(node.isGroup ? node.label : `${node.contact?.name || ''} ${node.contact?.surname || ''}`.trim());
    setOpen(false);
    setResults([]);
    if (location.pathname === '/') {
      setHighlightedNodeIds(new Set([node.id]));
      setFocusNodeId(node.id);
    }
  };

  const getNodeLabel = (node: Node) => {
    if (node.isGroup) return node.label;
    const parts = [node.contact?.name, node.contact?.surname].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : node.label;
  };

  return (
    <Box bg="teal.500" color="white" display="flex" flexDirection={"column"}>
      <MainHeader>
        <Logo>Социальные графы</Logo>
        <nav>
          <ChakraLink
            as={RouterLink}
            to="/"
            _hover={{ textDecoration: 'none' }}
            color={"white"}
          >
            Главная
          </ChakraLink>
        </nav>

        <Box ref={wrapperRef} position="relative" w="280px">
          <Input
            placeholder="Поиск по узлам..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            bg="white"
            color="gray.800"
            size="sm"
            borderRadius="md"
            _placeholder={{ color: 'gray.400' }}
          />
          {open && results.length > 0 && (
            <List
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt="4px"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              zIndex={100}
              maxH="240px"
              overflowY="auto"
            >
              {results.map((node) => (
                <ListItem
                  key={node.id}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: 'teal.50' }}
                  onMouseDown={() => handleSelect(node)}
                >
                  <Text color="gray.800" fontSize="sm" fontWeight={node.isGroup ? 'bold' : 'normal'}>
                    {getNodeLabel(node)}
                  </Text>
                  {!node.isGroup && node.contact?.phone && (
                    <Text color="gray.500" fontSize="xs">{node.contact.phone}</Text>
                  )}
                </ListItem>
              ))}
            </List>
          )}
          {open && results.length === 0 && query.trim() && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              mt="4px"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              zIndex={100}
              px={3}
              py={2}
            >
              <Text color="gray.500" fontSize="sm">Ничего не найдено</Text>
            </Box>
          )}
        </Box>

        <Profile>
          <ChakraLink
            as={RouterLink}
            to="/profile"
            _hover={{ textDecoration: 'none' }}
            color={"white"}
          >
            Профиль
          </ChakraLink>
        </Profile>
      </MainHeader>

      {location.pathname === '/' && (
        <Box bg="teal.600" px={4} py={1} display="flex" alignItems="center" gap={3}>
          <Button
            size="xs"
            variant="outline"
            colorScheme="whiteAlpha"
            color="white"
            borderColor="whiteAlpha.600"
            onClick={() => setDrawerOpen(true)}
          >
            Расширенный фильтр{activeCategory ? ` · ${activeCategory}` : ''}
          </Button>
          {activeCategory && (
            <Text
              fontSize="xs"
              color="whiteAlpha.800"
              cursor="pointer"
              onClick={() => { setActiveCategory(null); setHighlightedNodeIds(null); }}
              _hover={{ color: 'white' }}
            >
              Сбросить ×
            </Text>
          )}
        </Box>
      )}

      <Box
        position="fixed"
        top="0"
        right={drawerOpen ? '0' : '-260px'}
        width="240px"
        height="100vh"
        bg="white"
        boxShadow="-2px 0 12px rgba(0,0,0,0.15)"
        zIndex={200}
        transition="right 0.25s ease"
        display="flex"
        flexDirection="column"
        pt={4}
        px={4}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="sm" color="gray.700">Фильтр по категориям</Heading>
          <IconButton
            aria-label="Закрыть фильтр"
            icon={<CloseIcon />}
            size="xs"
            variant="ghost"
            onClick={() => setDrawerOpen(false)}
          />
        </Box>

        <Wrap spacing={3}>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <WrapItem key={cat}>
              <Tag
                size="md"
                borderRadius="full"
                cursor="pointer"
                bg={activeCategory === cat ? color : 'gray.100'}
                color={activeCategory === cat ? 'white' : 'gray.700'}
                border="2px solid"
                borderColor={color}
                onClick={() => handleCategoryFilter(cat)}
                _hover={{ bg: color, color: 'white' }}
                transition="all 0.15s"
                px={3}
                py={1}
              >
                <TagLabel fontWeight="medium">{cat}</TagLabel>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>

        {activeCategory && (
          <Button
            mt={6}
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={() => { setActiveCategory(null); setHighlightedNodeIds(null); }}
          >
            Сбросить фильтр ×
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
