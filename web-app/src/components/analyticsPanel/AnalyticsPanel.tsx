import React, { useMemo } from 'react';
import {
  Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber,
  StatHelpText, Divider, Wrap, WrapItem, Tag as ChakraTag, TagLabel,
  List, ListItem, Badge, Alert, AlertIcon, AlertDescription,
  VStack, HStack,
} from '@chakra-ui/react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { useGraphStoreContext } from '../../context/GraphStoreContext';
import { CATEGORY_COLORS } from '../forms/addNodeForm/AddNodeForm';

// ── helpers ────────────────────────────────────────────────────────────────────

const EDGE_TYPE_COLORS: Record<string, string> = {
  дружба:    '#4A90D9',
  работа:    '#E74C3C',
  родство:   '#2ECC71',
  знакомство:'#F39C12',
  бизнес:    '#9B59B6',
};

const StatCard = ({ label, value, help }: { label: string; value: string | number; help?: string }) => (
  <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={4} textAlign="center">
    <Stat>
      <StatLabel color="gray.500" fontSize="xs">{label}</StatLabel>
      <StatNumber fontSize="2xl">{value}</StatNumber>
      {help && <StatHelpText fontSize="xs" color="gray.400">{help}</StatHelpText>}
    </Stat>
  </Box>
);

const ChartBox = ({ title, children, height = 260 }: { title: string; children: React.ReactNode; height?: number }) => (
  <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={4}>
    <Text fontWeight="semibold" mb={3} color="gray.700" fontSize="sm">{title}</Text>
    <Box height={`${height}px`}>{children}</Box>
  </Box>
);

// ── main component ─────────────────────────────────────────────────────────────

