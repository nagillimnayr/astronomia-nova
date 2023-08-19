import { Plane, Shape } from '@react-three/drei';
import { MeshProps, Object3DNode, extend } from '@react-three/fiber';
import { PropsWithChildren, PropsWithRef, PropsWithoutRef } from 'react';
import { ColorRepresentation, Vector3Tuple } from 'three';
import { Panel, PanelBorder } from './classes/Panel';

extend({ Panel, PanelBorder });

declare module '@react-three/fiber' {
  interface ThreeElements {
    panel: Object3DNode<Panel, typeof Panel>;
    panelBorder: Object3DNode<PanelBorder, typeof PanelBorder>;
  }
}

type VRPanelProps = PropsWithChildren &
  PropsWithoutRef<Object3DNode<Panel, typeof Panel>> & {
    position?: Vector3Tuple;
    width?: number;
    height?: number;
    color?: ColorRepresentation;
    borderColor?: ColorRepresentation;
    borderRadius?: number;
    borderWidth?: number;
  };
export const VRPanel = ({
  children,
  position,
  width = 1,
  height = 1,
  color,
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
          color={borderColor ?? color}
        >
          <panel
            args={[
              width - borderWidth2,
              height - borderWidth2,
              borderRadius,
              24,
            ]}
            color={color}
            {...props}
          >
            {children}
          </panel>
        </panelBorder>
      </group>
    </>
  );
};
