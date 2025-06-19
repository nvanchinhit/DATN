'use client';

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ShopPage = () => {
  return (
    // Sử dụng flexbox của Bootstrap để căn giữa nội dung theo cả chiều dọc và ngang
    // min-vh-100 sẽ làm cho container chiếm ít nhất 100% chiều cao của màn hình
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      
      <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
        
        {/* Icon trực quan */}
        <i className="bi bi-tools display-2 text-primary mb-3"></i>

        {/* Tiêu đề chính */}
        <h2 className="fw-bold text-dark">Trang đang được xây dựng</h2>

        {/* Thông điệp cho người dùng */}
        <p className="text-muted mt-3">
          Chúng tôi đang nỗ lực hết mình để sớm ra mắt trang mua sắm sản phẩm.
          <br />
          Cảm ơn bạn đã kiên nhẫn và vui lòng quay lại sau!
        </p>

        {/* Nút hành động (tùy chọn, nhưng nên có để cải thiện trải nghiệm) */}
        <a href="/" className="btn btn-primary rounded-pill mt-4 px-4">
          Quay về Trang chủ
        </a>

      </div>

    </div>
  );
};

export default ShopPage;