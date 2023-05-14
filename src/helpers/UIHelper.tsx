import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export function GetSekleton (props: {number: number}) {
    const boxes = [];
    for (let i = 0; i < props.number; i++) {
      //@ts-ignore
      boxes.push(
        
          <Box key={i} padding="6" boxShadow="lg" bg="" maxW={500}  width={700}  flexGrow={1} resize={'horizontal'}>
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={5} spacing="4" skeletonHeight="2" />
          </Box>);
    }
    return <div className="flex flex-col items-center w-full">{boxes}</div>;
  }
  
export default  GetSekleton