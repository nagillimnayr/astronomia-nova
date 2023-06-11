import dynamic from "next/dynamic";

const Trail = dynamic(
  () => import("@react-three/drei/core/Trail").then((mod) => mod.Trail),
  { ssr: false }
);

export { Trail };
