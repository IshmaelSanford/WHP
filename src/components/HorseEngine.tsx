'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

// Shared mouse coordinate state in 3D world space
const globalMouse3D = new THREE.Vector3(999, 999, 999);

const noiseShader = `
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

function ParticleCloud({ horseMesh, originalGroup, parentGroup, seed, isEmitter = true, params }: { horseMesh: THREE.Mesh, originalGroup: React.RefObject<THREE.Group | null>, parentGroup: React.RefObject<THREE.Group | null>, seed: number, isEmitter?: boolean, params: any }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<any>(null);
  
  const geometry = useMemo(() => {
    // Clone original geometry
    const geo = horseMesh.geometry.clone();
    geo.center(); // Center the geometry bounding box
    
    const count = geo.attributes.position.count;
    const lifeOffsets = new Float32Array(count);
    
    // We want to sample actual FACES of the mesh, not just vertices.
    // This provides perfect 100% surface coverage.
    const originalPos = new Float32Array(geo.attributes.position.array);
    const originalMorphs = geo.morphAttributes.position 
      ? geo.morphAttributes.position.map(attr => new Float32Array(attr.array)) 
      : [];
      
    const positions = geo.attributes.position.array as Float32Array;
    const morphs = geo.morphAttributes.position || [];
    
    const indices = geo.getIndex()?.array;

    for(let i=0; i<count; i++) {
      lifeOffsets[i] = Math.random();
      
      // If the mesh is indexed, pick a random triangle to spawn a particle on
      if (indices && indices.length > 0) {
        // Pick a random face (triangle = 3 indices)
        const faceIdx = Math.floor(Math.random() * (indices.length / 3)) * 3;
        const i0 = indices[faceIdx];
        const i1 = indices[faceIdx + 1];
        const i2 = indices[faceIdx + 2];
        
        // Random barycentric coordinates for uniform face sampling
        let u = Math.random();
        let v = Math.random();
        if (u + v > 1) {
          u = 1 - u;
          v = 1 - v;
        }
        const w = 1 - u - v;

        // Interpolate base position
        positions[i*3] = originalPos[i0*3]*u + originalPos[i1*3]*v + originalPos[i2*3]*w;
        positions[i*3+1] = originalPos[i0*3+1]*u + originalPos[i1*3+1]*v + originalPos[i2*3+1]*w;
        positions[i*3+2] = originalPos[i0*3+2]*u + originalPos[i1*3+2]*v + originalPos[i2*3+2]*w;

        // Interpolate all morph targets perfectly so animation doesn't tear!
        for(let m=0; m<morphs.length; m++) {
          morphs[m].array[i*3] = originalMorphs[m][i0*3]*u + originalMorphs[m][i1*3]*v + originalMorphs[m][i2*3]*w;
          morphs[m].array[i*3+1] = originalMorphs[m][i0*3+1]*u + originalMorphs[m][i1*3+1]*v + originalMorphs[m][i2*3+1]*w;
          morphs[m].array[i*3+2] = originalMorphs[m][i0*3+2]*u + originalMorphs[m][i1*3+2]*v + originalMorphs[m][i2*3+2]*w;
        }
      }

      // Add microscopic noise to create 3D volumetric fuzz instead of flat faces
      const spread = isEmitter ? 0.3 : 0.05;
      positions[i*3] += (Math.random() - 0.5) * spread;
      positions[i*3+1] += (Math.random() - 0.5) * spread;
      positions[i*3+2] += (Math.random() - 0.5) * spread;
    }
    
    geo.setAttribute('aLifeOffset', new THREE.BufferAttribute(lifeOffsets, 1));
    // Inform ThreeJS that attributes updated
    geo.attributes.position.needsUpdate = true;
    for(let m=0; m<morphs.length; m++) {
      morphs[m].needsUpdate = true;
    }
    
    return geo;
  }, [horseMesh, isEmitter, seed]);

  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const customUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0,0,0) },
    uSeed: { value: seed },
    uTravelDistance: { value: paramsRef.current.travelDistance },
    uTurbulence: { value: paramsRef.current.turbulence },
    uBackMaskStart: { value: paramsRef.current.backMaskStart },
    uParticleSize: { value: paramsRef.current.particleSize }
  }), [seed]);

  useFrame((state) => {
    if (pointsRef.current && horseMesh.morphTargetInfluences) {
      if (!pointsRef.current.morphTargetInfluences) {
        pointsRef.current.morphTargetInfluences = [];
      }
      for (let i = 0; i < horseMesh.morphTargetInfluences.length; i++) {
        pointsRef.current.morphTargetInfluences[i] = horseMesh.morphTargetInfluences[i];
      }
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Convert global 3D mouse intersect into perfectly robust Local mesh space
      if (parentGroup && parentGroup.current) {
        const localMouse = parentGroup.current.worldToLocal(globalMouse3D.clone());
        shaderRef.current.uniforms.uMouse.value.copy(localMouse);
      } else {
        shaderRef.current.uniforms.uMouse.value.copy(globalMouse3D);
      }

      shaderRef.current.uniforms.uTravelDistance.value = paramsRef.current.travelDistance;
      shaderRef.current.uniforms.uTurbulence.value = paramsRef.current.turbulence;
      shaderRef.current.uniforms.uBackMaskStart.value = paramsRef.current.backMaskStart;
      shaderRef.current.uniforms.uParticleSize.value = paramsRef.current.particleSize;
    }
  });

  return (
    <points 
      ref={pointsRef} 
      morphTargetDictionary={horseMesh.morphTargetDictionary}
    >
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial 
        customProgramCacheKey={() => seed.toString()}
        size={params.particleSize} 
        color="#09090b" // Dark black/zinc
        transparent 
        opacity={isEmitter ? 0.2 : 0.6}  
        sizeAttenuation={false}
        blending={THREE.NormalBlending}
        depthWrite={false}
        onBeforeCompile={(shader) => {
          Object.assign(shader.uniforms, customUniforms);
          shaderRef.current = shader;

          shader.vertexShader = shader.vertexShader.replace(
            `#include <common>`,
            `
            #include <common>
            attribute float aLifeOffset;
            varying float vAlpha;
            uniform float uTime;
            uniform vec3 uMouse;
            uniform float uSeed;
            uniform float uTravelDistance;
            uniform float uTurbulence;
            uniform float uBackMaskStart;
            uniform float uParticleSize;
            ${noiseShader}
            `
          );

          // Emitter logic
          shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `
            #include <begin_vertex>
            
            // Particle Life (0.0 to 1.0 continuously looping)
            float life = fract(uTime * 0.15 + aLifeOffset + uSeed);
            
            // Turbulence/Force Field 
            float noiseX = snoise(transformed * 0.05 + vec3(uTime * 0.2, uTime * 0.1, uSeed));
            float noiseY = snoise(transformed * 0.05 + vec3(uSeed, uTime * 0.2, uTime * 0.2));
            float noiseZ = snoise(transformed * 0.05 + vec3(uTime * 0.1, uSeed, uTime * -0.2));
            vec3 noiseVec = vec3(noiseX, noiseY, noiseZ);

            // Universal body mouse repel: Calculated locally so camera/mesh rotations don't break the volumetric push
            float distToMouse = length(transformed - uMouse);
            float bodyRepelForce = smoothstep(40.0, 0.0, distToMouse) * 12.0; 
            vec3 bodyRepelDir = normalize(transformed - uMouse);
            
            // Apply body snap-back push directly to the origin position
            transformed += bodyRepelDir * bodyRepelForce;

            vec3 windDirection = normalize(vec3(1.5, 0.3, -3.0)); 
            
            // Dynamic turbulence for the drifting trail
            vec3 driftVelocity = (windDirection * 1.5 + noiseVec * uTurbulence);
            
            // Slider Mask control (-20 is far back, +20 encompasses whole horse)
            float backMask = smoothstep(uBackMaskStart + 20.0, uBackMaskStart, transformed.z);
            
            // Dynamic travel distance
            float travelDist = pow(life, 1.5) * uTravelDistance * float(${isEmitter ? '1.0' : '0.0'}) * backMask;
            transformed += driftVelocity * travelDist;
            
            // Fade in and out 
            float emitterAlpha = smoothstep(0.0, 0.1, life) * smoothstep(1.0, 0.1, life) * backMask;
            vAlpha = ${isEmitter ? 'emitterAlpha' : '1.0'};
            `
          );
          
          shader.vertexShader = shader.vertexShader.replace(
            `#include <size_vertex>`,
            `
            #include <size_vertex>
            // Make particles dynamically resize based on user settings 
            gl_PointSize *= ${isEmitter ? '(uParticleSize + fract(uTime * 0.15 + aLifeOffset + uSeed) * 1.5)' : 'uParticleSize'};
            `
          );

          // Inject varying vAlpha into Fragment Shader and create soft rounded points
          shader.fragmentShader = shader.fragmentShader.replace(
            `#include <common>`,
            `
            #include <common>
            varying float vAlpha;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            `#include <map_particle_fragment>`,
            `
            #include <map_particle_fragment>
            
            vec2 ptCoord = gl_PointCoord - vec2(0.5);
            float dist = length(ptCoord);
            float alphaShape = smoothstep(0.5, 0.1, dist);
            
            diffuseColor.a *= alphaShape * vAlpha;
            `
          );
        }}
      />
    </points>
  );
}

