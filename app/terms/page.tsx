import type { Metadata } from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'Условия использования | Teamly',
  description:
    'Условия использования платформы Teamly. Правила и обязанности пользователей при использовании сервиса.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://playteamly.ru/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[80rem] mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            Условия использования
          </h1>

          <div className="space-y-6 text-default-400 leading-relaxed">
            <p>
              Настоящие Условия использования регулируют использование платформы
              Teamly (далее — «Сервис»). Используя Сервис, вы соглашаетесь с
              данными условиями.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              1. Принятие условий
            </h2>
            <p>
              Используя сайт playteamly.ru, вы подтверждаете, что прочитали,
              поняли и согласны соблюдать настоящие Условия использования и
              Политику конфиденциальности.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              2. Описание сервиса
            </h2>
            <p>
              Teamly — это платформа для поиска тиммейтов и создания команд в
              онлайн-играх. Сервис позволяет пользователям:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Создавать заявки на поиск игроков</li>
              <li>Просматривать заявки других пользователей</li>
              <li>Общаться с другими игроками через встроенный чат</li>
              <li>Управлять своим профилем и настройками</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10">
              3. Регистрация и аккаунт
            </h2>
            <p>
              Для использования Сервиса необходимо создать учетную запись.
              Пользователь обязуется:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Предоставлять достоверную информацию при регистрации</li>
              <li>Поддерживать актуальность данных учетной записи</li>
              <li>Не передавать доступ к своей учетной записи третьим лицам</li>
              <li>
                Незамедлительно сообщать о любом несанкционированном
                использовании аккаунта
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10">
              4. Правила использования
            </h2>
            <p>При использовании Сервиса запрещается:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Публиковать оскорбительный, дискриминационный или незаконный
                контент
              </li>
              <li>Распространять спам или рекламу без согласования</li>
              <li>Нарушать права интеллектуальной собственности третьих лиц</li>
              <li>
                Использовать автоматизированные средства для доступа к Сервису
              </li>
              <li>
                Пытаться получить несанкционированный доступ к системам Сервиса
              </li>
              <li>Выдавать себя за другое лицо или организацию</li>
              <li>Создавать фейковые заявки или аккаунты</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10">
              5. Контент пользователей
            </h2>
            <p>
              Вы сохраняете все права на контент, который публикуете в Сервисе.
              Публикуя контент, вы предоставляете Teamly неисключительную
              лицензию на использование, хранение и отображение вашего контента
              в рамках работы Сервиса.
            </p>
            <p className="mt-4">
              Teamly оставляет за собой право удалять контент, нарушающий
              настоящие Условия или законодательство.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              6. Ответственность
            </h2>
            <p>
              Сервис предоставляется «как есть». Teamly не несет ответственности
              за:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Действия или бездействие других пользователей</li>
              <li>Временную недоступность или технические сбои Сервиса</li>
              <li>Потерю данных или упущенную выгоду</li>
              <li>
                Последствия взаимодействия пользователей вне платформы Teamly
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10">
              7. Прекращение использования
            </h2>
            <p>
              Вы можете в любой момент удалить свою учетную запись. Teamly
              оставляет за собой право приостановить или прекратить доступ к
              Сервису при нарушении настоящих Условий.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              8. Изменения условий
            </h2>
            <p>
              Teamly оставляет за собой право изменять настоящие Условия в любое
              время. О существенных изменениях пользователи будут уведомлены по
              электронной почте или через Сервис.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              9. Применимое право
            </h2>
            <p>
              Настоящие Условия регулируются законодательством Российской
              Федерации. Все споры подлежат разрешению в соответствии с
              действующим законодательством РФ.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10">
              10. Контакты
            </h2>
            <p>
              По всем вопросам, связанным с Условиями использования, вы можете
              связаться с нами:
            </p>
            <ul className="list-none space-y-2 mt-4">
              <li>
                Email: <span className="text-white">0xseppuk@gmail.com</span>
              </li>
              <li>
                Сайт: <span className="text-white">playteamly.ru</span>
              </li>
            </ul>

            <p className="text-sm text-default-500 mt-10">
              Дата вступления в силу: 7 февраля 2026 г.
            </p>
            <p className="text-sm text-default-500">
              Последнее обновление: 7 февраля 2026 г.
            </p>

            <div className="pt-10 flex gap-4">
              <NextLink className="text-secondary hover:underline" href="/">
                Вернуться на главную
              </NextLink>
              <span className="text-default-600">•</span>
              <NextLink
                className="text-secondary hover:underline"
                href="/privacy"
              >
                Политика конфиденциальности
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
