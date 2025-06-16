// app/shop/page.tsx
'use client';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarFilter from './component/SidebarFilter';
import ProductGrid from './component/ProductGrid';

const ShopPage = () => {
  return (
    <div className="container mt-4">
      <h3 className="mb-4">Tất cả sản phẩm</h3>
      <div className="row">
        <div className="col-md-3">
          <SidebarFilter />
        </div>
        <div className="col-md-9">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
