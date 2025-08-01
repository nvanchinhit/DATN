import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Lấy Authorization header từ request
    const authHeader = request.headers.get('authorization');
    
    // Tạo headers object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Thêm Authorization header nếu có
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${BACKEND_URL}/api/admin/doctors`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Lỗi server' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Lỗi kết nối server' }, { status: 500 });
  }
}