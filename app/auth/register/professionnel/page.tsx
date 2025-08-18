'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterProfessionnelPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the agency registration page
    router.replace('/auth/register/agence');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-default-600">Redirection vers l'inscription agence...</p>
      </div>
    </div>
  );
}