function HorseScene({ scrollYProgress, params }: { scrollYProgress: number, params: any }) {
  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF('/Horse.glb');
  
  const horseMeshArray = Object.values(nodes).filter((n) => (n as THREE.Mesh).isMesh);
  const horseMesh = horseMeshArray[0] as THREE.Mesh;
  const originalGroup = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, originalGroup);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionKey = Object.keys(actions)[0];
      actions[actionKey]?.play();
    }
  }, [actions]);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();
    // Start rotated strictly leftwards, add slight organic drift
    group.current.rotation.y = -Math.PI / 1.5 + time * 0.05 + scrollYProgress * Math.PI;
  });

  return (
    <>
      <group ref={originalGroup} visible={false}>
        <primitive object={horseMesh} />
      </group>

      <group ref={group} scale={[0.3, 0.3, 0.3]} position={[0, -5, 0]}>
        
        {/* SOLID OUTLINE (Clear silhouette) */}
        {Array.from({ length: params.bodyLayers || 0 }).map((_, i) => (
          <ParticleCloud key={`body-${i}`} horseMesh={horseMesh} originalGroup={originalGroup} parentGroup={group} seed={i * 0.1 + 0.1} isEmitter={false} params={params} />
        ))}
        
        {/* MODERATE PARTICLE TRAIL (Emitted exclusively from the back half) */}
        {Array.from({ length: params.trailLayers || 0 }).map((_, i) => (
          <ParticleCloud key={`trail-${i}`} horseMesh={horseMesh} originalGroup={originalGroup} parentGroup={group} seed={i * 1.1 + 1.1} params={params} />
        ))}
      </group>
    </>
  );
}

// Global mouse tracker uses a massive sphere to properly register mouse regardless of camera angle
function MouseTracker() {
  const { camera } = useThree();
  return (
    <mesh 
      visible={false} 
      onPointerMove={(e) => globalMouse3D.copy(e.point)}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[500, 32, 32]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  );
}

useGLTF.preload('/Horse.glb');

export default function HorseEngine({ className }: { className?: string }) {
  const scrollYProgress = 0; 

  // Hardcoded to user's perfect visual configuration
  const params = {
    travelDistance: 37.0,
    turbulence: 1.8,
    backMaskStart: 30.0,
    particleSize: 0.1,
    bodyLayers: 35,
    trailLayers: 7
  };
  
  return (
    <div className={cn("w-full h-full bg-transparent relative cursor-grab active:cursor-grabbing", className)}>
      <Canvas camera={{ position: [0, 10, 80], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <HorseScene scrollYProgress={scrollYProgress} params={params} />
        <MouseTracker />
        <OrbitControls enableZoom={false} enablePan={true} enableRotate={true} makeDefault />
      </Canvas>
    </div>
  );
}
