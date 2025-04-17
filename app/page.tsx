'use client';

import { useState, useEffect } from 'react';
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

  const getSaturation = (lightness: number, baseSaturation: number) => {
    if (activeTab === 'basic') return baseSaturation;
    
    const offset = 50;
    const mod = saturationMod;
    const saturationMultiplier = 1 + (Math.pow(lightness - offset, 2) / mod - Math.pow(offset, 2) / mod) / 100;
    return Math.max(0, Math.min(1, baseSaturation * saturationMultiplier));
  };

  const generateShades = (color: string, count: number) => {
    try {
      const colorObj = chroma(color);
      const shadesList = [];

      if (activeTab === 'basic') {
        // Basic color shades
        const scale = chroma.scale(['#FEFEFE', color, '#010101']).mode('lab');
        const extraShades = scale.colors(count + 2);
        setShades(extraShades.slice(1, -1));
      } else {
        // Tinted neutrals
        const baseSaturation = 0.2;
        for (let i = count - 1; i >= 0; i--) {
          const lightness = i / (count - 1);
          const adjustedSaturation = getSaturation(lightness * 100, baseSaturation);
          const shade = chroma.hsl(hue, adjustedSaturation, lightness);
          shadesList.push(shade.hex());
        }
        setShades(shadesList);
      }
    } catch (error) {
      console.error('Invalid color input');
    }
  };

  useEffect(() => {
    generateShades(baseColor, numShades);
  }, [baseColor, numShades, activeTab, hue, saturationMod]);

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
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Basic Colors
                </button>
                <button
                  onClick={() => setActiveTab('tinted')}
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === 'tinted'
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
                {activeTab === 'basic' ? (
                  // Basic Colors Content
                  <>
                    <div>
                      <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Enter Color
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-grow w-full sm:w-auto">
                          <input
                            type="text"
                            value={baseColor}
                            onChange={handleColorChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
                            placeholder="Enter color value"
                          />
                          <p className="text-gray-700 text-sm mt-2 font-medium">
                            Example: #808080 or rgb(128, 128, 128) or gray
                          </p>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                          <button
                            onClick={getRandomColor}
                            className="flex-1 sm:flex-none px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-medium rounded-lg transition-colors"
                          >
                            Get Random Color
                          </button>
                          <div className="w-20 h-20 rounded-lg border border-gray-300 cursor-pointer overflow-hidden shrink-0">
                            <input
                              type="color"
                              value={baseColor}
                              onChange={handleColorChange}
                              className="w-full h-full cursor-pointer"
                              aria-label="Color picker"
                            />
                          </div>
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

                {/* Common Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showContrast}
                        onChange={(e) => setShowContrast(e.target.checked)}
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

                {/* Color Shades Display */}
                <div>
                  <div className="h-20 w-full flex mb-4 rounded-xl overflow-hidden shadow-sm">
                    {shades.map((shade, index) => (
                      <div
                        key={`${shade}-${index}`}
                        onClick={() => setSelectedShade(shade)}
                        className="flex-1 h-full cursor-pointer transition-transform hover:transform hover:scale-y-110 relative group"
                        style={{ backgroundColor: shade }}
                        role="button"
                        aria-label={`Color shade ${shade}`}
                      >
                        {showContrast && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1 text-[10px] font-medium">
                            <div style={{ color: 'white' }}>
                              White {chroma.contrast(shade, 'white').toFixed(2)}
                            </div>
                            <div style={{ color: 'black' }}>
                              Black {chroma.contrast(shade, 'black').toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-gray-700 font-medium mb-6">
                    {showContrast 
                      ? "Hover over shades to see contrast ratios for white and black text" 
                      : "Select the color shade above to get color values below"}
                  </p>

                  {selectedShade && (
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {Object.entries(getColorFormats(selectedShade) || {}).map(([format, value]) => (
                            <div key={format} className="flex items-center gap-4">
                              <span className="uppercase font-semibold text-gray-700 w-12">
                                {format}
                              </span>
                              <button
                                onClick={() => copyToClipboard(value)}
                                className="flex-1 text-left px-4 py-2 bg-white rounded border border-gray-300 text-gray-900 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 font-mono"
                              >
                                {value}
                              </button>
                            </div>
                          ))}
                        </div>
                        <div
                          onClick={() => copyToClipboard(selectedShade)}
                          className="rounded-xl shadow-sm h-full min-h-[200px] relative group cursor-pointer overflow-hidden"
                          style={{ backgroundColor: selectedShade }}
                        >
                          {/* Contrast Information */}
                          <div className="absolute inset-0 flex flex-col justify-between p-4">
                            <div className="flex justify-between items-start w-full">
                              <div 
                                className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium"
                                style={{ color: getBestTextColor(selectedShade) }}
                              >
                                Click to copy HEX
                              </div>
                              <div className="space-y-2">
                                <div 
                                  className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2"
                                  style={{ color: 'white' }}
                                >
                                  <span className="w-3 h-3 rounded-full bg-white" />
                                  {getContrastRatio(selectedShade, 'white')}
                                </div>
                                <div 
                                  className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2"
                                  style={{ color: 'black' }}
                                >
                                  <span className="w-3 h-3 rounded-full bg-black" />
                                  {getContrastRatio(selectedShade, 'black')}
                                </div>
                              </div>
                            </div>
                            <div 
                              className="text-center text-2xl font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: getBestTextColor(selectedShade) }}
                            >
                              {selectedShade.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
