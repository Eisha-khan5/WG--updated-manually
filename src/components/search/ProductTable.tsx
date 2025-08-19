
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation to product detail page
import { ProductProps } from '@/components/ProductCard'; // Import product 
import 
{ 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface ProductTableProps {
  products: ProductProps[]; // Array of products to display in the table
}

//  Functional component to display products in a table format
const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <Table>

        {/* Table caption to show total number of products found */}
        <TableCaption>Total {products.length} products found</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Brand</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Fabric</TableHead>
            <TableHead className="text-center">Color</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
 
        {/* Table body with product data */}
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>

               {/* Product image cell */}
              <TableCell className="p-2">
                <Link to={`/product/${product.id}`} className="block w-16 h-16 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="object-cover w-full h-full"
                  />
                </Link>
              </TableCell>

               {/* Product name + 'New' tag */}
              <TableCell>
                <Link to={`/product/${product.id}`} className="font-medium hover:text-black-600">
                  {product.name}
                </Link>
                {product.isNew && (
                  <span className="ml-2 bg-emerald-100 text-emerald-800 text-xs px-1.5 py-0.5 rounded-full">New</span>
                )}
              </TableCell>

              {/* Product brand, category, fabric */}
              <TableCell className='text-center'>{product.brand}</TableCell>
              <TableCell className='text-center'>{product.category}</TableCell>
              <TableCell className='text-center'>{product.fabric}</TableCell>

               {/* Product color with color dot */}
              <TableCell className='text-center'>
                <div className="flex items-center gap-2 justify center">
                  <span className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: product.color?.toLowerCase() }}></span>
                  {product.color}
                </div>
              </TableCell>

              {/* Product price with discount if applicable */}
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-black-700">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.discount && product.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      Rs. {Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
