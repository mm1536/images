'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCompressedUrl('');
      setCompressedSize(0);
    }
  }, []);

  const compressImage = useCallback(async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setCompressedUrl(url);
              setCompressedSize(blob.size);
              setIsCompressing(false);
            }
          },
          'image/jpeg',
          quality / 100
        );
      };

      img.src = previewUrl;
    } catch (error) {
      console.error('压缩失败:', error);
      setIsCompressing(false);
    }
  }, [selectedFile, previewUrl, quality]);

  const downloadImage = useCallback(() => {
    if (!compressedUrl) return;

    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `compressed_${selectedFile?.name || 'image.jpg'}`;
    link.click();
  }, [compressedUrl, selectedFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🗜️ 图片压缩</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Upload Area */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  点击上传或拖拽图片到这里
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">支持 JPG、PNG、WEBP 格式</p>
              </div>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            </label>
          </div>

          {/* Quality Control */}
          {selectedFile && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
              <label className="block mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">压缩质量: {quality}%</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </label>
              <button
                onClick={compressImage}
                disabled={isCompressing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompressing ? '压缩中...' : '开始压缩'}
              </button>
            </div>
          )}

          {/* Preview Area */}
          {previewUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">原图</h3>
                <img src={previewUrl} alt="Original" className="w-full rounded-lg mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  大小: <span className="font-semibold">{formatFileSize(originalSize)}</span>
                </p>
              </div>

              {/* Compressed Image */}
              {compressedUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">压缩后</h3>
                  <img src={compressedUrl} alt="Compressed" className="w-full rounded-lg mb-4" />
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      大小: <span className="font-semibold">{formatFileSize(compressedSize)}</span>
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      已压缩: <span className="font-semibold">{compressionRatio}%</span>
                    </p>
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
