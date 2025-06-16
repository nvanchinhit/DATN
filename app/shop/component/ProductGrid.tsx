// shop/component/ProductGrid.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi tải sản phẩm:', err));
  }, []);

  return (
    <div className="row g-3">
      {products.map((product) => (
        <div className="col-md-4" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
