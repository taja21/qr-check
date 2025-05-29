// app/checkin/page.tsx (서버 컴포넌트)
import { Suspense } from 'react';
import CheckinClient from './CheckinClient';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CheckinClient />
    </Suspense>
  );
}
