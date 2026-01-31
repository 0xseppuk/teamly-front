export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '';

    const now = new Date();

    // Normalize to local date (ignore time)
    const dateLocal = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const todayLocal = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const yesterdayLocal = new Date(todayLocal);

    yesterdayLocal.setDate(yesterdayLocal.getDate() - 1);

    if (dateLocal.getTime() === todayLocal.getTime()) {
      return 'Сегодня';
    } else if (dateLocal.getTime() === yesterdayLocal.getTime()) {
      return 'Вчера';
    }

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return '';
  }
};

export const formatTime = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};
