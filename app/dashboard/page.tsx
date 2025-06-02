'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setError('사용자 정보를 확인할 수 없습니다. 다시 로그인 해주세요.');
        setTimeout(() => router.push('/login'), 3000); // 3초 후 로그인 페이지 이동
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">📋 내 대시보드</h1>

      {loading && <p>세션 확인 중...</p>}

      {!loading && error && (
        <p className="text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && user && (
        <p className="text-green-600">환영합니다, {user.email}</p>
      )}
    </main>
  );
}
