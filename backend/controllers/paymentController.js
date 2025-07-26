const db = require('../config/db.config');

class PaymentController {
  // GET - Lấy thông tin payment settings
  getPaymentSettings(req, res) {
    db.query(
      'SELECT * FROM payment_settings ORDER BY id DESC LIMIT 1',
      (err, rows) => {
        if (err) {
          console.error('Error getting payment settings:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy thông tin thanh toán',
            error: err.message
          });
        }
        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy cấu hình thanh toán'
          });
        }
        res.status(200).json({
          success: true,
          data: rows[0],
          message: 'Lấy thông tin thanh toán thành công'
        });
      }
    );
  }

  // POST - Lưu thông tin payment settings
  savePaymentSettings(req, res) {
    const { bankName, accountNumber, accountHolder, tokenAuto, description } = req.body;
    if (!bankName || !accountNumber || !accountHolder || !tokenAuto) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }
    db.query(
      'SELECT id FROM payment_settings ORDER BY id DESC LIMIT 1',
      (err, existingRows) => {
        if (err) {
          console.error('Error checking payment settings:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server khi kiểm tra thông tin thanh toán',
            error: err.message
          });
        }
        if (existingRows.length > 0) {
          // Cập nhật cấu hình hiện tại
          db.query(
            `UPDATE payment_settings SET bank_name = ?, account_number = ?, account_holder = ?, token_auto = ?, description = ? WHERE id = ?`,
            [bankName, accountNumber, accountHolder, tokenAuto, description || null, existingRows[0].id],
            (err, updateResult) => {
              if (err) {
                console.error('Error updating payment settings:', err);
                return res.status(500).json({
                  success: false,
                  message: 'Lỗi server khi cập nhật thông tin thanh toán',
                  error: err.message
                });
              }
              res.status(200).json({
                success: true,
                data: { id: existingRows[0].id, affectedRows: updateResult.affectedRows },
                message: 'Lưu thông tin thanh toán thành công'
              });
            }
          );
        } else {
          // Tạo cấu hình mới
          db.query(
            `INSERT INTO payment_settings (bank_name, account_number, account_holder, token_auto, description) VALUES (?, ?, ?, ?, ?)`,
            [bankName, accountNumber, accountHolder, tokenAuto, description || null],
            (err, insertResult) => {
              if (err) {
                console.error('Error inserting payment settings:', err);
                return res.status(500).json({
                  success: false,
                  message: 'Lỗi server khi lưu thông tin thanh toán',
                  error: err.message
                });
              }
              res.status(200).json({
                success: true,
                data: { id: insertResult.insertId, affectedRows: insertResult.affectedRows },
                message: 'Lưu thông tin thanh toán thành công'
              });
            }
          );
        }
      }
    );
  }

  // PUT - Cập nhật thông tin payment settings
  updatePaymentSettings(req, res) {
    const { id } = req.params;
    const { bankName, accountNumber, accountHolder, tokenAuto, description } = req.body;
    if (!bankName || !accountNumber || !accountHolder || !tokenAuto) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }
    db.query(
      'SELECT id FROM payment_settings WHERE id = ?',
      [id],
      (err, existingRows) => {
        if (err) {
          console.error('Error checking payment settings:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server khi kiểm tra thông tin thanh toán',
            error: err.message
          });
        }
        if (existingRows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy cấu hình thanh toán'
          });
        }
        db.query(
          `UPDATE payment_settings SET bank_name = ?, account_number = ?, account_holder = ?, token_auto = ?, description = ? WHERE id = ?`,
          [bankName, accountNumber, accountHolder, tokenAuto, description || null, id],
          (err, updateResult) => {
            if (err) {
              console.error('Error updating payment settings:', err);
              return res.status(500).json({
                success: false,
                message: 'Lỗi server khi cập nhật thông tin thanh toán',
                error: err.message
              });
            }
            res.status(200).json({
              success: true,
              data: { id: parseInt(id), affectedRows: updateResult.affectedRows },
              message: 'Cập nhật thông tin thanh toán thành công'
            });
          }
        );
      }
    );
  }

  // DELETE - Xóa thông tin payment settings
  deletePaymentSettings(req, res) {
    const { id } = req.params;
    db.query(
      'SELECT id FROM payment_settings WHERE id = ?',
      [id],
      (err, existingRows) => {
        if (err) {
          console.error('Error checking payment settings:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi server khi kiểm tra thông tin thanh toán',
            error: err.message
          });
        }
        if (existingRows.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy cấu hình thanh toán'
          });
        }
        db.query(
          'DELETE FROM payment_settings WHERE id = ?',
          [id],
          (err, deleteResult) => {
            if (err) {
              console.error('Error deleting payment settings:', err);
              return res.status(500).json({
                success: false,
                message: 'Lỗi server khi xóa thông tin thanh toán',
                error: err.message
              });
            }
            res.status(200).json({
              success: true,
              data: { id: parseInt(id), affectedRows: deleteResult.affectedRows },
              message: 'Xóa thông tin thanh toán thành công'
            });
          }
        );
      }
    );
  }

  // POST - Check payment history từ API bên ngoài
  checkPaymentHistory(req, res) {
    const { token, account_number, transaction_id, amount } = req.body;
    
    if (!token || !account_number) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin token hoặc account_number'
      });
    }

    console.log('Checking payment with:', { token, account_number, transaction_id, amount });

    // Gọi API bên ngoài từ backend
    const https = require('https');
    
    // Token là một phần của URL path
    const options = {
      hostname: 'thueapibank.vn',
      port: 443,
      path: `/historyapiacbv2/${token}`,
      method: 'GET', // Thay đổi thành GET
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    console.log('Making request to:', options.hostname + options.path);

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      
      console.log('API Response status:', apiRes.statusCode);
      console.log('API Response headers:', apiRes.headers);
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        console.log('Raw API response:', data.substring(0, 500)); // Log 500 ký tự đầu
        
        try {
          // Kiểm tra xem response có phải JSON không
          if (data.trim().startsWith('<')) {
            console.error('API returned HTML instead of JSON');
            return res.status(500).json({
              success: false,
              message: 'API trả về HTML thay vì JSON. Có thể endpoint sai hoặc cần authentication.',
              rawResponse: data.substring(0, 200)
            });
          }
          
          const responseData = JSON.parse(data);
          console.log('Parsed API Response:', responseData);
          
          // Kiểm tra giao dịch
          const hasNewPayment = responseData.transactions?.some((txn) => {
            const amountMatch = txn.amount === amount;
            const typeMatch = txn.type === 'IN';
            
            console.log('Checking transaction:', {
              txnAmount: txn.amount,
              expectedAmount: amount,
              txnDescription: txn.description,
              txnType: txn.type,
              amountMatch,
              typeMatch
            });
            
            return amountMatch && typeMatch;
          });
          
          res.status(200).json({
            success: true,
            data: responseData,
            hasPayment: hasNewPayment,
            message: hasNewPayment ? 'Tìm thấy giao dịch thanh toán' : 'Chưa tìm thấy giao dịch'
          });
        } catch (error) {
          console.error('Error parsing API response:', error);
          console.error('Raw response that caused error:', data);
          res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý response từ API',
            error: error.message,
            rawResponse: data.substring(0, 200)
          });
        }
      });
    });

    apiReq.on('error', (error) => {
      console.error('Error calling external API:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gọi API bên ngoài',
        error: error.message
      });
    });

    apiReq.end(); // Không cần write data vì dùng GET
  }
}

module.exports = PaymentController; 