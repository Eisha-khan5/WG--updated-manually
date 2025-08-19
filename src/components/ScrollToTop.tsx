

import { useEffect } from "react";
// Importing hook to access the current route location
import { useLocation } from "react-router-dom";

// Define a functional component called ScrollToTop
const ScrollToTop = () => {
  // Extract the current URL path using useLocation
  const { pathname } = useLocation();

    // useEffect runs whenever 'pathname' changes 
  useEffect(() => {
     // Scroll the window to the top-left corner (0, 0) on route change
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array: re-run effect only when pathname changes

   // This component does not render anything to the DOM
  return null;
};

// Export the component so it can be used in other files
export default ScrollToTop;
