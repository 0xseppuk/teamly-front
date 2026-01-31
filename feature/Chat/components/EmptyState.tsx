import { MessageCircle, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative text-center px-6">
        {/* Icon container */}
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white/70 dark:bg-default-100/70 backdrop-blur-sm border border-white/30 dark:border-default-200/30 shadow-lg flex items-center justify-center">
            <MessageCircle className="w-9 h-9 text-secondary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-purple-500 flex items-center justify-center shadow-lg shadow-secondary/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Выберите диалог
        </h3>
        <p className="text-sm text-default-500 max-w-xs mx-auto leading-relaxed">
          Выберите чат из списка слева, чтобы начать общение с тиммейтами
        </p>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <span className="w-2 h-2 rounded-full bg-secondary/40" />
          <span className="w-2 h-2 rounded-full bg-secondary/60" />
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span className="w-2 h-2 rounded-full bg-secondary/60" />
          <span className="w-2 h-2 rounded-full bg-secondary/40" />
        </div>
      </div>
    </div>
  );
}
