import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM doctors LIMIT 1');
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy bác sĩ' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Lỗi khi query DB:', err);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
