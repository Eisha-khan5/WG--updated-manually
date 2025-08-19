
import React from 'react'; // Importing React to use JSX and define the functional component.
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList, Table as TableIcon } from 'lucide-react'; // Importing icons from the lucide-react icon library:
import { motion } from 'framer-motion';

// Defining what props our ViewToggle component expects
// - `view` tells us which view is currently selected
// - `setView` is a function that changes the view when a button is clicked
interface ViewToggleProps {
  view: 'grid' | 'list' | 'table'; 
  setView: (view: 'grid' | 'list' | 'table') => void;
}

// Creating a functional component named ViewToggle with view and setView passed as props.
const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  return (
    //  // This is the outer wrapper for our 3 toggle buttons , styled with Tailwind CSS 
    <div className="view-toggle-container bg-white rounded-md border border-gray-100 p-1.5 flex gap-1.5 shadow-sm">
     
     {/* This is the "Grid" button */}
      <Button
        variant={view === 'grid' ? "default" : "ghost"} // Highlights this button if grid view is active
        size="sm"
        onClick={() => setView('grid')}  //  When clicked, it changes the view to "grid"
        className="flex items-center gap-2" // Aligns icon and text nicely
      >
        <LayoutGrid className="h-4 w-4" />  {/* Icon for grid view */}
        <span className="hidden md:inline">Grid</span> {/* text "Grid" only appears on medium+ screens  */}
      </Button>

      {/* This is the "List" button */}
      <Button
        variant={view === 'list' ? "default" : "ghost"} // Highlights this button if list view is active
        size="sm"
        onClick={() => setView('list')}
        className="flex items-center gap-2"
      >
        <LayoutList className="h-4 w-4" />
        <span className="hidden md:inline">List</span>
      </Button>
      
      {/* This is the "Table" button */}
      <Button
        variant={view === 'table' ? "default" : "ghost"}
        size="sm"
        onClick={() => setView('table')}
        className="flex items-center gap-2"
      >
        <TableIcon className="h-4 w-4" />
        <span className="hidden md:inline">Table</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
