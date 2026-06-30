// ============================================================
// Forum.js — Forum Diskusi Internal: Topik & Balasan
// ============================================================

import React, { useState } from 'react';
import { useApp } from '../App';

const CATEGORIES = ['Valas', 'Transfer', 'Warkat', 'Keaslian Uang'];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function NewTopicForm({ onClose }) {
  const { addForumTopic } = useApp();
  const [form, setForm] = useState({ title: '', category: CATEGORIES[0], author: '', branch: '', content: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    addForumTopic({
      ...form,
      author: form.author.trim() || 'Anonim',
      branch: form.branch.trim() || 'Cabang tidak disebutkan',
    });
    onClose();
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 animate-slide-up">
      <div className="font-semibold text-gray-700 mb-4">Buat Topik Baru</div>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Judul topik"
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none sm:col-span-2"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none bg-white"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          placeholder="Cabang (opsional)"
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none"
        />
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Nama / Username (opsional)"
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none sm:col-span-2"
        />
        <textarea
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Ceritakan temuan atau pertanyaan Anda..."
          rows={4}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-300 outline-none sm:col-span-2 resize-none"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Batal</button>
        <button type="submit" className="px-4 py-2 rounded-xl text-sm bg-primary-500 text-white font-medium shadow-sm hover:bg-primary-600">Posting Topik</button>
      </div>
    </form>
  );
}

function ReplyForm({ topicId }) {
  const { addForumReply } = useApp();
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addForumReply(topicId, content.trim(), author.trim() || 'Anonim');
    setContent('');
  };

  return (
    <form onSubmit={submit} className="flex gap-2 mt-3">
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Nama"
        className="w-28 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary-300 outline-none"
      />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis balasan..."
        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary-300 outline-none"
      />
      <button type="submit" className="px-3 py-2 rounded-xl bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100">Kirim</button>
    </form>
  );
}

function TopicCard({ topic }) {
  const { likeForumTopic, viewForumTopic } = useApp();
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (!expanded) viewForumTopic(topic.id);
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-primary-50 text-primary-600">{topic.category}</span>
        <span className="text-xs text-gray-300 whitespace-nowrap">{timeAgo(topic.timestamp)}</span>
      </div>
      <button onClick={handleExpand} className="text-left w-full">
        <div className="font-semibold text-gray-800 mb-1.5 hover:text-primary-600 transition-colors">{topic.title}</div>
      </button>
      <div className="text-xs text-gray-400 mb-3">{topic.author} · {topic.branch}</div>
      <div className={`text-sm text-gray-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>{topic.content}</div>

      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <button onClick={() => likeForumTopic(topic.id)} className="flex items-center gap-1 hover:text-red-500 transition-colors">
          ❤️ {topic.likes || 0}
        </button>
        <button onClick={handleExpand} className="flex items-center gap-1 hover:text-primary-600 transition-colors">
          💬 {topic.replies?.length || 0} balasan
        </button>
        <span className="flex items-center gap-1">👁️ {topic.views || 0}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-slide-up">
          {topic.replies?.length > 0 && (
            <div className="space-y-3 mb-2">
              {topic.replies.map((r) => (
                <div key={r.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {r.author?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-700">{r.author}</span>
                      <span className="text-[10px] text-gray-300">{timeAgo(r.timestamp)}</span>
                    </div>
                    <div className="text-xs text-gray-600">{r.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <ReplyForm topicId={topic.id} />
        </div>
      )}
    </div>
  );
}

export default function Forum() {
  const { forumPosts } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const filtered = categoryFilter === 'Semua' ? forumPosts : forumPosts.filter((t) => t.category === categoryFilter);

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 mb-1">Forum Diskusi Internal</h1>
          <p className="text-sm text-gray-400">Berbagi temuan lapangan antar Teller dan Customer Service</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium shadow-sm hover:bg-primary-600 whitespace-nowrap flex-shrink-0"
        >
          + Topik Baru
        </button>
      </div>

      {showForm && <NewTopicForm onClose={() => setShowForm(false)} />}

      <div className="flex gap-2 mb-6 flex-wrap">
        {['Semua', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              categoryFilter === c ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Belum ada topik di kategori ini. Jadilah yang pertama!</div>
      ) : (
        filtered.map((t) => <TopicCard key={t.id} topic={t} />)
      )}
    </div>
  );
}
