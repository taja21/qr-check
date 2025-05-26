// 📄 app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-qr-code';
import * as XLSX from 'xlsx';

export default function AdminListPage() {
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const { data } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setForms(data);
  };

  const handleDelete = async (id: string) => {
    const ok = confirm('정말 이 출석 항목을 삭제하시겠습니까?');
    if (!ok) return;

    const { error } = await supabase.from('forms').delete().eq('id', id);
    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      setForms(prev => prev.filter(form => form.id !== id));
    }
  };

  const handleExcelUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    formId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      const validColumns = ['성명', '부서', '직급', '전화번호', '생년월일'];
      const firstRow = json[0];
      const keys = Object.keys(firstRow || {});
      const isValid = validColumns.every(col => keys.includes(col));

      if (!isValid) {
        alert('엑셀 컬럼명이 잘못되었습니다. 다음 컬럼이 필요합니다: ' + validColumns.join(', '));
        return;
      }

      const inserts = (json as any[]).map(row => ({
        form_id: formId,
        data: {
          성명: row['성명'] || '',
          부서: row['부서'] || '',
          직급: row['직급'] || '',
          전화번호: row['전화번호'] || '',
          생년월일: row['생년월일'] || '',
        },
      }));

      const { error } = await supabase.from('candidates').insert(inserts);
      if (error) {
        alert('엑셀 업로드 실패: ' + error.message);
      } else {
        alert('엑셀 업로드 성공');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <Link href="/" className="text-blue-600 underline mb-4 inline-block">🏠 홈</Link>
      <h1 className="text-2xl font-bold mb-6">📝 출석 관리</h1>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-center">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="p-3 border-r">제목</th>
              <th className="p-3 border-r">생성일</th>
              <th className="p-3 border-r">QR 및 다운로드</th>
              <th className="p-3 border-r">엑셀 업로드</th>
              <th className="p-3">삭제</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form.id} className="hover:bg-gray-50 border-b">
                <td className="p-3 border-r text-left">
                  <Link href={`/admin/${form.id}`} className="text-blue-600 underline">
                    {form.title}
                  </Link>
                </td>
                <td className="p-3 border-r">
                  {new Date(form.created_at).toLocaleString()}
                </td>
                <td className="p-3 border-r">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white p-2 rounded shadow">
                      <QRCode
                        value={`http://localhost:3000/checkin?form_id=${form.id}`}
                        size={64}
                      />
                    </div>
                    <a
                      href={`http://localhost:3000/checkin?form_id=${form.id}`}
                      download
                      className="text-xs text-blue-500 underline"
                    >
                      QR 다운로드
                    </a>
                  </div>
                </td>
                <td className="p-3 border-r">
                  <label className="inline-block bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200 text-sm text-black">
                    📁 엑셀 업로드
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) => handleExcelUpload(e, form.id)}
                      className="hidden"
                    />
                  </label>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
