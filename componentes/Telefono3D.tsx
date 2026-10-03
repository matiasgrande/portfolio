'use client';

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from '@/lib/gsap';
import { ruta } from '@/lib/ruta';

export interface PunteroNormalizado {
  /** Posición del cursor sobre el escenario, de -1 a 1 */
  x: number;
  y: number;
}

interface PropsTelefono {
  puntero: MutableRefObject<PunteroNormalizado>;
  /** true cuando el teléfono muestra su cara trasera (Hybrid) */
  girado: boolean;
  /** true mientras el cursor está sobre el teléfono */
  sobre: MutableRefObject<boolean>;
  acento: string;
  visible: boolean;
}

// Medidas del teléfono en unidades de la escena
const ANCHO = 1.0;
const ALTO = 2.1;
const RADIO = 0.17;
const PROFUNDIDAD = 0.09;
const BISEL = 0.018;
const PANTALLA_ANCHO = 0.94;
const PANTALLA_ALTO = 2.0;
const Z_PANTALLA = PROFUNDIDAD / 2 + BISEL + 0.0005;

/** Cuerpo del teléfono: un rectángulo de esquinas redondas extruido con el borde biselado */
function crearCuerpo(): THREE.ExtrudeGeometry {
  const w = ANCHO - 2 * BISEL;
  const h = ALTO - 2 * BISEL;
  const r = RADIO - BISEL;
  const x0 = -w / 2;
  const y0 = -h / 2;
  const forma = new THREE.Shape();
  forma.moveTo(x0 + r, y0);
  forma.lineTo(x0 + w - r, y0);
  forma.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  forma.lineTo(x0 + w, y0 + h - r);
  forma.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  forma.lineTo(x0 + r, y0 + h);
  forma.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  forma.lineTo(x0, y0 + r);
  forma.quadraticCurveTo(x0, y0, x0 + r, y0);
  const geometria = new THREE.ExtrudeGeometry(forma, {
    depth: PROFUNDIDAD,
    bevelEnabled: true,
    bevelThickness: BISEL,
    bevelSize: BISEL,
    bevelSegments: 6,
    curveSegments: 20,
  });
  geometria.translate(0, 0, -PROFUNDIDAD / 2);
  return geometria;
}

/** Máscara en blanco y negro para redondear las esquinas de la pantalla */
function crearMascara(): THREE.CanvasTexture {
  const lienzo = document.createElement('canvas');
  lienzo.width = 470;
  lienzo.height = 1000;
  const ctx = lienzo.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, lienzo.width, lienzo.height);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(0, 0, lienzo.width, lienzo.height, 64);
    ctx.fill();
  }
  return new THREE.CanvasTexture(lienzo);
}

/** Reflejo diagonal que se desplaza sobre el cristal cuando el teléfono se inclina */
function crearReflejo(): THREE.CanvasTexture {
  const lienzo = document.createElement('canvas');
  lienzo.width = 256;
  lienzo.height = 256;
  const ctx = lienzo.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.42, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.58, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const textura = new THREE.CanvasTexture(lienzo);
  textura.wrapS = THREE.RepeatWrapping;
  return textura;
}

interface PropsPantalla {
  textura: THREE.Texture;
  mascara: THREE.Texture;
  reflejo: THREE.Texture;
}

/** Una cara del teléfono: pantalla con la captura, isla dinámica y reflejo */
function Pantalla({ textura, mascara, reflejo }: PropsPantalla) {
  return (
    <group>
      <mesh position={[0, 0, Z_PANTALLA]}>
        <planeGeometry args={[PANTALLA_ANCHO, PANTALLA_ALTO]} />
        <meshBasicMaterial map={textura} alphaMap={mascara} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.9, Z_PANTALLA + 0.001]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.032, 0.13, 4, 12]} />
        <meshBasicMaterial color="#050607" />
      </mesh>
      <mesh position={[0, 0, Z_PANTALLA + 0.002]}>
        <planeGeometry args={[PANTALLA_ANCHO, PANTALLA_ALTO]} />
        <meshBasicMaterial
          map={reflejo}
          alphaMap={mascara}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Motas de polvo que flotan alrededor del teléfono y solo se ven bajo la linterna */
