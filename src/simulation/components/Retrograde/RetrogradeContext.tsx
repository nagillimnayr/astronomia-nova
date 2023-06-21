import { createContext } from 'react';

type RetrogradeContextObj = 'referenceBody' | 'otherBody' | null;
export const RetrogradeContext = createContext<RetrogradeContextObj>(null);
