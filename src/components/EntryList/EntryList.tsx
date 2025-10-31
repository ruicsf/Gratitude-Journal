import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import type { Entry } from '../../types';

const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];

type FilterType = 'all' | 'gratitude' | 'journal';

interface textAreaProps {
  setContent: (content: string) => void;
  setEditingId: (editingId: string) => void;
}

export function EntryList({setContent, setEditingId}: textAreaProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'entries'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entriesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Entry;
        });
        setEntries(entriesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching entries:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await deleteDoc(doc(db, 'entries', id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  const handleEdit = async (id: string) => {
    console.log("editing entry", id);

    for (const entry of entries) {
      if (entry.id === id) {
        setContent(entry.content);
        setEditingId(id);
      }

    }
  }

  const filteredEntries = entries.filter((entry) => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } else if (diffInHours < 168) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      }).format(date);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading your entries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 bg-white rounded-xl shadow-md p-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('gratitude')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            filter === 'gratitude'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🙏 Gratitude
        </button>
        <button
          onClick={() => setFilter('journal')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            filter === 'journal'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📝 Journal
        </button>
      </div>

      {/* Entries */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No entries yet</p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === 'all'
              ? 'Start by adding your first entry above'
              : `No ${filter} entries found`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition ${
                entry.type === 'gratitude'
                  ? 'border-l-4 border-purple-500'
                  : 'border-l-4 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{entry.mood ? moodEmojis[entry.mood - 1] : '😐'}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        entry.type === 'gratitude'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {entry.type === 'gratitude' ? '🙏 Gratitude' : '📝 Journal'}
                    </span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  {entry.title && (
                    <h3 className="font-semibold text-gray-800 mb-2">{entry.title}</h3>
                  )}

                  {/* Content */}
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{entry.content}</p>
                </div>

                {/* Edit btn */}
                <button
                    onClick={() => handleEdit(entry.id)}
                    className="text-blue-500 hover:text-blue-950 font-bold"
                    aria-label="Edit"
                >
                  Edit
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
                  aria-label="Delete entry"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
