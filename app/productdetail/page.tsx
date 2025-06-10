"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
  views: number;
  stock: number;
  pack: string;
  description: string;
  details: string;
}

const mockProduct: Product = {
  id: "1",
  name: "Thuốc Paracetamol 500mg",
  brand: "Dược phẩm ABC",
  price: 102000,
  originalPrice: 120000,
  discount: 15,
  image:
    "https://tamanhhospital.vn/wp-content/uploads/2023/06/paracetamol-500mg.jpg",
  rating: 4.6,
  reviews: 8,
  views: 10,
  stock: 9,
  pack: "Hộp 60 viên",
  description: `
    • Hạ sốt nhanh, giảm đau hiệu quả trong các trường hợp cảm cúm, sốt siêu vi, nhiễm trùng...
    • Không dùng cho người mẫn cảm với paracetamol hoặc bệnh gan nặng.`,
  details: `
    Liều dùng:
    - Người lớn: 1 viên/lần, cách nhau ít nhất 4-6 giờ, tối đa 4 viên/ngày.
    - Trẻ em: theo chỉ dẫn của bác sĩ.
    
    Bảo quản:
    - Nơi khô thoáng, tránh ánh sáng trực tiếp.
    - Để xa tầm tay trẻ em.
    
    Sản xuất bởi: Công ty Dược phẩm ABC.
  `,
};

const relatedProducts = [
  {
    id: "2",
    name: "Panadol Extra",
    price: 110000,
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_05045_e0f976ccc5.jpg",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Decolgen",
    price: 115000,
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_09892_c5f46566c4.jpg",
    rating: 4.3,
  },
  {
    id: "4",
    name: "Hapacol 500",
    price: 108000,
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_09985_6ae3f52230.jpg",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Efferalgan 500mg",
    price: 113000,
    image:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/DSC_05505_4c243a16f9.jpg",
    rating: 4.4,
  },
];

// Định nghĩa rõ kiểu tab
type TabKey = "desc" | "detail" | "review";

const tabLabels: Record<TabKey, string> = {
  desc: "Mô tả sản phẩm",
  detail: "Chi tiết sản phẩm",
  review: "Đánh giá",
};

const ProductDetail: React.FC = () => {

  const product = mockProduct;
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<TabKey>("desc");

  return (
    <div className="bg-white min-h-screen py-10 px-4 lg:px-20">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4">
        <ol className="flex space-x-2 text-gray-600">
          <li>
            <a href="/" className="hover:underline text-blue-600">
              Trang chủ
            </a>
          </li>
          <li>/</li>
          <li className="text-black font-semibold">Trang chi tiết</li>
        </ol>
      </nav>

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-h-[400px] object-contain"
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-1">Thương hiệu: {product.brand}</p>

          <div className="flex items-center space-x-2 text-yellow-500 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400"
                    : "stroke-yellow-400"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500">
              ({product.reviews} đánh giá) | Lượt xem: {product.views}
            </span>
          </div>

          <p className="text-sm text-gray-500">{product.pack}</p>

          <div className="flex items-center mt-2 space-x-3">
            <span className="text-2xl font-bold text-teal-600">
              {product.price.toLocaleString()} VND
            </span>
            <span className="line-through text-gray-400">
              {product.originalPrice.toLocaleString()} VND
            </span>
            <span className="text-red-500 font-semibold">{product.discount}%</span>
          </div>

          <p className="mt-2 text-sm text-gray-700">Tồn kho: {product.stock}</p>

          <div className="flex items-center mt-4 space-x-2">
            <label className="text-sm">Số lượng</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= product.stock) setQuantity(val);
              }}
              className="border border-gray-300 px-3 py-1 rounded w-20"
            />
          </div>

          <button className="mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded transition">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border rounded-lg">
        <div className="flex border-b">
          {(Object.keys(tabLabels) as TabKey[]).map((key) => (
            <button
              key={key}
              className={`px-6 py-3 text-sm font-medium ${
                tab === key
                  ? "border-b-2 border-teal-600 text-teal-600"
                  : "text-gray-500"
              }`}
              onClick={() => setTab(key)}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>
        <div className="p-6 text-sm text-gray-700 whitespace-pre-line">
          {tab === "desc" && product.description}
          {tab === "detail" && product.details}
          {tab === "review" && "Hiển thị đánh giá sản phẩm tại đây."}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((prod) => (
            <div
              key={prod.id}
              className="border p-4 rounded-lg hover:shadow transition text-sm"
            >
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-32 object-contain rounded mb-3"
              />
              <h3 className="font-semibold">{prod.name}</h3>
              <p className="text-teal-600 font-bold">
                {prod.price.toLocaleString()} VND
              </p>
              <div className="flex items-center space-x-1 text-yellow-500 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(prod.rating) ? "fill-yellow-400" : ""
                    }`}
                  />
                ))}
              </div>
              <button className="mt-2 text-sm text-teal-600 hover:underline">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