function Polvo({ cantidad = 120 }: { cantidad?: number }) {
  const puntos = useRef<THREE.Points>(null);
  const datos = useMemo(() => {
    const posiciones = new Float32Array(cantidad * 3);
    const velocidades = new Float32Array(cantidad);
    for (let i = 0; i < cantidad; i++) {
      posiciones[i * 3] = (Math.random() - 0.5) * 2.4;
      posiciones[i * 3 + 1] = (Math.random() - 0.5) * 2.8;
      posiciones[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      velocidades[i] = 0.04 + Math.random() * 0.1;
    }
    return { posiciones, velocidades };
  }, [cantidad]);

  useFrame((estado, dt) => {
    const atributo = puntos.current?.geometry.getAttribute('position');
    if (!atributo) return;
    const t = estado.clock.elapsedTime;
    for (let i = 0; i < cantidad; i++) {
      let y = (datos.posiciones[i * 3 + 1] ?? 0) + (datos.velocidades[i] ?? 0) * dt;
      if (y > 1.5) y = -1.5;
      datos.posiciones[i * 3 + 1] = y;
      datos.posiciones[i * 3] = (datos.posiciones[i * 3] ?? 0) + Math.sin(t * 0.5 + i) * 0.0008;
    }
    atributo.needsUpdate = true;
  });

  return (
    <points ref={puntos}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[datos.posiciones, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#ECE6D6" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Modelo({ puntero, girado, sobre, acento }: Omit<PropsTelefono, 'visible'>) {
  const inclina = useRef<THREE.Group>(null);
  const gira = useRef<THREE.Group>(null);
  const luz = useRef<THREE.PointLight>(null);
  const giro = useRef({ valor: 0, escala: 1 });

  const [texAlm, texHyb] = useTexture([ruta('/imagenes/tel-alm.webp'), ruta('/imagenes/tel-hyb.webp')]);
  const cuerpo = useMemo(() => crearCuerpo(), []);
  const mascara = useMemo(() => crearMascara(), []);
  const reflejo = useMemo(() => crearReflejo(), []);

  useEffect(() => {
    for (const tex of [texAlm, texHyb]) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
    }
  }, [texAlm, texHyb]);

  // Libera lo que se creó a mano al desmontar
  useEffect(() => {
    return () => {
      cuerpo.dispose();
      mascara.dispose();
      reflejo.dispose();
    };
  }, [cuerpo, mascara, reflejo]);

  // Vuelta con un pequeño rebote, como un objeto con peso
  useEffect(() => {
    const tween = gsap.to(giro.current, { valor: girado ? Math.PI : 0, duration: 1.25, ease: 'back.out(1.5)' });
    return () => {
      tween.kill();
    };
  }, [girado]);

  useFrame((estado, dt) => {
    const interior = inclina.current;
    const volteo = gira.current;
    if (!interior || !volteo) return;
    const p = puntero.current;
    const t = estado.clock.elapsedTime;

    // Se inclina hacia el cursor y respira suavemente
    interior.rotation.y = THREE.MathUtils.damp(interior.rotation.y, p.x * 0.5 + Math.sin(t * 0.6) * 0.13, 4, dt);
    interior.rotation.x = THREE.MathUtils.damp(interior.rotation.x, -p.y * 0.3 + Math.cos(t * 0.5) * 0.05, 4, dt);
    interior.position.y = Math.sin(t * 0.9) * 0.035;

    const escalaObjetivo = sobre.current ? 1.045 : 1;
    giro.current.escala = THREE.MathUtils.damp(giro.current.escala, escalaObjetivo, 6, dt);
    interior.scale.setScalar(giro.current.escala);
    volteo.rotation.y = giro.current.valor;

    // El reflejo del cristal se desliza con la inclinación
    reflejo.offset.x = -interior.rotation.y * 0.9 + 0.1;

    // La luz de la linterna sigue al cursor también en 3D
    if (luz.current) {
      luz.current.position.x = THREE.MathUtils.damp(luz.current.position.x, p.x * 2.2, 5, dt);
      luz.current.position.y = THREE.MathUtils.damp(luz.current.position.y, -p.y * 2.2, 5, dt);
    }
  });

  return (
    <>
      <pointLight ref={luz} position={[0, 0, 2.4]} intensity={9} distance={7} color="#FFE9C2" />
      <pointLight position={[-1.8, 0.9, -1.4]} intensity={14} distance={7} color={acento} />
      <group ref={inclina}>
        <group ref={gira}>
          <mesh geometry={cuerpo}>
            <meshStandardMaterial color="#2c2f36" metalness={1} roughness={0.3} envMapIntensity={1.15} />
          </mesh>
          <Pantalla textura={texAlm} mascara={mascara} reflejo={reflejo} />
          <group rotation={[0, Math.PI, 0]}>
            <Pantalla textura={texHyb} mascara={mascara} reflejo={reflejo} />
          </group>
          {/* Botones laterales */}
          <mesh position={[ANCHO / 2 + 0.004, 0.45, 0]}>
            <boxGeometry args={[0.014, 0.22, 0.05]} />
            <meshStandardMaterial color="#3a3e46" metalness={1} roughness={0.35} />
          </mesh>
          <mesh position={[-ANCHO / 2 - 0.004, 0.55, 0]}>
            <boxGeometry args={[0.014, 0.1, 0.05]} />
            <meshStandardMaterial color="#3a3e46" metalness={1} roughness={0.35} />
          </mesh>
          <mesh position={[-ANCHO / 2 - 0.004, 0.32, 0]}>
            <boxGeometry args={[0.014, 0.16, 0.05]} />
            <meshStandardMaterial color="#3a3e46" metalness={1} roughness={0.35} />
          </mesh>
        </group>
      </group>
      <Polvo />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.6} position={[0, 3, 3]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.3} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color={acento} position={[4, 0, -2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[0, -3, 1]} scale={[6, 1.5, 1]} />
      </Environment>
    </>
  );
}

/** Teléfono 3D real: se inclina hacia el cursor, brilla con la linterna y da la vuelta al pulsarlo */
export default function Telefono3D({ puntero, girado, sobre, acento, visible }: PropsTelefono) {
  const [listo, setListo] = useState(false);

  return (
    <Canvas
      // El dibujado se detiene cuando el teléfono sale de pantalla
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent', opacity: listo ? 1 : 0, transition: 'opacity .8s' }}
      onCreated={() => setListo(true)}
    >
      <ambientLight intensity={0.35} />
      <Modelo puntero={puntero} girado={girado} sobre={sobre} acento={acento} />
    </Canvas>
  );
}
