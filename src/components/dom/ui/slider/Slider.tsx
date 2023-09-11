import { cn } from '@/helpers/cn';
import * as RadixSlider from '@radix-ui/react-slider';
import React from 'react';

type Props = RadixSlider.SliderProps & {
  tooltip?: boolean;
};
export const Slider = ({ className, tooltip, ...props }: Props) => {
  return (
    <RadixSlider.Root
      className={cn(
        'relative flex h-5 w-[200px] touch-none select-none items-center hover:cursor-pointer ',
        className
      )}
      {...props}
    >
      <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-black  ">
        <RadixSlider.Range className="absolute h-full rounded-full bg-white" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className={
          'focus-outline flex aspect-square h-fit w-4 items-center justify-center  rounded-full bg-white shadow-lg  shadow-black transition-all duration-500 hover:bg-black hover:shadow-lg hover:outline hover:outline-1 hover:outline-white focus:bg-black focus:shadow-lg focus:shadow-black focus:outline focus:outline-1 focus:outline-white'
        }
      />
    </RadixSlider.Root>
  );
};
