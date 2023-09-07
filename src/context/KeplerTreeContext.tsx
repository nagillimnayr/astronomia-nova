import { createContext, type MutableRefObject } from 'react';
import type KeplerBody from '../components/canvas/body/kepler-body';

const KeplerTreeContext =
  createContext<MutableRefObject<KeplerBody | null> | null>(null);

export default KeplerTreeContext;
