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
    const { token, account_number, transaction_id, amount, appointment_id } = req.body;
    
    if (!token || !account_number || !transaction_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin token, account_number, transaction_id hoặc amount'
      });
    }

    console.log('Checking payment with:', { token, account_number, transaction_id, amount, appointment_id });

    const https = require('https');
    
    const options = {
      hostname: 'thueapibank.vn',
      port: 443,
      path: `/historyapiacbv2/${token}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    console.log('Making request to:', options.hostname + options.path);

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      
      console.log('API Response status:', apiRes.statusCode);
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        console.log('Raw API response received.');
        
        try {
          if (data.trim().startsWith('<')) {
            console.error('API returned HTML instead of JSON');
            return res.status(500).json({
              success: false,
              message: 'API trả về HTML thay vì JSON. Có thể token sai hoặc hết hạn.',
            });
          }
          
          const responseData = JSON.parse(data);
          
          console.log('📊 API Response Data:', JSON.stringify(responseData, null, 2));
          
          // ================================================================
          // <<< CẢI THIỆN LOGIC KIỂM TRA >>>
          // ================================================================
          
          const transactions = responseData.transactions || [];
          console.log(`🔍 Found ${transactions.length} transactions to check`);
          
          // Log tất cả giao dịch để debug
          transactions.forEach((txn, index) => {
            console.log(`📋 Transaction ${index + 1}:`, {
              description: txn.description,
              amount: txn.amount,
              type: txn.type,
              date: txn.transactionDate || txn.date
            });
          });
          
          // Tìm giao dịch phù hợp với logic nghiêm ngặt
          const foundTransaction = transactions.find(txn => {
            // 1. Kiểm tra số tiền - PHẢI CHÍNH XÁC TUYỆT ĐỐI
            const amountMatch = txn.amount === amount;
            
            // 2. Kiểm tra loại giao dịch - PHẢI LÀ 'IN' (tiền vào)
            const typeMatch = txn.type === 'IN';
            
            // 3. Kiểm tra nội dung chuyển khoản - PHẢI CHỨA transaction_id
            const descriptionMatch = txn.description && txn.description.includes(transaction_id);
            
            // Log chi tiết cho từng giao dịch
            console.log(`🔍 Checking TXN [${txn.description}]:`, {
              amountMatch: `${txn.amount} vs ${amount} (${amountMatch ? '✅' : '❌'})`,
              typeMatch: `${txn.type} (${typeMatch ? '✅' : '❌'})`,
              descriptionMatch: `${descriptionMatch ? '✅' : '❌'}`
            });

            return amountMatch && typeMatch && descriptionMatch;
          });

          // Trả về kết quả
          if (foundTransaction) {
            console.log('✅ VALID TRANSACTION FOUND:', foundTransaction);
            
            // Cập nhật database nếu có appointment_id
            if (appointment_id) {
              const updateSql = `
                UPDATE appointments 
                SET payment_status = 'Đã thanh toán', 
                    payment_method = 'online',
                    transaction_id = ?,
                    paid_amount = ?,
                    payment_date = NOW()
                WHERE id = ?
              `;
              
              db.query(updateSql, [transaction_id, amount, appointment_id], (updateErr, updateResult) => {
                if (updateErr) {
                  console.error('❌ Error updating appointment payment status:', updateErr);
                } else {
                  console.log('✅ Appointment payment status updated successfully');
                }
              });
            }
            
            res.status(200).json({
              success: true,
              hasPayment: true,
              transactionDetails: {
                description: foundTransaction.description,
                amount: foundTransaction.amount,
                transactionDate: foundTransaction.transactionDate || foundTransaction.date
              },
              message: 'Tìm thấy giao dịch thanh toán hợp lệ.'
            });
          } else {
            console.log('⏳ No valid transaction found yet.');
            console.log('💡 Debug info:', {
              expectedAmount: amount,
              expectedTransactionId: transaction_id,
              totalTransactions: transactions.length,
              recentTransactions: transactions.slice(0, 3).map(t => ({
                description: t.description,
                amount: t.amount,
                type: t.type
              }))
            });
            
            res.status(200).json({
              success: true,
              hasPayment: false,
              transactionDetails: null,
              message: 'Chưa tìm thấy giao dịch hợp lệ. Vui lòng kiểm tra lại thông tin thanh toán.',
              debug: {
                expectedAmount: amount,
                expectedTransactionId: transaction_id,
                totalTransactions: transactions.length
              }
            });
          }
        } catch (error) {
          console.error('Error parsing API response:', error);
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

    apiReq.end();
  }

  // POST - Test API thanh toán (chỉ để debug)
  testPaymentAPI(req, res) {
    const { token, account_number } = req.body;
    
    if (!token || !account_number) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin token hoặc account_number'
      });
    }

    console.log('🧪 Testing payment API with:', { token, account_number });

    const https = require('https');
    
    const options = {
      hostname: 'thueapibank.vn',
      port: 443,
      path: `/historyapiacbv2/${token}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const apiReq = https.request(options, (apiRes) => {
      let data = '';
      
      console.log('🧪 API Response status:', apiRes.statusCode);
      
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      
      apiRes.on('end', () => {
        console.log('🧪 Raw API response received.');
        
        try {
          if (data.trim().startsWith('<')) {
            console.error('🧪 API returned HTML instead of JSON');
            return res.status(500).json({
              success: false,
              message: 'API trả về HTML thay vì JSON. Có thể token sai hoặc hết hạn.',
              rawResponse: data.substring(0, 500)
            });
          }
          
          const responseData = JSON.parse(data);
          
          res.status(200).json({
            success: true,
            message: 'API test thành công',
            data: {
              totalTransactions: responseData.transactions?.length || 0,
              recentTransactions: responseData.transactions?.slice(0, 5) || [],
              apiResponse: responseData
            }
          });
        } catch (error) {
          console.error('🧪 Error parsing API response:', error);
          res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý response từ API',
            error: error.message,
            rawResponse: data.substring(0, 500)
          });
        }
      });
    });

    apiReq.on('error', (error) => {
      console.error('🧪 Error calling external API:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gọi API bên ngoài',
        error: error.message
      });
    });

    apiReq.end();
  }

  // POST - Tạo QR code động
  generateQR(req, res) {
    const { bank_name, account_number, account_holder, amount, content } = req.body;
    
    if (!bank_name || !account_number || !account_holder || !amount || !content) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin cần thiết để tạo QR code'
      });
    }

    console.log('🎨 Generating QR code with:', { bank_name, account_number, account_holder, amount, content });

    try {
      // Tạo dữ liệu QR code theo chuẩn VietQR
      const qrData = {
        bankBin: '970416', // ACB Bank
        accountNo: account_number,
        amount: amount,
        format: 'text',
        template: 'compact2'
      };

      // Tạo URL QR code sử dụng API VietQR
      const qrCodeUrl = `https://img.vietqr.io/image/${qrData.bankBin}-${qrData.accountNo}-${qrData.template}.png?amount=${qrData.amount}&addInfo=${encodeURIComponent(content)}`;

      console.log('✅ QR code generated successfully:', qrCodeUrl);

      res.status(200).json({
        success: true,
        message: 'Tạo QR code thành công',
        qrCodeUrl: qrCodeUrl,
        data: {
          bank_name,
          account_number,
          account_holder,
          amount,
          content
        }
      });
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo QR code',
        error: error.message
      });
    }
  }
}

module.exports = PaymentController;