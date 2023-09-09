import { createContext, type MutableRefObject } from 'react';
import type { KeplerBody } from '@/components/canvas/body';

export const KeplerTreeContext =
  createContext<MutableRefObject<KeplerBody | null> | null>(null);
