import React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { cn } from '@/lib/cn';

type Props = RadixSlider.SliderProps;
export const Slider = ({ className, ...props }: Props) => {
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
        className={cn(
          'focus-outline pointer-events-auto block aspect-square  w-4 rounded-full bg-white shadow-lg  shadow-black transition-all duration-500 hover:bg-black hover:shadow-lg hover:outline hover:outline-1 hover:outline-white focus:bg-black focus:shadow-lg focus:shadow-black focus:outline focus:outline-1 focus:outline-white'
        )}
      />
    </RadixSlider.Root>
  );
};
