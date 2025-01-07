import { useToast, UseToastOptions } from '@chakra-ui/react';

interface NotificationOptions extends Omit<UseToastOptions, 'status'> {
  duration?: number;
}

export function useNotification() {
  const toast = useToast();

  const success = (title: string, options?: NotificationOptions) => {
    toast({
      title,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      ...options
    });
  };

  const error = (title: string, options?: NotificationOptions) => {
    toast({
      title,
      status: 'error',
      duration: 7000,
      isClosable: true,
      position: 'top-right',
      ...options
    });
  };

  const warning = (title: string, options?: NotificationOptions) => {
    toast({
      title,
      status: 'warning',
      duration: 6000,
      isClosable: true,
      position: 'top-right',
      ...options
    });
  };

  const info = (title: string, options?: NotificationOptions) => {
    toast({
      title,
      status: 'info',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      ...options
    });
  };

  return {
    success,
    error,
    warning,
    info
  };
}
