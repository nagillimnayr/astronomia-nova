import * as RadixSlider from '@radix-ui/react-slider';
import {
  FormEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSnapshot } from 'valtio';
import TimescaleTooltip from '../TimescaleTooltip';
import { useTimeStore } from '../../../state/zustand/time-store';

export const TimescaleSlider = () => {
  // const snap = useSnapshot(timeState);

  const timescale = useTimeStore((state) => state.timescale);
  const setTimescale = useTimeStore((state) => state.setTimescale);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleChange = useCallback(
    (values: number[]) => {
      if (values.length > 0 && values[0] !== undefined) {
        // setValue(values[0]);
        const value = values[0];
        if (value !== timescale) {
          setTimescale(values[0]);
        }
      }
    },
    [setTimescale, timescale]
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <form>
      <RadixSlider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center rounded-full"
        defaultValue={[1]}
        value={[timescale]}
        min={1}
        max={100}
        step={1}
        onValueChange={handleChange}
      >
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray-500  ">
          <RadixSlider.Range className="absolute h-full  rounded-full bg-white" />
        </RadixSlider.Track>
        {/* <TimescaleTooltip show={isHovered}> */}
        <RadixSlider.Thumb
          className="hover:bg-violet3 pointer-events-auto block aspect-square w-4 cursor-pointer rounded-full bg-white shadow-[0_2px_10px] shadow-black/50 focus:shadow-[0_0_0_6px] focus:shadow-black/50 focus:outline-none"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
        {/* </TimescaleTooltip> */}
      </RadixSlider.Root>
    </form>
  );
};
