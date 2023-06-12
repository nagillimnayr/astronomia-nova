import { MutableRefObject, createContext } from 'react';

type TimerContextObject = {
  timerRef: MutableRefObject<HTMLSpanElement>;
  portalRef: MutableRefObject<HTMLDivElement>;
};
const TimerContext = createContext<TimerContextObject>(null!);

export default TimerContext;
