/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type Object3DNode,
  extend,
  MeshProps,
  Object3DProps,
  BufferGeometryNode,
} from '@react-three/fiber';
import { forwardRef, PropsWithoutRef, type PropsWithChildren } from 'react';
import { Mesh, type ColorRepresentation, type Vector3Tuple } from 'three';
import { Panel, PanelInner, PanelOuter } from './classes/Panel';
import { colors, depth } from '../vr-hud-constants';
import React from 'react';
import { Plane } from '@react-three/drei';
import { useSpring, animated, SpringValue } from '@react-spring/three';
import { RoundedPlaneGeometry } from 'maath/geometry';
import { EventHandlers } from '@react-three/fiber/dist/declarations/src/core/events';

extend({ Panel, PanelInner, PanelOuter });

declare module '@react-three/fiber' {
  interface ThreeElements {
    panel: Object3DNode<Panel, typeof Panel>;
    panelInner: Object3DNode<PanelInner, typeof PanelInner>;
    panelOuter: Object3DNode<PanelOuter, typeof PanelOuter>;
  }
}

extend({ RoundedPlaneGeometry });
declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedPlaneGeometry: BufferGeometryNode<
      RoundedPlaneGeometry,
      typeof RoundedPlaneGeometry
    >;
  }
}

export type VRPanelProps = PropsWithChildren &
  EventHandlers & {
    position?: Vector3Tuple;
    width?: number;
    height?: number;
    radius?: number;
    borderWidth?: number;
    segments?: number;
    backgroundColor?: ColorRepresentation | SpringValue<string>;
    borderColor?: ColorRepresentation | SpringValue<string>;
  };
export const VRPanel = forwardRef<Mesh, VRPanelProps>(function VRPanel(
  {
    children,
    position,
    width = 2,
    height = 1,
    radius = 0.2 * height,
    borderWidth = 0.025 * Math.min(width, height),
    segments = 16,
    backgroundColor = colors.background,
    borderColor = colors.border,
    onClick,
    onPointerEnter,
    onPointerLeave,
    ...props
  }: VRPanelProps,
  fwdRef
) {
  return (
    <>
      {/** @ts-ignore */}
      <group position={position}>
        <animated.mesh
          ref={fwdRef}
          position={position}
          material-color={borderColor}
        >
          <roundedPlaneGeometry args={[width, height, radius, segments]} />
        </animated.mesh>
        <animated.mesh
          material-color={backgroundColor}
          position-z={0.001}
          onClick={onClick}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <roundedPlaneGeometry
            args={[
              width - borderWidth * 2,
              height - borderWidth * 2,
              radius - borderWidth,
              segments,
            ]}
          />
        </animated.mesh>
        {children}
      </group>
    </>
  );
});
