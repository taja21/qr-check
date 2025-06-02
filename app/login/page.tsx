// ✅ app/login/page.tsx
'use client';

import { supabase } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    console.log('🔐 로그인 시도 중...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('❌ 로그인 오류:', error.message);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push('/dashboard');
    });
  }, [router]);

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">소셜 로그인</h1>
      <button
        onClick={handleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Google 로그인
      </button>
    </main>
  );
}

