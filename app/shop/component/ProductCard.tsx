'use client';
import React from 'react';

const ProductCard: React.FC = () => {
  return (
    <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#f5fcff' }}>
      <div className="ratio ratio-1x1 bg-light rounded-top overflow-hidden">
        <img
          src="https://production-cdn.pharmacity.io/digital/828x828/plain/e-com/images/ecommerce/20250523103220-0-P24647_1.jpg?versionId=EqrUkTqlk06yvgNhgUudvhivue7Dy5pS"
          alt="Sản phẩm"
          className="img-fluid object-fit-cover w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="card-body p-3 d-flex flex-column justify-content-between">
        <div className="text-center">
          <h6 className="card-title mb-2 fw-semibold">Sản phẩm 3</h6>
          <div className="mb-2">
            <span className="fw-bold text-primary">150.000 VND</span>
            <span className="text-muted text-decoration-line-through ms-2">2 VND</span>
          </div>
        </div>

        <div className="text-center mb-2 small">
          {[1, 2, 3, 4, 5].map(i => (
            <i className="bi bi-star-fill text-warning mx-1" key={i}></i>
          ))}
          <span className="text-muted ms-2">(2)</span>
        </div>

        <div className="d-flex justify-content-center gap-2 mt-2">
          <button className="btn btn-outline-primary btn-sm">
            <i className="bi bi-eye me-1"></i> Xem chi tiết
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-cart-plus me-1"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
