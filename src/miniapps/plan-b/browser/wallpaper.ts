import { planBIcon, miminiappMarkPath } from '../domain/brand';
import { layoutWallpaper, wallpaperSize } from '../domain/wallpaper-layout';

export async function renderWallpaper(
  sentence: string,
  label: string,
): Promise<Blob> {
  const icon = new Image();
  icon.src = planBIcon;
  await Promise.all([document.fonts.ready, icon.decode()]);
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
    const iconWidth = (48 * icon.naturalWidth) / icon.naturalHeight;
    context.drawImage(icon, layout.left, layout.labelTop - 8, iconWidth, 48);
    context.fillText(label, layout.left + iconWidth + 16, layout.labelTop);
    // Brand signature is separate from the plan safe region and the phone clock.
    context.save();
    context.translate(layout.left, wallpaperSize.height * 0.82);
    context.scale(0.55, 0.55);
    context.fillStyle = color('--color-tint-ink');
    context.fill(new Path2D(miminiappMarkPath));
    context.restore();
    font(34);
    context.fillStyle = color('--color-muted');
    context.fillText(
      'MiMiniApp',
      layout.left + 58,
      wallpaperSize.height * 0.82 + 2,
    );
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
      // Chrome can postpone its idle encoder without requested frames. Supply a
      // short, bounded frame window; never animate content or keep a loop alive.
      let frame = 0;
      let remainingFrames = 5;
      let settled = false;
      function encodingFrame() {
        remainingFrames--;
        if (!settled && remainingFrames > 0)
          frame = requestAnimationFrame(encodingFrame);
      }
      function finish(blob: Blob | null) {
        if (settled) return;
        settled = true;
        cancelAnimationFrame(frame);
        if (blob) resolve(blob);
        else reject(new Error('PNG unavailable.'));
      }
      try {
        canvas.toBlob(finish, 'image/png');
        if (!settled) frame = requestAnimationFrame(encodingFrame);
      } catch (error) {
        settled = true;
        cancelAnimationFrame(frame);
        reject(error);
      }
    });
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}
