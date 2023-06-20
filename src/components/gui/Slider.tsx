import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';

export const Slider = () => {
  return (
    <RadixSlider.Root
      className="relative flex h-5 w-[200px] touch-none select-none items-center "
      defaultValue={[50]}
      min={0}
      max={100}
      step={1}
    >
      <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-blackA10  ">
        <RadixSlider.Range className="absolute h-full  rounded-full bg-white" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="pointer-events-auto block aspect-square h-5 w-5 cursor-pointer rounded-full bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:shadow-[0_0_0_6px] focus:shadow-blackA8 focus:outline-none" />
    </RadixSlider.Root>
  );
};
