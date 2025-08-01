import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const type = searchParams.get('type'); // 'all' hoặc 'by-doctors'
    
    // Xác định endpoint dựa trên type
    let endpoint = '/api/admin/medical-records';
    if (type === 'by-doctors') {
      endpoint = '/api/admin/medical-records-by-doctors';
    }
    
    const response = await fetch(`${BACKEND_URL}${endpoint}?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Lỗi server' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json({ error: 'Lỗi kết nối server' }, { status: 500 });
  }
} 