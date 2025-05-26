// 📄 app/api/attendance/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function maskPhoneSuffix(suffix: string): string {
  const rand3 = Math.floor(100 + Math.random() * 900);  // 3자리
  const rand2 = Math.floor(10 + Math.random() * 90);    // 2자리
  return `${rand3}${suffix}${rand2}`;
}

// generate deterministic masked phone with fixed seed-style for comparison
function generateMaskedPhoneOptions(suffix: string): string[] {
  const results = [];
  for (let r3 = 100; r3 <= 999; r3++) {
    for (let r2 = 10; r2 <= 99; r2++) {
      results.push(`${r3}${suffix}${r2}`);
    }
  }
  return results;
}

export async function POST(req: Request) {
  const { form_id, name, phone_suffix } = await req.json();

  if (!form_id || !name || !phone_suffix || phone_suffix.length !== 4) {
    return NextResponse.json({ error: '입력값이 올바르지 않습니다.' }, { status: 400 });
  }

  // Step 1: 사전 명단 존재 여부 확인
  const { data: attendees, error: attendeeError } = await supabase
    .from('attendees')
    .select('id')
    .eq('form_id', form_id)
    .limit(1);

  const hasWhitelist = attendees.length > 0;

  if (hasWhitelist) {
    // Step 2: 마스킹된 전화번호 리스트 생성
    const possiblePhones = generateMaskedPhoneOptions(phone_suffix);

    const { data: match } = await supabase
      .from('attendees')
      .select('id')
      .eq('form_id', form_id)
      .eq('name', name)
      .in('masked_phone', possiblePhones)
      .limit(1)
      .single();

    if (!match) {
      return NextResponse.json({ error: '등록된 교육 대상자가 아닙니다.' }, { status: 403 });
    }
  }

  // Step 3: 출석 저장
  const masked_phone = maskPhoneSuffix(phone_suffix);
  const { error: insertError } = await supabase.from('attendances').insert({
    form_id,
    name,
    masked_phone,
    checked_in_at: new Date().toISOString(),
  });

  if (insertError) {
    return NextResponse.json({ error: '출석 저장에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
