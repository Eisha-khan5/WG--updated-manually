// Imports all React APIs (like useState and useEffect) under the React namespace.
import * as React from "react"

// Sets a constant to define the mobile screen breakpoint (768px). Screens smaller than this are considered "mobile".
const MOBILE_BREAKPOINT = 768

// Custom hook to detect if the current screen size is mobile
export function useIsMobile() {

    // React state to store the result (true if mobile, false otherwise)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // React hook that runs after the component mounts. Used to add a screen resize listener.
  React.useEffect(() => { 
    // Creates a media query listener that watches if the screen is smaller than 768px.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)


    // Defines a callback function that updates the isMobile state whenever the screen size changes.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    // Add the event listener to listen for screen size changes
    // Subscribes to media query changes, so the app can react to screen resizing dynamically.
    mql.addEventListener("change", onChange) 
    
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) // Sets the initial value of isMobile based on the current window size when the component mounts.
    return () => mql.removeEventListener("change", onChange) //  Cleanup function: removes the event listener when the component unmounts to prevent memory leaks.
  }, [])  // Empty dependency array: runs only once when the component mounts

  return !!isMobile // Returns a boolean (true or false) indicating if the current screen is mobile.
}
