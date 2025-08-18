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
      <div style="margin-top:15px; padding:10px; border:1px solid #dc3545; background:#ffe6e6; border-radius:8px;">
        <p style="color:#dc3545; font-weight:bold;">THÔNG BÁO HOÀN TIỀN</p>
        <p>Bạn đã thanh toán cho lịch hẹn này. Vui lòng liên hệ phòng tài chính bệnh viện 
        qua số <strong>1900-xxxx</strong> hoặc email <strong>finance@benhvienabc.com</strong> 
        để yêu cầu hoàn tiền.</p>
      </div>
    `
    : '';

  const mailOptions = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: '❌ Lịch hẹn khám đã bị từ chối',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #dc3545;">THÔNG BÁO TỪ CHỐI LỊCH KHÁM</h2>
        <p>Chào <strong>${name}</strong>,</p>
        <p>Lịch hẹn của bạn đã bị từ chối với các thông tin sau:</p>
        <ul>
          <li><strong>Bác sĩ:</strong> ${doctor}</li>
          <li><strong>Ngày khám:</strong> ${date}</li>
          <li><strong>Thời gian:</strong> ${start} - ${end}</li>
          <li><strong>Lý do khám:</strong> ${reason}</li>
          <li><strong>Lý do từ chối:</strong> ${reject_reason || "Không có lý do cụ thể"}</li>
          <li><strong>Thanh toán:</strong> ${payment}</li>
        </ul>
        ${refundNote}
        <p>Mong bạn thông cảm vì sự bất tiện này.</p>
        <p>Trân trọng,<br><strong>${mailConfig.FROM_NAME || 'Bệnh viện ABC'}</strong></p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions, (err) => {
    if (err) console.error('❌ Lỗi gửi mail từ chối:', err);
  });
}


module.exports = { sendRejectionEmail };
