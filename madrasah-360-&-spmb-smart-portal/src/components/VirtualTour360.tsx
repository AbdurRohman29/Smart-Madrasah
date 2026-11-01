import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomProfile, RoomHotspot } from '../types';
import { generateEquirectangularTexture } from '../utils/panoramaGenerator';
import { 
  Compass, RotateCw, ZoomIn, ZoomOut, Maximize, Minimize, 
  Info, Eye, Layers, ChevronRight, Navigation, Sparkles, MapPin
} from 'lucide-react';

interface VirtualTour360Props {
  rooms: RoomProfile[];
  initialRoomId?: string;
  onOpenRoomProfile: (room: RoomProfile) => void;
}

interface ProjectedHotspot {
  hotspot: RoomHotspot;
  x: number;
  y: number;
  visible: boolean;
}

export const VirtualTour360: React.FC<VirtualTour360Props> = ({
  rooms,
  initialRoomId,
  onOpenRoomProfile,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>(initialRoomId || rooms[0]?.id || 'gerbang_plaza');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInfoHotspotOpen, setIsInfoHotspotOpen] = useState<{ title: string; text: string } | null>(null);
  const [hotspotsOnScreen, setHotspotsOnScreen] = useState<ProjectedHotspot[]>([]);
  const [yawAngle, setYawAngle] = useState(0); // for compass radar
  const [isLoadingTexture, setIsLoadingTexture] = useState(false);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Interaction State
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const lonRef = useRef(180);
  const latRef = useRef(0);
  const targetLonRef = useRef(180);
  const targetLatRef = useRef(0);

  // Texture Cache
  const textureCache = useRef<Record<string, THREE.Texture>>({});

  // Switch Room Helper
  const switchRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId);
    setIsInfoHotspotOpen(null);
  }, []);

  // Update Three.js Texture when active room changes
  useEffect(() => {
    if (!sphereMeshRef.current || !activeRoom) return;
    setIsLoadingTexture(true);

    const loadTexture = () => {
      if (textureCache.current[activeRoom.id]) {
        const mat = sphereMeshRef.current!.material as THREE.MeshBasicMaterial;
        mat.map = textureCache.current[activeRoom.id];
        mat.needsUpdate = true;
        setIsLoadingTexture(false);
        return;
      }

      // Generate canvas texture procedurally
      const dataUrl = generateEquirectangularTexture(activeRoom);
      const loader = new THREE.TextureLoader();
      loader.load(dataUrl, (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        textureCache.current[activeRoom.id] = loadedTexture;
        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          mat.map = loadedTexture;
          mat.needsUpdate = true;
        }
        setIsLoadingTexture(false);
      });
    };

    loadTexture();
  }, [activeRoom]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Inverted Sphere for 360 Panorama interior
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Turn inside-out

    // Initial placeholder texture
    const initialDataUrl = generateEquirectangularTexture(activeRoom);
    const initialTexture = new THREE.TextureLoader().load(initialDataUrl);
    initialTexture.colorSpace = THREE.SRGBColorSpace;
    textureCache.current[activeRoom.id] = initialTexture;

    const material = new THREE.MeshBasicMaterial({ map: initialTexture });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // Render Loop & Hotspot projection
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Auto-rotation when idle
      if (isAutoRotate && !isDraggingRef.current) {
        targetLonRef.current += 0.08;
      }

      // Smooth damping
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.1;
      latRef.current += (targetLatRef.current - latRef.current) * 0.1;

      // Clamp latitude
      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);

      // Calculate yaw angle for radar compass
      const normalizedLon = ((lonRef.current % 360) + 360) % 360;
      setYawAngle(normalizedLon);

      // Project hotspots into 2D screen coordinates
      if (activeRoom && activeRoom.hotspots.length > 0 && container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const projected: ProjectedHotspot[] = [];

        activeRoom.hotspots.forEach((hs) => {
          const hsPhi = THREE.MathUtils.degToRad(90 - hs.pitch);
          const hsTheta = THREE.MathUtils.degToRad(hs.yaw);

          const hsPos = new THREE.Vector3(
            -500 * Math.sin(hsPhi) * Math.cos(hsTheta),
            500 * Math.cos(hsPhi),
            500 * Math.sin(hsPhi) * Math.sin(hsTheta)
          );

          // Project to 2D
          const screenPos = hsPos.clone().project(camera);

          // Check if hotspot is in front of camera (z < 1)
          const isVisible = screenPos.z < 1;
          const x = (screenPos.x * 0.5 + 0.5) * width;
          const y = (-(screenPos.y * 0.5) + 0.5) * height;

          if (isVisible && x >= -50 && x <= width + 50 && y >= -50 && y <= height + 50) {
            projected.push({
              hotspot: hs,
              x,
              y,
              visible: true,
            });
          }
        });

        setHotspotsOnScreen(projected);
      } else {
        setHotspotsOnScreen([]);
      }
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Pointer & Touch Events
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;

    targetLonRef.current -= deltaX * 0.22;
    targetLatRef.current += deltaY * 0.22;

    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    e.preventDefault();
    const newFov = cameraRef.current.fov + e.deltaY * 0.05;
    cameraRef.current.fov = Math.max(40, Math.min(95, newFov));
    cameraRef.current.updateProjectionMatrix();
  };

  const zoomCamera = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -10 : 10;
    const newFov = cameraRef.current.fov + delta;
    cameraRef.current.fov = Math.max(40, Math.min(95, newFov));
    cameraRef.current.updateProjectionMatrix();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current?.parentElement;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[640px] flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-emerald-900/40 select-none shadow-2xl">
      {/* 360 Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="relative w-full flex-1 cursor-grab active:cursor-grabbing touch-none overflow-hidden"
      />

      {/* Loading Overlay */}
      {isLoadingTexture && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center pointer-events-none z-30 transition">
          <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-xl">
            <RotateCw className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-sm font-semibold text-white">Memuat Panorama 360° {activeRoom.name}...</p>
          </div>
        </div>
      )}

      {/* Interactive Hotspot Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {hotspotsOnScreen.map(({ hotspot, x, y }) => (
          <div
            key={hotspot.id}
            style={{
              transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
            }}
            className="absolute pointer-events-auto transition-transform hover:scale-110 duration-200"
          >
            {hotspot.type === 'navigate' ? (
              <button
                onClick={() => hotspot.targetRoomId && switchRoom(hotspot.targetRoomId)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 border border-emerald-300/40 backdrop-blur-md cursor-pointer transition"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Navigation className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold whitespace-nowrap drop-shadow">
                  {hotspot.label}
                </span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsInfoHotspotOpen({
                    title: hotspot.infoTitle || hotspot.label,
                    text: hotspot.infoText || 'Informasi fasilitas ruang madrasah.',
                  });
                }}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-600/90 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/50 border border-amber-300/40 backdrop-blur-md cursor-pointer transition"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Info className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold whitespace-nowrap drop-shadow">
                  {hotspot.label}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Top Header HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none z-30">
        {/* Active Room Title Card */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-emerald-500/30 shadow-xl max-w-sm sm:max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Virtual Tour 360°
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {activeRoom.building}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            {activeRoom.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
            {activeRoom.tagline}
          </p>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
            <button
              onClick={() => onOpenRoomProfile(activeRoom)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Info className="w-3.5 h-3.5" />
              Profil Lengkap Ruangan
            </button>
            <span className="text-[11px] text-slate-400">
              Kapasitas: {activeRoom.capacity} Siswa
            </span>
          </div>
        </div>

        {/* Top-Right HUD Controls: Compass Radar & Fullscreen */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl">
          {/* Compass Radar */}
          <div 
            className="w-10 h-10 rounded-full bg-slate-950 border border-emerald-500/40 flex items-center justify-center relative shadow-inner"
            title={`Arah Pandang: ${Math.round(yawAngle)}°`}
          >
            <div
              style={{ transform: `rotate(${-yawAngle}deg)` }}
              className="w-full h-full flex items-center justify-center transition-transform duration-75"
            >
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="absolute top-0.5 text-[8px] font-bold text-emerald-400">U</span>
          </div>

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2.5 rounded-xl transition ${
              isAutoRotate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isAutoRotate ? 'Jeda Putar Otomatis' : 'Mulai Putar Otomatis'}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            onClick={() => zoomCamera('in')}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Perbesar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => zoomCamera('out')}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Perkecil"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Hotspot Popup Drawer */}
      {isInfoHotspotOpen && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-[90%] bg-slate-900/95 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">
                {isInfoHotspotOpen.title}
              </h4>
            </div>
            <button
              onClick={() => setIsInfoHotspotOpen(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-slate-800"
            >
              Tutup
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {isInfoHotspotOpen.text}
          </p>
        </div>
      )}

      {/* Bottom Rooms Carousel & Navigation Selector */}
      <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 shadow-2xl">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Pilih Ruangan & Bangunan Madrasah ({rooms.length} Titik 360°)
            </span>
            <span className="text-[11px] text-emerald-400 font-medium hidden sm:inline">
              Geser mouse / sentuh layar untuk melihat 360 derajat
            </span>
          </div>

          {/* Room Thumbnails Slider */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-600">
            {rooms.map((room) => {
              const isActive = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => switchRoom(room.id)}
                  className={`group relative flex-shrink-0 flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 relative">
                    <img
                      src={room.galleryImages[0]}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-400 drop-shadow" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-bold whitespace-nowrap ${isActive ? 'text-emerald-300' : 'text-slate-200'}`}>
                      {room.name}
                    </p>
                    <p className="text-[10px] text-slate-400 whitespace-nowrap">
                      {room.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
