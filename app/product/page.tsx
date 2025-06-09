'use client';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ShopPage: React.FC = () => {
  const SidebarFilter: React.FC = () => (
    <aside className="border rounded p-3 mb-4" style={{ backgroundColor: '#f0fafa' }}>
      <h5 className="fw-bold mb-3">LỌC THEO GIÁ</h5>
      <form className="mb-4">
        {[
          "0 VND - 100.000 VND",
          "100.000 VND - 200.000 VND",
          "200.000 VND - 300.000 VND",
          "300.000 VND - 400.000 VND",
          "400.000 VND - 500.000 VND",
          "500.000 VND - 1.000.000 VND",
        ].map((label, index) => (
          <div className="form-check mb-2" key={index}>
            <input className="form-check-input" type="checkbox" id={`price${index}`} />
            <label className="form-check-label" htmlFor={`price${index}`}>{label}</label>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm w-100 mt-2">Apply</button>
      </form>

      <h5 className="fw-bold mb-3">LỌC THEO THƯƠNG HIỆU</h5>
      <div className="row gx-2 gy-2 mb-2">
        {["TH1","TH2","TH3","TH4","TH5","TH6","TH7","TH8","TH9"].map((th, i) => (
          <div className="col-4 text-center" key={i}>
            <input type="checkbox" className="btn-check" id={`brand${i}`} />
            <label
              className="btn btn-outline-secondary btn-sm"
              htmlFor={`brand${i}`}
              style={{
                borderRadius: '50%',
                width: 42,
                height: 42,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14
              }}
            >
              {th}
            </label>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-secondary btn-sm w-100 mt-2">Apply</button>
    </aside>
  );

  const ProductCard: React.FC = () => (
    <div className="card h-100 p-2 shadow-sm" style={{ backgroundColor: '#f5fefe' }}>
      <div className="ratio ratio-1x1 bg-light mb-2 rounded-2"></div>
      <div className="card-body p-0">
        <h6 className="card-title text-center">Sản phẩm 3</h6>
        <div className="text-center mb-2">
          <span className="fw-bold">1XX.XXX VND</span>
          <span className="text-muted text-decoration-line-through ms-2">2XX.XXX VND</span>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center px-2">
        <a href="#" className="small">Xem chi tiết</a>
        <a href="#" className="small"><i className="bi bi-cart-plus"></i> Thêm vào giỏ hàng</a>
      </div>
      <div className="text-center small mt-1 mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <i className="bi bi-star-fill text-warning mx-1" key={i}></i>
        ))}
        <span className="text-muted ms-2">(2)</span>
      </div>
    </div>
  );

  const ProductGrid: React.FC = () => (
    <div className="row g-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div className="col-12 col-md-4" key={i}>
          <ProductCard />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-fluid py-4" style={{ background: '#e6f2f2', minHeight: '100vh' }}>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small p-2 ps-3 pe-3 mb-3 rounded" style={{ backgroundColor: '#e0f7f7' }}>
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
