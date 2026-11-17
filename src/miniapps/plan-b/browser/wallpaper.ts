import { layoutWallpaper, wallpaperSize } from '../domain/wallpaper-layout';

export async function renderWallpaper(
  sentence: string,
  label: string,
): Promise<Blob> {
  await document.fonts.ready;
  await document.fonts.load('600 48px "Space Grotesk"');
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
    context.textAlign = 'center';
    context.fillStyle = color('--color-muted');
    font(layout.labelSize);
    context.fillText(label, canvas.width / 2, layout.labelTop);
    context.fillStyle = color('--color-ink');
    font(layout.fontSize);
    layout.lines.forEach((line, index) => {
      context.fillText(
        line,
        canvas.width / 2,
        layout.bodyTop + index * layout.lineHeight,
      );
    });
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
