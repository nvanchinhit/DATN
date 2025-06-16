'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Brand = {
  id: number;
  name: string;
  logo: string;
};

const SidebarFilter: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/brands') // chỉnh đúng đường dẫn backend
      .then(res => setBrands(res.data))
      .catch(err => console.error('Lỗi tải brands:', err));
  }, []);

  const toggleBrand = (id: number) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <aside className="border rounded-3 p-3 mb-4 shadow-sm" style={{ backgroundColor: '#f2fcff' }}>
      <h5 className="fw-bold mb-3">LỌC THEO GIÁ</h5>
      <form className="mb-4">
        {[ "0 - 100.000", "100.000 - 200.000", "200.000 - 300.000" ].map((label, index) => (
          <div className="form-check mb-2" key={index}>
            <input className="form-check-input" type="checkbox" id={`price${index}`} />
            <label className="form-check-label" htmlFor={`price${index}`}>{label}</label>
          </div>
        ))}
        <button type="button" className="btn btn-primary btn-sm w-100 mt-2">Áp dụng</button>
      </form>

      <h5 className="fw-bold mb-3">LỌC THEO THƯƠNG HIỆU</h5>
      <div className="row gx-2 gy-2 mb-2">
        {brands.map((b) => (
          <div className="col-4 text-center" key={b.id}>
            <input
              type="checkbox"
              className="btn-check"
              id={`brand${b.id}`}
              checked={selectedBrands.includes(b.id)}
              onChange={() => toggleBrand(b.id)}
            />
            <label
              className={`btn btn-sm d-flex align-items-center justify-content-center ${
                selectedBrands.includes(b.id) ? 'border-primary border-2' : 'btn-outline-secondary'
              }`}
              htmlFor={`brand${b.id}`}
              style={{
                borderRadius: '8px',
                width: 72,
                height: 72,
                padding: '4px',
                backgroundColor: '#fff',
              }}
            >
              <img
                src={b.logo}
                alt={b.name}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </label>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary btn-sm w-100 mt-2">Áp dụng</button>
    </aside>
  );
};

export default SidebarFilter;
