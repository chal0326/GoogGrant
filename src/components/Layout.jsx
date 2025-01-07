import { Box, Container, Flex, Link, Button, Spacer } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PropTypes from 'prop-types'

function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Box w="100vw" minH="100vh">
      <Box as="nav" bg="teal.500" color="white" py={4} w="100%">
        <Container maxW="100%" px={8}>
          <Flex gap={6} align="center">
            {user ? (
              <>
                <Link as={RouterLink} to="/" _hover={{ color: 'teal.100' }}>
                  Home
                </Link>
                <Link as={RouterLink} to="/editor" _hover={{ color: 'teal.100' }}>
                  Grant Editor
                </Link>
                <Link as={RouterLink} to="/templates" _hover={{ color: 'teal.100' }}>
                  Templates
                </Link>
                <Spacer />
                <Button
                  colorScheme="teal"
                  variant="outline"
                  color="white"
                  _hover={{ bg: 'teal.600' }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Spacer />
                <Link as={RouterLink} to="/auth" _hover={{ color: 'teal.100' }}>
                  Login / Register
                </Link>
              </>
            )}
          </Flex>
        </Container>
      </Box>
      <Container maxW="100%" px={8} py={8}>
        {children}
      </Container>
    </Box>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
