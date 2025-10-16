'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface RecognitionResult {
  labels: string[];
  text: string;
  colors: string[];
}

export default function RecognitionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setError('');
    }
  }, []);

  const recognizeImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // 模拟图片识别（实际项目中应使用专业的AI识别API，如Google Vision、百度AI等）
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟识别结果
      const mockResult: RecognitionResult = {
        labels: ['风景', '自然', '天空', '云朵', '山脉', '户外'],
        text: '这是一个演示结果。实际应用中，这里会显示图片中识别到的文字内容。',
        colors: ['#4A90E2', '#7ED321', '#F5A623', '#D0021B', '#8B572A']
      };

      setResult(mockResult);
      setIsProcessing(false);
    } catch (error) {
      console.error('识别失败:', error);
      setError('识别失败，请重试');
      setIsProcessing(false);
    }
  }, [selectedFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-green-600 hover:text-green-700 transition-colors">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔍 图片识别</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Info Banner */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">演示功能说明</h3>
                <p className="text-sm text-green-800 dark:text-green-400">
                  当前使用的是模拟数据演示。如需真实识别效果，请集成 Google Vision API、百度 AI 图像识别、腾讯云图像分析等专业 API。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Upload and Preview */}
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <label htmlFor="file-upload-recognition" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      点击上传或拖拽图片到这里
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG、PNG、WEBP 格式</p>
                  </div>
                  <input id="file-upload-recognition" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                </label>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">预览图片</h3>
                  <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
                  {!result && (
                    <button
                      onClick={recognizeImage}
                      disabled={isProcessing}
                      className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          识别中...
                        </span>
                      ) : (
                        '开始识别'
                      )}
                    </button>
                  )}
                  {error && (
                    <p className="mt-4 text-red-600 dark:text-red-400 text-center">{error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Results */}
            {result && (
              <div className="space-y-6">
                {/* Labels */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    识别标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.labels.map((label, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Text Recognition */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    文字识别
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {result.text}
                    </p>
                  </div>
                </div>

                {/* Color Analysis */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    主要颜色
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {result.colors.map((color, index) => (
                      <div key={index} className="text-center">
                        <div
                          className="w-full h-16 rounded-lg shadow-md mb-2"
                          style={{ backgroundColor: color }}
                        ></div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
