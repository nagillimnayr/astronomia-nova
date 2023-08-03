import type KeplerBody from '@/simulation/classes/kepler-body';
import * as Collapsible from '@radix-ui/react-collapsible';

import { ChevronRightIcon } from 'lucide-react';
import { useCallback, useContext, useState } from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';
import { cn } from '@/lib/cn';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';

type OutlinerItemProps = {
  body: KeplerBody;
};
const OutlinerItem = observer(({ body }: OutlinerItemProps) => {
  // const { uiState } = useContext(RootStoreContext);
  const { rootActor, selectionService } = useContext(GlobalStateContext);

  const keplerTreeActor = useSelector(
    rootActor,
    ({ context }) => context.keplerTreeActor
  );
  // Subscribe to state changes so that the outliner will update whenever a new node is added to the tree.
  useSelector(keplerTreeActor, (state) => state.matches('updatingTree'));

  const [isOpen, setOpen] = useState<boolean>(true);

  const handleOpenChanged = useCallback(
    (open: boolean) => {
      if (!body.orbitingBodies.length) {
        setOpen(false);
      } else {
        setOpen(open);
      }
    },
    [body.orbitingBodies.length]
  );

  const handleClick = useCallback(() => {
    // Select the object.
    // uiState.select(body);
    selectionService.send({ type: 'SELECT', selection: body });
  }, [body, selectionService]);
  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={handleOpenChanged}
      className="m-0 inline-flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center"
    >
      <span className="m-0 h-fit w-full p-0">
        <span className="m-0 inline-flex h-fit w-full items-center justify-start p-0">
          {/** Trigger to toggle collapsible content open/closed. */}
          <Collapsible.Trigger
            className={cn(
              'm-0 flex aspect-square h-full min-h-fit flex-col items-start justify-center overflow-hidden whitespace-nowrap rounded-full p-0 transition-all hover:bg-subtle data-[state=open]:rotate-90'
            )}
          >
            <span className={cn('icon-[mdi--chevron-right]')} />{' '}
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
