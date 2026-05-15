import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useFeaturedProducts } from "@/hooks/useProducts";
import stickersHero from "@/assets/stickers-hero.png";

type CardProps = {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  scrollY: MotionValue<number>;
  index: number;
};

const StickerCard = ({ url, position, rotation, scale, scrollY, index }: CardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, url);
  texture.anisotropy = 8;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const s = scrollY.get();
    // Scroll-driven tilt + parallax
    meshRef.current.rotation.y = rotation[1] + s * 0.004 + Math.sin(t * 0.5 + index) * 0.1;
    meshRef.current.rotation.x = rotation[0] + s * 0.002;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + index * 1.3) * 0.15 - s * 0.003;
    meshRef.current.position.z = position[2] + Math.cos(t * 0.4 + index) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1.4, 1.4, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        roughness={0.35}
        metalness={0.15}
      />
    </mesh>
  );
};

const Scene = ({ images, scrollY }: { images: string[]; scrollY: MotionValue<number> }) => {
  const cards = useMemo(() => {
    const positions: Array<{
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }> = [
      { position: [0, 0, 0], rotation: [0, -0.1, 0], scale: 1.4 },
      { position: [-1.8, 0.6, -0.8], rotation: [0.1, 0.3, -0.2], scale: 1.0 },
      { position: [1.9, -0.4, -0.6], rotation: [-0.05, -0.4, 0.15], scale: 1.05 },
      { position: [-1.4, -0.9, 0.5], rotation: [0.2, 0.2, 0.1], scale: 0.85 },
      { position: [1.5, 1.0, 0.4], rotation: [-0.15, -0.25, -0.1], scale: 0.9 },
      { position: [0.2, 1.4, -1.2], rotation: [0.1, 0.1, 0.05], scale: 0.8 },
    ];
    return positions.map((p, i) => ({ ...p, url: images[i % images.length] }));
  }, [images]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[3, 2, -2]} intensity={0.6} color="#60a5fa" />
      <Environment preset="city" />
      {cards.map((c, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
          <StickerCard
            url={c.url}
            position={c.position}
            rotation={c.rotation}
            scale={c.scale}
            scrollY={scrollY}
            index={i}
          />
        </Float>
      ))}
    </>
  );
};

const StickerScene3D = () => {
  const { data: products } = useFeaturedProducts();
  const { scrollY } = useScroll();

  const images = useMemo(() => {
    const list = (products || []).map((p) => p.image).filter(Boolean);
    if (list.length === 0) return [stickersHero];
    return list;
  }, [products]);

  return (
    <div className="relative h-[480px] w-full sm:h-[560px] lg:h-[600px]">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[70%] w-[70%] rounded-full bg-primary/20 blur-[100px]" />
      </div>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene images={images} scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StickerScene3D;