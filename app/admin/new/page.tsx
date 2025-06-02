'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function NewFormPage() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<string[]>([]);
  const [customField, setCustomField] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const predefinedFields = [
    '부서',
    '직급',
    '성명',
    '생년월일(800303)',
    '전화번호(뒤 4자리)',
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session || error) {
        alert('사용자 정보를 확인할 수 없습니다. 다시 로그인 해주세요.');
        router.replace('/login');
      } else {
        setUser(session.user);
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const toggleField = (field: string) => {
    setFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleAddCustomField = () => {
    const trimmed = customField.trim();
    if (trimmed && !fields.includes(trimmed)) {
      setFields(prev => [...prev, trimmed]);
    }
    setCustomField('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || fields.length === 0 || !user) {
      alert('제목, 항목, 로그인 여부를 확인하세요.');
      return;
    }

    const { data, error } = await supabase
      .from('forms')
      .insert({
        title,
        fields,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      alert('저장 실패: ' + error.message);
    } else {
      alert('출석관리 페이지가 만들어졌습니다.');
      router.push('/admin'); // ✅ 출석 관리 페이지로 이동
    }
  };

  if (loading) {
    return <p className="text-center mt-10">사용자 정보를 확인 중입니다...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">✅ 출석 체크 항목 만들기 및 QR 생성</h1>

      <label className="block mb-2 text-sm font-medium">출석 제목</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="예: 2025 정보보호 교육"
        className="w-full p-2 border rounded mb-4"
      />

      <h2 className="text-base font-bold mb-2">출석 체크 항목 선택</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        {predefinedFields.map(field => (
          <label key={field} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={fields.includes(field)}
              onChange={() => toggleField(field)}
            />
            {field}
          </label>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <input
          value={customField}
          onChange={e => setCustomField(e.target.value)}
          placeholder="추가 항목 입력"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleAddCustomField}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          추가
        </button>
      </div>

      <p className="mt-2 font-bold text-base text-blue-600">
        선택된 항목: {fields.join(', ') || '없음'}
      </p>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        출석 관리 페이지 만들기
      </button>
    </div>
  );
}
