'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Facebook, 
  Twitter, 
  Linkedin, 
  BriefcaseMedical, 
  HeartPulse 
} from 'lucide-react';

// A simple bar chart component for the floating card
const BarChart = () => (
  <div className="flex items-end gap-1 h-8">
    <div className="w-1.5 bg-blue-200 rounded-full" style={{ height: '40%' }}></div>
    <div className="w-1.5 bg-blue-500 rounded-full" style={{ height: '70%' }}></div>
    <div className="w-1.5 bg-blue-200 rounded-full" style={{ height: '50%' }}></div>
    <div className="w-1.5 bg-blue-500 rounded-full" style={{ height: '90%' }}></div>
    <div className="w-1.5 bg-blue-200 rounded-full" style={{ height: '60%' }}></div>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50/20 via-white to-blue-50/20 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Social Media Bar */}
      <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4 z-20">
        <a href="#" className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <Facebook className="w-5 h-5 text-blue-600" />
        </a>
        <a href="#" className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <Twitter className="w-5 h-5 text-blue-500" />
        </a>
        <a href="#" className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
          <Linkedin className="w-5 h-5 text-blue-700" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Content */}
        <div className="text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-semibold text-blue-600 uppercase tracking-wider mb-2">
              Giải pháp y tế cho tương lai
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-6">
              Tìm kiếm chuyên gia y tế phù hợp với bạn
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0">
              Kết nối với các bác sĩ hàng đầu, đặt lịch khám và nhận tư vấn chuyên sâu một cách dễ dàng và thuận tiện.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#booking"
                className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 px-8 py-3.5 rounded-full font-semibold flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Khám phá ngay <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#services"
                className="w-full sm:w-auto bg-transparent text-blue-600 border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 px-8 py-3.5 rounded-full font-semibold"
              >
                Liên hệ
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Image and Floating Elements */}
        <div className="relative h-[500px] lg:h-[650px] flex items-center justify-center">
          {/* Background Shape */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-blue-100/50 rounded-full scale-125 blur-xl"></div>
          </div>
          
          {/* Main Doctor Image */}
          <motion.img
            src="https://dreamthemebd.dreamitsolution.net/html/dreamhub/medical/assets/images/hero-imgs.png" // Using a background-removed image
            alt="Bác sĩ"
            className="relative z-10 w-auto h-full max-h-[600px] object-contain"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Floating UI Elements */}
          <motion.div 
            className="absolute top-1/4 -left-4 sm:left-0 z-20 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center gap-4"
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <img src="https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Dr. Alisha" className="w-12 h-12 rounded-full object-cover border-2 border-white"/>
            <div>
              <p className="font-bold text-slate-800">BS. Lan Anh</p>
              <p className="text-sm text-gray-500">Khoa Tim Mạch</p>
              <div className="flex text-yellow-400 mt-1">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 text-gray-300 fill-current" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-1/4 -right-4 sm:right-0 z-20 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-xl w-40"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <p className="text-sm text-gray-500">Lượt tư vấn</p>
            <p className="font-bold text-xl text-slate-800 my-1">2.85k+</p>
            <BarChart />
          </motion.div>

          <motion.div 
            className="absolute top-20 right-1/4 z-0 bg-white p-3 rounded-full shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 1.2 }}
          >
            <BriefcaseMedical className="w-6 h-6 text-blue-500"/>
          </motion.div>

           <motion.div 
            className="absolute bottom-10 left-1/4 z-20 bg-white p-3 rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 1.4 }}
          >
            <HeartPulse className="w-6 h-6 text-red-500"/>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;