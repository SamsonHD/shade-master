'use client';

import React, { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';
import { ColorInput } from './components/ColorInput';
import { ColorShadeDisplay } from './components/ColorShadeDisplay';
import { ColorInfo } from './components/ColorInfo';
import { Tab, ColorState } from './types';
import { getSaturation } from './utils/colorUtils';

export default function Home() {
  const [state, setState] = useState<ColorState>({
    activeTab: 'palette',
    baseColor: '#b656cd',
    shades: [],
    numShades: 25,
    selectedShade: null,
    showContrast: false,
  });

  const generateShades = useCallback((color: string, count: number) => {
    try {
      const colorObj = chroma(color);
      const shadesList: string[] = [];

      if (state.activeTab === 'basic') {
        const scale = chroma.scale(['#FEFEFE', color, '#010101']).mode('lab');
        const extraShades = scale.colors(count + 2);
        setState(prev => ({ ...prev, shades: extraShades.slice(1, -1) }));
      } else {
        const baseSaturation = 0.2;
        for (let i = count - 1; i >= 0; i--) {
          const lightness = i / (count - 1);
          const adjustedSaturation = getSaturation(lightness * 100, baseSaturation, state.activeTab, state.saturationMod);
          const shade = chroma.hsl(state.hue, adjustedSaturation, lightness);
          shadesList.push(shade.hex());
        }
        setState(prev => ({ ...prev, shades: shadesList }));
      }
    } catch (err) {
      console.error('Error generating shades:', err);
    }
  }, [state.activeTab, state.hue, state.saturationMod]);

  useEffect(() => {
    generateShades(state.baseColor, state.numShades);
  }, [state.baseColor, state.numShades, state.activeTab, state.hue, state.saturationMod, generateShades]);

  const handleColorChange = (color: string) => {
    setState(prev => ({ ...prev, baseColor: color }));
  };

  const handleShadeSelect = (shade: string) => {
    setState(prev => ({ ...prev, selectedShade: shade }));
  };

  const handleTabChange = (tab: Tab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Color Shade Generator
            </h1>
            <a
              href="https://github.com/SamsonHD/shade-master"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => handleTabChange('basic')}
                  className={`px-6 py-3 text-sm font-medium ${
                    state.activeTab === 'basic'
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Basic Colors
                </button>
                <button
                  onClick={() => handleTabChange('tinted')}
                  className={`px-6 py-3 text-sm font-medium ${
                    state.activeTab === 'tinted'
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tinted Neutrals
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-8">
                <ColorInput
                  baseColor={state.baseColor}
                  onColorChange={handleColorChange}
                />

                {state.activeTab === 'tinted' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Tint Settings
                      </label>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hue ({state.hue}°)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={state.hue}
                            onChange={(e) => setState(prev => ({ ...prev, hue: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Saturation Curve ({state.saturationMod})
                          </label>
                          <input
                            type="range"
                            min="25"
                            max="200"
                            value={state.saturationMod}
                            onChange={(e) => setState(prev => ({ ...prev, saturationMod: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.showContrast}
                        onChange={(e) => setState(prev => ({ ...prev, showContrast: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        Show Contrast
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={state.numShades}
                      onChange={(e) => setState(prev => ({ ...prev, numShades: parseInt(e.target.value) }))}
                      className="w-48"
                      aria-label="Number of shades"
                    />
                    <span className="text-2xl font-semibold text-gray-900 w-8 text-right">
                      {state.numShades}
                    </span>
                  </div>
                </div>

                <ColorShadeDisplay
                  shades={state.shades}
                  showContrast={state.showContrast}
                  onShadeSelect={handleShadeSelect}
                />

                <ColorInfo selectedShade={state.selectedShade} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 