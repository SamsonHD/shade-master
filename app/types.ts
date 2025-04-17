export type Tab = 'basic' | 'tinted';

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

export interface ColorState {
  baseColor: string;
  shades: string[];
  numShades: number;
  selectedShade: string | null;
  showContrast: boolean;
  normalizeShades: boolean;
  useTintedNeutrals: boolean;
  hue: number;
  saturationMod: number;
  activeTab: Tab;
} 