import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isAnalyticsConfigured, trackPageView } from "@/lib/analytics";

const AnalyticsRouteTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!isAnalyticsConfigured) {
      return;
    }

    const pagePath = `${pathname}${search}`;
    const timer = window.setTimeout(() => {
      trackPageView(pagePath);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, search]);

  return null;
};

export default AnalyticsRouteTracker;
