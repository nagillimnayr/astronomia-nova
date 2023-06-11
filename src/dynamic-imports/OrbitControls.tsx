import dynamic from "next/dynamic";

const OrbitControls = dynamic(
  () =>
    import("@react-three/drei/core/OrbitControls").then((mod) => {
      return mod.OrbitControls;
    }),
  { ssr: false }
);

export { OrbitControls };
