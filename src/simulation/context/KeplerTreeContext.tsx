import { type MutableRefObject, createContext } from 'react';
import type KeplerBody from '../classes/kepler-body';

const KeplerTreeContext =
  createContext<MutableRefObject<KeplerBody | null> | null>(null);

export default KeplerTreeContext;
