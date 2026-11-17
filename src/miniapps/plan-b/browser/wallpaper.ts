import { layoutWallpaper, wallpaperSize } from '../domain/wallpaper-layout';

export async function renderWallpaper(
  sentence: string,
  label: string,
): Promise<Blob> {
  await document.fonts.ready;
  const faces = await document.fonts.load('600 48px "Space Grotesk"');
  if (!faces.length) throw new Error('Local font unavailable.');
  const canvas = document.createElement('canvas');
  canvas.width = wallpaperSize.width;
  canvas.height = wallpaperSize.height;
  try {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable.');
    const theme = getComputedStyle(document.documentElement);
    const color = (name: string) => {
      const value = theme.getPropertyValue(name).trim();
      if (!value) throw new Error('Theme unavailable.');
      return value;
    };
    const font = (size: number) => {
      context.font = `600 ${size}px "Space Grotesk", sans-serif`;
    };
    const layout = layoutWallpaper(sentence, (text, size) => {
      font(size);
      return context.measureText(text).width;
    });
    context.fillStyle = color('--color-canvas');
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textBaseline = 'top';
    context.strokeStyle = color('--color-panel-border');
    context.lineWidth = 3;
    for (const radius of [300, 225]) {
      context.beginPath();
      context.arc(1100, 2400, radius, Math.PI, Math.PI * 1.8);
      context.stroke();
    }
    context.textAlign = 'left';
    context.fillStyle = color('--color-tint-ink');
    font(layout.labelSize);
    context.fillText(label, layout.left, layout.labelTop);
    context.fillStyle = color('--color-ink');
    font(layout.fontSize);
    layout.lines.forEach((line, index) => {
      context.fillText(
        line,
        layout.left,
        layout.bodyTop + index * layout.lineHeight,
      );
    });
    context.strokeStyle = color('--color-tint-ink');
    context.lineWidth = layout.strokeWidth;
    context.lineCap = 'round';
    const y = layout.continuityY,
      x = layout.left;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 220, y);
    context.quadraticCurveTo(x + 260, y, x + 280, y - 18);
    context.quadraticCurveTo(x + 300, y - 36, x + 320, y - 12);
    context.lineTo(x + 360, y - 12);
    context.stroke();
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('PNG unavailable.')),
        'image/png',
      );
    });
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}
