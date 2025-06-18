'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  {
    title: 'Chăm sóc sức khỏe thông minh tại TDCARE',
    description:
      'Đặt lịch khám bệnh trực tuyến, tư vấn với bác sĩ chuyên khoa và mua thuốc giao tận nơi chỉ với vài thao tác đơn giản',
    image:
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    title: 'Tư vấn bác sĩ chuyên môn cao',
    description:
      'Kết nối với đội ngũ bác sĩ nhiều kinh nghiệm để được hỗ trợ tận tình và kịp thời',
    image:
      'https://images.pexels.com/photos/8460158/pexels-photo-8460158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    title: 'Mua thuốc tiện lợi, giao hàng tận nơi',
    description:
      'Tìm kiếm và đặt mua các loại thuốc bạn cần từ các nhà thuốc uy tín',
    image:
      'https://images.pexels.com/photos/3683075/pexels-photo-3683075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[index];

  return (
    <section className="relative bg-gradient-to-r from-teal-500 to-blue-600 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Mũi tên trái */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-teal-600 p-2 rounded-full z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Mũi tên phải */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-teal-600 p-2 rounded-full z-20"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Hình ảnh */}
          <div className="md:w-5/12 w-full">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt="slide"
                  className="rounded-xl shadow-2xl object-cover h-[350px] w-full"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              <div className="absolute -bottom-3 -right-3 bg-teal-100 w-24 h-24 rounded-full z-0"></div>
              <div className="absolute -top-3 -left-3 bg-blue-100 w-16 h-16 rounded-full z-0"></div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="md:w-1/2 text-white text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.title}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-snug">
                  {currentSlide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 text-teal-50">
                  {currentSlide.description}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a
                    href="#booking"
                    className="bg-white text-teal-600 hover:bg-teal-50 transition px-6 py-3 rounded-lg font-medium flex items-center"
                  >
                    Đặt lịch khám ngay <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href="#medicine"
                    className="bg-teal-700 text-white hover:bg-teal-800 transition px-6 py-3 rounded-lg font-medium"
                  >
                    Mua thuốc online
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
