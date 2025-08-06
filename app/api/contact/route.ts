import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('API Contact được gọi');
    const { name, email, phone, subject, message } = await request.json();
    console.log('Dữ liệu nhận được:', { name, email, phone, subject, message });
    
    // Tạo transporter cho email - sử dụng cấu hình cố định
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chinhnvpd10204@gmail.com',
        pass: 'zibh qdzl wlfo nxuu',
      },
    });

    // Email gửi đến admin
    const adminMailOptions = {
      from: 'chinhnvpd10204@gmail.com',
      to: 'chinhnvpd10204@gmail.com',
      subject: `Tin nhắn liên hệ mới: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Tin Nhắn Liên Hệ Mới
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Thông Tin Người Gửi</h3>
            <p><strong>Họ và tên:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Số điện thoại:</strong> ${phone}</p>
            <p><strong>Tiêu đề:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1e293b; margin-top: 0;">Nội Dung Tin Nhắn</h3>
            <p style="line-height: 1.6; color: #475569;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      `,
    };

    // Email cảm ơn gửi cho khách hàng
    const thankYouMailOptions = {
      from: 'chinhnvpd10204@gmail.com',
      to: email,
      subject: 'Cảm ơn bạn đã liên hệ với HealthFirst Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">HealthFirst Clinic</h1>
            <p style="color: #64748b; font-size: 18px;">Cảm ơn bạn đã liên hệ với chúng tôi!</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin-top: 0;">Xin chào ${name},</h2>
            <p style="line-height: 1.6; color: #475569; font-size: 16px;">
              Chúng tôi đã nhận được tin nhắn của bạn và rất cảm ơn vì đã quan tâm đến HealthFirst Clinic. 
              Đội ngũ của chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất có thể.
            </p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin-top: 0;">Thông Tin Tin Nhắn Của Bạn</h3>
            <p><strong>Tiêu đề:</strong> ${subject}</p>
            <p><strong>Nội dung:</strong> ${message}</p>
            <p><strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e40af; margin-top: 0;">Thông Tin Liên Hệ Khác</h3>
            <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> 116 Nguyễn Huy Tưởng, Phường Hòa Minh, Quận Liên Chiểu, TP. Đà Nẵng</p>
            <p style="margin: 5px 0;"><strong>Điện thoại:</strong> 0344 757 955</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> chinhnvpd10204@gmail.com</p>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Nếu bạn có bất kỳ câu hỏi nào khác, đừng ngần ngại liên hệ với chúng tôi.
            </p>
            <p style="margin: 10px 0 0 0; color: #2563eb; font-weight: bold;">
              Trân trọng,<br>
              Đội ngũ HealthFirst Clinic
            </p>
          </div>
        </div>
      `,
    };

    // Gửi email đến admin
    await transporter.sendMail(adminMailOptions);
    
    // Gửi email cảm ơn cho khách hàng
    await transporter.sendMail(thankYouMailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Tin nhắn đã được gửi thành công!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.' 
      },
      { status: 500 }
    );
  }
} 