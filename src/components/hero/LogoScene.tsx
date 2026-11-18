import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Il logo Wheel Tours in 3D: la biga (SVG vettorializzato dal logo originale, public/brand/emblem-body.svg)
 * estrusa a livelli come un rilievo: contorni blu metallici sotto, corpo cyan laccato sopra, aquila bianca
 * in primo piano. La ruota disegnata è stata tolta dal tracciato e al suo posto è montata una ruota 3D
 * con gli stessi raggi a fuso, che gira davvero (da sola e con lo scroll).
 * All'inizio il logo è frontale, identico a quello dell'intro; quando l'intro finisce si gira di tre quarti.
 */

const VIEW_W = 1080;
const VIEW_H = 860;
const WORLD_W = 2.6; // larghezza del logo nella scena
const S = WORLD_W / VIEW_W;

// profilo del raggio (lo stesso del WheelGlyph SVG): [semi-larghezza, distanza] su base 100
const PROFILE: [number, number][] = [
  [0, 14], [3, 17], [5.5, 27], [9.5, 47], [8.5, 60], [4.5, 72], [3.6, 80], [6.5, 88], [3.5, 93], [0, 95],
];

// spessori dei livelli (unità del viewBox)
const DEPTH = { '#003355': 50, '#00aeef': 58, '#ffffff': 10 } as Record<string, number>;
const Z0 = { '#003355': 0, '#00aeef': 0, '#ffffff': 58 } as Record<string, number>;

type Mats = Record<'lacquer' | 'navy' | 'iron' | 'satin' | 'pearl', THREE.Material>;

function useMaterials(): Mats {
  return useMemo(
    () => ({
      lacquer: new THREE.MeshPhysicalMaterial({ color: '#00aeef', metalness: 0, roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.25, envMapIntensity: 0.22 }),
      navy: new THREE.MeshPhysicalMaterial({ color: '#003355', metalness: 0.35, roughness: 0.5, clearcoat: 0.3, envMapIntensity: 0.35 }),
      iron: new THREE.MeshStandardMaterial({ color: '#2a3540', metalness: 0.85, roughness: 0.42, envMapIntensity: 0.9 }),
      satin: new THREE.MeshStandardMaterial({ color: '#ccd6df', metalness: 1, roughness: 0.22, envMapIntensity: 1.2 }),
      pearl: new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0.4, clearcoat: 0.6, envMapIntensity: 0.3 }),
    }),
    [],
  );
}

/** riflessi realistici senza file esterni: ambiente "stanza" generato da three.js */
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

