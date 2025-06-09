// app/shop/page.tsx
'use client';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SidebarFilter from './component/SidebarFilter';
import ProductGrid from './component/ProductGrid';

const ShopPage: React.FC = () => {
  return (
    <div className="container-fluid py-4" style={{ background: '#e8f6f9', minHeight: '100vh' }}>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small p-2 px-3 mb-3 rounded shadow-sm" style={{ backgroundColor: '#d0f0f4' }}>
            <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
            <li className="breadcrumb-item active" aria-current="page">Tất cả sản phẩm</li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <SidebarFilter />
          </div>
          <div className="col-12 col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-2 align-items-center">
                <label className="small fw-semibold me-2">Sắp xếp</label>
                <select className="form-select form-select-sm" style={{ width: 130 }}>
                  <option>Mới nhất</option>
                  <option>Bán chạy</option>
                  <option>Giá tăng dần</option>
                  <option>Giá giảm dần</option>
                </select>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <label className="small fw-semibold me-2">Xem</label>
                <button className="btn btn-outline-secondary btn-sm active">
                  <i className="bi bi-grid-3x3-gap"></i>
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-list"></i>
                </button>
              </div>
            </div>
            <ProductGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
