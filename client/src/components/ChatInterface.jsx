import { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, User, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export default function ChatInterface({ messages, isLoading, onSend, onStop }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />

            {/* Header */}
            <div className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <h1 className="font-semibold text-white tracking-tight">Pocket LLM</h1>
                    <div className="h-4 w-px bg-slate-800" />
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                        CPU Mode Active
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 z-0 custom-scrollbar scroll-smooth">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20 ring-1 ring-white/5">
                            <Sparkles size={32} className="text-sky-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-2">Welcome to Pocket LLM</h2>
                        <p className="text-slate-400 max-w-md text-center">
                            Your lightweight, offline-capable AI assistant. Type a message below to get started.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "flex gap-6 max-w-4xl mx-auto animate-in slide-in-from-bottom-2 duration-300",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <Sparkles size={16} className="text-sky-400" />
                            </div>
                        )}

                        <div className={clsx(
                            "px-6 py-4 rounded-2xl max-w-[85%] leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-sky-600 text-white rounded-br-sm shadow-sky-900/20"
                                : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm shadow-black/20"
                        )}>
                            <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={16} className="text-slate-400" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-950 z-10">
                <div className="max-w-4xl mx-auto relative">
                    <form onSubmit={handleSubmit} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message Pocket LLM..."
                            className="w-full bg-slate-900 text-white rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-sky-500/50 border border-slate-800 placeholder-slate-500 shadow-lg shadow-black/20 relative z-10 transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() && !isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white disabled:opacity-50 transition-colors z-20"
                        >
                            {isLoading ? (
                                <StopCircle size={24} onClick={(e) => { e.preventDefault(); onStop(); }} className="text-red-400 hover:text-red-300 animate-pulse" />
                            ) : (
                                <div className={clsx(
                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                    input.trim() ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" : "bg-transparent"
                                )}>
                                    <Send size={18} />
                                </div>
                            )}
                        </button>
                    </form>
                    <div className="text-center mt-3 text-xs text-slate-600 font-medium">
                        Pocket LLM runs locally. No data leaves your device.
                    </div>
                </div>
            </div>
        </div>
    );
}
