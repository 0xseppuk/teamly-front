import Image from 'next/image';

type Props = {
  width: number;
  height: number;
};

export function Logo({ height, width }: Props) {
  return (
    <Image
      alt={'logo'}
      className="rounded-2xl"
      height={height}
      src={'/favicon-32x32.png'}
      width={width}
    />
  );
}
