
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';

const AIEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const mimeType = image.split(',')[0].split(':')[1].split(';')[0];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `Modify this image based on the following request: ${prompt}. Return ONLY the resulting image.`,
            },
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setResultImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error('AI Edit error:', error);
      alert('Failed to process image. Please try a different prompt.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <header className="text-center space-y-2">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
          <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
        </div>
        <h2 className="text-3xl font-black tracking-tight">AI Note Polisher</h2>
        <p className="text-slate-500 text-sm">Use Gemini 2.5 Flash Image to transform your study materials</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Source Image Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Original Material</h3>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
          >
            {image ? (
              <img src={image} className="w-full h-full object-contain" alt="Source" />
            ) : (
              <div className="text-center p-6 space-y-2">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 group-hover:text-indigo-400 transition-colors"></i>
                <p className="text-xs font-bold text-slate-400">Click to upload notes or photos</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        {/* Action / Result Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">AI Prompt</h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a retro paper texture', 'Remove the distracting pen in the corner', 'Enhance contrast for better reading'"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-all"
            />
            <button 
              onClick={handleEdit}
              disabled={!image || !prompt || isProcessing}
              className={`w-full py-4 rounded-xl font-black shadow-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-sparkles"></i>
                  Magic Enhance
                </>
              )}
            </button>
          </div>

          {resultImage && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Result</h3>
                <a 
                  href={resultImage} 
                  download="enhanced-notes.png" 
                  className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <i className="fa-solid fa-download"></i>
                  Download
                </a>
              </div>
              <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img src={resultImage} className="w-full h-full object-contain" alt="Result" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIEditor;
