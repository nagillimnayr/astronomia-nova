import useHover from '@/hooks/useHover';
import { type ThreeEvent } from '@react-three/fiber';
import { type XRInteractionEvent } from '@react-three/xr';
import {
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Box3, type Group, type Object3D, Vector3 } from 'three';
import { VRPanel, type VRPanelProps } from './VRPanel';
import { VRLabel } from './VRLabel';

const bbox = new Box3();
const bbSize = new Vector3();
const bbCenter = new Vector3();

const HORIZONTAL_RATIO = 2 / 1.6;

type VRHudButtonProps = Omit<VRPanelProps, 'onClick'> & {
  onClick?: (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => void;
};
export const VRHudButton = ({
  onClick,
  width = 2,
  height = 1,
}: VRHudButtonProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  const containerRef = useRef<Group>(null!);
  const labelRef = useRef<Object3D>(null!);
  const widthRef = useRef<number>(width);

  useEffect(() => {
    const label = labelRef.current;
    if (!labelRef) return;

    bbox.setFromObject(label);
    bbox.getSize(bbSize);
    console.log('label bbox size:', bbSize);
    widthRef.current = bbSize.x * HORIZONTAL_RATIO;
  });

  return (
    <>
      <group
        ref={containerRef}
        onClick={onClick}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
        scale={isHovered ? 1.2 : 1}
      >
        <VRPanel width={widthRef.current} height={height}>
          <object3D ref={labelRef}>
            <VRLabel label={'Label'} fontSize={height * 0.5} />
          </object3D>
        </VRPanel>
      </group>
    </>
  );
};
