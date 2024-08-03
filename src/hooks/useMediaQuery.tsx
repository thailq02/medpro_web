"use client";
import {useCallback, useEffect, useState} from "react";

type responseBreakPoint = 576 | 768 | 940 | 1024 | 1080 | 1366 | 1536 | 1920;

export const useMediaQuery = (width: responseBreakPoint): boolean => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return targetReached;
};
