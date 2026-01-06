import { SVGProps } from 'react';

export type ErrorResponseTypes = 'Incorect password' | 'Email not found';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
