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
import { useSpring, animated } from '@react-spring/three';
import { RoundedPlaneGeometry } from 'maath/geometry';

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
  Omit<PropsWithoutRef<Object3DProps>, 'args'> & {
    position?: Vector3Tuple;
    width?: number;
    height?: number;
    radius?: number;
    borderWidth?: number;
    segments?: number;
    backgroundColor?: ColorRepresentation;
    borderColor?: ColorRepresentation;
  };
export const VRPanel = forwardRef<Mesh, VRPanelProps>(function VRPanel(
  {
    children,
    position,
    width = 2,
    height = 1,
    radius = 0.2 * height,
    borderWidth = 0.01,
    segments = 16,
    backgroundColor = colors.background,
    borderColor = colors.border,
    ...props
  }: VRPanelProps,
  fwdRef
) {
  return (
    <>
      {/** @ts-ignore */}
      <group position={position}>
        <mesh ref={fwdRef} position={position}>
          <roundedPlaneGeometry args={[width, height, radius, segments]} />
          <meshBasicMaterial color={borderColor} />
        </mesh>
        <mesh
          position-z={0.001}
          onClick={props.onClick}
          onPointerEnter={props.onPointerEnter}
          onPointerLeave={props.onPointerLeave}
        >
          <roundedPlaneGeometry
            args={[
              width - borderWidth * 2,
              height - borderWidth * 2,
              radius - borderWidth,
              segments,
            ]}
          />
          <meshBasicMaterial color={backgroundColor} />
        </mesh>
        {children}
      </group>
    </>
  );
});

export const AnimatedVRPanel = animated(VRPanel);
