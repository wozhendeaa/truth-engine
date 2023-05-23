import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn'; 

dayjs.locale('zh-cn'); // set locale to Chinese
dayjs.extend(relativeTime);


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
  

  export function GetTime (props: {date: Date}) {
    let date = dayjs(props.date);
    let now = dayjs();
    let differenceInHours = now.diff(date, 'hour');
    let formattedDate;
    if (differenceInHours >= 24) {
      // format date as year/month/day if difference is 24 hours or more
      formattedDate = date.format('YYYY/MM/DD hh:mm A');
    } else {
      // otherwise, use relative time
      formattedDate = date.fromNow();
    }
  
    return formattedDate;
  }
  

  
