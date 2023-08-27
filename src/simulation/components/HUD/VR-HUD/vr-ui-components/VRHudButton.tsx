import useHover from '@/hooks/useHover';
import { type ThreeEvent } from '@react-three/fiber';
import { type XRInteractionEvent } from '@react-three/xr';
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Box3, type Group, type Object3D, Vector3 } from 'three';
import { VRPanel, type VRPanelProps } from './VRPanel';
import { VRLabel } from './VRLabel';
import { Panel } from './classes/Panel';
import { TextMesh } from '@/type-declarations/troika-three-text/Text';
import { useCursor } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

const bbox = new Box3();
const bbSize = new Vector3();
const bbCenter = new Vector3();

const HORIZONTAL_RATIO = 2 / 1.6;

type VRHudButtonProps = Omit<VRPanelProps, 'onClick'> & {
  onClick?: (event: ThreeEvent<MouseEvent> | XRInteractionEvent) => void;
  label: string;
};
export const VRHudButton = ({
  onClick,
  width = 2,
  height = 1,
  label,
}: VRHudButtonProps) => {
  const { isHovered, setHovered, hoverEvents } = useHover();
  useCursor(isHovered, 'pointer');
  const { scale } = useSpring({
    scale: isHovered ? 1.2 : 1,
  });

  const containerRef = useRef<Group>(null!);
  const panelRef = useRef<Panel>(null!);
  const labelRef = useRef<Object3D>(null!);
  const troikaRef = useRef<TextMesh | null>(null);
  const widthRef = useRef<number>(1);

  const handleSync = useCallback((troika: TextMesh) => {
    troikaRef.current = troika;
    const labelObj = labelRef.current;
    const panel = panelRef.current;
    if (!label || !panel) return;

    // Measure the bounding box of the text.
    bbox.setFromObject(labelObj);
    bbox.getSize(bbSize);

    // Multiply width by ratio.
    const newWidth = bbSize.x * HORIZONTAL_RATIO;

    // Set panel width.
    panel.setWidth(newWidth);
    widthRef.current = newWidth;
  }, []);

  return (
    <>
      <animated.group
        ref={containerRef}
        onClick={onClick}
        onPointerEnter={hoverEvents.handlePointerEnter}
        onPointerLeave={hoverEvents.handlePointerLeave}
        scale={scale}
      >
        <VRPanel ref={panelRef} width={widthRef.current} height={height} />

        <object3D ref={labelRef}>
          <VRLabel label={label} fontSize={height * 0.5} onSync={handleSync} />
        </object3D>
      </animated.group>
    </>
  );
};
