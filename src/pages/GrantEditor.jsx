import { useState } from 'react'
import {
  Box,
  Button,
  Textarea,
  VStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function GrantEditor() {
  const [projectName, setProjectName] = useState('')
  const [content, setContent] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [editedContent, setEditedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [category, setCategory] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { user } = useAuth()

  const handleGetFeedback = async () => {
    if (!projectName.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both project name and content.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const requestBody = {
      grantText: content
    };

    console.log('Sending request with body:', requestBody);

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('review-grant', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) {
        console.error('Feedback error details:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        throw new Error(error.message || 'Failed to get feedback');
      }
      if (!data) {
        throw new Error('No response from feedback service');
      }

      console.log('Received response:', data);
      setFeedback(data.feedback);
    } catch (error) {
      console.error('Feedback error:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      toast({
        title: 'Error',
        description: error.message || 'Failed to get feedback',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyEdits = async () => {
    if (!feedback) return;

    const requestBody = {
      originalText: content,
      feedback: feedback
    };

    console.log('Sending edit request with body:', requestBody);

    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('implement-suggestions', {
        body: requestBody
      });

      if (error) {
        console.error('Edit error details:', error);
        throw new Error(error.message || 'Failed to apply edits');
      }
      if (!data) {
        throw new Error('No response from edit service');
      }

      setEditedContent(data.improvedText);

      toast({
        title: 'Success',
        description: 'Edits applied successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Edit error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to apply edits',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const { error } = await supabase
        .from('templates')
        .insert([
          {
            name: templateName,
            content: editedContent || content,
            category,
            user_id: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Saved as template successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading>Grant Editor</Heading>
      
      <FormControl isRequired>
        <FormLabel>Project Name</FormLabel>
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Grant Content</FormLabel>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your grant application..."
          minHeight="400px"
          size="lg"
        />
      </FormControl>

      <Button
        colorScheme="teal"
        onClick={handleGetFeedback}
        isLoading={isLoading}
        loadingText="Getting Feedback..."
      >
        Save & Get Feedback
      </Button>

      {feedback && (
        <Box mt={6}>
          <Heading size="md">AI Feedback</Heading>
          <Text whiteSpace="pre-wrap" mt={2}>
            {feedback}
          </Text>
          
          <Button
            mt={4}
            colorScheme="blue"
            onClick={handleApplyEdits}
            isLoading={isSaving}
            loadingText="Applying Edits..."
          >
            Apply Suggested Edits
          </Button>
        </Box>
      )}

      {editedContent && (
        <Box mt={6}>
          <Heading size="md">Edited Version</Heading>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            minHeight="400px"
            size="lg"
            mt={2}
          />
          
          <Button
            mt={4}
            colorScheme="green"
            onClick={onOpen}
          >
            Save as Template
          </Button>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save as Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Template Name</FormLabel>
              <Input 
                placeholder="Enter template name" 
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Category</FormLabel>
              <Input 
                placeholder="E.g., Problem Statement, Methods, Goals" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              mr={3}
              mt={4}
              onClick={handleSaveTemplate}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default GrantEditor
