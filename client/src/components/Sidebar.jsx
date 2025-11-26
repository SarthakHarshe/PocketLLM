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
        <div className="w-72 bg-slate-950 text-slate-300 flex flex-col h-screen border-r border-slate-800/50">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <Box size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Pocket LLM</span>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 bg-white text-slate-900 px-4 py-3 rounded-xl font-medium hover:bg-slate-100 transition-all shadow-sm active:scale-[0.98]"
                >
                    <Plus size={20} />
                    <span>New Chat</span>
                </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
                <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">History</div>
                {sessions.map(session => (
                    <button
                        key={session.id}
                        onClick={() => onLoadSession(session.id)}
                        className={clsx(
                            "w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all group",
                            currentSessionId === session.id
                                ? "bg-slate-800/80 text-white shadow-sm ring-1 ring-white/5"
                                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        )}
                    >
                        <MessageSquare size={16} className={clsx(
                            "transition-colors",
                            currentSessionId === session.id ? "text-sky-400" : "text-slate-600 group-hover:text-slate-500"
                        )} />
                        <span className="truncate text-sm font-medium">{session.title}</span>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50">
                <button className="flex items-center gap-3 text-slate-400 hover:text-white w-full px-3 py-3 rounded-lg hover:bg-slate-900 transition-colors">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
}
