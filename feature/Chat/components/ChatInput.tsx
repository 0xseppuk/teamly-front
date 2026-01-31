import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Send, Smile } from 'lucide-react';
import { KeyboardEvent, useRef, useState } from 'react';

const EMOJI_LIST = [
  '😀',
  '😂',
  '😊',
  '😍',
  '🥰',
  '😘',
  '😎',
  '🤔',
  '😢',
  '😭',
  '😤',
  '😡',
  '🥺',
  '😱',
  '🤗',
  '🤩',
  '👍',
  '👎',
  '👏',
  '🙌',
  '🤝',
  '✌️',
  '🤞',
  '💪',
  '❤️',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🖤',
  '💔',
  '🔥',
  '⭐',
  '✨',
  '💫',
  '🎉',
  '🎊',
  '💯',
  '👀',
  '😈',
  '👻',
  '💀',
  '🤖',
  '👾',
  '🎮',
  '🏆',
  '🚀',
];

interface ChatInputProps {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onTypingStart: () => void;
  onTypingEnd: () => void;
}

export function ChatInput({
  value,
  isSending,
  onChange,
  onSend,
  onTypingStart,
  onTypingEnd,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onChange(value + emoji);
    setIsEmojiOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 bg-white/60 dark:bg-default-50/60 backdrop-blur-xl border-t border-white/20 dark:border-default-100/20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 p-2 bg-white/70 dark:bg-default-100/70 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-default-200/30 shadow-sm">
          {/* Input field */}
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-default-400 outline-none px-2"
            placeholder="Написать сообщение..."
            type="text"
            value={value}
            onBlur={onTypingEnd}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onTypingStart}
            onKeyDown={handleKeyDown}
          />

          {/* Emoji picker */}
          <Popover
            isOpen={isEmojiOpen}
            placement="top-end"
            onOpenChange={setIsEmojiOpen}
          >
            <PopoverTrigger>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-xl text-default-400 hover:text-default-600 hover:bg-default-100/50 transition-all duration-200 cursor-pointer"
                type="button"
              >
                <Smile size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-3 bg-white/90 dark:bg-default-100/90 backdrop-blur-xl border border-white/30 dark:border-default-200/30 rounded-2xl shadow-xl">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    className="w-9 h-9 flex items-center justify-center text-xl hover:bg-default-100 rounded-lg transition-colors cursor-pointer"
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Send button */}
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
              value.trim() && !isSending
                ? 'bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:scale-105 active:scale-95'
                : 'bg-default-100 text-default-400 cursor-not-allowed'
            }`}
            disabled={!value.trim() || isSending}
            type="button"
            onClick={onSend}
          >
            <Send className={value.trim() ? '-rotate-45' : ''} size={18} />
          </button>
        </div>

        {/* Hint text */}
        <p className="text-[11px] text-default-400 text-center mt-2">
          Нажмите Enter для отправки
        </p>
      </div>
    </div>
  );
}
