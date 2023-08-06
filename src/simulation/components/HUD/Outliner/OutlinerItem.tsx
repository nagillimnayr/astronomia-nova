import type KeplerBody from '@/simulation/classes/kepler-body';
import * as Collapsible from '@radix-ui/react-collapsible';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useSpring, animated } from '@react-spring/web';

const openSpring = {
  from: { height: '0%' },
  to: { height: '100%' },
};
const closeSpring = {
  from: { height: '100%' },
  to: { height: '0%' },
};

type OutlinerItemProps = {
  body: KeplerBody;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  const { mapActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const [isOpen, setOpen] = useState<boolean>(true);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const openSubtree = useCallback(() => {}, []);

  const closeSubtree = useCallback(() => {}, []);

  const handleOpenChanged = useCallback(() => {
    // console.log('clicked');
    if (!body.orbitingBodies.length) {
      setOpen(false);
    } else {
      // Toggle state.
      setOpen((state) => !state);
    }
  }, [body.orbitingBodies.length]);

  const handleSelect = useCallback(() => {
    // Select the object.
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);

  // console.log(body.name, mapState.bodyMap.has(body.name));
  return (
    <div
      ref={rootRef}
      // onOpenChange={handleOpenChanged}
      data-state={isOpen ? 'open' : 'closed'}
      className={cn(
        'm-0 inline-flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center'
      )}
    >
      <div className="m-0 h-fit w-full p-0">
        <div className="m-0 inline-flex h-fit w-full items-center justify-start p-0">
          {/** Trigger to toggle collapsible content open/closed. */}
          <button
            data-state={isOpen ? 'open' : 'closed'}
            className={cn(
              'm-0 flex aspect-square h-full min-h-fit flex-col items-start justify-center overflow-hidden whitespace-nowrap rounded-full p-0 transition-all hover:bg-subtle data-[state=open]:rotate-90'
            )}
            onClick={handleOpenChanged}
          >
            <span className={cn('icon-[mdi--chevron-right]')} />{' '}
          </button>

          {/** Button to select body. */}
          <button
            onClick={handleSelect}
            className="m-0 inline-flex h-full w-full cursor-pointer items-center justify-start hover:bg-subtle"
          >
            <span className="m-0 h-fit w-fit p-1 text-left font-sans font-medium">
              {body.name}
            </span>
          </button>
        </div>

        {/** Subtree of orbiting bodies. */}
        <div
          ref={contentRef}
          data-state={isOpen ? 'open' : 'closed'}
          className="m-0 flex w-full flex-col  overflow-y-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
        >
          {/** Add some left margin to indent each subtree from its parent, left padding to line up the left border with the list marker. */}
          <ul className="ml-2 border-l border-gray-600 pl-1 marker:text-gray-600">
            {body.orbitingBodies.map((child, index) => {
              // Recursively traverse the tree to construct the tree view.
              return (
                <li key={index} className="w-full list-outside list-none">
                  <OutlinerItem body={child} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { OutlinerItem };
