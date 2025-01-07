import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Heading, VStack, Text, useToast, Input, Textarea, Select } from '@chakra-ui/react';
import { createClient } from '@supabase/supabase-js';
import { useSupabase } from '../lib/supabase-context';

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export function ReusableSections() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({ title: '', content: '', category: '' });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const toast = useToast();
  const supabase = useSupabase();

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

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

  async function handleSave() {
    if (!newTemplate.title || !newTemplate.content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const { data, error } = await supabase
      .from('templates')
      .insert([newTemplate]);

    if (error) {
      toast({
        title: 'Error saving template',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setNewTemplate({ title: '', content: '', category: '' });
    fetchTemplates();
    toast({
      title: 'Success',
      description: 'Template saved successfully',
      status: 'success',
      duration: 3000,
    });
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('templates')
      .delete()
      .match({ id });

    if (error) {
      toast({
        title: 'Error deleting template',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      return;
    }

    fetchTemplates();
    toast({
      title: 'Success',
      description: 'Template deleted successfully',
      status: 'success',
      duration: 3000,
    });
  }

  async function handleUpdate(template: Template) {
    const { error } = await supabase
      .from('templates')
      .update({
        title: template.title,
        content: template.content,
        category: template.category,
      })
      .match({ id: template.id });

    if (error) {
      toast({
        title: 'Error updating template',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
      return;
    }

    setIsEditing(null);
    fetchTemplates();
    toast({
      title: 'Success',
      description: 'Template updated successfully',
      status: 'success',
      duration: 3000,
    });
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Reusable Sections</Heading>

        {/* Create new template */}
        <Box p={6} borderWidth={1} borderRadius="lg">
          <VStack spacing={4}>
            <Heading size="md">Create New Template</Heading>
            <Input
              placeholder="Title"
              value={newTemplate.title}
              onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
            />
            <Select
              placeholder="Select category"
              value={newTemplate.category}
              onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
            >
              <option value="introduction">Introduction</option>
              <option value="methodology">Methodology</option>
              <option value="budget">Budget</option>
              <option value="timeline">Timeline</option>
              <option value="conclusion">Conclusion</option>
            </Select>
            <Textarea
              placeholder="Content"
              value={newTemplate.content}
              onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
              minH="200px"
            />
            <Button colorScheme="blue" onClick={handleSave}>Save Template</Button>
          </VStack>
        </Box>

        {/* List existing templates */}
        <VStack spacing={4}>
          {templates.map((template) => (
            <Box key={template.id} p={6} borderWidth={1} borderRadius="lg" w="100%">
              {isEditing === template.id ? (
                <VStack spacing={4}>
                  <Input
                    value={template.title}
                    onChange={(e) => setTemplates(templates.map(t => 
                      t.id === template.id ? { ...t, title: e.target.value } : t
                    ))}
                  />
                  <Select
                    value={template.category}
                    onChange={(e) => setTemplates(templates.map(t => 
                      t.id === template.id ? { ...t, category: e.target.value } : t
                    ))}
                  >
                    <option value="introduction">Introduction</option>
                    <option value="methodology">Methodology</option>
                    <option value="budget">Budget</option>
                    <option value="timeline">Timeline</option>
                    <option value="conclusion">Conclusion</option>
                  </Select>
                  <Textarea
                    value={template.content}
                    onChange={(e) => setTemplates(templates.map(t => 
                      t.id === template.id ? { ...t, content: e.target.value } : t
                    ))}
                    minH="200px"
                  />
                  <Button onClick={() => handleUpdate(template)}>Save Changes</Button>
                  <Button onClick={() => setIsEditing(null)}>Cancel</Button>
                </VStack>
              ) : (
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">{template.title}</Heading>
                  <Text color="gray.500">Category: {template.category}</Text>
                  <Text noOfLines={3}>{template.content}</Text>
                  <Box>
                    <Button size="sm" onClick={() => setIsEditing(template.id)} mr={2}>
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(template.id)}>
                      Delete
                    </Button>
                  </Box>
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

export default ReusableSections;