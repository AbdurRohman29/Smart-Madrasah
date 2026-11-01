import { RoomProfile } from '../types';

/**
 * Procedural Equirectangular 360 Panorama Texture Generator
 * Creates high-fidelity 2:1 ratio (2048x1024) spherical panoramas
 * tailored specifically for each Madrasah location.
 */
export function generateEquirectangularTexture(room: RoomProfile): string {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const theme = room.theme;

  // 1. Base Gradient (Sky / Ceiling to Floor)
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0, theme.skyTop);
  baseGrad.addColorStop(0.48, theme.skyBottom);
  baseGrad.addColorStop(0.52, theme.wallColor);
  baseGrad.addColorStop(1, theme.floorColor);
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Horizon and Grid / Floor Perspective
  const horizon = height * 0.5;

  // Draw Floor Tiles / Ground
  ctx.save();
  ctx.fillStyle = theme.floorColor;
  ctx.fillRect(0, horizon, width, height - horizon);

  // Floor grid lines for 3D depth perception
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  for (let y = horizon + 20; y < height; y += (y - horizon) * 0.35 + 15) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Radial perspective lines converging to horizon center points
  for (let x = 0; x < width; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, horizon);
    ctx.lineTo(x + (x - width / 2) * 1.5, height);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Wall Panels & Architectural Pillars
  ctx.save();
  const pillarCount = 8;
  const pillarWidth = width / pillarCount;

  for (let i = 0; i < pillarCount; i++) {
    const px = i * pillarWidth;

    // Architectural Column
    const colGrad = ctx.createLinearGradient(px, 0, px + 40, 0);
    colGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    colGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    colGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

    ctx.fillStyle = colGrad;
    ctx.fillRect(px, horizon - 280, 50, 280);

    // Decorative Islamic Arch header
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px + 25, horizon - 280, 25, Math.PI, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Room-Specific Custom Architectural Scenes
  if (room.id === 'kelas_xmipa') {
    renderClassroomScene(ctx, width, height, horizon);
  } else if (room.id === 'masjid_jami') {
    renderMasjidScene(ctx, width, height, horizon);
  } else if (room.id === 'lab_sains') {
    renderLabScene(ctx, width, height, horizon);
  } else if (room.id === 'perpustakaan_digital') {
    renderLibraryScene(ctx, width, height, horizon);
  } else if (room.id === 'gerbang_plaza') {
    renderPlazaScene(ctx, width, height, horizon);
  } else if (room.id === 'asrama_santri') {
    renderAsramaScene(ctx, width, height, horizon);
  } else {
    renderSportHallScene(ctx, width, height, horizon);
  }

  // 5. Ceiling Lighting Fixtures
  ctx.save();
  for (let cx = 150; cx < width; cx += 320) {
    const lightGrad = ctx.createRadialGradient(cx, horizon - 360, 5, cx, horizon - 360, 80);
    lightGrad.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
    lightGrad.addColorStop(0.3, 'rgba(254, 243, 199, 0.4)');
    lightGrad.addColorStop(1, 'rgba(254, 243, 199, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.arc(cx, horizon - 360, 80, 0, Math.PI * 2);
    ctx.fill();

    // Luminaire fixture
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 30, horizon - 370, 60, 12);
  }
  ctx.restore();

  // 6. 360 Degree Compass Band (Atmospheric subtle footer)
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, height - 32, width, 32);
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('UTARA (0°)', width * 0.5, height - 10);
  ctx.fillText('TIMUR (90°)', width * 0.75, height - 10);
  ctx.fillText('SELATAN (180°)', width * 0.05, height - 10);
  ctx.fillText('BARAT (270°)', width * 0.25, height - 10);
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.88);
}

// Sub-renderers for realistic environments:
function renderClassroomScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Front Center: 75 Inch Interactive Smartboard
  const sbX = width * 0.5 - 280;
  const sbY = horizon - 220;
  const sbW = 560;
  const sbH = 220;

  // Frame
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(sbX - 10, sbY - 10, sbW + 20, sbH + 20);

  // Screen
  const screenGrad = ctx.createLinearGradient(sbX, sbY, sbX + sbW, sbY + sbH);
  screenGrad.addColorStop(0, '#064e3b');
  screenGrad.addColorStop(1, '#042f2e');
  ctx.fillStyle = screenGrad;
  ctx.fillRect(sbX, sbY, sbW, sbH);

  // Smartboard Content
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SMART CLASSROOM X-MIPA 1', width * 0.5, sbY + 45);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Materi: Fisika Komputasi & Integrasi Sains Qur\'ani', width * 0.5, sbY + 80);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 18px "Amiri", serif';
  ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ - اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', width * 0.5, sbY + 130);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Kapasitas: 32 Siswa | AC 2 Unit | Smart Display 4K UHD', width * 0.5, sbY + 175);

  // Wall Motivational Clock & Islamic Calligraphy Art
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(width * 0.5, sbY - 45, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.fillText('10:15', width * 0.5, sbY - 40);

  // Left Wall: Large Windows with Sunlight & Greenery View
  for (let wx = 80; wx < 350; wx += 140) {
    ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
    ctx.fillRect(wx, horizon - 200, 110, 180);
    // Window mullions
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(wx, horizon - 200, 110, 180);
    ctx.beginPath();
    ctx.moveTo(wx + 55, horizon - 200);
    ctx.lineTo(wx + 55, horizon - 20);
    ctx.moveTo(wx, horizon - 110);
    ctx.lineTo(wx + 110, horizon - 110);
    ctx.stroke();
  }

  // Right Wall: Student Showcase & Achievement Board
  ctx.fillStyle = '#78350f';
  ctx.fillRect(width - 380, horizon - 210, 280, 160);
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MADING KARYA SAINS SANTRI', width - 240, horizon - 175);
}

function renderMasjidScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Majestic Golden Mihrab at Center
  const mihrabX = width * 0.5 - 200;
  const mihrabY = horizon - 320;
  const mihrabW = 400;
  const mihrabH = 320;

  // Gold Archway
  const goldGrad = ctx.createLinearGradient(mihrabX, mihrabY, mihrabX + mihrabW, mihrabY + mihrabH);
  goldGrad.addColorStop(0, '#f59e0b');
  goldGrad.addColorStop(0.5, '#fbbf24');
  goldGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = goldGrad;

  // Pointed Arch Shape
  ctx.beginPath();
  ctx.moveTo(mihrabX, horizon);
  ctx.lineTo(mihrabX, mihrabY + 120);
  ctx.bezierCurveTo(mihrabX + 50, mihrabY + 20, mihrabX + 150, mihrabY - 40, width * 0.5, mihrabY - 50);
  ctx.bezierCurveTo(mihrabX + 250, mihrabY - 40, mihrabX + 350, mihrabY + 20, mihrabX + mihrabW, mihrabY + 120);
  ctx.lineTo(mihrabX + mihrabW, horizon);
  ctx.closePath();
  ctx.fill();

  // Mihrab Interior Depth
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(mihrabX + 30, horizon);
  ctx.lineTo(mihrabX + 30, mihrabY + 130);
  ctx.bezierCurveTo(mihrabX + 80, mihrabY + 40, mihrabX + 160, mihrabY - 20, width * 0.5, mihrabY - 25);
  ctx.bezierCurveTo(mihrabX + 240, mihrabY - 20, mihrabX + 320, mihrabY + 40, mihrabX + mihrabW - 30, mihrabY + 130);
  ctx.lineTo(mihrabX + mihrabW - 30, horizon);
  ctx.closePath();
  ctx.fill();

  // Quranic Calligraphy
  ctx.fillStyle = '#fbbf24';
  ctx.font = '24px "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.fillText('فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ', width * 0.5, mihrabY + 80);

  // Mimbar Jati
  ctx.fillStyle = '#78350f';
  ctx.fillRect(width * 0.5 + 80, horizon - 90, 70, 90);
  ctx.fillStyle = '#fbbf24';
  ctx.fillText('مِنْبَر', width * 0.5 + 115, horizon - 50);

  // Turkish Red & Green Carpet Prayer Lines
  for (let cy = horizon + 30; cy < height; cy += 45) {
    ctx.fillStyle = (cy % 90 === 0) ? '#047857' : '#991b1b';
    ctx.fillRect(0, cy, width, 38);
    // Ornate prayer rug border
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, cy + 34, width, 4);
  }
}

function renderLabScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Center: Dual Display Stations & Robot Showcase
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LABORATORIUM SAINS TERPADU & ROBOTIKA', width * 0.5, horizon - 220);

  // Giant Periodic Table on the right wall
  const ptX = width * 0.72;
  const ptY = horizon - 240;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(ptX, ptY, 440, 220);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(ptX, ptY, 440, 220);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PERIODIC TABLE OF ELEMENTS & STEM RESEARCH', ptX + 220, ptY + 30);

  // Mini colorful periodic element boxes
  const colors = ['#f43f5e', '#ec4899', '#a855f7', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 12; col++) {
      ctx.fillStyle = colors[(row + col) % colors.length];
      ctx.fillRect(ptX + 20 + col * 33, ptY + 50 + row * 30, 28, 24);
    }
  }

  // Left: Robot Arena Banner & IoT Sensors
  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.fillRect(100, horizon - 220, 360, 180);
  ctx.fillStyle = '#34d399';
  ctx.fillText('DIVISI ROBOTIKA & KECERDASAN BUATAN', 280, horizon - 180);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('• 40 PC High Spec Intel Core i7', 280, horizon - 140);
  ctx.fillText('• 3D Printing & Laser CNC Cutter', 280, horizon - 110);
  ctx.fillText('• Mikroskop Digital 4K Olympus', 280, horizon - 80);
}

function renderLibraryScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Majestic Wooden Bookshelves wrapping the walls
  ctx.fillStyle = '#451a03';
  ctx.fillRect(width * 0.5 - 400, horizon - 260, 800, 240);

  // Shelf divisions
  ctx.fillStyle = '#78350f';
  for (let shelfY = horizon - 240; shelfY < horizon - 20; shelfY += 45) {
    ctx.fillRect(width * 0.5 - 400, shelfY, 800, 8);
  }

  // Books with various colors
  const bookColors = ['#dc2626', '#16a34a', '#2563eb', '#d97706', '#9333ea', '#e11d48', '#0891b2', '#059669', '#ca8a04'];
  let bIdx = 0;
  for (let shelfY = horizon - 232; shelfY < horizon - 20; shelfY += 45) {
    for (let bx = width * 0.5 - 380; bx < width * 0.5 + 380; bx += 22) {
      if ((bx + shelfY) % 7 === 0) continue; // Gap
      ctx.fillStyle = bookColors[(bIdx++) % bookColors.length];
      const bH = 26 + (bx % 12);
      ctx.fillRect(bx, shelfY + 45 - bH - 8, 18, bH);
    }
  }

  // Library Welcome Banner
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PERPUSTAKAAN DIGITAL & KHAZANAH ISLAM', width * 0.5, horizon - 275);
}

function renderPlazaScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Grand Entrance Gateway Arch at Center
  const gateX = width * 0.5 - 300;
  const gateW = 600;
  const gateH = 340;
  const gateY = horizon - gateH;

  // Emerald & Sandstone Monument
  ctx.fillStyle = '#065f46';
  ctx.fillRect(gateX, gateY, gateW, 60);

  // Twin Minarets
  ctx.fillStyle = '#047857';
  ctx.fillRect(gateX, gateY - 80, 70, 80 + gateH);
  ctx.fillRect(gateX + gateW - 70, gateY - 80, 70, 80 + gateH);

  // Minaret Domes
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(gateX + 35, gateY - 80, 35, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(gateX + gateW - 35, gateY - 80, 35, Math.PI, 0);
  ctx.fill();

  // Welcome Signboard
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SELAMAT DATANG DI MADRASAH UNGGULAN AL-IKHLAS', width * 0.5, gateY + 38);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '16px "Amiri", serif';
  ctx.fillText('أَهْلًا وَسَهْلًا وَمَرْحَبًا بِكُمْ فِي مَدْرَسَتِنَا', width * 0.5, gateY + 90);

  // Palm trees and lush grass
  ctx.fillStyle = '#059669';
  ctx.fillRect(0, horizon, width, 60);
}

function renderAsramaScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Clean Dorm Room Interior
  ctx.fillStyle = '#581c87';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GEDUNG ASRAMA SANTRI MODERN DARUSSALAM', width * 0.5, horizon - 220);

  // Bunk Beds illustration
  ctx.fillStyle = '#78350f';
  ctx.fillRect(width * 0.5 - 320, horizon - 160, 240, 160);
  ctx.fillRect(width * 0.5 + 80, horizon - 160, 240, 160);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(width * 0.5 - 310, horizon - 140, 220, 25);
  ctx.fillRect(width * 0.5 - 310, horizon - 50, 220, 25);
  ctx.fillRect(width * 0.5 + 90, horizon - 140, 220, 25);
  ctx.fillRect(width * 0.5 + 90, horizon - 50, 220, 25);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Kamar Ber-AC | 4 Santri per Kamar | Musyrif Siaga 24 Jam', width * 0.5, horizon - 180);
}

function renderSportHallScene(ctx: CanvasRenderingContext2D, width: number, height: number, horizon: number) {
  // Indoor Stadium Courts & Spectator Grandstand
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, horizon, width, height - horizon);

  // White Court Line Markings
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(width * 0.5 - 350, horizon + 40, 700, 220);

  // Center Court Circle
  ctx.beginPath();
  ctx.arc(width * 0.5, horizon + 150, 80, 0, Math.PI * 2);
  ctx.stroke();

  // Grandstand Banners
  ctx.fillStyle = '#166534';
  ctx.fillRect(width * 0.5 - 400, horizon - 220, 800, 180);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GELANGGANG OLAHRAGA HAMZAH BIN ABDUL MUTHALIB', width * 0.5, horizon - 170);

  ctx.fillStyle = '#ffffff';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Futsal Standar FIFA • Basket Indoor • Tapak Suci • Bulutangkis', width * 0.5, horizon - 120);
}
