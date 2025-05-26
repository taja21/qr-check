// 📄 app/api/export-attendance/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const form_id = searchParams.get('form_id');

  if (!form_id) {
    return NextResponse.json({ error: 'form_id가 누락되었습니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('attendances')
    .select('name, masked_phone')
    .eq('form_id', form_id);

  if (error) {
    return NextResponse.json({ error: '출석 데이터 조회 실패' }, { status: 500 });
  }

  const csvRows = ["이름,전화번호_4자리"];
  data.forEach(row => {
    const suffix = row.masked_phone.slice(3, 7); // 3 + 4 + 2 구조에서 중간 4자리 추출
    csvRows.push(`${row.name},${suffix}`);
  });

  const csvContent = csvRows.join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename=attendance_${form_id}.csv`,
    },
  });
}