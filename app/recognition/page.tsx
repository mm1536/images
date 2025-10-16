'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function RecognitionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [recognitionResult, setRecognitionResult] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRecognitionResult('');

      // 获取图片尺寸
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    } else if (file) {
      setError('请选择有效的图片文件（JPG、PNG、WEBP）');
    }
  }, []);

  // 支持拖拽上传
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRecognitionResult('');

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    } else if (file) {
      setError('请选择有效的图片文件（JPG、PNG、WEBP）');
    }
  }, []);

  // 调用火山引擎 API 识别图片
  const recognizeImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // 将图片转换为 Base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onload = async () => {
        const base64Image = reader.result as string;

        // 调用后端 API
        const response = await fetch('/api/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: base64Image,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API 错误: ${response.status}`);
        }

        const result = await response.json();
        setRecognitionResult(result.content || '未能识别图片内容');
        setIsProcessing(false);

        console.log('图片识别成功:', result);
      };

      reader.onerror = () => {
        throw new Error('读取图片文件失败');
      };
    } catch (error) {
      console.error('识别失败:', error);
      setError(error instanceof Error ? error.message : '识别失败，请重试');
      setIsProcessing(false);
    }
  }, [selectedFile]);

  const resetUpload = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');
    setRecognitionResult('');
    setError('');
    setImageDimensions(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
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
        <div className="max-w-4xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">火山引擎 AI 图片识别</h3>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  使用先进的 AI 技术识别图片内容，支持物体识别、场景分析、文字提取等功能。
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label htmlFor="file-upload-recognition" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    点击上传或拖拽图片到这里
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG、PNG、WEBP 格式</p>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      已选择: {selectedFile.name}
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload-recognition"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>

          {/* Process Button */}
          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={recognizeImage}
                  disabled={isProcessing || !!recognitionResult}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI 识别中...
                    </span>
                  ) : recognitionResult ? (
                    '✓ 识别完成'
                  ) : (
                    '开始识别图片'
                  )}
                </button>
                {recognitionResult && (
                  <button
                    onClick={resetUpload}
                    className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    重新上传
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Preview and Result Area */}
          {previewUrl && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">上传的图片</h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
                  <img src={previewUrl} alt="Original" className="w-full h-auto" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">文件大小:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatFileSize(selectedFile?.size || 0)}
                    </span>
                  </div>
                  {imageDimensions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">图片尺寸:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {imageDimensions.width} × {imageDimensions.height}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recognition Result */}
              {recognitionResult && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">识别结果</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[200px]">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {recognitionResult}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
