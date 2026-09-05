import { useEffect, useMemo, useState } from "react";

const BREAKPOINTS = {
  SM: 0,
  MD: 600,
  LG: 960,
  XL: 1200
};

const useBreakpoints = () => {
  const [deviceWidth, setDeviceWidth] = useState<number>(0);

  const isSM = useMemo<boolean>(
    () => deviceWidth < BREAKPOINTS.MD,
    [deviceWidth]
  );

  const isMD = useMemo<boolean>(
    () => deviceWidth >= BREAKPOINTS.MD && deviceWidth < BREAKPOINTS.LG,
    [deviceWidth]
  );

  const isLG = useMemo<boolean>(
    () => deviceWidth >= BREAKPOINTS.LG && deviceWidth < BREAKPOINTS.XL,
    [deviceWidth]
  );

  const isXL = useMemo<boolean>(
    () => deviceWidth >= BREAKPOINTS.XL,
    [deviceWidth]
  );

  const isMobile = useMemo<boolean>(
    () => deviceWidth < BREAKPOINTS.MD,
    [deviceWidth]
  );

  const isDesktop = useMemo<boolean>(
    () => deviceWidth >= BREAKPOINTS.MD,
    [deviceWidth]
  );

  useEffect(() => {
    const updateSize = () => {
      setDeviceWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return {
    isSM,
    isMD,
    isLG,
    isXL,
    isMobile,
    isDesktop
  };
};

export default useBreakpoints;