import { useEffect, useState, useRef, RefObject } from "react";
import { useInView } from "react-intersection-observer";
import React from "react";
import axios from "axios";
import TE_Routes from "TE_Routes";
import data from "@emoji-mart/data";
import { useQuery } from "@tanstack/react-query";

const EXPIRATION_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

let globalViewedIdsSet = new Set<string>();
let newViewsIdsSet = new Set<string>();
let hasInterval = false;

export function useViewTracker() {
  useEffect(() => {
    const value = localStorage.getItem("viewedPosts");
    const stored = value ? JSON.parse(value) : { ids: [], expires: Date.now() };
    if (stored.expires < Date.now()) {
      localStorage.removeItem("viewedPosts");
      return;
    }
    // Update global set with IDs from local storage
    globalViewedIdsSet = new Set(stored.ids);
  }, []);

  if (!hasInterval) {
    const interval = setInterval(async () => {
      let newIds = Array.from(newViewsIdsSet);

      if (newIds.length > 0) {
        newViewsIdsSet.clear();
        // Update viewedIds state with the global set
        await axios
          .post(TE_Routes.trackViews.path, {
            data: JSON.stringify({ viewedPostIds: newIds }),
          })
          .then(() => {})
          .catch((e) => {
            console.log("记录观看数据时出错", e.message);
          });

        // Update localStorage
        let globalIds = globalViewedIdsSet;
        
        const viewed = JSON.stringify({
          ids: Array.from(globalIds),
          expires: Date.now() + EXPIRATION_DURATION,
        });
        localStorage.setItem("viewedPosts", viewed);
      }
    }, 5000);
    hasInterval = true;
  }

  const addViewedId = (id: string) => {

    if (!globalViewedIdsSet.has(id)) {
      newViewsIdsSet.add(id);
      globalViewedIdsSet.add(id);
    }
  };

  return { addViewedId };
}

export const intersectionObserver = (callback: () => void) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0));

  const [ref, inView] = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      // Start a timer when the element comes into view
      const timerId = setTimeout(() => {
        callback();
      }, 1000);
      setTimer(timerId);
    } else {
      // The element is not in view, clear the timer
      if (timer) {
        clearTimeout(timer);
      }
    }
    // Clean up when the component is unmounted or the inView status changes
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [inView]);

  return ref;
};
