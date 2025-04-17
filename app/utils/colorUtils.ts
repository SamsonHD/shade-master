import chroma from 'chroma-js';
import { ColorFormats } from '../types';

export const getColorFormats = (color: string): ColorFormats | null => {
  try {
    const c = chroma(color);
    return {
      hex: c.hex(),
      rgb: `rgb(${c.rgb().map(Math.round).join(', ')})`,
      hsl: `hsl(${Math.round(c.get('hsl.h') || 0)}, ${Math.round(c.get('hsl.s') * 100)}%, ${Math.round(c.get('hsl.l') * 100)}%)`,
      hsv: `hsv(${Math.round(c.get('hsv.h') || 0)}, ${Math.round(c.get('hsv.s') * 100)}%, ${Math.round(c.get('hsv.v') * 100)}%)`
    };
  } catch {
    return null;
  }
};

export const getContrastRatio = (background: string, text: string): string => {
  return chroma.contrast(background, text).toFixed(2);
};

export const getBestTextColor = (background: string): string => {
  const whiteContrast = chroma.contrast(background, 'white');
  const blackContrast = chroma.contrast(background, 'black');
  return whiteContrast > blackContrast ? 'white' : 'black';
};

export const generateRandomColor = (): string => {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

export const getSaturation = (lightness: number, baseSaturation: number, activeTab: string, saturationMod: number): number => {
  if (activeTab === 'basic') return baseSaturation;
  
  const offset = 50;
  const mod = saturationMod;
  const saturationMultiplier = 1 + (Math.pow(lightness - offset, 2) / mod - Math.pow(offset, 2) / mod) / 100;
  return Math.max(0, Math.min(1, baseSaturation * saturationMultiplier));
}; 