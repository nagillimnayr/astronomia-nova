import type KeplerBody from '@/simulation/classes/KeplerBody';
import * as Collapsible from '@radix-ui/react-collapsible';

import { ChevronRightIcon } from 'lucide-react';
import { useCallback, useContext } from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

type OutlinerItemProps = {
  body: KeplerBody;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  const { uiState } = useContext(RootStoreContext);

  const handleClick = useCallback(() => {
    // Since this component isn't wrapped in 'observer()', it won't be bound to state changes, so it shouldn't re-render on state changes.
    if (uiState.selected === body) return; // Already selected, do nothing.
    uiState.select(body);
  }, [body, uiState]);
  return (
    <Collapsible.Root className="m-0 inline-flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center">
      <span className="m-0 h-fit w-full p-0">
        <span className="m-0 inline-flex h-fit w-full items-center justify-start p-0">
          {/** Trigger to toggle collapsible content open/closed. */}
          <Collapsible.Trigger className="m-0 flex aspect-square h-full min-h-fit flex-col items-start justify-center overflow-hidden whitespace-nowrap p-0 hover:bg-subtle">
            <ChevronRightIcon strokeWidth={1} />
          </Collapsible.Trigger>

          {/** Button to select body. */}
          <button
            onClick={handleClick}
            className="m-0 inline-flex h-full w-full cursor-pointer items-center justify-start hover:bg-subtle"
          >
            <span className="m-0 h-fit w-fit p-1 text-left font-sans font-medium">
              {body.name}
            </span>
          </button>
        </span>

        {/** Subtree of orbiting bodies. */}
        <Collapsible.Content className="m-0 flex h-fit max-h-fit min-h-fit w-full flex-col items-stretch justify-start data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {/** Add some left margin to indent each subtree from its parent, left padding to line up the left border with the list marker. */}
          <ul className="ml-2 border-l border-gray-600 pl-5 marker:text-gray-600">
            {body.orbitingBodies.map((child, index) => {
              // Recursively traverse the tree to construct the tree view.
              return (
                <li
                  key={index}
                  className="bg-subtle/50 w-full list-outside list-disc"
                >
                  <OutlinerItem body={child} />
                </li>
              );
            })}
          </ul>
        </Collapsible.Content>
      </span>
    </Collapsible.Root>
  );
};

export { OutlinerItem };
