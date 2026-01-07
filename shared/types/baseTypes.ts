import { SVGProps } from 'react';

export type ErrorResponseTypes = 'Incorrect password' | 'Email not found';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
