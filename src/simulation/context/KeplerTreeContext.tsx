import { type MutableRefObject, createContext } from 'react';
import type KeplerBody from '../classes/KeplerBody';

const KeplerTreeContext = createContext<MutableRefObject<KeplerBody> | null>(
  null
);

export default KeplerTreeContext;
