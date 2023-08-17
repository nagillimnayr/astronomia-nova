import { Grid, GridProps } from '@react-three/drei';
import { Object3DProps } from '@react-three/fiber';

type Props = GridProps & Object3DProps;
export const Floor = ({ position = [0, 0, 0], ...props }: Props) => {
  return (
    <>
      <Grid infiniteGrid position={position} />
    </>
  );
};
