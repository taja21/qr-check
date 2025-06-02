// ✅ app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        alert('세션 복원 실패. 다시 로그인해주세요.');
        router.replace('/login');
      } else {
        router.replace('/dashboard');
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center mt-20">로그인 세션 확인 중...</p>;
}
