import { type KeplerBody } from '@/components/canvas/body/kepler-body';
import { cn } from '@/helpers/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useMachine, useSelector } from '@xstate/react';
import { gsap } from 'gsap';
import { useCallback, useEffect, useRef } from 'react';
import { outlinerItemMachine } from './outliner-item-machine/outliner-item-machine';

type OutlinerItemProps = {
  body: KeplerBody;
  defaultOpen?: boolean;
};
const OutlinerItem = ({ body, defaultOpen = false }: OutlinerItemProps) => {
  const { mapActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  /* Bind to state changes so that the component will re-render 
  whenever bodyMap is modified. */
  useSelector(mapActor, ({ context }) => context.bodyMap);

  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );
  const isSelected = Object.is(body, selected);

  const rootRef = useRef<HTMLDivElement>(null!);
  const buttonRef = useRef<HTMLButtonElement>(null!);
  const contentRef = useRef<HTMLDivElement>(null!);
  const listRef = useRef<HTMLUListElement>(null!);

  const openSubtree = useCallback(() => {
    return new Promise((resolve) => {
      const content = contentRef.current;
      if (!content) return;

      // Save current height value.
      const fromHeight = window.getComputedStyle(content).height;

      /* 'fit-content' is not an animatable property, so we must get the
      computed value to use in the animation. Get the computed value of
      height at fit-content. */
      content.style.height = 'fit-content';
      const toHeight = window.getComputedStyle(content).height;

      // Reset starting height value.
      content.style.height = fromHeight;
      // const diff = Math.abs(parseFloat(toHeight) - parseFloat(fromHeight));
      // const duration = Math.max(0.5, diff / 288);
      gsap.to(content, {
        duration: 0.5,
        height: toHeight,
        // ease: 'power2.out',
        ease: 'power2.inOut',
        onComplete: () => {
          // For whatever reason, onComplete seems to get called before the
          // animation finishes. Timeout so that it doesn't immediately snap to
          // full height.
          setTimeout(() => {
            content.style.height = 'fit-content';
            resolve(null);
          }, 300);
        },
      });
    });
  }, []);

  const closeSubtree = useCallback(() => {
    return new Promise((resolve) => {
      const content = contentRef.current;
      if (!content) return;

      // 'fit-content' is not an animatable property, so we must get the
      // computed value to use in the animation. Get the computed value of the
      // elements height.
      const fromHeight = window.getComputedStyle(content).height;
      content.style.height = fromHeight;

      // const duration = Math.max(0.5, parseFloat(fromHeight) / 288);
      gsap.to(content, {
        duration: 0.5,
        height: 0,
        ease: 'power2.inOut',
        // ease: 'none',
        onComplete: () => {
          // For whatever reason, onComplete seems to get called before the
          // animation finishes. Timeout so that it doesn't immediately snap to
          // full height.
          setTimeout(() => {
            resolve(null);
          }, 300);
        },
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

  /* Close if no children. */
  useEffect(() => {
    const subscription = mapActor.subscribe(() => {
      if (isOpen && body.orbitingBodies.length < 1) {
        send({ type: 'CLOSE' });
      }
    });

    // Cleanup.
    return () => subscription.unsubscribe();
  }, [body, isOpen, mapActor, send]);

  useEffect(() => {
    // This should only run when mounting and when the orbiting bodies are
    // updated, which is necessary since the outliner will likely load before
    // the orbiting planets.
    if (defaultOpen && body.orbitingBodies.length > 0) {
      actor.send({ type: 'OPEN' });
    }
  }, [actor, body.orbitingBodies.length, defaultOpen]);

  useEffect(() => {
    const subscription = selectionActor.subscribe((state) => {
      const { selected } = state.context;
      const button = buttonRef.current;
      if (Object.is(body, selected)) {
        gsap.to(button, {
          outlineColor: 'white',
          // outlineWidth: '2px',
        });
      } else {
        gsap.to(button, {
          outlineColor: 'transparent',
          // outlineWidth: '0px',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [body, selectionActor]);

  const handleSelect = useCallback(() => {
    // Select the object.
    selectionActor.send({ type: 'SELECT', selection: body });
  }, [body, selectionActor]);

  const dataState = state.value;
  return (
    <div
      ref={rootRef}
      className={cn(
        'mx-0 my-[2px] flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center'
      )}
    >
      <div className="m-0 h-fit w-full p-0">
        <div className="m-0 inline-flex h-fit w-full items-center justify-start p-0">
          {/** Trigger to toggle collapsible content open/closed. */}
          <button
            data-state={dataState}
            data-selected={isSelected ? 'true' : 'false'}
            className={cn(
              'm-0 mr-2 inline-flex aspect-square h-full min-h-fit flex-col items-center justify-center overflow-hidden whitespace-nowrap rounded-full transition-all duration-500 hover:bg-subtle',
              'data-[state=open]:rotate-90 data-[state=opening]:rotate-90'
            )}
            onClick={() => send({ type: 'TOGGLE' })}
          >
            {/** Chevron icon. */}
            <span className={cn('icon-[mdi--chevron-right] h-8 w-8')} />
          </button>

          {/** Button to select body. */}
          <button
            ref={buttonRef}
            data-selected={isSelected ? 'true' : 'false'}
            onClick={handleSelect}
            className={cn(
              'm-0 my-[3px] mr-1 inline-flex h-full w-full cursor-pointer items-center justify-start rounded-md p-1 outline outline-2 outline-transparent transition-colors hover:bg-subtle',
              'data-[selected=true]:bg-subtle '
            )}
          >
            <span className="m-0 h-8 w-fit p-1 text-left align-middle font-sans text-2xl font-medium leading-none">
              {body.name}
            </span>
          </button>
          {/* <VisibilityToggleButton name={body.name} /> */}
        </div>

        {/** Subtree of orbiting bodies. */}
        <div
          data-state={state.value}
          ref={contentRef}
          className={cn(
            'm-0 flex h-fit w-full flex-col overflow-y-hidden transition-all',
            'data-[state=closed]:h-0 data-[state=open]:h-fit'
          )}
        >
          {/** Add some left margin to indent each subtree from its parent, left padding to line up the left border with the list marker. */}
          <ul
            ref={listRef}
            className="ml-2 h-fit overflow-y-hidden border-l-2 border-gray-200 pl-1 marker:text-gray-300"
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
