// 📄 app/checkin/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CheckinPage() {
  const searchParams = useSearchParams();
  const form_id = searchParams.get('form_id');
  const [name, setName] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form_id || name.trim() === '' || phoneSuffix.trim().length !== 4) {
      return setMessage('이름과 전화번호 4자리를 정확히 입력하세요.');
    }
    setSubmitting(true);
    const res = await fetch('/api/attendance', {
      method: 'POST',
      body: JSON.stringify({ form_id, name, phone_suffix: phoneSuffix }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (json.success) {
      setMessage('✅ 출석이 완료되었습니다.');
    } else {
      setMessage(`❗ ${json.error || '출석 실패'}`);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 space-y-5 text-center">
      <h1 className="text-2xl font-bold">📲 출석 체크</h1>
      <p className="text-gray-600 text-sm">이름과 전화번호 뒷 4자리를 입력하세요.</p>

      <div className="space-y-4 text-left">
        <div>
          <label className="block mb-1 font-medium">성명</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">전화번호 뒷 4자리</label>
          <input
            type="text"
            value={phoneSuffix}
            onChange={e => setPhoneSuffix(e.target.value)}
            placeholder="1234"
            className="w-full px-4 py-2 border rounded"
            maxLength={4}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          출석하기
        </button>
      </div>

      {message && <p className="text-sm text-red-600 mt-4">{message}</p>}
    </main>
  );
}
