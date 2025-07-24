// routes/medical-records.js


// controllers/medicalRecordController.js
const getRecordsByCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT 
        a.id AS appointment_id,
        a.reason,
        a.created_at,
        a.doctor_id,
        c.name AS patient_name,
        c.email AS patient_email,
        mr.id AS medical_record_id,
        mr.diagnosis,
        mr.treatment,
        mr.notes
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      LEFT JOIN medical_records mr ON a.id = mr.appointment_id
      WHERE a.customer_id = ?
      ORDER BY a.created_at DESC`,
      [customerId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Lỗi khi lấy hồ sơ theo customer:', err);
    res.status(500).json({ error: 'Lỗi khi lấy hồ sơ bệnh án theo bệnh nhân.' });
  }
};

