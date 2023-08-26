import {
  MeshProps,
  type Object3DNode,
  extend,
  ThreeEvent,
} from '@react-three/fiber';
import {
  type PropsWithChildren,
  PropsWithRef,
  type PropsWithoutRef,
  useState,
} from 'react';
import { type ColorRepresentation, type Vector3Tuple } from 'three';
import { Panel, PanelInner, PanelOuter } from './classes/Panel';
import { EventHandlers } from '@react-three/fiber/dist/declarations/src/core/events';
import { useCursor } from '@react-three/drei';
import { colors } from '../vr-hud-constants';

extend({ Panel, PanelInner, PanelOuter });

declare module '@react-three/fiber' {
  interface ThreeElements {
    panel: Object3DNode<Panel, typeof Panel>;
    panelInner: Object3DNode<PanelInner, typeof PanelInner>;
    panelOuter: Object3DNode<PanelOuter, typeof PanelOuter>;
  }
}

type VRPanelProps = PropsWithChildren &
  // Pick<PropsWithoutRef<Object3DNode<Panel, typeof Panel>>, 'onClick' | 'onContextMenu' | ''>
  EventHandlers & {
    position?: Vector3Tuple;
    width?: number;
    height?: number;
    radius?: number;
    borderWidth?: number;
    segments?: number;
    backgroundColor?: ColorRepresentation;
    borderColor?: ColorRepresentation;
  };
export const VRPanel = ({
  children,
  position,
  width = 2,
  height = 1,
  radius = 0.2,
  borderWidth = 0.01,
  segments,
  backgroundColor = colors.background,
  borderColor = colors.border,
  ...props
}: VRPanelProps) => {
  return (
    <>
      <group position={position}>
        <panel
          args={[width, height, radius, borderWidth, segments]}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          {...props}
        >
          {children}
        </panel>
      </group>
    </>
  );
};
