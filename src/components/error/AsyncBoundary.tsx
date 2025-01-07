import React, { Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Spinner, Center } from '@chakra-ui/react';

interface AsyncBoundaryProps {
  children: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function AsyncBoundary({
  children,
  errorFallback,
  loadingFallback = (
    <Center h="200px">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  ),
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
