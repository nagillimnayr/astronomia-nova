import { animated } from '@react-spring/three';
import {
  Box,
  Circle,
  Dodecahedron,
  Icosahedron,
  Line,
  // MeshDistortMaterial,
  MeshReflectorMaterial,
  MeshRefractionMaterial,
  MeshTransmissionMaterial,
  // MeshWobbleMaterial,
  Octahedron,
  Plane,
  PointMaterial,
  Points,
  Ring,
  RoundedBox,
  Sphere,
  Svg,
  Text,
  Text3D,
  Torus,
  TorusKnot,
} from '@react-three/drei';

export const anim = {
  Svg: animated(Svg),
  Circle: animated(Circle),
  Box: animated(Box),
  RoundedBox: animated(RoundedBox),
  Sphere: animated(Sphere),
  Plane: animated(Plane),
  Ring: animated(Ring),
  Icosahedron: animated(Icosahedron),
  Dodecahedron: animated(Dodecahedron),
  Octahedron: animated(Octahedron),
  Torus: animated(Torus),
  TorusKnot: animated(TorusKnot),
  Text: animated(Text),
  Text3D: animated(Text3D),
  Points: animated(Points),
  Line: animated(Line),
  PointMaterial: animated(PointMaterial),
  MeshReflectorMaterial: animated(MeshReflectorMaterial),
  // MeshWobbleMaterial: animated(MeshWobbleMaterial),
  // MeshDistortMaterial: animated(MeshDistortMaterial),
  MeshRefractionMaterial: animated(MeshRefractionMaterial),
  MeshTransmissionMaterial: animated(MeshTransmissionMaterial),
};
