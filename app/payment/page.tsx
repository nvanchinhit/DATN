'use client';

import React, { useState, useEffect } from 'react';
import { ScanLine, Clock, User, Mail, ShieldCheck, RefreshCw } from 'lucide-react';

const CheckoutPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 phút
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed
  
  const service = {
    name: 'Phí khám Chuyên khoa Tim mạch',
    doctor: 'BS. Trần Văn Minh',
    doctorAvatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '10:00 - 10:30, 29/10/2023',
    price: 50000, // Thay đổi từ 500000 thành 50000 để test
  };
  const user = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
  };
  const [transaction, setTransaction] = useState({
    id: '',
    discount: 0,
    total: service.price,
  });

  // Lấy thông tin ngân hàng từ API
  const loadBankInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payment/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBankInfo({
            BANK_ID: '970416', // Có thể lấy từ database nếu cần
            ACCOUNT_NO: data.data.account_number,
            ACCOUNT_NAME: data.data.account_holder,
            TEMPLATE: 'compact2',
            TOKEN_AUTO: data.data.token_auto
          });
        } else {
          // Fallback data nếu API không trả về dữ liệu
          setBankInfo({
            BANK_ID: '970416',
            ACCOUNT_NO: '1234567890',
            ACCOUNT_NAME: 'NGUYEN VAN A',
            TEMPLATE: 'compact2',
            TOKEN_AUTO: null
          });
        }
      } else {
        // Fallback data nếu API lỗi
        setBankInfo({
          BANK_ID: '970416',
          ACCOUNT_NO: '1234567890',
          ACCOUNT_NAME: 'NGUYEN VAN A',
          TEMPLATE: 'compact2',
          TOKEN_AUTO: null
        });
      }
    } catch (error) {
      console.error('Error loading bank info:', error);
      // Fallback data nếu có lỗi network
      setBankInfo({
        BANK_ID: '970416',
        ACCOUNT_NO: '1234567890',
        ACCOUNT_NAME: 'NGUYEN VAN A',
        TEMPLATE: 'compact2',
        TOKEN_AUTO: null
      });
    }
  };

  // Check lịch sử giao dịch từ API bên ngoài
  const checkPaymentHistory = async () => {
    if (!bankInfo?.TOKEN_AUTO) return;
    
    setIsCheckingPayment(true);
    try {
      const response = await fetch('http://localhost:5000/api/payment/check-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: bankInfo.TOKEN_AUTO,
          account_number: bankInfo.ACCOUNT_NO,
          transaction_id: transaction.id,
          amount: service.price
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment check response:', data);
        
        if (data.success && data.hasPayment) {
          setPaymentStatus('success');
          console.log('Payment confirmed! Status updated to success');
        } else {
          console.log('No payment found yet');
        }
      } else {
        console.error('Error checking payment:', response.status);
      }
    } catch (error) {
      console.error('Error checking payment history:', error);
    } finally {
      setIsCheckingPayment(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadBankInfo();
    
    const transactionId = `TDCARE${Date.now()}`;
    setTransaction(prev => ({ ...prev, id: transactionId }));

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Tạo QR code khi có thông tin ngân hàng
  useEffect(() => {
    if (bankInfo && transaction.id) {
      const qrApiUrl = `https://img.vietqr.io/image/${bankInfo.BANK_ID}-${bankInfo.ACCOUNT_NO}-${bankInfo.TEMPLATE}.png?amount=${service.price}&addInfo=${encodeURIComponent(transaction.id)}&accountName=${encodeURIComponent(bankInfo.ACCOUNT_NAME)}`;
      setQrCodeUrl(qrApiUrl);
    }
  }, [bankInfo, transaction.id]);

  // Tự động check payment mỗi 30 giây
  useEffect(() => {
    if (paymentStatus === 'pending' && bankInfo?.TOKEN_AUTO) {
      const checkInterval = setInterval(() => {
        checkPaymentHistory();
      }, 30000); // 30 giây

      return () => clearInterval(checkInterval);
    }
  }, [paymentStatus, bankInfo]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const formatVND = (number: number) => {
    return isClient ? number.toLocaleString('vi-VN') + ' đ' : number + ' đ';
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          text: 'Thanh toán thành công',
          color: 'bg-green-50 text-green-700',
          icon: ShieldCheck
        };
      case 'failed':
        return {
          text: 'Thanh toán thất bại',
          color: 'bg-red-50 text-red-700',
          icon: ShieldCheck
        };
      default:
        return {
          text: 'Đang chờ thanh toán',
          color: 'bg-yellow-50 text-yellow-700',
          icon: Clock
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-500 mb-6">
          Trang chủ / Đặt lịch / <span className="font-medium text-gray-700">Xác nhận & Thanh toán</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <ScanLine className="text-blue-600" />
              Thanh toán bằng mã QR
            </h2>
            <p className="text-gray-500 mb-6">Quét mã dưới đây bằng ứng dụng Ngân hàng hoặc Ví điện tử để hoàn tất thanh toán.</p>
            
            {!bankInfo ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="w-full max-w-xs mx-auto sm:mx-0 aspect-square p-3 bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center">
                        {qrCodeUrl ? (
                          <>
                            {isQrLoading && <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>}
                            <img 
                                src={qrCodeUrl} 
                                alt="Mã QR thanh toán" 
                                className={`w-full h-full object-contain transition-opacity duration-300 ${isQrLoading ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={() => setIsQrLoading(false)}
                                onError={() => { setIsQrLoading(false); console.error("Lỗi tải ảnh QR."); }}
                                style={{ display: isQrLoading ? 'none' : 'block' }}
                            />
                          </>
                        ) : (
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-700 mb-3">Hướng dẫn:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                            <li>Mở ứng dụng Ngân hàng / Ví điện tử.</li>
                            <li>Chọn tính năng quét mã QR (QR Pay).</li>
                            <li>Quét mã và xác nhận giao dịch.</li>
                        </ol>
                        
                        <div className="mt-4">
                          <button
                            onClick={checkPaymentHistory}
                            disabled={isCheckingPayment}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <RefreshCw className={`h-4 w-4 ${isCheckingPayment ? 'animate-spin' : ''}`} />
                            {isCheckingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                          </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-yellow-600">
                        <Clock size={20} />
                        <p className="font-medium">Giao dịch sẽ hết hạn sau:</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{formatTime(timeLeft)}</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin thanh toán</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Chi tiết khách hàng</h3>
                  <div className="text-sm space-y-2">
                      <p className="flex items-center gap-2 text-gray-600"><User size={14}/> {user.name}</p>
                      <p className="flex items-center gap-2 text-gray-600"><Mail size={14}/> {user.email}</p>
                  </div>
              </div>

              <div className="border-t border-b py-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Chi tiết dịch vụ</h3>
                  <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                          <img 
                              src={service.doctorAvatar} 
                              alt={service.doctor} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" 
                          />
                          <div>
                              <p className="font-bold text-gray-800">{service.name}</p>
                              <p className="text-sm text-gray-500">{service.doctor}</p>
                              <p className="text-sm text-gray-500">{service.date}</p>
                          </div>
                      </div>
                      <p className="font-semibold text-lg text-gray-800 flex-shrink-0">{formatVND(service.price)}</p>
                  </div>
              </div>

              <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                      <span>Tạm tính:</span>
                      <span>{formatVND(service.price)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                      <span>Giảm giá:</span>
                      <span>- {formatVND(transaction.discount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t mt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatVND(transaction.total)}</span>
                  </div>
              </div>

              <div className={`text-center p-3 rounded-lg flex items-center justify-center gap-2 ${statusDisplay.color}`}>
                 <StatusIcon size={16} />
                 <p className="text-sm font-medium">Trạng thái: <span className="font-bold">{statusDisplay.text}</span></p>
              </div>
              
              {transaction.id && (
                <p className="text-xs text-center text-gray-400 mt-4">Mã giao dịch: {transaction.id}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;