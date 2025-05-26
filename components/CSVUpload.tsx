// 📄 components/CSVUpload.tsx

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '../../components/ui/button';


export default function CSVUpload({ formId }: { formId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setStatus('📁 업로드할 파일을 선택하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('form_id', formId);

    const res = await fetch('/api/upload-attendees', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      setStatus('✅ 명단이 성공적으로 업로드되었습니다.');
    } else {
      setStatus(`❌ 오류: ${result.error}`);
    }
  };

  return (
    <div className="space-y-2">
      <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleUpload}>CSV 업로드</Button>
      {status && <div className="text-sm text-gray-600">{status}</div>}
    </div>
  );
}
