import * as React from "react";

// Default to 768px (iPad Mini / Tablets start here, so anything below is mobile)
const MOBILE_BREAKPOINT = 768;

export function useIsMobile(customBreakpoint = MOBILE_BREAKPOINT) {
  // 1. Initialize as false to prevent SSR crashes (Server doesn't know screen size)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // 2. Check if window exists (Safe guard)
    if (typeof window === "undefined") return;

    // 3. Create the media query listener
    const mql = window.matchMedia(`(max-width: ${customBreakpoint - 1}px)`);

    // 4. Define the handler to update state based on the query result
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // 5. Set the initial value immediately
    setIsMobile(mql.matches);

    // 6. Add the listener
    mql.addEventListener("change", onChange);

    // 7. Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, [customBreakpoint]);

  return isMobile;
}

//How big is the users screen(is smaller than a tablet)