import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Settings, Box } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar({ currentSessionId, onLoadSession, onNewChat }) {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchSessions();
    }, [currentSessionId]);

    const fetchSessions = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/sessions');
            const data = await res.json();
            setSessions(data);
        } catch (err) {
            console.error('Failed to fetch sessions', err);
        }
    };

    return (
        <div className="w-72 bg-zinc-900 text-zinc-400 flex flex-col h-screen border-r border-zinc-800">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 text-zinc-100">
                <div className="w-8 h-8 bg-teal-200 rounded-lg flex items-center justify-center shadow-lg shadow-teal-900/20">
                    <Box size={20} className="text-teal-900" />
                </div>
                <span className="font-bold text-lg tracking-tight">Pocket LLM</span>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 bg-zinc-100 text-zinc-900 px-4 py-3 rounded-xl font-medium hover:bg-white transition-all shadow-sm active:scale-[0.98] group"
                >
                    <Plus size={20} className="text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                    <span>New Chat</span>
                </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                <div className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2 mt-2">History</div>
                {sessions.map(session => (
                    <div key={session.id} className="group relative">
                        <button
                            onClick={() => onLoadSession(session.id)}
                            className={clsx(
                                "w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all pr-10",
                                currentSessionId === session.id
                                    ? "bg-zinc-800 text-zinc-100 shadow-sm ring-1 ring-white/5"
                                    : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                            )}
                        >
                            <MessageSquare size={16} className={clsx(
                                "transition-colors",
                                currentSessionId === session.id ? "text-rose-300" : "text-zinc-600 group-hover:text-zinc-500"
                            )} />
                            <span className="truncate text-sm font-medium">{session.title}</span>
                        </button>
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this chat?')) {
                                    try {
                                        await fetch(`http://localhost:3001/api/sessions/${session.id}`, { method: 'DELETE' });
                                        fetchSessions();
                                        if (currentSessionId === session.id) onNewChat();
                                    } catch (err) {
                                        console.error('Failed to delete session', err);
                                    }
                                }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-700/50 rounded-md"
                            title="Delete Chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800">
                {/* Settings removed as per requirements */}
            </div>
        </div>
    );
}
