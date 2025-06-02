'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { DownloadIcon, PinIcon } from 'lucide-react';

export default function AdminFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchForm();
    fetchCandidates();
  }, [id]);

  const fetchForm = async () => {
    const { data } = await supabase.from('forms').select('*').eq('id', id).single();
    if (data) setForm(data);
  };

  const fetchCandidates = async () => {
    const { data } = await supabase
      .from('candidates')
      .select('*')
      .eq('form_id', id)
      .order('created_at', { ascending: true });

    if (data) setCandidates(data);
  };

  const getAttendanceStatus = (candidate: any) => {
    return candidate.checked_in_at ? '출석' : '미출석';
  };

  const downloadCSV = () => {
    if (!form || !form.fields) return;

    const header = [...form.fields, '출석일시', '출석여부'];
    const rows = candidates.map(c => {
      const row = form.fields.map((field: string) => c.data?.[field] || '');
      row.push(c.checked_in_at || '');
      row.push(getAttendanceStatus(c));
      return row;
    });

    const csvContent = [header, ...rows]
      .map(row => row.map(v => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${form.title}.csv`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin')}
            className="text-blue-600 font-semibold flex items-center gap-1"
          >
            <span className="text-lg">📋</span>
            출석 관리 페이지 보기
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PinIcon className="w-5 h-5 text-red-500" />
            {form?.title || '출석 현황'}
          </h1>
        </div>

        <button
          onClick={downloadCSV}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm"
        >
          CSV 다운로드
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm text-center">
          <thead className="bg-gray-100">
            <tr className="border-b">
              {form?.fields?.map((field: string) => (
                <th key={field} className="p-3 border-r">{field}</th>
              ))}
              <th className="p-3 border-r">출석일시</th>
              <th className="p-3">출석여부</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={form?.fields?.length + 2} className="p-4 text-gray-500">
                  출석 데이터가 없습니다.
                </td>
              </tr>
            ) : (
              candidates.map((c, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b">
                  {form?.fields?.map((field: string) => (
                    <td key={field} className="p-2 border-r">
                      {c.data?.[field] || ''}
                    </td>
                  ))}
                  <td className="p-2 border-r">
                    {c.checked_in_at ? new Date(c.checked_in_at).toLocaleString() : ''}
                  </td>
                  <td className="p-2">
                    {getAttendanceStatus(c)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
