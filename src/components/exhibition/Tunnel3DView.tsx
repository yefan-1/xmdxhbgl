import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MOCK_3D_MURALS } from '../../data/posterGraffitiMock';
import { Murals3DItem } from '../../types/posterGraffitiTypes';
import { ArrowLeft, ArrowRight, RotateCcw, Maximize2, Minimize2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Tunnel3DViewProps {
  selectedTheme?: string;
  onOpenHistory?: () => void;
}

export default function Tunnel3DView({ selectedTheme, onOpenHistory }: Tunnel3DViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeMural, setActiveMural] = useState<Murals3DItem | null>(null);
  const [cameraPosZ, setCameraPosZ] = useState(5);
  const [wallSide, setWallSide] = useState<'CENTER' | 'LEFT' | 'RIGHT'>('CENTER');
  const [isAutoAdvance, setIsAutoAdvance] = useState(true);

  // Performance refs to prevent scene destruction on camera / view state changes
  const cameraPosZRef = useRef(cameraPosZ);
  const wallSideRef = useRef(wallSide);
  const isAutoAdvanceRef = useRef(isAutoAdvance);

  useEffect(() => {
    cameraPosZRef.current = cameraPosZ;
  }, [cameraPosZ]);
  useEffect(() => {
    wallSideRef.current = wallSide;
  }, [wallSide]);
  useEffect(() => {
    isAutoAdvanceRef.current = isAutoAdvance;
  }, [isAutoAdvance]);

  // Mouse drag panning refs
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startDragOffsetRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen request failed:', err);
        setIsFullscreen(prev => !prev);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 800;
    const height = currentMount.clientHeight || 500;

    // Helper 1: Create procedural cement concrete canvas texture
    const createConcreteCanvasTexture = (isFloor: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = isFloor ? '#999999' : '#f8fafc';
      ctx.fillRect(0, 0, 256, 256);

      const imgData = ctx.getImageData(0, 0, 256, 256);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 14;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imgData, 0, 0);

      if (!isFloor) {
        // Smooth concrete ceiling texture without horizontal grid lines
      } else {
        // Draw single bright yellow dashed center dividing line (明黄色单条虚线 #FFCC00)
        ctx.strokeStyle = '#FFCC00';
        ctx.lineWidth = 5;
        ctx.setLineDash([56, 36]);
        
        ctx.beginPath();
        ctx.moveTo(128, 0);
        ctx.lineTo(128, 256);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    // Helper 2: Create reflective warning stripe canvas texture
    const createReflectiveStripeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#eab308';
      ctx.fillRect(0, 0, 256, 64);

      ctx.fillStyle = '#0f172a';
      const stripeWidth = 24;
      for (let x = -64; x < 320; x += stripeWidth * 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + stripeWidth, 0);
        ctx.lineTo(x + stripeWidth - 28, 64);
        ctx.lineTo(x - 28, 64);
        ctx.closePath();
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(45, 1);
      return texture;
    };

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.02);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    currentMount.appendChild(renderer.domElement);

    // Mouse pointer drag handlers on 3D canvas
    const domElement = renderer.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startDragOffsetRef.current = dragOffsetRef.current;
      dragDistanceRef.current = 0;
      domElement.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      dragDistanceRef.current = Math.abs(deltaX);
      dragOffsetRef.current = startDragOffsetRef.current + deltaX * 0.012;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      domElement.style.cursor = 'grab';
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 2. High performance optimized lights (1 Ambient + 1 Directional + 1 Camera PointLight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const mainDirLight = new THREE.DirectionalLight(0xffffff, 0.65);
    mainDirLight.position.set(0, 9, 10);
    scene.add(mainDirLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 0.8, 30);
    pointLight.position.set(0, 3.5, 0);
    scene.add(pointLight);

    // 3. Create Arched Milky White Concrete Tunnel Geometry (Taller Arch: Radius = 7.0m, +20% height)
    const tunnelGroup = new THREE.Group();
    const tunnelLength = 70;
    const radius = 7.0; // Taller tunnel height (+20%)

    const tunnelGeo = new THREE.CylinderGeometry(radius, radius, tunnelLength, 24, 1, true, Math.PI * 0.12, Math.PI * 1.76);
    tunnelGeo.scale(-1, 1, 1);

    const concreteCeilingTex = createConcreteCanvasTexture(false);
    concreteCeilingTex.repeat.set(4, 20);

    const tunnelMat = new THREE.MeshStandardMaterial({
      map: concreteCeilingTex,
      color: 0xfafafa,
      roughness: 0.8,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
    tunnelMesh.rotation.x = Math.PI / 2;
    tunnelMesh.position.z = -tunnelLength / 2 + 5;
    tunnelGroup.add(tunnelMesh);

    // Concrete Floor Mesh
    const concreteFloorTex = createConcreteCanvasTexture(true);
    concreteFloorTex.repeat.set(1, 20);

    const floorGeo = new THREE.PlaneGeometry(10.2, tunnelLength);
    const floorMat = new THREE.MeshStandardMaterial({
      map: concreteFloorTex,
      color: 0x999999,
      roughness: 0.8
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, -tunnelLength / 2 + 5);
    tunnelGroup.add(floorMesh);

    // 4. Sidewalk Kerbs on Both Sides
    const kerbHeight = 0.28;
    const kerbWidth = 0.88;

    const sidewalkTopGeo = new THREE.BoxGeometry(kerbWidth, kerbHeight, tunnelLength);
    const kerbTopMat = new THREE.MeshStandardMaterial({
      map: concreteFloorTex,
      color: 0x999999,
      roughness: 0.85
    });

    const reflectiveTex = createReflectiveStripeTexture();
    const kerbReflectiveMat = new THREE.MeshStandardMaterial({
      map: reflectiveTex,
      roughness: 0.35,
      metalness: 0.1
    });

    const leftKerbMats = [kerbReflectiveMat, kerbTopMat, kerbTopMat, kerbTopMat, kerbTopMat, kerbTopMat];
    const leftKerbMesh = new THREE.Mesh(sidewalkTopGeo, leftKerbMats);
    leftKerbMesh.position.set(-4.52, kerbHeight / 2, -tunnelLength / 2 + 5);
    tunnelGroup.add(leftKerbMesh);

    const rightKerbMats = [kerbTopMat, kerbReflectiveMat, kerbTopMat, kerbTopMat, kerbTopMat, kerbTopMat];
    const rightKerbMesh = new THREE.Mesh(sidewalkTopGeo, rightKerbMats);
    rightKerbMesh.position.set(4.52, kerbHeight / 2, -tunnelLength / 2 + 5);
    tunnelGroup.add(rightKerbMesh);

    // 5. Ceiling Two Parallel Rows of Flush LED Lights (Tight flush against arched ceiling surface)
    const lightRowGroup = new THREE.Group();
    const lightSpacing = 5.2;

    const lightPanelGeo = new THREE.BoxGeometry(0.48, 0.04, 2.6);
    const lightPanelMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.3,
      roughness: 0.1
    });

    for (let z = 5; z >= -tunnelLength + 5; z -= lightSpacing) {
      // Left row light panel - mounted tight against arch ceiling surface at Y = 6.95
      const leftMesh = new THREE.Mesh(lightPanelGeo, lightPanelMat);
      leftMesh.position.set(-0.55, 6.95, z);
      leftMesh.rotation.z = -0.08;
      lightRowGroup.add(leftMesh);

      // Right row light panel - mounted tight against arch ceiling surface at Y = 6.95
      const rightMesh = new THREE.Mesh(lightPanelGeo, lightPanelMat);
      rightMesh.position.set(0.55, 6.95, z);
      rightMesh.rotation.z = 0.08;
      lightRowGroup.add(rightMesh);
    }
    tunnelGroup.add(lightRowGroup);

    // 5.1 Ceiling Arched Structural Lines / Ribs (顶部拱形线条：细一点、密一点、#999999颜色，仅限顶部无涂鸦区域)
    const archRibGroup = new THREE.Group();
    const archRadius = 6.95;
    // Torus arc covering ~0.44 * PI stays strictly on the clean top ceiling above the murals
    const archGeo = new THREE.TorusGeometry(archRadius, 0.012, 8, 24, Math.PI * 0.44);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x999999, // #999999
      roughness: 0.4,
      metalness: 0.2
    });

    // Dense spacing: z -= 1.2m
    for (let z = 5; z >= -tunnelLength + 5; z -= 1.2) {
      const archMesh = new THREE.Mesh(archGeo, archMat);
      archMesh.position.set(0, 0, z);
      archMesh.rotation.z = Math.PI * 0.28; // Centered on top ceiling
      archRibGroup.add(archMesh);
    }
    tunnelGroup.add(archRibGroup);

    scene.add(tunnelGroup);

    // 6. Curved Murals on Left & Right Walls (Clean seamless murals without horizontal seam lines)
    const muralMeshes: { mesh: THREE.Mesh; muralData: Murals3DItem }[] = [];
    const loader = new THREE.TextureLoader();

    const wallRadius = 6.94; // Slightly inside tunnel radius (7.0m) to eliminate z-fighting seam lines
    const muralWidth = 3.82;
    const muralHeight = 13.5;
    const muralSpacing = 3.82;
    const deltaTheta = muralHeight / wallRadius;

    const baseSource = MOCK_3D_MURALS;
    const totalSlots = Math.floor(tunnelLength / muralSpacing);

    // Reusable geometries
    const thetaCenterLeft = Math.PI * 0.48;
    const thetaStartLeft = thetaCenterLeft - deltaTheta / 2;
    const curvedGeoLeft = new THREE.CylinderGeometry(wallRadius, wallRadius, muralWidth, 16, 1, true, thetaStartLeft, deltaTheta);
    curvedGeoLeft.scale(-1, 1, 1);

    const thetaCenterRight = Math.PI * 1.52;
    const thetaStartRight = thetaCenterRight - deltaTheta / 2;
    const curvedGeoRight = new THREE.CylinderGeometry(wallRadius, wallRadius, muralWidth, 16, 1, true, thetaStartRight, deltaTheta);
    curvedGeoRight.scale(-1, 1, 1);

    // Texture cache map
    const textureCache = new Map<string, THREE.Texture>();
    const getTexture = (url: string, isLeft: boolean) => {
      const key = `${url}_${isLeft ? 'L' : 'R'}`;
      if (textureCache.has(key)) return textureCache.get(key)!;
      const tex = loader.load(url);
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.center.set(0.5, 0.5);
      tex.rotation = isLeft ? Math.PI / 2 : -Math.PI / 2;
      textureCache.set(key, tex);
      return tex;
    };

    for (let i = 0; i < totalSlots; i++) {
      const zPos = 4 - i * muralSpacing;

      // Left Wall Slot
      const muralDataLeft = baseSource[(i * 2) % baseSource.length];
      const textureLeft = getTexture(muralDataLeft.imageUrl, true);
      const muralMatLeft = new THREE.MeshStandardMaterial({
        map: textureLeft,
        color: 0xffffff,
        roughness: 0.3,
        emissive: 0x222222,
        side: THREE.FrontSide
      });

      const meshLeft = new THREE.Mesh(curvedGeoLeft, muralMatLeft);
      meshLeft.rotation.x = Math.PI / 2;
      meshLeft.position.set(0, 0, zPos);
      scene.add(meshLeft);
      muralMeshes.push({ mesh: meshLeft, muralData: muralDataLeft });

      // Right Wall Slot
      const muralDataRight = baseSource[(i * 2 + 1) % baseSource.length];
      const textureRight = getTexture(muralDataRight.imageUrl, false);
      const muralMatRight = new THREE.MeshStandardMaterial({
        map: textureRight,
        color: 0xffffff,
        roughness: 0.3,
        emissive: 0x222222,
        side: THREE.FrontSide
      });

      const meshRight = new THREE.Mesh(curvedGeoRight, muralMatRight);
      meshRight.rotation.x = Math.PI / 2;
      meshRight.position.set(0, 0, zPos);
      scene.add(meshRight);
      muralMeshes.push({ mesh: meshRight, muralData: muralDataRight });
    }

    // Raycaster for clicking murals
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (dragDistanceRef.current > 6) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(muralMeshes.map(m => m.mesh));

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const matched = muralMeshes.find(m => m.mesh === hitMesh);
        if (matched) {
          setActiveMural(matched.muralData);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-advance camera if enabled and user is not actively dragging
      if (isAutoAdvanceRef.current && !isDraggingRef.current) {
        cameraPosZRef.current -= 0.035;
        if (cameraPosZRef.current < -52) {
          cameraPosZRef.current = 4;
        }
      }

      const currentWallSide = wallSideRef.current;
      const targetCamX = currentWallSide === 'LEFT' ? 2.2 : currentWallSide === 'RIGHT' ? -2.2 : 0;
      let lookTargetX = 0;
      let lookTargetZ = camera.position.z - 6;

      if (currentWallSide === 'CENTER') {
        lookTargetX = dragOffsetRef.current;
        lookTargetZ = camera.position.z - 6;
      } else if (currentWallSide === 'LEFT') {
        lookTargetX = -4.8;
        lookTargetZ = camera.position.z + dragOffsetRef.current;
      } else if (currentWallSide === 'RIGHT') {
        lookTargetX = 4.8;
        lookTargetZ = camera.position.z + dragOffsetRef.current;
      }

      // Smooth camera position & lookAt target updates without re-renders
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.z += (cameraPosZRef.current - camera.position.z) * 0.12;
      camera.lookAt(lookTargetX, 2.1, lookTargetZ);

      pointLight.position.x = camera.position.x;
      pointLight.position.z = camera.position.z - 2;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick);
      }
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Thorough memory cleanup on unmount
      tunnelGeo.dispose();
      floorGeo.dispose();
      sidewalkTopGeo.dispose();
      lightPanelGeo.dispose();
      curvedGeoLeft.dispose();
      curvedGeoRight.dispose();
      concreteCeilingTex.dispose();
      concreteFloorTex.dispose();
      reflectiveTex.dispose();
      textureCache.forEach(tex => tex.dispose());
      renderer.dispose();
    };
  }, []); // Run ONCE on mount! Zero rebuilds when panning, sliding, or changing views!

  const handleResetCamera = () => {
    setCameraPosZ(5);
    dragOffsetRef.current = 0;
  };

  const handleWallSwitch = (side: 'CENTER' | 'LEFT' | 'RIGHT') => {
    setWallSide(side);
    dragOffsetRef.current = 0;
    if (side === 'LEFT' || side === 'RIGHT') {
      setCameraPosZ(4); // Align camera directly at 1st mural at z = 4 with 0 blank padding on left
    } else {
      setCameraPosZ(5);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-[100] h-screen rounded-none' : 'h-[624px] rounded-3xl'} bg-slate-100 overflow-hidden border border-slate-200 shadow-2xl flex flex-col transition-all`}
    >
      {/* Top Overlay Controls (Translucent White Background) */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-start justify-between pointer-events-none">
        {/* Left Column: Center / Left / Right Wall View Switcher + 历史涂鸦 Button */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-xl">
            <button
              type="button"
              onClick={() => handleWallSwitch('CENTER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wallSide === 'CENTER'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              居中
            </button>
            <button
              type="button"
              onClick={() => handleWallSwitch('LEFT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wallSide === 'LEFT'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              左壁
            </button>
            <button
              type="button"
              onClick={() => handleWallSwitch('RIGHT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                wallSide === 'RIGHT'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              右壁
            </button>
          </div>

          {/* 下一行：历史涂鸦按钮 */}
          {onOpenHistory && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="bg-white/90 hover:bg-blue-600 hover:text-white text-blue-700 backdrop-blur-md px-4 py-2 rounded-xl border border-white/80 shadow-xl text-xs font-bold transition-all flex items-center gap-1.5 w-fit cursor-pointer active:scale-95 shadow-blue-900/5"
            >
              <History size={15} />
              <span>历史涂鸦</span>
            </button>
          )}
        </div>

        {/* Reset Camera View & Maximize Buttons */}
        <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/80 shadow-xl pointer-events-auto">
          <label className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 rounded-xl transition-colors text-xs font-bold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAutoAdvance}
              onChange={(e) => setIsAutoAdvance(e.target.checked)}
              className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
            />
            <span>自动前进</span>
          </label>
          <div className="w-px h-4 bg-slate-200" />
          <button
            onClick={handleResetCamera}
            className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="视角复位"
          >
            <RotateCcw size={14} /> 视角复位
          </button>
          <div className="w-px h-4 bg-slate-200" />
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title={isFullscreen ? "退出全屏" : "最大化"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? "退出全屏" : "最大化"}</span>
          </button>
        </div>
      </div>

      {/* ThreeJS Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 居中视角下的地板 3D 导航箭头按钮 (向前/向后) - 透明白色背景，紧贴地面 */}
      {wallSide === 'CENTER' && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto [perspective:900px]">
          {/* 向前按钮：透明白色背景，悬停改变颜色 */}
          <button
            type="button"
            onClick={() => setCameraPosZ((prev) => Math.max(prev - 5, -52))}
            className="group relative flex items-center justify-center w-20 h-44 rounded-3xl bg-white/85 hover:bg-sky-600/90 text-sky-600 hover:text-white border-2 border-sky-400/80 hover:border-white shadow-[0_15px_35px_rgba(2,132,199,0.3)] transition-colors active:scale-95 cursor-pointer backdrop-blur-md [transform:rotateX(72deg)_scaleY(1.2)] origin-bottom mb-7"
            title="向前"
          >
            <div className="flex flex-col items-center justify-center h-full w-full py-3">
              <svg className="w-10 h-36 text-sky-600 group-hover:text-white transition-colors animate-pulse" viewBox="0 0 40 140" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="20" y1="130" x2="20" y2="14" />
                <polyline points="6,28 20,10 34,28" />
              </svg>
            </div>
          </button>

          {/* 向后按钮：透明白色背景 */}
          <button
            type="button"
            onClick={() => setCameraPosZ((prev) => Math.min(prev + 5, 4))}
            className="group relative flex items-center justify-center w-18 h-14 rounded-2xl bg-white/85 hover:bg-amber-600/90 text-amber-600 hover:text-white border-2 border-amber-400/80 hover:border-white shadow-[0_12px_25px_rgba(217,119,6,0.3)] transition-colors active:scale-95 cursor-pointer backdrop-blur-md [transform:rotateX(72deg)_scaleY(1.2)] origin-bottom"
            title="向后"
          >
            <svg className="w-7 h-9 text-amber-600 group-hover:text-white transition-colors" viewBox="0 0 32 38" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="16" y1="6" x2="16" y2="30" />
              <polyline points="6,20 16,32 26,20" />
            </svg>
          </button>
        </div>
      )}

      {/* 左壁/右壁视图下的底部拖动与向左/向右导航控件 (透明白色背景 + 椭圆形滑轨) */}
      {wallSide !== 'CENTER' && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-5 py-3.5 rounded-3xl bg-white/85 border border-white/80 shadow-2xl backdrop-blur-md max-w-xl w-[90%] pointer-events-auto">
          {/* 向左按钮 */}
          <button
            type="button"
            onClick={() => {
              if (wallSide === 'LEFT') {
                setCameraPosZ(prev => Math.max(prev - 5, -52));
              } else {
                setCameraPosZ(prev => Math.min(prev + 5, 4));
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft size={16} />
            <span>向左</span>
          </button>

          {/* 墙面滚动位置 椭圆形滑轨 */}
          <div className="flex-1 flex flex-col items-center gap-1 px-1">
            <div className="w-full flex justify-between text-[11px] font-bold text-slate-600 px-2">
              <span>{wallSide === 'LEFT' ? '入口 (0m)' : '深处 (350m)'}</span>
              <span className="text-blue-600 font-extrabold">按住拖拽滑动壁面</span>
              <span>{wallSide === 'LEFT' ? '深处 (350m)' : '入口 (0m)'}</span>
            </div>
            {/* 椭圆形滑轨 Track Container */}
            <div className="w-full relative flex items-center h-4 bg-slate-200/90 rounded-full px-1 border border-slate-300 shadow-inner">
              <input
                type="range"
                min={-52}
                max={4}
                step={0.5}
                value={cameraPosZ}
                onChange={(e) => setCameraPosZ(Number(e.target.value))}
                className="w-full h-3 bg-transparent rounded-full appearance-none cursor-pointer accent-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 向右按钮 */}
          <button
            type="button"
            onClick={() => {
              if (wallSide === 'LEFT') {
                setCameraPosZ(prev => Math.min(prev + 5, 4));
              } else {
                setCameraPosZ(prev => Math.max(prev - 5, -52));
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>向右</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Active Mural Modal */}
      <AnimatePresence>
        {activeMural && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row text-slate-800"
            >
              {/* 图片 Preview */}
              <div className="md:w-1/2 bg-slate-100 relative flex items-center justify-center p-3">
                <img
                  src={activeMural.imageUrl}
                  alt={activeMural.title}
                  className="w-full h-64 md:h-full object-cover rounded-2xl shadow-sm border border-slate-200"
                />
                <span className="absolute top-5 left-5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                  {activeMural.theme}
                </span>
              </div>

              {/* Detail Content (White Background) */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md font-semibold">
                      S-{activeMural.meterPosition}m 墙面 ({activeMural.side === 'LEFT' ? '左侧' : '右侧'})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveMural(null)}
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer font-bold"
                      title="关闭"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mt-3 mb-3">{activeMural.title}</h3>

                  {/* 核心显示字段明细 */}
                  <div className="space-y-2.5 mb-4 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">涂鸦主题：</span>
                      <span className="text-blue-800 font-bold bg-blue-100/80 px-2 py-0.5 rounded-md">{activeMural.theme}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">创作单位名称：</span>
                      <span className="text-slate-900 font-bold">{activeMural.orgName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">创作团队 / 负责人：</span>
                      <span className="text-slate-700 font-medium">{activeMural.artist}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">创作时间：</span>
                      <span className="text-slate-900 font-mono font-bold">{activeMural.year} 年</span>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeMural.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-500 font-medium">
                    展示位置：S-{activeMural.meterPosition}m ({activeMural.side === 'LEFT' ? '左壁' : '右壁'})
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    创作时间：{activeMural.year}年
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
