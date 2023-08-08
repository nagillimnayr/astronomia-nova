import type KeplerBody from '@/simulation/classes/kepler-body';
import * as Collapsible from '@radix-ui/react-collapsible';
import { gsap, Elastic } from 'gsap';
import useMeasure from 'react-use-measure';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useMachine, useSelector } from '@xstate/react';
import { outlinerItemMachine } from './outliner-item-machine/outliner-item-machine';
import { InterpreterFrom } from 'xstate';

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

  const openSubtree = useCallback(() => {
    return new Promise((resolve) => {
      const content = contentRef.current;
      if (!content) return;

      // Save current height value.
      const fromHeight = window.getComputedStyle(content).height;
      // Get the computed value of height at fit-content.
      content.style.height = 'fit-content';
      const toHeight = window.getComputedStyle(content).height;

      // Reset starting height value.
      content.style.height = fromHeight;
      const diff = Math.abs(parseFloat(toHeight) - parseFloat(fromHeight));
      const duration = Math.max(0.5, diff / 288);
      gsap.to(content, {
        duration,
        height: toHeight,
        ease: 'power2.out',
        onComplete: () => {
          content.style.height = 'fit-content';
          resolve(null);
        },
      });
    });
  }, []);

  const closeSubtree = useCallback(() => {
    return new Promise((resolve) => {
      const content = contentRef.current;
      if (!content) return;

      // Get the computed value of the elements height.
      const fromHeight = window.getComputedStyle(content).height;
      content.style.height = fromHeight;

      const duration = Math.max(0.5, parseFloat(fromHeight) / 288);
      gsap.to(content, {
        duration,
        height: 0,
        ease: 'power2.in',
        onComplete: resolve,
      });
    });
  }, []);

  const [state, send, actor] = useMachine(outlinerItemMachine, {
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
    const subscription = mapActor.subscribe(() => {
      if (isOpen && body.orbitingBodies.length < 1) {
        send({ type: 'CLOSE' });
      }
    });
    return () => subscription.unsubscribe();
  }, [body, isOpen, mapActor, send]);

  const handleSelect = useCallback(() => {
    // Select the object.
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);

  const dataState = state.value;
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
            data-state={dataState}
            className={cn(
              'm-0 flex aspect-square h-full min-h-fit flex-col items-start justify-center overflow-hidden whitespace-nowrap rounded-full p-0 transition-all duration-500 hover:bg-subtle',
              'data-[state=open]:rotate-90 data-[state=opening]:rotate-90'
            )}
            onClick={() => send({ type: 'TOGGLE' })}
          >
            <span className={cn('icon-[mdi--chevron-right]')} />{' '}
          </button>

          {/** Button to select body. */}
          <button
            onClick={handleSelect}
            className="m-0 inline-flex h-full w-full cursor-pointer items-center justify-start transition-colors hover:bg-subtle"
          >
            <span className="m-0 h-8 w-fit p-1 text-left align-middle font-sans text-2xl font-medium leading-none">
              {body.name}
            </span>
          </button>
        </div>

        {/** Subtree of orbiting bodies. */}
        <div
          ref={contentRef}
          className={cn(
            'm-0 flex h-fit w-full flex-col overflow-y-hidden transition-all'
            // 'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
          )}
        >
          {/** Add some left margin to indent each subtree from its parent, left padding to line up the left border with the list marker. */}
          <ul
            ref={listRef}
            className="ml-2 h-fit overflow-y-hidden border-l border-gray-600 pl-1 marker:text-gray-600"
          >
            {body.orbitingBodies.map((child) => {
              // Recursively traverse the tree to construct the tree view.
              return (
                <li key={child.name} className="w-full list-outside list-none">
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
