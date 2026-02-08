import type { Metadata } from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Teamly',
  description:
    'Политика конфиденциальности платформы Teamly. Узнайте, какие данные мы собираем и как мы их используем.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[80rem] mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Политика конфиденциальности
          </h1>

          <div className="space-y-6 text-default-400 leading-relaxed">
            <p>
              Настоящая Политика конфиденциальности описывает, какие данные
              собирает платформа Teamly и как эти данные используются.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              1. Общие положения
            </h2>
            <p>
              Используя сайт playteamly.ru, вы соглашаетесь с настоящей
              Политикой конфиденциальности и условиями обработки персональных
              данных.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              2. Какие данные мы собираем
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Адрес электронной почты</li>
              <li>Имя пользователя и информация профиля</li>
              <li>Информация о создаваемых заявках</li>
              <li>Техническая информация (IP-адрес, cookies, user-agent)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10">
              3. Как мы используем данные
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Для предоставления функциональности платформы</li>
              <li>Для связи с пользователями</li>
              <li>Для улучшения качества сервиса</li>
              <li>Для обеспечения безопасности</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10">
              4. Передача данных третьим лицам
            </h2>
            <p>
              Teamly не передает персональные данные третьим лицам, за
              исключением случаев, предусмотренных законодательством или
              необходимых для работы сервиса.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              5. Cookies
            </h2>
            <p>
              Мы используем cookies для корректной работы сайта и улучшения
              пользовательского опыта.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              6. Защита данных
            </h2>
            <p>
              Мы принимаем разумные технические и организационные меры для
              защиты персональных данных от утраты, несанкционированного доступа
              и раскрытия.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              7. Контакты
            </h2>
            <p>
              По всем вопросам, связанным с обработкой персональных данных, вы
              можете связаться с нами по адресу:{' '}
              <span className="text-white">0xseppuk@gmail.com</span>
            </p>

            <p className="text-sm text-default-500 mt-10">
              Дата вступления в силу: 7 февраля 2026 г.
            </p>

            <div className="pt-10">
              <NextLink className="text-secondary hover:underline" href="/">
                Вернуться на главную
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
