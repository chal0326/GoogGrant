import { Box, Skeleton, SkeletonText, Stack } from '@chakra-ui/react';

export function GrantCardSkeleton() {
  return (
    <Box 
      p={5} 
      shadow="md" 
      borderWidth="1px" 
      borderRadius="lg"
      bg="white"
    >
      <Skeleton height="24px" width="70%" mb={4} />
      <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />
      <Stack direction="row" spacing={4} mt={4}>
        <Skeleton height="20px" width="100px" />
        <Skeleton height="20px" width="80px" />
      </Stack>
    </Box>
  );
}

export function GrantCardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <GrantCardSkeleton key={index} />
      ))}
    </Stack>
  );
}
