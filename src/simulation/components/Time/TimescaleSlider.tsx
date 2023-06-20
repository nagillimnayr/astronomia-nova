import * as RadixSlider from '@radix-ui/react-slider';
import { FormEvent, FormEventHandler, useCallback, useRef } from 'react';
import { timeState } from '~/simulation/state/TimeState';

export const TimescaleSlider = () => {
  const handleChange = useCallback((value: number[]) => {
    if (value.length > 0 && value[0]) {
      timeState.setTimescale(value[0]);
    }
  }, []);

  return (
    <RadixSlider.Root
      className="relative flex h-5 w-[200px] touch-none select-none items-center "
      defaultValue={[1]}
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
  );
};
