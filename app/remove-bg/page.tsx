'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedUrl('');
      setError('');
    }
  }, []);

  const removeBackground = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // 使用 Canvas API 进行简单的背景处理（实际项目中应使用专业的AI API）
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // 获取图像数据
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return;

        const data = imageData.data;

        // 简单的背景去除算法（基于颜色相似度）
        // 注意：这是一个简化的演示，实际应用应使用专业的AI抠图API
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 如果像素接近白色或浅色背景，设置为透明
          const brightness = (r + g + b) / 3;
          if (brightness > 200) {
            data[i + 3] = 0; // 设置 alpha 通道为透明
          }
        }

        ctx?.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setProcessedUrl(url);
              setIsProcessing(false);
            }
          },
          'image/png'
        );
      };

      img.onerror = () => {
        setError('图片加载失败，请重试');
        setIsProcessing(false);
      };

      img.src = previewUrl;
    } catch (error) {
      console.error('处理失败:', error);
      setError('处理失败，请重试');
      setIsProcessing(false);
    }
  }, [selectedFile, previewUrl]);

  const downloadImage = useCallback(() => {
    if (!processedUrl) return;

    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = `removed_bg_${selectedFile?.name?.replace(/\.[^/.]+$/, '.png') || 'image.png'}`;
    link.click();
  }, [processedUrl, selectedFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">✂️ 抠图去背景</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">演示功能说明</h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  当前使用的是基础算法演示。如需专业抠图效果，请集成 Remove.bg、Cloudinary 等专业 AI 抠图 API。
                </p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <label htmlFor="file-upload-bg" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  点击上传或拖拽图片到这里
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG、PNG、WEBP 格式</p>
              </div>
              <input id="file-upload-bg" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            </label>
          </div>

          {/* Process Button */}
          {selectedFile && !processedUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
              <button
                onClick={removeBackground}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </span>
                ) : (
                  '开始去除背景'
                )}
              </button>
              {error && (
                <p className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</p>
              )}
            </div>
          )}

          {/* Preview Area */}
          {previewUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">原图</h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img src={previewUrl} alt="Original" className="w-full" />
                </div>
              </div>

              {/* Processed Image */}
              {processedUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">处理后</h3>
                  <div className="relative rounded-lg overflow-hidden mb-4" style={{
                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}>
                    <img src={processedUrl} alt="Processed" className="w-full" />
                  </div>
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    下载图片
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
