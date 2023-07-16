import type KeplerBody from '@/simulation/classes/KeplerBody';
import * as Accordion from '@radix-ui/react-accordion';

type OutlinerItemProps = {
  body: Readonly<KeplerBody>;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  return (
    <Accordion.Root
      type="multiple"
      className="m-0 flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center"
    >
      <Accordion.Item value={body.name} className="m-0 h-fit w-full p-0">
        <Accordion.Header className="m-0 h-fit w-full p-0">
          <Accordion.Trigger className="m-0 flex h-full min-h-fit w-full flex-col items-start justify-center overflow-hidden whitespace-nowrap p-0 hover:bg-subtle">
            <h3 className="m-0 h-fit w-fit p-1 text-left font-sans font-medium text-muted-foreground">
              {body.name}
            </h3>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="m-0 flex h-fit max-h-fit min-h-fit w-full flex-col items-start justify-start gap-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {/** a bit of left padding to indent each subtree from its parent */}
          <ul className="w-full pl-2">
            {body.orbitingBodies.map((child, index) => {
              // recursively traverse the tree to construct the tree view
              return (
                <li key={index} className="">
                  <OutlinerItem body={child} />
                </li>
              );
            })}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default OutlinerItem;
