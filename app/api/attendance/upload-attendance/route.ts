// 📄 app/api/upload-attendees/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const form_id = formData.get('form_id') as string;

  if (!file || !form_id) {
    return NextResponse.json({ error: '파일 또는 세션 정보가 누락되었습니다.' }, { status: 400 });
  }

  const text = await file.text();
  const rows = text.trim().split('\n');
  const attendees = rows.slice(1).map(row => {
    const [name, phone_suffix] = row.split(',').map(s => s.trim());
    return { form_id, name, phone_suffix };
  });

  const { error } = await supabase.from('attendees').insert(attendees);

  if (error) {
    return NextResponse.json({ error: '명단 저장 실패: ' + error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
