import type { ReactNode } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut(auth);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '16px 32px' }} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              <h1 className="text-xl font-bold text-gray-800">Gratitude Journal</h1>
            </div>
            <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '500px', margin: '0 auto', padding: '32px' }}>
          {children}
        </main>
      </div>
  );
}
