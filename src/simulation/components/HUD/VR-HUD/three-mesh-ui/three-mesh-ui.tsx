import { Object3DNode, extend } from '@react-three/fiber';
import ThreeMeshUI, { Block, BlockOptions, TextOptions } from 'three-mesh-ui';

extend(ThreeMeshUI);

declare module '@react-three/fiber' {
  interface ThreeElements {
    block: Object3DNode<Block, typeof Block>;
    text: Object3DNode<Text, typeof Text>;
  }
}

export const Test = () => {
  return (
    <>
      <block></block>
      <text></text>
    </>
  );
};
