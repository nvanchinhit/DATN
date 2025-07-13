const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ntmtuan205@gmail.com',
    pass: 'gcce vdvv bezo pyjo'
  }
});

function sendConfirmationEmail({ name, email, doctor, date, start, end, reason, payment }) {
  const mailOptions = {
    from: 'ntmtuan205@gmail.com',
    to: email,
    subject: '✅ Lịch hẹn khám đã được xác nhận',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #007bff;">XÁC NHẬN LỊCH KHÁM</h2>
        <p>Chào <strong>${name}</strong>,</p>
        <p>Bệnh viện xin xác nhận bạn đã đặt lịch khám thành công với các thông tin sau:</p>
        <ul>
          <li><strong>Bác sĩ:</strong> ${doctor}</li>
          <li><strong>Ngày khám:</strong> ${date}</li>
          <li><strong>Thời gian:</strong> ${start} - ${end}</li>
          <li><strong>Lý do khám:</strong> ${reason}</li>
          <li><strong>Thanh toán:</strong> ${payment}</li>
        </ul>
        <p>Vui lòng đến trước 15 phút để làm thủ tục.</p>
        <p>Trân trọng,<br>Bệnh viện ABC</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('❌ Lỗi gửi mail:', err);
    else console.log('📧 Đã gửi mail xác nhận:', info.response);
  });
}
function sendRejectionEmail({ name, email, doctor, date, start, end, reason }) {
  const mailOptions = {
    from: 'ntmtuan205@gmail.com',
    to: email,
    subject: '❌ Lịch hẹn khám đã bị từ chối',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #dc3545;">THÔNG BÁO TỪ CHỐI LỊCH HẸN</h2>
        <p>Chào <strong>${name}</strong>,</p>
        <p>Bệnh viện xin thông báo rằng lịch hẹn khám của bạn <span style="color: red;"><strong>đã bị từ chối</strong></span> vì một số lý do (ví dụ: bác sĩ bận, khung giờ không khả dụng, v.v).</p>
        <p>Thông tin lịch hẹn bạn đã đăng ký:</p>
        <ul>
          <li><strong>Bác sĩ:</strong> ${doctor}</li>
          <li><strong>Ngày khám:</strong> ${date}</li>
          <li><strong>Thời gian:</strong> ${start} - ${end}</li>
          <li><strong>Lý do khám:</strong> ${reason || 'Không cung cấp'}</li>
        </ul>
        <p>Chúng tôi rất mong bạn thông cảm và vui lòng đặt lại lịch mới tại hệ thống.</p>
        <p>Trân trọng,<br><strong>Bệnh viện ABC</strong></p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('❌ Lỗi gửi mail:', err);
    else console.log('📧 Đã gửi mail từ chối:', info.response);
  });
}
module.exports = { sendConfirmationEmail,sendRejectionEmail };
