import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <VStack spacing={8} align="stretch">
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          AI-Powered Grant Application Assistant
        </Heading>
        <Text fontSize="xl" color="gray.600" mb={8}>
          Create compelling grant applications with AI-powered feedback and suggestions
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => navigate('/editor')}
        >
          Start Writing
        </Button>
      </Box>
    </VStack>
  )
}

export default Home
