import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cena do hero: um disco de acreção feito de partículas em órbita kepleriana,
 * calculado inteiramente na GPU. O cursor inclina a cena; o scroll afasta a câmera.
 */

const COUNT_DESKTOP = 26000;
const COUNT_MOBILE = 9000;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aRadius;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Velocidade angular ~ r^-1.5 (Kepler): o interior gira bem mais rápido.
    float speed = 0.9 / pow(aRadius, 1.5);
    float a = aAngle + uTime * speed;
    float wobble = sin(uTime * 0.6 + aSeed * 40.0) * 0.015 * aRadius;
    vec3 pos = vec3(cos(a) * aRadius, aHeight + wobble, sin(a) * aRadius);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 90.0);
    gl_PointSize = uSize * uPixelRatio * (0.35 + aSeed * 0.9) * twinkle / -mv.z;

    // Interior quente e branco-azulado, borda fria violeta, com raras brasas.
    float t = smoothstep(0.9, 5.5, aRadius);
    vec3 inner = vec3(0.93, 0.96, 1.0);
    vec3 mid = vec3(0.56, 0.70, 1.0);
    vec3 outer = vec3(0.55, 0.45, 0.95);
    vec3 col = mix(inner, mid, smoothstep(0.0, 0.4, t));
    col = mix(col, outer, smoothstep(0.4, 1.0, t));
    col = mix(col, vec3(1.0, 0.62, 0.3), step(0.985, aSeed));
    vColor = col;
    vAlpha = (1.0 - smoothstep(4.5, 7.0, aRadius)) * smoothstep(0.85, 1.05, aRadius);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, core * core * vAlpha);
  }
`;

function Disk({ count, scroll, pointer }: SceneProps & { count: number }) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const [geometry, material] = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const radius = new Float32Array(count);
    const angle = new Float32Array(count);
    const height = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Densidade maior perto do centro.
      const r = 1.0 + Math.pow(Math.random(), 2.2) * 6.0;
      radius[i] = r;
      // Braços espirais sutis para quebrar a uniformidade.
      const arm = (Math.floor(Math.random() * 3) / 3) * Math.PI * 2;
      angle[i] = arm + r * 0.9 + (Math.random() - 0.5) * 1.6;
      height[i] = (Math.random() - 0.5) * 0.22 * r * Math.random();
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
    g.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
    g.setAttribute("aHeight", new THREE.BufferAttribute(height, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

    const m = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
        uSize: { value: 26 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return [g, m];
  }, [count, gl]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value += Math.min(delta, 0.05);
    const g = group.current;
    if (!g) return;
    // Inclinação base + resposta suave ao cursor.
    const targetX = 0.3 + pointer.current.y * 0.1;
    const targetZ = -0.22 + pointer.current.x * 0.1;
    g.rotation.x += (targetX - g.rotation.x) * 0.04;
    g.rotation.z += (targetZ - g.rotation.z) * 0.04;

    const s = scroll.current;
    state.camera.position.z = 10.5 + s * 5;
    state.camera.position.y = 0.4 - s * 1.6;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} />
      {/* Horizonte de eventos: a esfera escura recorta o disco que passa por trás. */}
      <mesh renderOrder={-1}>
        <sphereGeometry args={[0.92, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Anel de fótons: brilho em volta do horizonte, sempre de frente para a câmera.
function PhotonRing() {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p) * 2.0;
            float ring = exp(-pow((r - 0.31) * 38.0, 2.0)) * 0.9;
            float halo = exp(-pow((r - 0.31) * 7.0, 2.0)) * 0.22;
            float ang = atan(p.y, p.x);
            float flicker = 0.85 + 0.15 * sin(ang * 3.0 + uTime * 0.7);
            vec3 col = mix(vec3(0.62, 0.74, 1.0), vec3(1.0), ring);
            float a = (ring + halo) * flicker;
            a *= smoothstep(0.27, 0.3, r);
            gl_FragColor = vec4(col, a);
          }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value += Math.min(delta, 0.05);
    ref.current?.quaternion.copy(state.camera.quaternion);
  });

  return (
    <mesh ref={ref} material={material}>
      <planeGeometry args={[6, 6]} />
    </mesh>
  );
}

function Stars({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 40;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.004;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.09} color="#b9c8ff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export type SceneProps = {
  scroll: RefObject<number>;
  pointer: RefObject<{ x: number; y: number }>;
};

export default function Singularity({ scroll, pointer, mobile, paused }: SceneProps & { mobile: boolean; paused: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 10.5], fov: 42 }}
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      // Pausada, a cena renderiza um único quadro (e nada mais) — inclusive com movimento reduzido.
      frameloop={paused ? "demand" : "always"}
      aria-hidden="true"
    >
      <Stars count={mobile ? 500 : 1400} />
      <Disk count={mobile ? COUNT_MOBILE : COUNT_DESKTOP} scroll={scroll} pointer={pointer} />
      <PhotonRing />
    </Canvas>
  );
}
