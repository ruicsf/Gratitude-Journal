import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Auth } from './components/Auth/Auth';
import { Layout } from './components/Layout/Layout';
import { EntryForm } from './components/EntryForm/EntryForm';
import { EntryList } from './components/EntryList/EntryList';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      console.log('Auth state changed:', user?.email || 'Not logged in');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <EntryForm content={content} setContent={setContent} editingId={editingId} setEditingId={setEditingId} />
        <EntryList setContent={setContent} setEditingId={setEditingId} />
      </div>
    </Layout>
  );
}

export default App;
