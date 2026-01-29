
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

type ImageSize = '1K' | '2K' | '4K';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: size
          },
          tools: [{ googleSearch: {} }] // Adding search grounding for better context
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          
          // Trigger Achievement logic if it's 4K
          if (size === '4K') {
            const currentStats = JSON.parse(localStorage.getItem('zenflow_stats') || '{}');
            if (!currentStats.badges?.includes('creative-spark')) {
              currentStats.badges = [...(currentStats.badges || []), 'creative-spark'];
              localStorage.setItem('zenflow_stats', JSON.stringify(currentStats));
            }
          }
          break;
        }
      }
    } catch (error) {
      console.error('Image Gen error:', error);
      alert('Generation failed. Please try a different prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="text-center md:text-left space-y-2">
        <h2 className="text-4xl font-black tracking-tighter">Creative Studio</h2>
        <p className="text-slate-500 font-medium italic">Visualize your learning goals with Nano Banana Pro</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Resolution</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      size === s 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Creative Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to visualize... (e.g., A futuristic laboratory for chemistry study)"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[150px] transition-all resize-none"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
                isGenerating 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-700 hover:shadow-indigo-500/40'
              }`}
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-compact-disc fa-spin"></i>
                  Rendering {size}...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-sparkles"></i>
                  Generate Masterpiece
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] aspect-square flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative group">
            {generatedImage ? (
              <>
                <img src={generatedImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Generated" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a 
                    href={generatedImage} 
                    download={`zenflow-${size}.png`}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl hover:scale-110 transition-transform"
                  >
                    <i className="fa-solid fa-download text-xl"></i>
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-4 opacity-30">
                <i className="fa-solid fa-image text-8xl"></i>
                <p className="font-bold text-lg">Your creation will appear here</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-indigo-600 animate-pulse uppercase tracking-widest text-xs">Processing {size} Resolution</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
