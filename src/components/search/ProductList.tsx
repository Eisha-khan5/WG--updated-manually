
import React from 'react';
import { ProductProps } from '@/components/ProductCard';
import { Link } from 'react-router-dom';

interface ProductListProps {
  products: ProductProps[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Link 
          key={product.id}
          to={`/product/${product.id}`}
          className="block"
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-sm flex items-center hover:shadow-md transition-shadow cursor-pointer">
            {/* Left side: product image section */}
            <div className="w-1/3 aspect-[1/1]">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Right side: product details section */}
            <div className="p-4 flex-1">
              <h3 className="text-sm text-gray-500 capitalize">{product.brand}</h3>
              <h2 className="font-medium text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-600 mt-2">
                {product.category} • {product.fabric} • {product.color}
              </p>

              {/* Price and discount section */}
              <div className="mt-4">
                <span className="font-semibold text-black-900">
                  Rs. {product.price.toLocaleString()}
                </span>

                {/* If there's a discount, show original price with strike-through */}
                {product.discount && product.discount > 0 && (
                  <span className="text-xs text-gray-400 line-through ml-2">
                    Rs. {Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
