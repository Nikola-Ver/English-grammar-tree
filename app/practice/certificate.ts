/** Renders a shareable PNG certificate for a passed level exam. */

const LEVEL_COLORS: Record<string, string> = {
  A1: '#4ade80',
  A2: '#34d399',
  B1: '#38bdf8',
  B2: '#818cf8',
  C1: '#f472b6',
  C2: '#fb923c',
};

export interface CertificateText {
  heading: string;
  line: string;
  levelName: string;
  scoreLine: string;
  date: string;
  name?: string;
}

export async function downloadCertificate(level: string, text: CertificateText): Promise<void> {
  const w = 1200;
  const h = 800;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext('2d');
  if (!c) return;
  const accent = LEVEL_COLORS[level] ?? '#818cf8';

  const bg = c.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0d0f14');
  bg.addColorStop(1, '#1a1e2a');
  c.fillStyle = bg;
  c.fillRect(0, 0, w, h);

  c.strokeStyle = accent;
  c.lineWidth = 6;
  c.strokeRect(40, 40, w - 80, h - 80);
  c.globalAlpha = 0.35;
  c.lineWidth = 2;
  c.strokeRect(58, 58, w - 116, h - 116);
  c.globalAlpha = 1;

  c.textAlign = 'center';
  c.fillStyle = '#e8eaf0';
  c.font = '600 30px Outfit, system-ui, sans-serif';
  c.fillText('🌳  English Grammar Tree', w / 2, 140);

  c.font = '700 64px Outfit, system-ui, sans-serif';
  c.fillText(text.heading, w / 2, 250);

  if (text.name) {
    c.font = '500 40px Outfit, system-ui, sans-serif';
    c.fillStyle = '#e8eaf0';
    c.fillText(text.name, w / 2, 330);
  }

  c.font = '400 30px Outfit, system-ui, sans-serif';
  c.fillStyle = '#8b92a8';
  c.fillText(text.line, w / 2, text.name ? 390 : 340);

  c.font = '800 150px Outfit, system-ui, sans-serif';
  c.fillStyle = accent;
  c.fillText(level, w / 2, 545);

  c.font = '500 32px Outfit, system-ui, sans-serif';
  c.fillStyle = '#e8eaf0';
  c.fillText(text.levelName, w / 2, 605);

  c.font = '400 26px Outfit, system-ui, sans-serif';
  c.fillStyle = '#8b92a8';
  c.fillText(`${text.scoreLine} · ${text.date}`, w / 2, 680);

  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `grammar-tree-${level}-certificate.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
