import { type Object3DNode, extend } from '@react-three/fiber';
import { forwardRef, type PropsWithChildren } from 'react';
import { type ColorRepresentation, type Vector3Tuple } from 'three';
import { Panel, PanelInner, PanelOuter } from './classes/Panel';
import { colors } from '../vr-hud-constants';
import React from 'react';

extend({ Panel, PanelInner, PanelOuter });

declare module '@react-three/fiber' {
  interface ThreeElements {
    panel: Object3DNode<Panel, typeof Panel>;
    panelInner: Object3DNode<PanelInner, typeof PanelInner>;
    panelOuter: Object3DNode<PanelOuter, typeof PanelOuter>;
  }
}

export type VRPanelProps = PropsWithChildren & {
  position?: Vector3Tuple;
  width?: number;
  height?: number;
  radius?: number;
  borderWidth?: number;
  segments?: number;
  backgroundColor?: ColorRepresentation;
  borderColor?: ColorRepresentation;
};
export const VRPanel = forwardRef<Panel, VRPanelProps>(function VRPanel(
  {
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
  }: VRPanelProps,
  fwdRef
) {
  return (
    <>
      <group position={position}>
        <panel
          ref={fwdRef}
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
});
