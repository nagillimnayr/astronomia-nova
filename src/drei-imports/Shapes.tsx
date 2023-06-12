import dynamic from "next/dynamic";

const Sphere = dynamic(
  () =>
    import("@react-three/drei/core/shapes").then((mod) => {
      return mod.Sphere;
    }),
  { ssr: false }
);

export { Sphere };
