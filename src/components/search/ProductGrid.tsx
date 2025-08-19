
// Importing React to use JSX and build components
import React from 'react';

// Importing ProductCard component and ProductProps type for product data structure
// ProductProps is a TypeScript interface (or type) that defines what properties (data) a single product card should receive.
import ProductCard, { ProductProps } from '@/components/ProductCard';

// Importing motion for animation effects from Framer Motion
import { motion } from 'framer-motion';


// Defining the type for props: an array of products, each following ProductProps type
interface ProductGridProps {
  products: ProductProps[];
}

// Declaring a functional React component named ProductGrid that accepts products as a prop
const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    // Using a grid layout to display products in a responsive manner
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id} 
          initial={{ opacity: 0, y: 20 }} // Initial state for animation: invisible and slightly below
          animate={{ opacity: 1, y: 0 }} // fade in and move to original position
          transition={{ duration: 0.3 }} // smooth transition
        >
          {/* Render ProductCard component and pass all product props to it */}
          <ProductCard {...product} />
        </motion.div>
      ))}
    </div>
  );
};
// Exporting the component so it can be used in other parts of the app
export default ProductGrid;
