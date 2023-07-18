import { createContext } from 'react';
import type KeplerBody from '../classes/KeplerBody';

type childRefFn = (body: KeplerBody) => void;
const KeplerTreeContext = createContext<childRefFn>((body: KeplerBody) => {
  return;
});

export default KeplerTreeContext;
