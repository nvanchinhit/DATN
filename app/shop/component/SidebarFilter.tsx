'use client';
import React, { useState } from 'react';

const brands = [
  { id: 'panadol', label: 'Panadol', logo: 'https://i-cf65.ch-static.com/content/dam/cf-consumer-healthcare/panadol/vi_vn/blue-images/Logo%20Panadol%20Peru.png?auto=format' },
  { id: 'panadol-children', label: 'Panadol Children', logo: 'https://www.mumsociety.com.au/wp-content/uploads/2019/05/Panadol-1024x1024.jpg' },
  { id: 'efferalgan', label: 'Efferalgan', logo: 'data:image/png;base64,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' },
  { id: 'salonpas', label: 'Salonpas', logo: '/logos/salonpas.png' },
  { id: 'ph', label: 'P/H', logo: '/logos/ph.png' },
  { id: 'paracetamol', label: 'Paracetamol', logo: '/logos/paracetamol.png' },
  { id: 'mediplantex', label: 'Mediplantex', logo: '/logos/mediplantex.png' },
  { id: 'dhg', label: 'DHG', logo: '/logos/dhg.png' },
  { id: 'stada', label: 'Stada', logo: '/logos/stada.png' },
];

const SidebarFilter: React.FC = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleBrand = (id: string) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <aside className="border rounded-3 p-3 mb-4 shadow-sm" style={{ backgroundColor: '#f2fcff' }}>
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
        <button type="button" className="btn btn-primary btn-sm w-100 mt-2">Áp dụng</button>
      </form>

      <h5 className="fw-bold mb-3">LỌC THEO THƯƠNG HIỆU</h5>
      <div className="row gx-2 gy-2 mb-2">
        {brands.map((b) => (
          <div className="col-4 text-center" key={b.id}>
            <input
              type="checkbox"
              className="btn-check"
              id={b.id}
              checked={selectedBrands.includes(b.id)}
              onChange={() => toggleBrand(b.id)}
            />
            <label
              className={`btn btn-sm d-flex align-items-center justify-content-center ${selectedBrands.includes(b.id) ? 'border-primary border-2' : 'btn-outline-secondary'}`}
              htmlFor={b.id}
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
                alt={b.label}
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