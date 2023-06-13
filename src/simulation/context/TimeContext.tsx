import { MutableRefObject, createContext } from 'react';

type TimeContextObject = {
  // refs to DOM Elements
  timerRef: MutableRefObject<HTMLSpanElement>;
  hourRef: MutableRefObject<HTMLParagraphElement>;
  dateRef: MutableRefObject<HTMLParagraphElement>;

  timeElapsedRef: MutableRefObject<number>;
  timescaleRef: MutableRefObject<number>;
};
const TimeContext = createContext<TimeContextObject>(null!);

export { TimeContext };
export type { TimeContextObject };
