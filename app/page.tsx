'use client';

import { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';

type Tab = 'basic' | 'tinted';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [baseColor, setBaseColor] = useState('#b656cd');
  const [shades, setShades] = useState<string[]>([]);
  const [numShades, setNumShades] = useState(25);
  const [selectedShade, setSelectedShade] = useState<string | null>(null);
  const [showContrast, setShowContrast] = useState(false);
  const [normalizeShades, setNormalizeShades] = useState(false);
  const [useTintedNeutrals, setUseTintedNeutrals] = useState(false);
  const [hue, setHue] = useState(200);
  const [saturationMod, setSaturationMod] = useState(70);

  const getSaturation = useCallback((lightness: number, baseSaturation: number) => {
    if (activeTab === 'basic') return baseSaturation;
    
    const offset = 50;
    const mod = saturationMod;
    const saturationMultiplier = 1 + (Math.pow(lightness - offset, 2) / mod - Math.pow(offset, 2) / mod) / 100;
    return Math.max(0, Math.min(1, baseSaturation * saturationMultiplier));
  }, [activeTab, saturationMod]);

  const generateShades = useCallback((color: string, count: number) => {
    try {
      if (activeTab === 'basic') {
        // Basic color shades
        const scale = chroma.scale(['#FEFEFE', color, '#010101']).mode('lab');
        const extraShades = scale.colors(count + 2);
        setShades(extraShades.slice(1, -1));
      } else {
        // Tinted neutrals
        const shadesList = [];
        const baseSaturation = 0.2;
        for (let i = count - 1; i >= 0; i--) {
          const lightness = i / (count - 1);
          const adjustedSaturation = getSaturation(lightness * 100, baseSaturation);
          const shade = chroma.hsl(hue, adjustedSaturation, lightness);
          shadesList.push(shade.hex());
        }
        setShades(shadesList);
      }
    } catch {
      console.error('Invalid color input');
    }
  }, [activeTab, hue, getSaturation]);

  useEffect(() => {
    generateShades(baseColor, numShades);
  }, [baseColor, numShades, generateShades]);

  const getRandomColor = () => {
    const newColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(newColor);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBaseColor(newColor);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard');
    }
  };

  const getColorFormats = (color: string) => {
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

  const getContrastRatio = (background: string, text: string) => {
    return chroma.contrast(background, text).toFixed(2);
  };

  const getBestTextColor = (background: string) => {
    const whiteContrast = chroma.contrast(background, 'white');
    const blackContrast = chroma.contrast(background, 'black');
    return whiteContrast > blackContrast ? 'white' : 'black';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Color Shade Generator
            </h1>
            <a
              href="https://github.com/yourusername/color-shades"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Generator Container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'basic'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Basic Colors
                </button>
                <button
                  onClick={() => setActiveTab('tinted')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'tinted'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tinted Neutrals
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-8">
                {activeTab === 'basic' ? (
                  // Basic Colors Content
                  <>
                    <div className="max-w-3xl mx-auto">
                      <label className="block text-lg font-semibold text-gray-900 mb-4">
                        Enter Color
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-md">
                          <div className="relative">
                            <input
                              type="text"
                              value={baseColor}
                              onChange={handleColorChange}
                              className="w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                              placeholder="Enter color value"
                            />
                            <p className="absolute -bottom-6 left-0 text-gray-600 text-sm">
                              Example: #808080 or rgb(128, 128, 128) or gray
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="group relative">
                            <div className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden shadow-sm hover:border-blue-400 transition-all transform hover:scale-105">
                              <input
                                type="color"
                                value={baseColor}
                                onChange={handleColorChange}
                                className="w-full h-full cursor-pointer opacity-0 absolute inset-0"
                                aria-label="Color picker"
                              />
                              <div 
                                className="w-full h-full"
                                style={{ backgroundColor: baseColor }}
                              />
                            </div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                Pick color
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={getRandomColor}
                            className="h-12 px-5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 hover:shadow-md flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Random
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Controls Section */}
                    <div className="max-w-3xl mx-auto">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 py-4">
                        <div className="flex items-center gap-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showContrast}
                              onChange={(e) => setShowContrast(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-700">
                              Show Contrast
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700">Shades:</span>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={numShades}
                            onChange={(e) => setNumShades(parseInt(e.target.value))}
                            className="w-48"
                            aria-label="Number of shades"
                          />
                          <span className="text-2xl font-semibold text-gray-900 w-8 text-right">
                            {numShades}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Tinted Neutrals Content
                  <>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-4">
                          Tint Settings
                        </label>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hue ({hue}°)
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={hue}
                              onChange={(e) => setHue(parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Saturation Curve ({saturationMod})
                            </label>
                            <input
                              type="range"
                              min="25"
                              max="200"
                              value={saturationMod}
                              onChange={(e) => setSaturationMod(parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Color Shades Display */}
                <div>
                  <div className="h-20 w-full flex mb-4 rounded-xl overflow-hidden shadow-sm">
                    {shades.map((shade, index) => (
                      <div
                        key={`${shade}-${index}`