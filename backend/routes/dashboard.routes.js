// /routes/dashboard.js
// PHIÊN BẢN HOÀN CHỈNH - ĐẦY ĐỦ CHỨC NĂNG

const express = require('express');
const router = express.Router();
const db = require('../config/db.config');
const util = require('util');

if (db.query) {
  db.query = util.promisify(db.query);
}

// Hàm lấy dữ liệu thô cho biểu đồ (Đã sửa lỗi SQL 'only_full_group_by')
const getRawChartData = (range, doctorId) => {
    let dateFilter = '';
    let groupByExpression = ''; 
    let orderByExpression = '';
    let dateFormat = '';

    const dateColumn = 'dts.slot_date';
    const timeColumn = 'dts.start_time';

    switch (range) {
        case '1d':
            dateFormat = `HOUR(${timeColumn})`;
            dateFilter = `AND ${dateColumn} = CURDATE()`;
            groupByExpression = `HOUR(${timeColumn})`;
            orderByExpression = `HOUR(${timeColumn})`;
            break;
        case '1w':
            dateFormat = `DATE_FORMAT(${dateColumn}, '%d/%m')`;
            dateFilter = `AND ${dateColumn} BETWEEN DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()`;
            groupByExpression = `DATE(${dateColumn}), DATE_FORMAT(${dateColumn}, '%d/%m')`;
            orderByExpression = `DATE(${dateColumn})`;
            break;
        case '1m':
            dateFormat = `DATE_FORMAT(${dateColumn}, '%d/%m')`;
            dateFilter = `AND ${dateColumn} BETWEEN DATE_SUB(CURDATE(), INTERVAL 29 DAY) AND CURDATE()`;
            groupByExpression = `DATE(${dateColumn}), DATE_FORMAT(${dateColumn}, '%d/%m')`;
            orderByExpression = `DATE(${dateColumn})`;
            break;
        case '6m':
            dateFormat = `DATE_FORMAT(${dateColumn}, '%m/%Y')`;
            dateFilter = `AND ${dateColumn} >= DATE_SUB(CURDATE(), INTERVAL 5 MONTH)`;
            groupByExpression = `YEAR(${dateColumn}), MONTH(${dateColumn}), DATE_FORMAT(${dateColumn}, '%m/%Y')`;
            orderByExpression = `YEAR(${dateColumn}), MONTH(${dateColumn})`;
            break;
        case '1y':
            dateFormat = `DATE_FORMAT(${dateColumn}, '%m/%Y')`;
            dateFilter = `AND YEAR(${dateColumn}) = YEAR(CURDATE())`;
            groupByExpression = `YEAR(${dateColumn}), MONTH(${dateColumn}), DATE_FORMAT(${dateColumn}, '%m/%Y')`;
            orderByExpression = `YEAR(${dateColumn}), MONTH(${dateColumn})`;
            break;
        default:
            return Promise.resolve([]);
    }

    const sql = `
      SELECT ${dateFormat} AS label, COUNT(a.id) AS total
      FROM appointments a
      JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
      WHERE a.doctor_id = ? ${dateFilter}
      GROUP BY ${groupByExpression}
      ORDER BY ${orderByExpression} ASC;
    `;
    
    return db.query(sql, [doctorId]);
};

// Hàm tạo dữ liệu biểu đồ hoàn chỉnh (Đã sửa lỗi định dạng ngày tháng)
const getFullChartData = async (range, doctorId) => {
    const rawData = await getRawChartData(range, doctorId);
    const dataMap = new Map(rawData.map(item => [String(item.label), item.total]));
    let fullData = [];
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, '0');
    switch (range) {
        case '1d': for (let i = 0; i < 24; i++) { const label = String(i); fullData.push({ label: `${label}h`, total: dataMap.get(label) || 0 }); } break;
        case '1w': for (let i = 6; i >= 0; i--) { const date = new Date(); date.setDate(now.getDate() - i); const label = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`; fullData.push({ label, total: dataMap.get(label) || 0 }); } break;
        case '1m': for (let i = 29; i >= 0; i--) { const date = new Date(); date.setDate(now.getDate() - i); const label = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`; fullData.push({ label, total: dataMap.get(label) || 0 }); } break;
        case '6m': for (let i = 5; i >= 0; i--) { const date = new Date(now.getFullYear(), now.getMonth() - i, 1); const label = `${pad(date.getMonth() + 1)}/${date.getFullYear()}`; fullData.push({ label, total: dataMap.get(label) || 0 }); } break;
        case '1y': for (let i = 0; i < 12; i++) { const date = new Date(now.getFullYear(), i, 1); const label = `${pad(date.getMonth() + 1)}/${date.getFullYear()}`; fullData.push({ label, total: dataMap.get(label) || 0 }); } break;
    }
    return fullData;
}

