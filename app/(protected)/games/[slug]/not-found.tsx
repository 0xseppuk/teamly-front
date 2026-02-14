import NextLink from 'next/link';

export default function GameNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold">Игра не найдена</h1>
      <p className="mt-4 text-lg text-default-500">
        К сожалению, такой игры не существует на нашей платформе.
      </p>
      <NextLink
        className="mt-6 rounded-xl bg-secondary px-6 py-3 text-secondary-foreground hover:opacity-90"
        href="/games"
      >
        Смотреть все игры
      </NextLink>
    </div>
  );
}
