import { MutableRefObject, createContext } from 'react';

type TimeContextObject = {
  timerRef: MutableRefObject<HTMLSpanElement>;
  portalRef: MutableRefObject<HTMLDivElement>;
  hoursRef: MutableRefObject<HTMLParagraphElement>;
  dateRef: MutableRefObject<HTMLParagraphElement>;
};
const TimeContext = createContext<TimeContextObject>(null!);

export { TimeContext };
export type { TimeContextObject };