// API CHÍNH: Lấy dữ liệu thống kê và biểu đồ
router.get('/:doctorId', async (req, res) => {
    const { doctorId } = req.params;
    const { range = '1m' } = req.query;

    if (!doctorId) { return res.status(400).json({ error: 'doctorId is required' }); }

    try {
        const dateColumn = 'dts.slot_date';
        const statsSql = `
          SELECT
            COUNT(CASE WHEN a.status = 'Chưa xác nhận' THEN 1 END) AS pending,
            COUNT(CASE WHEN a.status = 'Đã khám xong' THEN 1 END) AS completed,
            COUNT(CASE WHEN a.status = 'Đã khám xong' AND ${dateColumn} >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) THEN 1 END) AS completed_last_7_days,
            COUNT(CASE WHEN a.status = 'Đã khám xong' AND ${dateColumn} >= DATE_SUB(CURDATE(), INTERVAL 29 DAY) THEN 1 END) AS completed_last_30_days,
            COUNT(CASE WHEN a.status = 'Đã khám xong' AND YEAR(${dateColumn}) = YEAR(CURDATE()) THEN 1 END) AS completed_current_year,
            COUNT(CASE WHEN a.status = 'Đã hủy' THEN 1 END) AS cancelled,
            COUNT(CASE WHEN a.status = 'Từ chối' THEN 1 END) AS rejected
          FROM appointments a
          LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
          WHERE a.doctor_id = ?;
        `;
        const [statsResult, chartData] = await Promise.all([
            db.query(statsSql, [doctorId]),
            getFullChartData(range, doctorId)
        ]);
        res.status(200).json({ ...statsResult[0], chart: chartData });
    } catch (error) {
        console.error("--- ERROR: Dashboard API Failed ---", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy dữ liệu dashboard.', errorDetails: error.sqlMessage || error.message });
    }
});

// API MỚI: Lấy danh sách bệnh nhân chi tiết
router.get('/:doctorId/patients', async (req, res) => {
    const { doctorId } = req.params;
    const { type } = req.query; 

    if (!doctorId || !type) { return res.status(400).json({ message: 'Thiếu doctorId hoặc type' }); }

    try {
        const dateColumn = 'dts.slot_date';
        let condition = '';

        switch (type) {
            case 'pending': condition = `AND a.status = 'Chưa xác nhận'`; break;
            case 'completed_total': condition = `AND a.status = 'Đã khám xong'`; break;
            case 'completed_last_7_days': condition = `AND a.status = 'Đã khám xong' AND ${dateColumn} >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)`; break;
            case 'completed_last_30_days': condition = `AND a.status = 'Đã khám xong' AND ${dateColumn} >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)`; break;
            case 'completed_current_year': condition = `AND a.status = 'Đã khám xong' AND YEAR(${dateColumn}) = YEAR(CURDATE())`; break;
            case 'cancelled': condition = `AND a.status = 'Đã hủy'`; break;
            case 'rejected': condition = `AND a.status = 'Từ chối'`; break;
            default: return res.status(400).json({ message: 'Loại thống kê không hợp lệ' });
        }

        const sql = `
            SELECT a.name, a.age, a.gender, dts.slot_date AS appointment_date, a.status
            FROM appointments a
            LEFT JOIN doctor_time_slot dts ON a.time_slot_id = dts.id
            WHERE a.doctor_id = ? ${condition}
            ORDER BY dts.slot_date DESC, a.id DESC;
        `;

        const patients = await db.query(sql, [doctorId]);
        res.status(200).json(patients);

    } catch (error) {
        console.error(`--- ERROR: Lấy danh sách bệnh nhân thất bại (type: ${type}) ---`, error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách bệnh nhân.', errorDetails: error.sqlMessage || error.message });
    }
});

module.exports = router;