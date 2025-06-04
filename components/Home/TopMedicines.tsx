import React from 'react';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';

const TopMedicines = () => {
  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      image: 'https://images.pexels.com/photos/139398/himalayas-tibet-machinery-pharmacy-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Giảm đau, hạ sốt thông thường',
      price: '35.000',
      rating: 4.8,
      manufacturer: 'Công ty Dược phẩm Việt Nam',
      discount: '10%'
    },
    {
      id: 2,
      name: 'Vitamin C 1000mg',
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Tăng cường hệ miễn dịch, bổ sung vitamin C',
      price: '120.000',
      rating: 4.9,
      manufacturer: 'DHG Pharma',
      discount: '15%'
    },
    {
      id: 3,
      name: 'Probiotics 250mg',
      image: 'https://images.pexels.com/photos/7446986/pexels-photo-7446986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Hỗ trợ tiêu hóa, cải thiện hệ vi sinh đường ruột',
      price: '180.000',
      rating: 4.7,
      manufacturer: 'Dược Hậu Giang',
      discount: '5%'
    },
    {
      id: 4,
      name: 'Omega-3 Fish Oil',
      image: 'https://images.pexels.com/photos/163944/pexels-photo-163944.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      description: 'Hỗ trợ sức khỏe tim mạch, não bộ và thị lực',
      price: '220.000',
      rating: 4.8,
      manufacturer: 'Imexpharm',
      discount: '20%'
    }
  ];

  return (
    <section id="medicine" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Thuốc & thực phẩm chức năng</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đa dạng sản phẩm chính hãng, nguồn gốc rõ ràng, giao hàng nhanh chóng tận nơi
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <div 
              key={medicine.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group"
            >
              <div className="relative">
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  -{medicine.discount}
                </div>
                <img 
                  src={medicine.image} 
                  alt={medicine.name} 
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1 text-gray-700">{medicine.rating}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{medicine.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{medicine.manufacturer}</p>
                <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-teal-600 font-bold">{medicine.price}đ</span>
                  <button className="flex items-center bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <a 
            href="#medicines" 
            className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopMedicines;