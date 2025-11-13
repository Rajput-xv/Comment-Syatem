'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/services/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Email verification content component
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'no-token'>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('no-token');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => router.push('/login'), 2000);
      } catch (error: any) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <div className="max-w-md w-full glass-card rounded-2xl shadow-xl p-8 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Verifying Email</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-gray-600">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-2 text-gray-600">The verification link is invalid or has expired.</p>
            <Link
              href="/register"
              className="mt-6 inline-block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition"
            >
              Back to Register
            </Link>
          </>
        )}

        {status === 'no-token' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-gray-600">
              We've sent you a verification email. Please check your inbox and click the verification link.
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition"
              >
                Go to Login
              </Link>
              <Link
                href="/register"
                className="block w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Email verification page with Suspense wrapper
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
