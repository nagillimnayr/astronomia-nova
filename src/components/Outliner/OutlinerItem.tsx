import type KeplerBody from '@/simulation/classes/KeplerBody';
import * as Accordion from '@radix-ui/react-accordion';

type OutlinerItemProps = {
  body: Readonly<KeplerBody>;
};
const OutlinerItem = ({ body }: OutlinerItemProps) => {
  return (
    <Accordion.Root
      type="multiple"
      className="m-0 inline-flex h-fit min-h-fit w-full flex-col items-center justify-start rounded-none text-center"
    >
      <Accordion.Item value={body.name} className="m-0 h-fit w-full p-0">
        <Accordion.Header className="m-0 h-fit w-full p-0">
          <Accordion.Trigger className="m-0 flex h-full min-h-fit w-full flex-col items-start justify-center overflow-hidden whitespace-nowrap p-0 hover:bg-subtle">
            <h3 className="m-0 h-fit w-fit p-1 text-left font-sans font-medium text-muted-foreground">
              {body.name}
            </h3>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="m-0 flex h-fit max-h-fit min-h-fit w-full flex-col items-stretch justify-start data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {/** add some left margin to indent each subtree from its parent, left padding to line up the left border with the list marker */}
          <ul className="ml-4 border-l border-gray-600 pl-3 marker:text-gray-600">
            {body.orbitingBodies.map((child, index) => {
              // recursively traverse the tree to construct the tree view
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
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default OutlinerItem;
