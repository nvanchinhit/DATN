import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-teal-500 to-blue-600 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Chăm sóc sức khỏe thông minh tại TDCARE
            </h1>
            <p className="text-lg md:text-xl mb-8 text-teal-50">
              Đặt lịch khám bệnh trực tuyến, tư vấn với bác sĩ chuyên khoa và 
              mua thuốc giao tận nơi chỉ với vài thao tác đơn giản
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#booking" className="bg-white text-teal-600 hover:bg-teal-50 transition px-6 py-3 rounded-lg font-medium flex items-center">
                Đặt lịch khám ngay <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#medicine" className="bg-teal-700 text-white hover:bg-teal-800 transition px-6 py-3 rounded-lg font-medium">
                Mua thuốc online
              </a>
            </div>
          </div>
          <div className="md:w-5/12">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Bác sĩ tư vấn" 
                className="rounded-xl shadow-2xl relative z-10 object-cover h-[350px] w-full"
              />
              <div className="absolute -bottom-3 -right-3 bg-teal-100 w-24 h-24 rounded-full z-0"></div>
              <div className="absolute -top-3 -left-3 bg-blue-100 w-16 h-16 rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;