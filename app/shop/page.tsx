'use client';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarFilter from './component/SidebarFilter';
import ProductGrid from './component/ProductGrid';

const ShopPage = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // TODO: lọc sản phẩm nếu cần
  };

  return (
    <div className="container mt-4">
      {/* Tiêu đề + thanh tìm kiếm nằm cùng hàng */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="m-0">Tất cả sản phẩm</h3>
        <input
          type="text"
          className="form-control rounded-pill w-50"
          placeholder="Tìm kiếm thuốc..."
          value={search}
          onChange={handleSearch}
          style={{ maxWidth: '300px' }}
        />
      </div>

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