const AnalyticsPanel: React.FC = () => {
  const { vitrualGraph } = useGraphStoreContext();

  const data = useMemo(() => {
    if (!vitrualGraph) return null;

    const contacts = vitrualGraph.nodes.filter(n => !n.isGroup);
    const groups   = vitrualGraph.nodes.filter(n => n.isGroup);
    const edges    = vitrualGraph.edges;

    // ── overview ──
    const avgEdgesPerContact = contacts.length > 0
      ? (edges.length / contacts.length).toFixed(1)
      : '0';

    // ── by category ──
    const categoryMap: Record<string, number> = {};
    contacts.forEach(n => {
      const cat = n.category || 'Без категории';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const byCategory = Object.entries(categoryMap).map(([id, value]) => ({
      id, label: id, value,
      color: CATEGORY_COLORS[id] || '#aaa',
    }));

    // ── by group ──
    const groupMap: Record<string, number> = {};
    contacts.forEach(n => {
      const group = groups.find(g => g.id === n.parentId);
      const name = group?.label || 'Без группы';
      groupMap[name] = (groupMap[name] || 0) + 1;
    });
    const byGroup = Object.entries(groupMap).map(([id, value]) => ({
      id, label: id, value,
    }));

    // ── by edge type ──
    const typeMap: Record<string, number> = {};
    edges.forEach(e => {
      const t = (e as any).type || 'не указан';
      typeMap[t] = (typeMap[t] || 0) + 1;
    });
    const byEdgeType = Object.entries(typeMap).map(([type, count]) => ({
      type, count, color: EDGE_TYPE_COLORS[type] || '#ccc',
    }));

    // ── by edge weight ──
    const weightMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    edges.forEach(e => {
      const w = (e as any).weight;
      if (w >= 1 && w <= 5) weightMap[w]++;
    });
    const byEdgeWeight = [1, 2, 3, 4, 5].map(w => ({ вес: String(w), количество: weightMap[w] }));

    // ── top 5 strongest connections ──
    const topEdges = [...edges]
      .sort((a, b) => ((b as any).weight || 0) - ((a as any).weight || 0))
      .slice(0, 5)
      .map(e => {
        const target = contacts.find(n => n.id === e.target);
        const name = target
          ? [target.contact?.name, target.contact?.surname].filter(Boolean).join(' ') || target.label
          : e.target;
        return { name, weight: (e as any).weight || 1, type: (e as any).type || '' };
      });

    // ── tag cloud ──
    const tagFreq: Record<string, number> = {};
    contacts.forEach(n => (n.contact?.tags || []).forEach(t => {
      tagFreq[t] = (tagFreq[t] || 0) + 1;
    }));
    const tags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);
    const maxTagFreq = tags[0]?.[1] || 1;

    // ── data quality ──
    const noCategory = contacts.filter(n => !n.category).length;
    const noTags     = contacts.filter(n => !(n.contact?.tags?.length)).length;
    const noContacts = contacts.filter(n =>
      !n.contact?.phone && !n.contact?.telegramId &&
      !n.contact?.vkId && !n.contact?.github && !n.contact?.whatsAppPhone
    ).length;
    const emptyGroups = groups.filter(g =>
      !contacts.some(n => n.parentId === g.id)
    ).length;

    return {
      contactsCount: contacts.length,
      groupsCount: groups.length,
      edgesCount: edges.length,
      avgEdgesPerContact,
      byCategory,
      byGroup,
      byEdgeType,
      byEdgeWeight,
      topEdges,
      tags,
      maxTagFreq,
      noCategory,
      noTags,
      noContacts,
      emptyGroups,
    };
  }, [vitrualGraph]);

  if (!data) return (
    <Box p={6} color="gray.400" textAlign="center">Загрузка данных...</Box>
  );

  const hasQualityIssues = data.noCategory > 0 || data.noTags > 0 || data.noContacts > 0 || data.emptyGroups > 0;

  return (
    <VStack spacing={6} align="stretch" p={6} bg="gray.50" minH="100%">

      {/* ── Block 1: Overview ── */}
      <Box>
        <Heading size="sm" color="gray.600" mb={3}>Обзор</Heading>
        <SimpleGrid columns={4} spacing={3}>
          <StatCard label="Контактов" value={data.contactsCount} />
          <StatCard label="Групп" value={data.groupsCount} />
          <StatCard label="Связей" value={data.edgesCount} />
          <StatCard label="Связей на контакт" value={data.avgEdgesPerContact} help="в среднем" />
        </SimpleGrid>
      </Box>

      <Divider />

      {/* ── Block 2: Structure ── */}
      <Box>
        <Heading size="sm" color="gray.600" mb={3}>Структура</Heading>
        <SimpleGrid columns={2} spacing={4}>
          <ChartBox title="По категориям">
            <ResponsivePie
              data={data.byCategory}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={({ data }) => data.color}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#555"
              arcLinkLabelsThickness={2}
              arcLabelsSkipAngle={12}
              enableArcLabels={false}
              legends={[]}
            />
          </ChartBox>
          <ChartBox title="По группам">
            <ResponsivePie
              data={data.byGroup}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.4}
              padAngle={0.5}
              cornerRadius={3}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#555"
              arcLinkLabelsThickness={2}
              enableArcLabels={false}
            />
          </ChartBox>
        </SimpleGrid>
      </Box>

      <Divider />

      {/* ── Block 3: Connections ── */}
      <Box>
        <Heading size="sm" color="gray.600" mb={3}>Связи</Heading>
        <SimpleGrid columns={2} spacing={4}>
          <ChartBox title="По типу связи">
            {data.byEdgeType.length === 0 ? (
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Text color="gray.400" fontSize="sm">Нет данных</Text>
              </Box>
            ) : (
              <ResponsiveBar
                data={data.byEdgeType}
                keys={['count']}
                indexBy="type"
                margin={{ top: 10, right: 20, bottom: 50, left: 40 }}
                padding={0.3}
                colors={({ data }) => (data as any).color}
                axisBottom={{ tickRotation: -20 }}
                axisLeft={{ tickSize: 0 }}
                enableLabel={false}
                borderRadius={4}
              />
            )}
          </ChartBox>
          <ChartBox title="Сила связей (1–5)">
            <ResponsiveBar
              data={data.byEdgeWeight}
              keys={['количество']}
              indexBy="вес"
              margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
              padding={0.3}
              colors="#4A90D9"
              axisBottom={{ legend: 'вес', legendPosition: 'middle', legendOffset: 30 }}
              axisLeft={{ tickSize: 0 }}
              enableLabel={false}
              borderRadius={4}
            />
          </ChartBox>
        </SimpleGrid>

        {/* Top 5 strongest */}
        {data.topEdges.length > 0 && (
          <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={4} mt={4}>
            <Text fontWeight="semibold" mb={3} color="gray.700" fontSize="sm">Топ-5 сильных связей</Text>
            <List spacing={2}>
              {data.topEdges.map((e, i) => (
                <ListItem key={i} display="flex" alignItems="center" justifyContent="space-between">
                  <HStack>
                    <Text fontWeight="bold" color="gray.400" fontSize="sm" w="20px">{i + 1}</Text>
                    <Text fontSize="sm">{e.name}</Text>
                    {e.type && <Badge colorScheme="blue" fontSize="xs">{e.type}</Badge>}
                  </HStack>
                  <HStack spacing={1}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Box
                        key={n}
                        w="8px" h="8px" borderRadius="full"
                        bg={n <= e.weight ? 'teal.400' : 'gray.200'}
                      />
                    ))}
                  </HStack>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      <Divider />

      {/* ── Block 4: Tag cloud ── */}
      <Box>
        <Heading size="sm" color="gray.600" mb={3}>Теги</Heading>
        <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="lg" p={4}>
          {data.tags.length === 0 ? (
            <Text color="gray.400" fontSize="sm">Нет тегов</Text>
          ) : (
            <Wrap spacing={2}>
              {data.tags.map(([tag, freq]) => {
                const ratio = freq / data.maxTagFreq;
                const size = ratio > 0.66 ? 'lg' : ratio > 0.33 ? 'md' : 'sm';
                const opacity = 0.5 + ratio * 0.5;
                return (
                  <WrapItem key={tag}>
                    <ChakraTag
                      size={size}
                      colorScheme="blue"
                      borderRadius="full"
                      opacity={opacity}
                    >
                      <TagLabel>#{tag} ({freq})</TagLabel>
                    </ChakraTag>
                  </WrapItem>
                );
              })}
            </Wrap>
          )}
        </Box>
      </Box>

      {/* ── Block 5: Data quality ── */}
      {hasQualityIssues && (
        <>
          <Divider />
          <Box>
            <Heading size="sm" color="gray.600" mb={3}>Качество данных</Heading>
            <VStack spacing={2} align="stretch">
              {data.noCategory > 0 && (
                <Alert status="warning" borderRadius="md" py={2}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    <b>{data.noCategory}</b> контактов без категории
                  </AlertDescription>
                </Alert>
              )}
              {data.noTags > 0 && (
                <Alert status="info" borderRadius="md" py={2}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    <b>{data.noTags}</b> контактов без тегов
                  </AlertDescription>
                </Alert>
              )}
              {data.noContacts > 0 && (
                <Alert status="info" borderRadius="md" py={2}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    <b>{data.noContacts}</b> контактов без способов связи
                  </AlertDescription>
                </Alert>
              )}
              {data.emptyGroups > 0 && (
                <Alert status="warning" borderRadius="md" py={2}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    <b>{data.emptyGroups}</b> пустых групп без контактов
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </Box>
        </>
      )}
    </VStack>
  );
};

export default AnalyticsPanel;
