import { useEffect, useMemo, useState } from "react";

const getWidth = () => (typeof window === "undefined" ? 1200 : window.innerWidth || 1200);

/**
 * Breakpoints tuned for phones + iPad mini/air/pro.
 * - phone: <= 600
 * - tablet (mini/air portrait & landscape): 601 - 1024
 * - ipadPro: 1025 - 1366
 */
export function useClientBreakpoints() {
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return useMemo(() => {
    const isPhone = width <= 600;
    const isTablet = width > 600 && width <= 1024;
    const isIPadPro = width > 1024 && width <= 1366;
    const isTabletLike = isTablet || isIPadPro;

    return {
      width,
      isPhone,
      isTablet,
      isIPadPro,
      isTabletLike,
      isDesktop: !isPhone && !isTabletLike,
    };
  }, [width]);
}

