// 📄 app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  // 선택적으로 최근 출석 체크 ID를 사용할 수 있도록 예시 변수 선언
  const latestFormId = ''; // or 예: 'a39de95d-xxxx-xxxx'

  return (
    <main className="p-4 space-y-6 max-w-xl mx-auto">
      
      <h1 className="text-3xl font-bold">🎓 출석 체크 시스템</h1>

      <p className="text-gray-600">
        아래 기능을 선택하세요. 출석 항목을 만들고, QR 코드로 출석을 관리할 수 있습니다.
      </p>

      <ul className="list-disc list-inside space-y-2">
        <li>
          <Link href="/admin/new" className="text-blue-600 underline">
            📌 출석 체크 항목 및 QR 생성하기
          </Link>
        </li>
        <li>
          <Link href="/admin" className="text-blue-600 underline">
            📋 출석 관리 페이지 보기
          </Link>
        </li>
        {latestFormId && (
          <li>
            <span className="text-gray-700">
              📱 출석 체크 URL:{' '}
              <Link
                href={`/checkin?form_id=${latestFormId}`}
                className="text-blue-600 underline"
              >
                /checkin?form_id={latestFormId}
              </Link>
            </span>
          </li>
        )}
      </ul>
    </main>
  );
}
