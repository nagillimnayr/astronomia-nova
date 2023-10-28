import { cn } from '@/helpers/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import * as RadixSlider from '@radix-ui/react-slider';
import { useSelector } from '@xstate/react';
import { useCallback, useRef, useState } from 'react';

const MIN = -100;
const MAX = 100;

export const TimescaleSlider = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);
  const timescale = useSelector(timeActor, ({ context }) => context.timescale);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const rangeRef = useRef<HTMLDivElement>(null!);

  const handleChange = useCallback(
    (values: number[]) => {
      if (values.length >= 0 && values[0] !== undefined) {
        const value = values[0];

        timeActor.send({ type: 'SET_TIMESCALE', timescale: value });

        /* Scale the range. */
        const scale = value / MAX;
        const range = rangeRef.current;
        if (!range) return;
        range.style.transform = `scale(${scale}, 1)`;
      }
    },
    [timeActor]
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div className="flex w-full  items-center justify-center rounded-full bg-gray-400/20 px-4 py-1">
      <RadixSlider.Root
        className="relative flex h-5 w-full touch-none select-none items-center rounded-full"
        // defaultValue={[1]}
        value={[timescale]}
        min={MIN}
        max={MAX}
        step={1}
        onValueChange={handleChange}
      >
        <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-gray-500">
          {/* <RadixSlider.Range className="absolute h-full rounded-full bg-white" /> */}
          <div
            ref={rangeRef}
            className={cn(
              'absolute left-1/2 h-full w-1/2 origin-left scale-x-0 rounded-full bg-white'
            )}
            style={{ transform: 'scale(0, 1)' }}
          />
        </RadixSlider.Track>
        {/* <TimescaleTooltip show={isHovered}> */}
        <RadixSlider.Thumb
          className="pointer-events-auto block aspect-square w-4 cursor-pointer rounded-full bg-white shadow-primary outline-none transition-colors hover:border hover:border-white hover:bg-subtle hover:shadow-[0_2px_10px] focus:border focus:border-white focus:bg-subtle focus:shadow-[0_2px_10px]"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        />
        {/* </TimescaleTooltip> */}
      </RadixSlider.Root>
    </div>
  );
};
