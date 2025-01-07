import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  Textarea,
  Input,
  Divider,
} from '@chakra-ui/react';
import { useSupabase } from '../lib/supabase-context';

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface Section {
  id: string;
  content: string;
  title: string;
}

export function GrantBuilder() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedSections, setSelectedSections] = useState<Section[]>([]);
  const [grantTitle, setGrantTitle] = useState('');
  const [finalContent, setFinalContent] = useState('');
  const toast = useToast();
  const supabase = useSupabase();

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Update final content whenever sections change
    const combinedContent = selectedSections
      .map(section => section.content)
      .join('\n\n');
    setFinalContent(combinedContent);
  }, [selectedSections]);

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      toast({
        title: 'Error fetching templates',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setTemplates(data || []);
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    if (result.source.droppableId === result.destination.droppableId) {
      // Reordering within the same list
      const items = Array.from(selectedSections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setSelectedSections(items);
    } else if (result.source.droppableId === 'templates' && result.destination.droppableId === 'grant') {
      // Adding from templates to grant
      const template = templates[result.source.index];
      const newSection = {
        id: `${template.id}-${Date.now()}`,
        content: template.content,
        title: template.title,
      };
      const items = Array.from(selectedSections);
      items.splice(result.destination.index, 0, newSection);
      setSelectedSections(items);
    }
  };

  async function handleSaveGrant() {
    if (!grantTitle) {
      toast({
        title: 'Missing title',
        description: 'Please provide a title for your grant',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const { error } = await supabase
      .from('grants')
      .insert([{
        title: grantTitle,
        content: finalContent,
        sections: selectedSections,
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      toast({
        title: 'Error saving grant',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Grant saved successfully',
      status: 'success',
      duration: 3000,
    });
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Grant Builder</Heading>
        
        <Input
          placeholder="Enter grant title"
          value={grantTitle}
          onChange={(e) => setGrantTitle(e.target.value)}
          size="lg"
        />

        <HStack align="flex-start" spacing={8}>
          {/* Templates Section */}
          <Box flex={1}>
            <Heading size="md" mb={4}>Available Templates</Heading>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="templates">
                {(provided) => (
                  <VStack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={4}
                    align="stretch"
                  >
                    {templates.map((template, index) => (
                      <Draggable
                        key={template.id}
                        draggableId={template.id}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            bg="white"
                          >
                            <Text fontWeight="bold">{template.title}</Text>
                            <Text color="gray.500" fontSize="sm">
                              {template.category}
                            </Text>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </VStack>
                )}
              </Droppable>
            </DragDropContext>
          </Box>

          {/* Grant Building Section */}
          <Box flex={2}>
            <Heading size="md" mb={4}>Your Grant</Heading>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="grant">
                {(provided) => (
                  <VStack
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    spacing={4}
                    align="stretch"
                    minH="400px"
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                  >
                    {selectedSections.map((section, index) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            p={4}
                            borderWidth={1}
                            borderRadius="md"
                            bg="white"
                          >
                            <Text fontWeight="bold">{section.title}</Text>
                            <Text noOfLines={3}>{section.content}</Text>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </VStack>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </HStack>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Final Grant Content</Heading>
          <Textarea
            value={finalContent}
            onChange={(e) => setFinalContent(e.target.value)}
            minH="400px"
            mb={4}
          />
          <Button colorScheme="blue" onClick={handleSaveGrant}>
            Save Grant
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}

export default GrantBuilder;