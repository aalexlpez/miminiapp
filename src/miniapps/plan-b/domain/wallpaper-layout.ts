export const wallpaperSize = { width: 1179, height: 2556 } as const;
export type MeasureText = (text: string, size: number) => number;

/** Keep every character, including whitespace, and never split a grapheme. */
export function wrapWallpaperText(
  text: string,
  size: number,
  measure: MeasureText,
) {
  const width = wallpaperSize.width * 0.8;
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const parts = [...segmenter.segment(text)].map((part) => part.segment);
  const lines: string[] = [];
  let line = '';
  for (const part of parts) {
    if (measure(part, size) > width) return null;
    while (line && measure(line + part, size) > width) {
      const boundary = [...segmenter.segment(line)].findLast((part) =>
        /^\s+$/u.test(part.segment),
      );
      const split = boundary
        ? boundary.index + boundary.segment.length
        : line.length;
      lines.push(line.slice(0, split));
      line = line.slice(split);
    }
    line += part;
  }
  if (line) lines.push(line);
  return lines;
}

export function layoutWallpaper(text: string, measure: MeasureText) {
  if (!text || /[\r\n\u2028\u2029]/u.test(text))
    throw new RangeError('Invalid wallpaper text.');
  const { width, height } = wallpaperSize;
  const labelSize = width * 0.028;
  const bodyOffset = width * 0.072;
  const continuityGap = width * 0.03;
  const strokeWidth = width * 0.007;
  const minimum = width * 0.04;
  let size = width * 0.07;
  while (true) {
    const lines = wrapWallpaperText(text, size, measure);
    const lineHeight = size * 1.3;
    const blockHeight =
      bodyOffset +
      (lines?.length ?? Infinity) * lineHeight +
      continuityGap +
      strokeWidth / 2;
    if (lines && blockHeight <= height * 0.4) {
      const top = height * 0.32 + (height * 0.4 - blockHeight) / 2;
      return {
        lines,
        fontSize: size,
        lineHeight,
        labelSize,
        labelTop: top,
        left: width * 0.1,
        bodyTop: top + bodyOffset,
        continuityY:
          top + bodyOffset + lines.length * lineHeight + continuityGap,
        strokeWidth,
      };
    }
    if (size === minimum) throw new RangeError('Wallpaper text does not fit.');
    size = Math.max(minimum, size - 1);
  }
}
