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
import { Panel, PanelBorder } from './classes/Panel';
import { EventHandlers } from '@react-three/fiber/dist/declarations/src/core/events';
import { useCursor } from '@react-three/drei';

extend({ Panel, PanelBorder });

declare module '@react-three/fiber' {
  interface ThreeElements {
    panel: Object3DNode<Panel, typeof Panel>;
    panelBorder: Object3DNode<PanelBorder, typeof PanelBorder>;
  }
}

type VRPanelProps = PropsWithChildren &
  // Pick<PropsWithoutRef<Object3DNode<Panel, typeof Panel>>, 'onClick' | 'onContextMenu' | ''>
  EventHandlers & {
    position?: Vector3Tuple;
    width?: number;
    height?: number;
    backgroundColor?: ColorRepresentation;
    borderColor?: ColorRepresentation;
    borderRadius?: number;
    borderWidth?: number;
  };
export const VRPanel = ({
  children,
  position,
  width = 1,
  height = 1,
  backgroundColor,
  borderColor,
  borderRadius = 0,
  borderWidth = 0.01,
  ...props
}: VRPanelProps) => {
  const borderWidth2 = borderWidth * 2;

  return (
    <>
      <group position={position}>
        <panelBorder
          args={[width, height, borderRadius, borderWidth, 24]}
          backgroundColor={borderColor ?? backgroundColor}
          {...props}
        >
          <panel
            args={[
              width - borderWidth2,
              height - borderWidth2,
              borderRadius,
              24,
            ]}
            backgroundColor={backgroundColor}
          >
            {children}
          </panel>
        </panelBorder>
      </group>
    </>
  );
};
