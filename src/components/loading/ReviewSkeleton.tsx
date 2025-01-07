import { Box, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';

export function ReviewSkeleton() {
  return (
    <Box 
      p={5} 
      shadow="sm" 
      borderWidth="1px" 
      borderRadius="md"
      bg="white"
    >
      <Stack direction="row" spacing={4} mb={4}>
        <Skeleton height="24px" width="150px" />
        <Skeleton height="24px" width="100px" />
      </Stack>
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      <Stack direction="row" spacing={4} mt={4} justifyContent="flex-end">
        <Skeleton height="20px" width="60px" />
      </Stack>
    </Box>
  );
}

export function ReviewListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <ReviewSkeleton key={index} />
      ))}
    </Stack>
  );
}
