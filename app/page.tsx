import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "高效压缩图片大小，保持画质清晰",
      icon: "🗜️",
      href: "/compress",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "抠图去背景",
      description: "智能识别主体，一键去除背景",
      icon: "✂️",
      href: "/remove-bg",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提取文字信息",
      icon: "🔍",
      href: "/recognition",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "AI生图",
      description: "文字描述生成精美图片",
      icon: "🎨",
      href: "/ai-generate",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            图片处理工具箱
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的在线图片处理平台，提供一站式图片处理解决方案
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative p-8 flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Arrow Icon */}
                  <div className="mt-auto pt-6">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                      立即使用
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 图片处理工具箱 - 让图片处理更简单</p>
        </div>
      </footer>
    </div>
  );
}
