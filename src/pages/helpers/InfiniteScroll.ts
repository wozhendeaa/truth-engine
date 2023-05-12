import { useEffect, useState, useRef, RefObject } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (callback: () => void) => {
    const [ref, inView] = useInView({
        threshold: 1,
      });
    
      useEffect(() => {
        if (inView) {
            callback();
        }
      }, [inView, callback]);

  return ref;
};