/** carica il corpo della biga e lo estrude, un'unica geometria per colore */
function useBody(onLoaded: () => void) {
  const [data, setData] = useState<{ parts: { color: string; geo: THREE.BufferGeometry }[]; wheel: [number, number, number] } | null>(null);
  useEffect(() => {
    let alive = true;
    fetch('/brand/emblem-body.svg')
      .then((r) => r.text())
      .then((text) => {
        if (!alive) return;
        const wheel = (text.match(/data-wheel="([\d.,]+)"/)?.[1] ?? '883,717,150').split(',').map(Number) as [number, number, number];
        const svg = new SVGLoader().parse(text);
        const byColor = new Map<string, THREE.BufferGeometry[]>();
        for (const p of svg.paths) {
          const color = '#' + p.color.getHexString();
          const depth = DEPTH[color] ?? 20;
          for (const shape of SVGLoader.createShapes(p)) {
            const g = new THREE.ExtrudeGeometry(shape, { depth, curveSegments: 5, bevelEnabled: color === '#00aeef', bevelThickness: 2, bevelSize: 0.8, bevelSegments: 2 });
            g.translate(0, 0, Z0[color] ?? 0);
            (byColor.get(color) ?? byColor.set(color, []).get(color)!).push(g);
          }
        }
        const parts = [...byColor].map(([color, gs]) => {
          const geo = mergeGeometries(gs)!;
          gs.forEach((g) => g.dispose());
          return { color, geo };
        });
        setData({ parts, wheel });
        onLoaded();
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [onLoaded]);
  return data;
}

type Props = { scroll: MotionValue<number>; entered: boolean; pointer: React.RefObject<{ x: number; y: number }>; onLoaded: () => void };

function Logo({ scroll, entered, pointer, onLoaded }: Props) {
  const mats = useMaterials();
  const body = useBody(onLoaded);
  const group = useRef<THREE.Group>(null);
  const wheel = useRef<THREE.Group>(null);
  const rot = useRef(0);
  const spin = useRef(0);
  const enteredAt = useRef<number | null>(null);

  const spokeGeo = useMemo(() => {
    const pts = PROFILE.map(([w, d]) => new THREE.Vector2(w / 100, d / 100));
    const geo = new THREE.LatheGeometry(pts, 32);
    geo.scale(1, 1, 0.6);
    return geo;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (entered && enteredAt.current === null) enteredAt.current = t;
    const k = enteredAt.current === null ? 0 : Math.min(1, (t - enteredAt.current) / 1.6);
    const ease = 1 - Math.pow(1 - k, 3);
    // ruota: parte all'ingresso, poi gira piano e accelera con lo scroll
    spin.current += dt * 0.35 * ease;
    const target = -spin.current - scroll.get() * ((Math.PI * 2) / 900) - ease * Math.PI * 2;
    rot.current += (target - rot.current) * Math.min(1, dt * 5);
    if (wheel.current) wheel.current.rotation.z = rot.current;
    const p = pointer.current ?? { x: 0, y: 0 };
    if (group.current) {
      const ry = ease * (-0.42 + p.x * 0.18);
      const rx = ease * (0.06 - p.y * 0.08);
      group.current.rotation.y += (ry - group.current.rotation.y) * 0.08;
      group.current.rotation.x += (rx - group.current.rotation.x) * 0.08;
      // la ruota sporge verso la camera: il logo sale e si sposta un poco a sinistra per non uscire dal palco
      group.current.position.y = ease * (0.12 + Math.sin(t * 0.8) * 0.03);
      group.current.position.x = ease * -0.1;
    }
  });

  if (!body) return null;
  const [hx, hy, hr] = body.wheel;
  const r = hr * 1.06; // copre il cerchione del disegno
  const matFor = (c: string) => (c === '#00aeef' ? mats.lacquer : c === '#ffffff' ? mats.pearl : mats.navy);

  return (
    <group ref={group}>
      {/* sistema del viewBox: origine al centro, y verso l'alto */}
      <group scale={[S, -S, S]} position={[(-VIEW_W / 2) * S, (VIEW_H / 2) * S, 0]}>
        {body.parts.map((p) => (
          <mesh key={p.color} geometry={p.geo} material={matFor(p.color)} />
        ))}
        {/* ruota 3D al posto di quella disegnata, davanti al carro */}
        <group position={[hx, hy, 78]} scale={[r, -r, r]}>
          <group ref={wheel}>
            <mesh material={mats.iron}>
              <torusGeometry args={[1.0, 0.055, 24, 140]} />
            </mesh>
            <mesh material={mats.lacquer}>
              <torusGeometry args={[0.92, 0.05, 24, 140]} />
            </mesh>
            <mesh material={mats.navy} position={[0, 0, 0.05]}>
              <torusGeometry args={[0.85, 0.014, 12, 140]} />
            </mesh>
            {Array.from({ length: 8 }, (_, i) => (
              <mesh key={i} geometry={spokeGeo} material={mats.lacquer} rotation={[0, 0, (i * Math.PI) / 4]} scale={0.9} />
            ))}
            <mesh material={mats.satin} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.19, 0.26, 48]} />
            </mesh>
            <mesh material={mats.navy} position={[0, 0, 0.135]}>
              <torusGeometry args={[0.1, 0.018, 12, 48]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function LogoScene({ scroll, entered, onReady }: { scroll: MotionValue<number>; entered: boolean; onReady?: () => void }) {
  const pointer = useRef({ x: 0, y: 0 });
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const [onLoaded] = useState(() => () => readyRef.current?.());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (host.current) io.observe(host.current);
    return () => {
      window.removeEventListener('pointermove', onMove);
      io.disconnect();
    };
  }, []);

  // camera: a logo frontale, il logo occupa il 90% del palco (margine per la ruota in primo piano) (stesso formato 1080 x 860)
  const fov = 35;
  const dist = WORLD_W / 0.9 / (VIEW_W / VIEW_H) / (2 * Math.tan(((fov / 2) * Math.PI) / 180));

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, dist], fov, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Environment />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-2, 3, 6]} intensity={1.15} />
        <directionalLight position={[4, 1, -3]} intensity={0.6} color="#6ec1e4" />
        <Logo scroll={scroll} entered={entered} pointer={pointer} onLoaded={onLoaded} />
      </Canvas>
    </div>
  );
}
