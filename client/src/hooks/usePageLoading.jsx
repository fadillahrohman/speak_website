import { useState, useEffect } from "react";

export function usePageLoading(pageName) {
  // Manage loading on each page
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storageKey = `hasVisited_${pageName}`;
    const timestampKey = `lastVisit_${pageName}`;
    
    const hasVisitedBefore = sessionStorage.getItem(storageKey);
    const lastVisitTimestamp = sessionStorage.getItem(timestampKey);
    const currentTime = new Date().getTime();
    
    // Check if it's been more than 1 minutes since last visit
    const oneMinutesInMs = 1 * 60  * 1000; // 1 minutes in milliseconds
    const shouldResetLoading = lastVisitTimestamp && 
      (currentTime - parseInt(lastVisitTimestamp) > oneMinutesInMs);
    
    if (hasVisitedBefore && !shouldResetLoading) {
      // If visited before and it's been less than 1 minutes
      setIsLoading(false);
    } else {
      // If first visit or it's been more than 1 minutes
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem(storageKey, "true");
        sessionStorage.setItem(timestampKey, currentTime.toString());
      }, 1500); // 1.5 seconds loading time
      
      return () => clearTimeout(timer);
    }
    
    // Always update the timestamp on each visit
    sessionStorage.setItem(timestampKey, currentTime.toString());
    
  }, [pageName]);

  return isLoading;
}