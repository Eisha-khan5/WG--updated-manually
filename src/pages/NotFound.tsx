
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <h1 className="font-serif text-6xl font-bold text-navy-600 mb-4">404</h1>
        <p className="text-2xl font-medium mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="bg-navy-600 hover:bg-navy-500">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
