import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Heading, Text, Button, VStack, Code } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Log the error to your error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          p={8}
          maxW="container.md"
          mx="auto"
          textAlign="center"
        >
          <VStack spacing={6}>
            <Heading size="lg" color="red.500">
              Something went wrong
            </Heading>
            
            <Text>
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </Text>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box 
                bg="gray.50" 
                p={4} 
                borderRadius="md"
                width="100%"
                textAlign="left"
              >
                <Text fontWeight="bold" mb={2}>
                  Error Details:
                </Text>
                <Code display="block" whiteSpace="pre-wrap" p={2}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Code>
              </Box>
            )}

            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>

            <Button
              variant="outline"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
