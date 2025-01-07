import { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Textarea,
  Input,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  IconButton,
  HStack,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, ViewIcon, AddIcon } from '@chakra-ui/icons'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function Templates() {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [editedCategory, setEditedCategory] = useState('')
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const toast = useToast()
  const { user } = useAuth()

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setTemplates(data)

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(t => t.category).filter(Boolean))]
      setCategories(uniqueCategories)
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template)
    onViewOpen()
  }

  const handleEditClick = (template) => {
    setSelectedTemplate(template)
    setEditedName(template.name)
    setEditedContent(template.content)
    setEditedCategory(template.category || '')
    onEditOpen()
  }

  const handleEditSubmit = async () => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          name: editedName,
          content: editedContent,
          category: editedCategory,
        })
        .eq('id', selectedTemplate.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Template updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onEditClose()
      fetchTemplates()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Template deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchTemplates()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const { error } = await supabase
        .from('templates')
        .insert([
          {
            name: editedName,
            content: editedContent,
            category: editedCategory,
            user_id: user.id
          }
        ])

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Template created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onCreateClose()
      setEditedName('')
      setEditedContent('')
      setEditedCategory('')
      fetchTemplates()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const filteredTemplates = selectedCategory
    ? templates.filter(t => t.category === selectedCategory)
    : templates

  return (
    <VStack spacing={6} align="stretch" w="100%">
      <Flex justify="space-between" align="center">
        <Heading>Reusable Templates</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={() => {
            setEditedName('')
            setEditedContent('')
            setEditedCategory('')
            onCreateOpen()
          }}
        >
          Create Template
        </Button>
      </Flex>

      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <>
          {categories.length > 0 && (
            <FormControl maxW="300px">
              <FormLabel>Filter by Category</FormLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="All Categories"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {filteredTemplates.map((template) => (
              <Box
                key={template.id}
                p={6}
                borderWidth={1}
                borderRadius="lg"
                _hover={{ shadow: 'md' }}
              >
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="bold">{template.name}</Text>
                  {template.category && (
                    <Text fontSize="sm" color="gray.600">
                      Category: {template.category}
                    </Text>
                  )}
                  <HStack spacing={2}>
                    <IconButton
                      icon={<ViewIcon />}
                      onClick={() => handleViewTemplate(template)}
                      aria-label="View template"
                      size="sm"
                    />
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleEditClick(template)}
                      aria-label="Edit template"
                      size="sm"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(template.id)}
                      aria-label="Delete template"
                      size="sm"
                      colorScheme="red"
                    />
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Create Template Modal */}
          <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Template</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Template Name</FormLabel>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Input
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      placeholder="E.g., Problem Statement, Methods, Goals"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      minHeight="300px"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleCreateTemplate}>
                  Create
                </Button>
                <Button onClick={onCreateClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* View Template Modal */}
          <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedTemplate?.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text whiteSpace="pre-wrap">{selectedTemplate?.content}</Text>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Edit Template Modal */}
          <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Template</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Template Name</FormLabel>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Input
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      placeholder="E.g., Problem Statement, Methods, Goals"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      minHeight="300px"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleEditSubmit}>
                  Save Changes
                </Button>
                <Button onClick={onEditClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </VStack>
  )
}

export default Templates
