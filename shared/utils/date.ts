import { DateValue, parseDate } from '@internationalized/date';

/**
 * Утилиты для работы с датами
 */

/**
 * Конвертирует строку ISO даты в DateValue для NextUI
 * @param isoString - Дата в формате ISO (YYYY-MM-DD)
 * @returns DateValue объект или undefined
 */
export function parseISODate(isoString?: string): DateValue | undefined {
  if (!isoString) return undefined;
  try {
    return parseDate(isoString);
  } catch {
    return undefined;
  }
}

/**
 * Конвертирует DateValue в строку формата ISO (YYYY-MM-DD)
 * @param date - DateValue объект из NextUI
 * @returns Строка в формате YYYY-MM-DD
 */
export function formatToISODate(
  date: DateValue | null | undefined,
): string | undefined {
  if (!date) return undefined;

  // DateValue имеет year, month, day
  const year = date.year;
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Вычисляет возраст на основе даты рождения
 * @param birthDate - Дата рождения в формате ISO, DateValue или Date объект
 * @returns Возраст в годах
 */
export function calculateAge(
  birthDate: string | DateValue | Date | undefined,
): number | undefined {
  if (!birthDate) return undefined;

  let birthYear: number, birthMonth: number, birthDay: number;

  if (typeof birthDate === 'string') {
    const date = new Date(birthDate);

    birthYear = date.getFullYear();
    birthMonth = date.getMonth() + 1; // Month is 0-indexed in Date
    birthDay = date.getDate();
  } else if ('year' in birthDate) {
    // DateValue type
    birthYear = birthDate.year;
    birthMonth = birthDate.month;
    birthDay = birthDate.day;
  } else {
    // Date object
    birthYear = birthDate.getFullYear();
    birthMonth = birthDate.getMonth() + 1;
    birthDay = birthDate.getDate();
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let age = currentYear - birthYear;

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

/**
 * Форматирует дату для отображения в UI
 * @param date - Дата в формате ISO, DateValue или Date объект
 * @param locale - Локаль для форматирования (по умолчанию 'ru-RU')
 * @returns Отформатированная строка даты
 */
export function formatDateForDisplay(
  date: string | DateValue | Date | undefined,
  locale: string = 'ru-RU',
): string | undefined {
  if (!date) return undefined;

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if ('year' in date) {
    // DateValue type - convert to Date
    dateObj = new Date(date.year, date.month - 1, date.day);
  } else {
    dateObj = date;
  }

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Форматирует время для отображения
 * @param date - Дата в формате ISO или Date объект
 * @returns Время в формате HH:MM
 */
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Форматирует временной диапазон
 * @param start - Начальная дата/время
 * @param end - Конечная дата/время
 * @returns Строка формата "HH:MM - HH:MM"
 */
export function formatTimeRange(
  start: string | Date,
  end: string | Date,
): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}
