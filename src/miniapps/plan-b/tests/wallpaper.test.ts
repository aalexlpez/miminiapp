import { describe, expect, it } from 'vitest';
import {
  layoutWallpaper,
  wallpaperSize,
  wrapWallpaperText,
} from '../domain/wallpaper-layout';

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const measure = (text: string, size: number) =>
  [...segmenter.segment(text)].length * size;
describe('complete wallpaper in its safe region', () => {
  it.each([
    'Si llego tarde, entonces hago cinco minutos.',
    `If ${'W'.repeat(90)}, then ${'W'.repeat(90)}.`,
    `Si ${'界'.repeat(90)}, entonces ${'語'.repeat(90)}.`,
    `Si ${'é'.repeat(90)}, entonces ${'💪'.repeat(90)}.`,
    `Si ${'👨‍👩‍👧‍👦'.repeat(12)}, entonces ${'🇪🇸'.repeat(40)}.`,
    `Si ${'a\u0301'.repeat(45)}, entonces ${'👍🏽'.repeat(45)}.`,
    `Si ${'\u0020\u0301'.repeat(30)}, entonces ${'un texto  '.repeat(9)}.`,
  ])('keeps every character and grapheme: %s', (sentence) => {
    const layout = layoutWallpaper(sentence, measure);
    expect(layout.lines.join('')).toBe(sentence);
    expect(layout.fontSize).toBeGreaterThanOrEqual(47.16);
    expect(layout.fontSize).toBeLessThanOrEqual(82.53);
    expect(layout.labelTop).toBeGreaterThanOrEqual(817.92);
    expect(
      layout.bodyTop + layout.lines.length * layout.lineHeight,
    ).toBeLessThanOrEqual(1840.32);
    const boundaries = new Set(
      [...segmenter.segment(sentence)].map((part) => part.index),
    );
    let offset = 0;
    for (const line of layout.lines) {
      expect(boundaries.has(offset)).toBe(true);
      expect(measure(line, layout.fontSize)).toBeLessThanOrEqual(
        wallpaperSize.width * 0.8,
      );
      offset += line.length;
    }
  });
  it('prefers whole words and keeps their separators', () => {
    expect(wrapWallpaperText('uno dos tres', 200, measure)).toEqual([
      'uno ',
      'dos ',
      'tres',
    ]);
  });
  it('reports impossible rendering rather than clipping or reducing below minimum', () => {
    expect(() => layoutWallpaper('huge', () => 10000)).toThrow();
    expect(() => layoutWallpaper('bad\ntext', measure)).toThrow();
    expect(() => layoutWallpaper('', measure)).toThrow();
  });
});
