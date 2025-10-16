'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remove.bg API 配置
  const REMOVE_BG_API_KEY = '9TMNPzoX5wTGqGUhJpPXKSkn';
  const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setProcessedUrl('');
      setProcessedBlob(null);

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
      setProcessedUrl('');
      setProcessedBlob(null);

      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
    } else if (file) {
      setError('请选择有效的图片文件（JPG、PNG、WEBP）');
    }
  }, []);

  // 使用 Remove.bg API 去除背景
  const removeBackground = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append('image_file', selectedFile);
      formData.append('size', 'auto');

      // 调用 Remove.bg API
      const response = await fetch(REMOVE_BG_API_URL, {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.title || `API 错误: ${response.status}`);
      }

      // 获取处理后的图片 Blob
      const blob = await response.blob();

      // 创建预览 URL
      const url = URL.createObjectURL(blob);
      setProcessedBlob(blob);
      setProcessedUrl(url);
      setIsProcessing(false);

      console.log('背景去除成功:', {
        原始文件: selectedFile.name,
        处理后大小: blob.size,
      });
    } catch (error) {
      console.error('处理失败:', error);
      setError(error instanceof Error ? error.message : '处理失败，请重试');
      setIsProcessing(false);
    }
  }, [selectedFile]);

  const downloadImage = useCallback(() => {
    if (!processedBlob || !selectedFile) {
      setError('没有可下载的图片');
      return;
    }

    try {
      const link = document.createElement('a');
      const url = URL.createObjectURL(processedBlob);

      link.href = url;
      const originalName = selectedFile.name.replace(/\.[^/.]+$/, '') || 'image';
      link.download = `no-bg-${originalName}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      console.log('下载成功:', link.download);
    } catch (error) {
      console.error('下载失败:', error);
      setError('下载失败，请重试');
    }
  }, [processedBlob, selectedFile]);

  const resetUpload = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }

    setSelectedFile(null);
    setPreviewUrl('');
    setProcessedUrl('');
    setProcessedBlob(null);
    setError('');
    setImageDimensions(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl, processedUrl]);

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
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Remove.bg AI 抠图</h3>
                <p className="text-sm text-purple-800 dark:text-purple-400">
                  使用专业的 AI 技术自动识别主体并去除背景，支持人物、产品、动物等各类图片。
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
              <label htmlFor="file-upload-bg" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    点击上传或拖拽图片到这里
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG、PNG、WEBP 格式</p>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                      已选择: {selectedFile.name}
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload-bg"
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
                  onClick={removeBackground}
                  disabled={isProcessing || !!processedUrl}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI 处理中...
                    </span>
                  ) : processedUrl ? (
                    '✓ 处理完成'
                  ) : (
                    '开始去除背景'
                  )}
                </button>
                {processedUrl && (
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

          {/* Preview Area */}
          {previewUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">原图</h3>
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

              {/* Processed Image */}
              {processedUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">处理后（透明背景）</h3>
                  {/* 棋盘格背景显示透明度 */}
                  <div
                    className="relative rounded-lg overflow-hidden mb-4"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  >
                    <img src={processedUrl} alt="Processed" className="w-full h-auto" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">文件大小:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatFileSize(processedBlob?.size || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">格式:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">PNG (透明背景)</span>
                    </div>
                  </div>
                  <button
                    onClick={downloadImage}
                    disabled={!processedBlob}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
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
