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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          /* UI/UX Pro Max - Soft UI Evolution + Minimal Design */
          
          /* Base Reset */
          *, *::before, *::after { 
            box-sizing: border-box; 
            margin: 0;
            padding: 0;
          }
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            color: #1a202c;
            line-height: 1.6;
          }
          
          /* Navigation - Soft UI */
          .nav-soft {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          }
          
          /* Card - Soft UI Evolution */
          .card-soft {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 16px;
            box-shadow: 
              0 4px 6px -1px rgba(0, 0, 0, 0.05),
              0 2px 4px -1px rgba(0, 0, 0, 0.03),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-soft:hover {
            transform: translateY(-4px);
            box-shadow: 
              0 20px 25px -5px rgba(0, 0, 0, 0.08),
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          /* Primary Button */
          .btn-primary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
            transition: all 0.2s ease;
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
          }
          
          /* Secondary Button */
          .btn-secondary {
            background: rgba(255, 255, 255, 0.9);
            color: #374151;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            border: 1px solid rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .btn-secondary:hover {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          
          /* Score Badge */
          .badge-score {
            background: rgba(254, 226, 226, 0.9);
            color: #991b1b;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
            border: 1px solid rgba(254, 202, 202, 0.5);
          }
          
          /* Link Style */
          .link-blue {
            color: #4f46e5;
            font-weight: 500;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          
          .link-blue:hover {
            color: #3730a3;
            text-decoration: underline;
          }
          
          /* Container */
          .container-max {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }
          
          /* Spacing Utilities */
          .py-16 { padding-top: 64px; padding-bottom: 64px; }
          .py-6 { padding-top: 24px; padding-bottom: 24px; }
          .px-6 { padding-left: 24px; padding-right: 24px; }
          .p-6 { padding: 24px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-12 { margin-top: 48px; }
          .space-x-4 > * + * { margin-left: 16px; }
          .space-y-6 > * + * { margin-top: 24px; }
          .gap-6 { gap: 24px; }
          
          /* Flex Utilities */
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .items-center { align-items: center; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          
          /* Text Utilities */
          .text-center { text-align: center; }
          .text-3xl { font-size: 1.875rem; font-weight: 700; }
          .text-xl { font-size: 1.25rem; font-weight: 600; }
          .text-sm { font-size: 0.875rem; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-800 { color: #1f2937; }
          
          /* Grid */
          .grid { display: grid; }
          @media (min-width: 768px) {
            .md\\:grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          }
          
          /* Emoji Size */
          .emoji-lg { font-size: 1.5rem; }
          
          /* Footer */
          .footer-soft {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.5);
          }
        `}} />
      </head>
      <body>
        <nav className="nav-soft py-6">
          <div className="container-max flex justify-between items-center">
            <a href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', textDecoration: 'none' }}>
              🔥 AI热点日报
            </a>
            <div className="flex space-x-4">
              <a href="/" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>今日</a>
              <a href="/today" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>详细</a>
              <a href="/history" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>历史</a>
            </div>
          </div>
        </nav>
        
        <main className="container-max py-16">
          {children}
        </main>
        
        <footer className="footer-soft py-6 mt-12">
          <div className="container-max text-center text-gray-500">
            <p>Powered by OpenClaw | 每日7:30自动更新</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
