'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function AIGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const styles = [
    { value: 'realistic', label: '写实风格', icon: '📷' },
    { value: 'anime', label: '动漫风格', icon: '🎭' },
    { value: 'oil-painting', label: '油画风格', icon: '🖼️' },
    { value: 'watercolor', label: '水彩风格', icon: '🎨' },
    { value: '3d', label: '3D渲染', icon: '🎮' },
    { value: 'sketch', label: '素描风格', icon: '✏️' }
  ];

  const sizes = [
    { value: '512x512', label: '512×512' },
    { value: '1024x1024', label: '1024×1024' },
    { value: '1024x1792', label: '1024×1792 (竖版)' },
    { value: '1792x1024', label: '1792×1024 (横版)' }
  ];

  const examplePrompts = [
    '一只可爱的橘猫坐在窗台上，阳光洒在它身上',
    '未来科技城市，霓虹灯闪烁，飞行汽车穿梭其中',
    '宁静的湖边小屋，周围环绕着茂密的森林',
    '宇航员在月球表面漫步，地球在背景中升起'
  ];

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('请输入图片描述');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // 模拟AI生成图片（实际项目中应使用专业的AI生图API，如DALL-E、Midjourney、Stable Diffusion等）
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 使用占位图服务模拟生成的图片
      const mockImageUrl = `https://picsum.photos/seed/${Date.now()}/1024/1024`;

      const newImage: GeneratedImage = {
        url: mockImageUrl,
        prompt: prompt,
        timestamp: Date.now()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setIsGenerating(false);
    } catch (error) {
      console.error('生成失败:', error);
      setError('生成失败，请重试');
      setIsGenerating(false);
    }
  }, [prompt]);

  const downloadImage = useCallback((url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai_generated_${index + 1}.jpg`;
    link.target = '_blank';
    link.click();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🎨 AI生图</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Info Banner */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">演示功能说明</h3>
                <p className="text-sm text-orange-800 dark:text-orange-400">
                  当前使用的是占位图演示。如需真实AI生图效果，请集成 OpenAI DALL-E、Stable Diffusion、Midjourney 等专业 AI 生图 API。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Prompt Input */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">图片描述</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="描述你想要生成的图片，越详细越好..."
                  className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 dark:text-white"
                />

                {/* Example Prompts */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">示例提示词：</p>
                  <div className="space-y-2">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(example)}
                        className="w-full text-left text-xs text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-3 py-2 rounded-lg transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Style Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">风格选择</h3>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        style === s.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-xs font-medium text-gray-900 dark:text-white">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">图片尺寸</h3>
                <div className="space-y-2">
                  {sizes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSize(s.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        size === s.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </span>
                ) : (
                  '生成图片'
                )}
              </button>
              {error && (
                <p className="text-red-600 dark:text-red-400 text-center text-sm">{error}</p>
              )}
            </div>

            {/* Right Column - Generated Images */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">生成结果</h3>

                {generatedImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">暂无生成的图片</p>
                    <p className="text-sm mt-2">输入描述并点击生成按钮开始创作</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedImages.map((image, index) => (
                      <div key={image.timestamp} className="group relative">
                        <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={image.url}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <button
                              onClick={() => downloadImage(image.url, index)}
                              className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform scale-90 group-hover:scale-100"
                            >
                              下载图片
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {image.prompt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
