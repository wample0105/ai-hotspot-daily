export const metadata = {
  title: 'AI热点日报',
  description: '每日AI领域最新热点追踪',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <style dangerouslySetInnerHTML={{ __html: `
          /* 中国用户优化版 - 移动端优先 */
          
          /* 中文字体栈 */
          @font-face {
            font-family: 'Noto Sans SC';
            src: local('PingFang SC'), local('Microsoft YaHei'), local('Noto Sans SC');
            font-display: swap;
          }
          
          *, *::before, *::after { 
            box-sizing: border-box; 
            margin: 0;
            padding: 0;
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
            min-height: 100vh;
            color: #1a202c;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* 骨架屏动画 */
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 8px;
          }
          
          /* 导航栏 */
          .nav-soft {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 12px 0;
          }
          
          /* 移动端底部导航 */
          @media (max-width: 768px) {
            .nav-soft {
              position: fixed;
              bottom: 0;
              top: auto;
              border-top: 1px solid rgba(0, 0, 0, 0.05);
              border-bottom: none;
              padding: 8px 0;
            }
            
            body {
              padding-bottom: 60px;
            }
          }
          
          /* 桌面端顶部导航 */
          @media (min-width: 769px) {
            .nav-soft {
              position: sticky;
              top: 0;
            }
          }
          
          /* 卡片 - 移动端优化 */
          .card-soft {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(0, 0, 0, 0.04);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }
          
          .card-soft:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          }
          
          @media (max-width: 768px) {
            .card-soft {
              border-radius: 16px;
              margin: 0 -4px;
            }
            
            .card-soft:active {
              transform: scale(0.98);
            }
          }
          
          /* 按钮 - 更大的点击区域 */
          .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            min-width: 120px;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          }
          
          .btn-primary:active {
            transform: translateY(0);
          }
          
          .btn-secondary {
            background: rgba(255, 255, 255, 0.9);
            color: #374151;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
            min-width: 120px;
          }
          
          .btn-secondary:hover {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          
          /* 评分标签 - 中国红 */
          .badge-score {
            background: rgba(254, 226, 226, 0.9);
            color: #dc2626;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            border: 1px solid rgba(254, 202, 202, 0.5);
            white-space: nowrap;
          }
          
          .badge-hot {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          
          /* 链接 */
          .link-blue {
            color: #4f46e5;
            font-weight: 500;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          
          .link-blue:hover {
            color: #3730a3;
          }
          
          /* 容器 - 移动端全宽 */
          .container-max {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          @media (min-width: 1024px) {
            .container-max {
              max-width: 900px;
              padding: 0 24px;
            }
          }
          
          /* 间距 - 移动端优化 */
          .py-16 { padding-top: 48px; padding-bottom: 48px; }
          .py-6 { padding-top: 16px; padding-bottom: 16px; }
          .px-6 { padding-left: 16px; padding-right: 16px; }
          .p-6 { padding: 20px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 12px; }
          .mb-6 { margin-bottom: 20px; }
          .mb-8 { margin-bottom: 24px; }
          .mt-12 { margin-top: 32px; }
          
          @media (min-width: 768px) {
            .py-16 { padding-top: 64px; padding-bottom: 64px; }
            .p-6 { padding: 24px; }
            .mb-8 { margin-bottom: 32px; }
            .mt-12 { margin-top: 48px; }
          }
          
          /* Flex */
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .items-center { align-items: center; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          .gap-4 { gap: 12px; }
          .gap-6 { gap: 20px; }
          
          /* 文字 */
          .text-center { text-align: center; }
          .text-3xl { font-size: 1.5rem; font-weight: 700; }
          .text-xl { font-size: 1.125rem; font-weight: 600; }
          .text-sm { font-size: 0.875rem; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-800 { color: #1f2937; }
          
          @media (min-width: 768px) {
            .text-3xl { font-size: 1.875rem; }
            .text-xl { font-size: 1.25rem; }
          }
          
          /* Grid */
          .grid { display: grid; }
          
          /* Emoji */
          .emoji-lg { font-size: 1.25rem; }
          
          @media (min-width: 768px) {
            .emoji-lg { font-size: 1.5rem; }
          }
          
          /* 页脚 - 移动端底部导航适配 */
          .footer-soft {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          @media (max-width: 768px) {
            .footer-soft {
              padding-bottom: 80px;
            }
          }
          
          /* 底部导航图标 */
          .nav-icon {
            font-size: 1.25rem;
            margin-bottom: 2px;
          }
          
          .nav-label {
            font-size: 0.625rem;
          }
          
          /* 分享按钮 */
          .btn-share {
            background: rgba(0, 0, 0, 0.05);
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s ease;
            font-size: 0.875rem;
          }
          
          .btn-share:hover {
            background: rgba(0, 0, 0, 0.08);
          }
          
          /* 响应式显示/隐藏 */
          @media (max-width: 768px) {
            .hidden-mobile {
              display: none !important;
            }
          }
          
          @media (min-width: 769px) {
            .show-mobile {
              display: none !important;
            }
          }
        `}} />
      </head>
      <body>
        {/* 桌面端顶部导航 */}
        <nav className="nav-soft hidden-mobile">
          <div className="container-max flex justify-between items-center">
            <a href="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', textDecoration: 'none' }}>
              🔥 AI热点日报
            </a>
            <div className="flex gap-6">
              <a href="/" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>今日</a>
              <a href="/today" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>详细</a>
              <a href="/history" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}>历史</a>
            </div>
          </div>
        </nav>
        
        <main className="container-max" style={{ padding: '64px 16px' }}>
          {children}
        </main>
        
        <footer className="footer-soft py-6 mt-12">
          <div className="container-max text-center text-gray-500">
            <p style={{ fontSize: '0.875rem' }}>Powered by OpenClaw | 每日7:30自动更新</p>
          </div>
        </footer>
        
        {/* 移动端底部导航 */}
        <nav className="nav-soft show-mobile">
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '4px 0' }}>
            <a href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#4f46e5', textDecoration: 'none' }}>
              <span className="nav-icon">📊</span>
              <span className="nav-label">今日</span>
            </a>
            <a href="/today" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#6b7280', textDecoration: 'none' }}>
              <span className="nav-icon">📋</span>
              <span className="nav-label">详细</span>
            </a>
            <a href="/history" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#6b7280', textDecoration: 'none' }}>
              <span className="nav-icon">📚</span>
              <span className="nav-label">历史</span>
            </a>
          </div>
        </nav>
      </body>
    </html>
  )
}
