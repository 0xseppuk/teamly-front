import { ConversationResponse } from '@/shared/services/conversations';
import {
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConversationItem } from './ConversationItem';

interface ChatSidebarProps {
  conversations: ConversationResponse[] | undefined;
  isLoading: boolean;
  selectedConversationId: string | null;
  isCollapsed: boolean;
  onSelectConversation: (conversation: ConversationResponse) => void;
  onToggleCollapse: () => void;
}

export function ChatSidebar({
  conversations,
  isLoading,
  selectedConversationId,
  isCollapsed,
  onSelectConversation,
  onToggleCollapse,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];

    // Sort by last_message_at (most recent first)
    const sorted = [...conversations].sort((a, b) => {
      const dateA = a.last_message_at
        ? new Date(a.last_message_at).getTime()
        : 0;
      const dateB = b.last_message_at
        ? new Date(b.last_message_at).getTime()
        : 0;

      return dateB - dateA;
    });

    if (!searchQuery.trim()) return sorted;

    const query = searchQuery.toLowerCase().trim();

    return sorted.filter((conv) =>
      conv.other_user.nickname.toLowerCase().includes(query),
    );
  }, [conversations, searchQuery]);

  return (
    <div
      className={`flex flex-col bg-white/60 dark:bg-default-50/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-default-100/20 overflow-hidden transition-all duration-300 ease-out ${
        isCollapsed ? 'w-[80px]' : 'w-[320px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[72px] px-5 border-b border-white/20 dark:border-default-100/20">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/10">
              <MessageCircle className="text-secondary" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Чаты</h2>
              <p className="text-xs text-default-500">
                {filteredConversations.length || 0} диалогов
              </p>
            </div>
          </div>
        )}
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-xl bg-default-100/50 hover:bg-default-200/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="text-default-600" size={18} />
          ) : (
            <PanelLeftClose className="text-default-600" size={18} />
          )}
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-b border-white/10 dark:border-default-100/10">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-default-400"
              size={16}
            />
            <input
              className="w-full h-10 pl-9 pr-9 bg-white/50 dark:bg-default-100/50 backdrop-blur-sm rounded-xl border border-white/30 dark:border-default-200/30 text-sm text-foreground placeholder:text-default-400 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
              placeholder="Поиск по никнейму..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 cursor-pointer"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-default-200 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-secondary/20 rounded-full" />
              <div className="absolute inset-0 w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
            {!isCollapsed && (
              <p className="text-sm text-default-400">Загрузка...</p>
            )}
          </div>
        ) : !filteredConversations.length ? (
          <div className="flex flex-col items-center justify-center h-32 gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-default-100/50">
              {searchQuery ? (
                <Search className="text-default-400" size={24} />
              ) : (
                <MessageCircle className="text-default-400" size={24} />
              )}
            </div>
            {!isCollapsed && (
              <p className="text-sm text-default-400 text-center">
                {searchQuery ? 'Ничего не найдено' : 'Нет диалогов'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isCollapsed={isCollapsed}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
