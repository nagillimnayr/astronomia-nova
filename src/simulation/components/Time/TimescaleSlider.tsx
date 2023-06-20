import * as RadixSlider from '@radix-ui/react-slider';
import {
  FormEvent,
  FormEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useSnapshot } from 'valtio';
import { timeState } from '~/simulation/state/TimeState';

export const TimescaleSlider = () => {
  const snap = useSnapshot(timeState);
  // const [value, setValue] = useState(1);

  const handleChange = useCallback((values: number[]) => {
    if (values.length > 0 && values[0] !== undefined) {
      // setValue(values[0]);
      timeState.setTimescale(values[0]);
    }
  }, []);

  return (
    <form>
      <RadixSlider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center "
        defaultValue={[0]}
        value={[snap.timescale]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleChange}
      >
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-blackA10  ">
          <RadixSlider.Range className="absolute h-full  rounded-full bg-white" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="pointer-events-auto block aspect-square h-5 w-5 cursor-pointer rounded-full bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:shadow-[0_0_0_6px] focus:shadow-blackA8 focus:outline-none" />
      </RadixSlider.Root>
    </form>
  );
};
