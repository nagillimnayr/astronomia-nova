import { RootContainer, Container, Text } from '@coconut-xr/koestlich';
import { Glass, IconButton, List, ListItem } from '@coconut-xr/apfel-kruemel';
import { Suspense } from 'react';
import {
  GOLDEN_RATIO,
  border,
  borderRadius,
  color,
  text,
} from '../vr-hud-constants';

// Type annotations are needed so that eslint/typescript doesn't flag a bunch of errors.
type Dimension = number | 'auto' | `${number}%` | undefined;
type Variant = {
  width: Dimension;
  height: Dimension;
};
const horizontal: Variant = {
  width: 'auto',
  height: 4,
};
const vertical: Variant = {
  width: 4,
  height: 'auto',
};

type VRSeparatorProps = {
  direction?: 'horizontal' | 'vertical';
};
export const VRSeparator = ({ direction = 'horizontal' }: VRSeparatorProps) => {
  const { height, width } = direction === 'horizontal' ? horizontal : vertical;
  return (
    <>
      <Container
        backgroundColor={color.border}
        borderRadius={1000}
        height={height}
        width={width}
      />
    </>
  );
};
