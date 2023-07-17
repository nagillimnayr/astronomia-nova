import { createContext } from 'react';
import { type RootStore } from './root-store';

export const RootStoreContext = createContext<RootStore>(null!);
