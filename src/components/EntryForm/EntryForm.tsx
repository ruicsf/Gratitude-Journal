import {useState} from 'react';
import {collection, addDoc, updateDoc, serverTimestamp, doc} from 'firebase/firestore';
import {db, auth} from '../../lib/firebase';
import type {EntryType, MoodRating} from '../../types';

const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];

interface EntryFormProps {
    onSuccess?: () => void;
    content: string;
    setContent: (value: string) => void;
    editingId: string | null;
    setEditingId: (editingId: string | null) => void;
}

export function EntryForm({onSuccess, content, setContent, editingId, setEditingId}: EntryFormProps) {
    const [type, setType] = useState<EntryType>('gratitude');
    const [title, setTitle] = useState('');
    const [mood, setMood] = useState<MoodRating>(3);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.currentUser) {
            setError('You must be logged in to add an entry');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editingId != null) {
                await updateDoc(doc(db, 'entries', editingId), {
                    type,
                    title: title.trim() || null,
                    content: content.trim(),
                    mood,
                    updatedAt: serverTimestamp(),
                  })
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'entries'), {
                    type,
                    title: title.trim() || null,
                    content: content.trim(),
                    mood,
                    userId: auth.currentUser.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }

            // Reset form
            setTitle('');
            setContent('');
            setMood(3);

            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'Failed to save entry');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Entry Type Selection */}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setType('gratitude')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                            type === 'gratitude'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        🙏 Gratitude
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('journal')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                            type === 'journal'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📝 Journal
                    </button>
                </div>

                {/* Title (optional, more relevant for journal) */}
                {type === 'journal' && (
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title (optional)
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your entry a title..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                    </div>
                )}

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        {type === 'gratitude' ? "What are you grateful for today?" : "What's on your mind?"}
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e)
                            }
                        }}
                        required
                        rows={6}
                        placeholder={
                            type === 'gratitude'
                                ? 'I am grateful for...'
                                : 'Write your thoughts here...'
                        }
                        className="w-full rounded-lg  px-2 shadow-nice shadow-hover"
                    />
                </div>

                {/* Mood Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-5 ">
                        How are you feeling?
                    </label>
                    <div className="flex justify-between gap-2">
                        {moodEmojis.map((emoji, index) => {
                            const moodValue = (index + 1) as MoodRating;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setMood(moodValue)}
                                    className={`flex-1 py-3 text-2xl rounded-lg transition ${
                                        mood === moodValue
                                            ? 'bg-purple-100 ring-2 ring-purple-500 scale-110'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    {emoji}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !content.trim()}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                        type === 'gratitude'
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {loading ? 'Saving...' : 'Save Entry'}
                </button>
            </form>
        </div>
    );
}
