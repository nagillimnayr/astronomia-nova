import { r3f } from '@/helpers/tunnel/tunnel';
import { type PropsWithChildren } from 'react';

export const Three = ({ children }: PropsWithChildren) => {
  return <r3f.In>{children}</r3f.In>;
};
