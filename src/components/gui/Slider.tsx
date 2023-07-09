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
      <RadixSlider.Track className="bg-blackA10 relative h-[3px] grow rounded-full  ">
        <RadixSlider.Range className="absolute h-full  rounded-full bg-white" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="shadow-blackA7 hover:bg-violet3 focus:shadow-blackA8  pointer-events-auto block aspect-square w-4 cursor-pointer rounded-full bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_6px] focus:outline-none" />
    </RadixSlider.Root>
  );
};
