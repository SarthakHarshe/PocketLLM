import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { useChatStream } from './hooks/useChatStream';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const {
    messages,
    isLoading,
    sendMessage,
    stopStream,
    clearChat,
    loadSession,
    currentSessionId
  } = useChatStream();

  const handleNewChat = () => {
    clearChat();
  };

  return (
    <div className="flex h-screen bg-zinc-950 font-sans antialiased selection:bg-teal-500/30 selection:text-teal-200">
      <Sidebar
        currentSessionId={currentSessionId}
        onLoadSession={loadSession}
        onNewChat={handleNewChat}
      />
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        onSend={sendMessage}
        onStop={stopStream}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
