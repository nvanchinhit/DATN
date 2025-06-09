'use client';
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {Array.from({ length: 9 }).map((_, i) => (
      <ProductCard key={i} />
    ))}
  </div>
);

export default ProductGrid;
