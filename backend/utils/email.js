const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail.config');

const transporter = nodemailer.createTransport({
  host: mailConfig.HOST,
  port: mailConfig.PORT,
  secure: false,
  auth: {
    user: mailConfig.USERNAME,
    pass: mailConfig.PASSWORD,
  }
});

function sendRejectionEmail({ name, email, doctor, date, start, end, reason, payment, reject_reason }) {
  const refundNote = payment === 'Đã thanh toán'
    ? `
      <div style="margin-top:15px; padding:15px; border:1px solid #dc3545; background:#ffe6e6; border-radius:8px;">
        <p style="color:#dc3545; font-weight:bold;">THÔNG BÁO HOÀN TIỀN</p>
        <p>Quý khách đã thực hiện thanh toán cho lịch hẹn này. 
        Vui lòng liên hệ với <strong>Phòng Tài chính</strong> của bệnh viện qua số 
        <strong>1900-8888</strong> hoặc email <strong>support@healthfirst.vn</strong> 
        để được hỗ trợ hoàn tiền trong thời gian sớm nhất.</p>
      </div>
    `
    : '';

  const mailOptions = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: '❌ Thông báo từ chối lịch hẹn khám tại bệnh viện',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background: #fdfdfd;">
        
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="TDCARE Logo" style="height: 80px;" />
        </div>

        <!-- Title -->
        <h2 style="color: #dc3545; text-align: center;">THÔNG BÁO TỪ CHỐI LỊCH KHÁM</h2>

        <!-- Greeting -->
        <p>Chào <strong>${name}</strong>,</p>

        <!-- Content -->
        <p>Chúng tôi rất tiếc phải thông báo rằng lịch hẹn khám của quý khách không thể thực hiện được. 
        Thông tin chi tiết của lịch hẹn đã bị từ chối như sau:</p>

        <!-- Details -->
        <ul style="line-height: 1.6;">
          <li><strong>Bác sĩ dự kiến phụ trách khám cho quý khách là:</strong> ${doctor}</li>
          <li><strong>Ngày khám đã được đặt là:</strong> ${date}</li>
          <li><strong>Thời gian khám dự kiến:</strong> từ ${start} đến ${end}</li>
          <li><strong>Lý do khám mà quý khách đã đăng ký là:</strong> ${reason}</li>
          <li><strong>Lý do từ chối được đưa ra là:</strong> ${reject_reason || "Không có lý do cụ thể"}</li>
          <li><strong>Hình thức thanh toán đã được ghi nhận là:</strong> ${payment}</li>
          <li><strong>Địa chỉ bệnh viện: 116 Nguyễn Huy Tưởng, Thành phố Đà Nẵng</li>
        </ul>

        <!-- Refund (if any) -->
        ${refundNote}

        <!-- Closing -->
        <p>Chúng tôi thành thật xin lỗi vì sự bất tiện này và rất mong nhận được sự thông cảm từ quý khách.</p>
        <p>Quý khách có thể liên hệ với chúng tôi để đặt lại lịch hẹn vào thời gian khác thuận tiện hơn.</p>

        <!-- Signature -->
        <p>Trân trọng,<br><strong>${mailConfig.FROM_NAME || 'Bệnh viện HEAL THFIRST'}</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.jpeg',
        path: 'https://i.imgur.com/bUBPKF9.jpeg', // link logo của bạn
        cid: 'logo'
      }
    ]
  };

  return transporter.sendMail(mailOptions, (err) => {
    if (err) console.error('❌ Lỗi gửi mail từ chối:', err);
    else console.log('✅ Email từ chối đã được gửi thành công!');
  });
}


module.exports = { sendRejectionEmail };
