'use client';

import React, { useState, useEffect } from 'react';
import { ScanLine, Clock, User, Mail, ShieldCheck, RefreshCw } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const data = searchParams.get('data');

  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 phút
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isQrLoading, setIsQrLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed
  const [showSuccessPage, setShowSuccessPage] = useState(false); // Hiển thị trang thành công
  const [appointmentCreated, setAppointmentCreated] = useState(false); // Đã tạo appointment chưa
  
  // State để lưu dữ liệu từ checkout
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Lấy dữ liệu từ URL parameters
  useEffect(() => {
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setPaymentData(decoded);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi parse dữ liệu thanh toán:", err);
        alert("Dữ liệu thanh toán không hợp lệ.");
        router.back();
      }
    } else {
      alert("Không có dữ liệu thanh toán.");
      router.back();
    }
  }, [data, router]);

  // Dữ liệu service và user từ paymentData
  const service = paymentData ? {
    name: `Phí khám ${paymentData.specialty}`,
    doctor: paymentData.doctorName,
    doctorAvatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: `${paymentData.appointmentTime}, ${new Date(paymentData.appointmentDate + 'T00:00:00').toLocaleDateString('vi-VN')}`,
    price: paymentData.amount,
  } : {
    name: 'Phí khám Chuyên khoa Tim mạch',
    doctor: 'BS. Trần Văn Minh',
    doctorAvatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    date: '10:00 - 10:30, 29/10/2023',
    price: 50000,
  };

  const user = paymentData ? {
    name: paymentData.patientName,
    email: paymentData.patientEmail,
  } : {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
  };

  const [transaction, setTransaction] = useState({
    id: '',
    discount: 0,
    total: service.price,
  });

  // Cập nhật total khi service.price thay đổi
  useEffect(() => {
    setTransaction(prev => ({ ...prev, total: service.price }));
  }, [service.price]);

  // Lấy thông tin ngân hàng từ API
  const loadBankInfo = async () => {
    // Dự phòng mặc định
    const fallbackBankInfo = {
      BANK_ID: '970416',
      ACCOUNT_NO: '16087671',
      ACCOUNT_NAME: 'NGUYEN VAN CHINH',
      TEMPLATE: 'compact2',
      TOKEN_AUTO: null
    };

    try {
      const response = await fetch(`${API_URL}/api/payment/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setBankInfo({
            BANK_ID: '970416',
            ACCOUNT_NO: data.data.account_number,
            ACCOUNT_NAME: data.data.account_holder,
            TEMPLATE: 'compact2',
            TOKEN_AUTO: data.data.token_auto
          });
        } else {
          setBankInfo(fallbackBankInfo);
        }
      } else {
        setBankInfo(fallbackBankInfo);
      }
    } catch (error) {
      console.error('Error loading bank info:', error);
      setBankInfo(fallbackBankInfo);
    }
  };

  // Check lịch sử giao dịch từ API bên ngoài
  const checkPaymentHistory = async () => {
    if (!bankInfo?.TOKEN_AUTO) return;
    
    setIsCheckingPayment(true);
    try {
      const response = await fetch(`${API_URL}/api/payment/check-history`, {
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
          console.log('✅ Payment confirmed! Setting status to success');
          setPaymentStatus('success');
          
          // Nếu thanh toán thành công và chưa tạo appointment
          if (paymentData?.formData && !appointmentCreated) {
            console.log('🔄 Creating appointment after successful payment...');
            const appointmentResult = await createAppointment(paymentData.formData);
            if (appointmentResult) {
              console.log('✅ Appointment created successfully');
              setAppointmentCreated(true);
              // Hiển thị trang thành công sau 2 giây
              setTimeout(() => {
                console.log('🎉 Showing success page');
                setShowSuccessPage(true);
              }, 2000);
            } else {
              console.log('❌ Failed to create appointment');
            }
          }
        } else {
          console.log('⏳ No payment found yet, current status:', paymentStatus);
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

  // Hàm tạo appointment sau khi thanh toán thành công
  const createAppointment = async (formData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không có token để tạo appointment');
      return false;
    }

    try {
      // Validate required fields first
      const requiredFields = ['doctor_id', 'time_slot_id', 'name', 'age', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        console.error('❌ FormData received:', formData);
        return false;
      }

      // Thêm thông tin thanh toán vào formData
      const appointmentData = {
        ...formData,
        payment_status: 'Đã thanh toán', // Đã thanh toán
        payment_method: 'online', // Thanh toán online
        transaction_id: transaction.id, // Mã giao dịch
        paid_amount: service.price, // Số tiền đã thanh toán
        payment_date: new Date().toISOString() // Ngày thanh toán
      };

      console.log('📤 Creating appointment with data:', appointmentData);
      console.log('📤 API_URL:', API_URL);
      console.log('📤 Token exists:', !!token);

      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response statusText:', response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Appointment created successfully with payment status:', result);
        return true;
      } else {
        // Get raw response text first to see what server actually returns
        const responseText = await response.text();
        console.log('📥 Raw response:', responseText);
        
        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : { error: 'Empty response' };
        } catch (parseError) {
          console.log('📥 JSON parse failed:', parseError);
          errorData = { error: `Parse error: ${responseText}` };
        }
        
        console.error('❌ Error creating appointment:', {
          status: response.status,
          statusText: response.statusText,
          rawResponse: responseText,
          parsedError: errorData
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!paymentData) return; // Chờ paymentData được load
    
    setIsClient(true);
    loadBankInfo();
    
    const transactionId = `TDCARE${Date.now()}`;
    setTransaction(prev => ({ ...prev, id: transactionId, total: service.price }));

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [paymentData, service.price]);

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

  // Hiển thị loading nếu chưa có dữ liệu
  if (isLoading || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  // Hiển thị trang thành công sau khi thanh toán xong
  if (showSuccessPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-6">Lịch hẹn của bạn đã được xác nhận và ghi nhận.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Thông tin lịch hẹn</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Bệnh nhân:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bác sĩ:</span>
                <span className="font-medium">{service.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chuyên khoa:</span>
                <span className="font-medium">{paymentData.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày khám:</span>
                <span className="font-medium">{new Date(paymentData.appointmentDate + 'T00:00:00').toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giờ khám:</span>
                <span className="font-medium">{paymentData.appointmentTime}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 font-semibold">Số tiền đã thanh toán:</span>
                <span className="font-bold text-green-600">{formatVND(service.price)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                ✅ <strong>Xác nhận:</strong> Thanh toán đã được xác nhận và lịch hẹn đã được tạo thành công.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/profile/appointment')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Xem lịch hẹn của tôi
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Về trang chủ
              </button>
            </div>

            <div className="text-sm text-gray-500 mt-4">
              <p>📧 Thông tin chi tiết đã được gửi đến email: <strong>{user.email}</strong></p>
              <p>📱 Bạn cũng có thể xem lịch hẹn trong mục "Lịch hẹn của tôi" trong trang cá nhân.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                {/* Thông tin chuyển khoản thủ công */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3 text-center">Thông tin chuyển khoản</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ngân hàng:</span>
                            <span className="font-medium">Á Châu Bank (ACB)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Số tài khoản:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-medium">{bankInfo?.ACCOUNT_NO}</span>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(bankInfo?.ACCOUNT_NO || '')}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tên tài khoản:</span>
                            <span className="font-medium">{bankInfo?.ACCOUNT_NAME}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Số tiền:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-medium">{formatVND(service.price)}</span>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(service.price.toString())}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Nội dung:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-medium text-xs">{transaction.id}</span>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(transaction.id)}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-700 text-center">
                            💡 <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống có thể xác nhận thanh toán tự động.
                        </p>
                    </div>
                </div>

                {/* Nút tạo QR */}
                <div className="text-center mb-6">
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                    >
                        <ScanLine className="h-5 w-5" />
                        {showQR ? 'Ẩn mã QR' : 'Tạo mã QR'}
                    </button>
                </div>

                <div className="text-center bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-yellow-600">
                        <Clock size={20} />
                        <p className="font-medium">Giao dịch sẽ hết hạn sau:</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{formatTime(timeLeft)}</p>
                    
                    {/* Nút kiểm tra thanh toán thủ công */}
                    <div className="mt-4">
                        <button
                            onClick={checkPaymentHistory}
                            disabled={isCheckingPayment}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                        >
                            <RefreshCw className={`h-4 w-4 ${isCheckingPayment ? 'animate-spin' : ''}`} />
                            {isCheckingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                        </button>
                        
                        {/* Nút test để simulate thanh toán thành công */}
                        <button
                            onClick={async () => {
                                console.log('🧪 Testing payment success...');
                                setPaymentStatus('success');
                                if (paymentData?.formData && !appointmentCreated) {
                                    console.log('🔄 Creating appointment after test payment...');
                                    const appointmentResult = await createAppointment(paymentData.formData);
                                    if (appointmentResult) {
                                        console.log('✅ Test appointment created successfully');
                                        setAppointmentCreated(true);
                                        setTimeout(() => {
                                            setShowSuccessPage(true);
                                        }, 2000);
                                    }
                                }
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-2 mx-auto"
                        >
                            🧪 Test Thanh toán thành công
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Hệ thống sẽ tự động kiểm tra mỗi 30 giây, hoặc bạn có thể bấm nút trên để kiểm tra thủ công
                        </p>
                    </div>
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
              
              {paymentStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <ShieldCheck size={16} />
                    <span className="font-semibold">Thanh toán thành công!</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Đang tạo lịch hẹn... Vui lòng chờ trong giây lát.
                  </p>
                </div>
              )}
              
              {transaction.id && (
                <p className="text-xs text-center text-gray-400 mt-4">Mã giao dịch: {transaction.id}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Mã QR Thanh toán</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-80 h-80 mx-auto p-4 bg-white border-4 border-blue-500 rounded-lg flex items-center justify-center mb-4">
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
              
              <div className="text-left">
                <h4 className="font-semibold text-gray-700 mb-3">Hướng dẫn:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Mở ứng dụng Ngân hàng / Ví điện tử.</li>
                  <li>Chọn tính năng quét mã QR (QR Pay).</li>
                  <li>Quét mã và xác nhận giao dịch.</li>
                </ol>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
                <button
                  onClick={checkPaymentHistory}
                  disabled={isCheckingPayment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isCheckingPayment ? 'animate-spin' : ''}`} />
                  {isCheckingPayment ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;