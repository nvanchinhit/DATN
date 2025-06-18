'use client';

import { Pencil, Trash2, PlusCircle } from 'lucide-react';

export default function ProductAdminPage() {
  const medicines = [
    {
      id: 101,
      name: "Paracetamol 500mg",
      price: 12000,
      brand: "Pymepharco",
      image: "https://nhathuoclongchau.com.vn/images/product/2021/08/00025535-paracetamol-500mg-dhg-hop-10-vi-x-10-vien-3512-610_large.png",
      createdAt: "2024-06-01",
    },
    {
      id: 102,
      name: "Prospan Syrup 100ml",
      price: 62000,
      brand: "Engelhard Arzneimittel (Đức)",
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/400x400/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/thuoc-ho-prospan-100ml-5651.png",
      createdAt: "2024-05-28",
    },
    {
      id: 103,
      name: "C sủi Plusssz",
      price: 34000,
      brand: "Herbion",
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/0x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/c_sui_plusssz_1000mg_vi_cam_tube_10v_64065b28a6.png",
      createdAt: "2024-06-05",
    },
    {
      id: 104,
      name: "Aspirin 81mg",
      price: 20000,
      brand: "Bayer",
      image: "https://cdn.nhathuoclongchau.com.vn/unsafe/400x400/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/aspirin_81mg_020202-03407.png",
      createdAt: "2024-06-10",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">💊 Quản lý thuốc</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          <PlusCircle size={18} /> Thêm thuốc
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b">ID</th>
              <th className="px-4 py-3 border-b">Hình ảnh</th>
              <th className="text-left px-4 py-3 border-b">Tên thuốc</th>
              <th className="text-left px-4 py-3 border-b">Hãng sản xuất</th>
              <th className="text-left px-4 py-3 border-b">Giá bán</th>
              <th className="text-left px-4 py-3 border-b">Ngày thêm</th>
              <th className="text-center px-4 py-3 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50 text-sm">
                <td className="px-4 py-2 border-b">{med.id}</td>
                <td className="px-4 py-2 border-b">
                  <img
                    src={med.image}
                    alt={med.name}
                    className="h-14 w-14 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 border-b font-medium">{med.name}</td>
                <td className="px-4 py-2 border-b">{med.brand}</td>
                <td className="px-4 py-2 border-b text-green-700">{med.price.toLocaleString()}₫</td>
                <td className="px-4 py-2 border-b">{med.createdAt}</td>
                <td className="px-4 py-2 border-b text-center">
                  <button className="text-blue-600 hover:text-blue-800 mr-3" title="Sửa">
                    <Pencil size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800" title="Xoá">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
