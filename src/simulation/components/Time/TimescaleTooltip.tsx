import { useTimeStore } from '@/simulation/state/zustand/time-store';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useCallback } from 'react';

type TooltipProps = {
  children: React.ReactNode;
  show?: boolean;
};
const TimescaleTooltip = (props: TooltipProps) => {
  const timescale = useTimeStore((state) => state.timescale);
  const handleOpenChange = useCallback((open: boolean) => {
    open;
    return;
  }, []);
  return (
    <Tooltip.Provider>
      <Tooltip.Root
        open={props.show}
        delayDuration={0}
        onOpenChange={handleOpenChange}
      >
        <Tooltip.Trigger asChild>{props.children}</Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-full bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={5}
          >
            {timescale}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TimescaleTooltip;
