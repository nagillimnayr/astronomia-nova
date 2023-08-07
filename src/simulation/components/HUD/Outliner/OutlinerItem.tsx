import type KeplerBody from '@/simulation/classes/kepler-body';
import * as Collapsible from '@radix-ui/react-collapsible';
import { gsap } from 'gsap';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useMachine, useSelector } from '@xstate/react';
import { outlinerItemMachine } from './outliner-item-machine/outliner-item-machine';

type OutlinerItemProps = {
  body: KeplerBody;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  const { mapActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so that the component will re-render whenever bodyMap is modified.
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const numOfSubNodes = body.countSubNodes();

  const openSubtree = useCallback(() => {
    return new Promise((resolve) => {
      const content = contentRef.current;
      if (!content) return;
      gsap.to(content, {
        duration: 0.5,
        height: 60 * numOfSubNodes,

        onComplete: resolve,
      });
    });
  }, [numOfSubNodes]);

  const closeSubtree = useCallback(() => {
    return new Promise((resolve) => {
      const content = contentRef.current;
      if (!content) return;
      gsap.to(content, {
        duration: 0.5,
        height: 0,

        onComplete: resolve,
      });
    });
  }, []);

  const [state, send] = useMachine(outlinerItemMachine, {
    context: {
      body,
    },
    services: {
      openSubtree,
      closeSubtree,
    },
  });
  const isOpen = state.matches('open');

  useEffect(() => {
    if (isOpen && numOfSubNodes < 1) {
      send({ type: 'CLOSE' });
    }
  }, [isOpen, numOfSubNodes, send]);

  const handleSelect = useCallback(() => {
    // Select the object.
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);

  return (
    <div
      ref={rootRef}
      className={cn(
        'm-0 flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center'
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
            onClick={() => send({ type: 'TOGGLE' })}
          >
            <span className={cn('icon-[mdi--chevron-right]')} />{' '}
          </button>

          {/** Button to select body. */}
          <button
            onClick={handleSelect}
            className="m-0 inline-flex h-full w-full cursor-pointer items-center justify-start hover:bg-subtle"
          >
            <span className="m-0 h-fit w-fit p-1 text-left font-sans text-xl font-medium">
              {body.name}
            </span>
          </button>
        </div>

        {/** Subtree of orbiting bodies. */}
        <div
          ref={contentRef}
          // data-state={isOpen ? 'open' : 'closed'}
          className={cn(
            'm-0 flex w-full flex-col overflow-y-hidden border-2 border-red-500 transition-all'
            // 'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
          )}
        >
          {/** Add some left margin to indent each subtree from its parent, left padding to line up the left border with the list marker. */}
          <ul
            ref={listRef}
            className="ml-2 h-fit overflow-y-hidden border-l border-gray-600 pl-1 marker:text-gray-600"
          >
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
