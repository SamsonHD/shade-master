import React from 'react';
import { getColorFormats, getBestTextColor } from '../utils/colorUtils';

interface ColorInfoProps {
  selectedShade: string | null;
}

export const ColorInfo: React.FC<ColorInfoProps> = ({ selectedShade }) => {
  if (!selectedShade) return null;

  const colorFormats = getColorFormats(selectedShade);
  const textColor = getBestTextColor(selectedShade);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          {colorFormats && Object.entries(colorFormats).map(([format, value]) => (
            <div key={format} className="flex items-center gap-4">
              <span className="uppercase font-semibold text-gray-700 w-12">
                {format}
              </span>
              <button
                onClick={() => copyToClipboard(value)}
                className="flex-1 text-left px-4 py-2 bg-white rounded border border-gray-300 text-gray-900 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 font-mono"
                aria-label={`Copy ${format} value`}
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
          role="button"
          aria-label="Color preview"
        >
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex justify-between items-start w-full">
              <div 
                className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium"
                style={{ color: textColor }}
              >
                Click to copy HEX
              </div>
            </div>
            <div 
              className="text-center text-2xl font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: textColor }}
            >
              {selectedShade.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 