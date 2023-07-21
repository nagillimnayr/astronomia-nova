import type KeplerBody from '@/simulation/classes/KeplerBody';
import * as Collapsible from '@radix-ui/react-collapsible';

import { ChevronRightIcon } from 'lucide-react';
import { useCallback, useContext } from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';

type OutlinerItemProps = {
  body: KeplerBody;
};
const OutlinerItem = observer(({ body }: OutlinerItemProps) => {
  const { uiState } = useContext(RootStoreContext);

  const handleClick = useCallback(() => {
    // Select the object.
    uiState.select(body);
  }, [body, uiState]);
  return (
    <Collapsible.Root className="m-0 inline-flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center">
      <span className="m-0 h-fit w-full p-0">
        <span className="m-0 inline-flex h-fit w-full items-center justify-start p-0">
          {/** Trigger to toggle collapsible content open/closed. */}
          <Collapsible.Trigger className="m-0 flex aspect-square h-full min-h-fit flex-col items-start justify-center overflow-hidden whitespace-nowrap rounded-full p-0 transition-all hover:bg-subtle data-[state=open]:rotate-90">
            <span className="icon-[mdi--chevron-right]" />
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
        <Collapsible.Content className="m-0 flex w-full flex-col  overflow-y-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
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
        </Collapsible.Content>
      </span>
    </Collapsible.Root>
  );
});

export { OutlinerItem };
