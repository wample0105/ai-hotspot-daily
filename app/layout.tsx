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
        <style dangerouslySetInnerHTML={{ __html: `
          /* Tailwind-like styles */
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .min-h-screen { min-height: 100vh; }
          .bg-gray-900 { background-color: #111827; }
          .text-white { color: #ffffff; }
          .p-4 { padding: 1rem; }
          .max-w-6xl { max-width: 72rem; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .items-center { align-items: center; }
          .text-xl { font-size: 1.25rem; }
          .font-bold { font-weight: 700; }
          .space-x-4 > * + * { margin-left: 1rem; }
          .hover\\:text-blue-400:hover { color: #60a5fa; }
          .p-6 { padding: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .text-3xl { font-size: 1.875rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .text-gray-600 { color: #4b5563; }
          .grid { display: grid; }
          .gap-6 { gap: 1.5rem; }
          .mb-12 { margin-bottom: 3rem; }
          .bg-white { background-color: #ffffff; }
          .rounded-lg { border-radius: 0.5rem; }
          .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .p-6 { padding: 1.5rem; }
          .border-l-4 { border-left-width: 4px; }
          .border-blue-500 { border-color: #3b82f6; }
          .text-2xl { font-size: 1.5rem; }
          .text-sm { font-size: 0.875rem; }
          .text-gray-500 { color: #6b7280; }
          .bg-red-100 { background-color: #fee2e2; }
          .text-red-800 { color: #991b1b; }
          .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
          .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
          .rounded-full { border-radius: 9999px; }
          .mb-4 { margin-bottom: 1rem; }
          .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .mr-4 { margin-right: 1rem; }
          .text-blue-600 { color: #2563eb; }
          .justify-center { justify-content: center; }
          .gap-4 { gap: 1rem; }
          .bg-blue-600 { background-color: #2563eb; }
          .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
          .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .rounded-lg { border-radius: 0.5rem; }
          .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
          .bg-gray-200 { background-color: #e5e7eb; }
          .text-gray-800 { color: #1f2937; }
          .hover\\:bg-gray-300:hover { background-color: #d1d5db; }
          .bg-gray-100 { background-color: #f3f4f6; }
          .mt-12 { margin-top: 3rem; }
          .text-center { text-align: center; }
          a { text-decoration: none; }
          .underline { text-decoration: underline; }
        `}} />
      </head>
      <body className="min-h-screen">
        <nav className="bg-gray-900 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-bold">🔥 AI热点日报</a>
            <div className="space-x-4">
              <a href="/" className="hover:text-blue-400">今日</a>
              <a href="/today" className="hover:text-blue-400">详细</a>
              <a href="/history" className="hover:text-blue-400">历史</a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto p-6">
          {children}
        </main>
        <footer className="bg-gray-100 p-6 mt-12 text-center text-gray-600">
          <p>Powered by OpenClaw | 每日7:30自动更新</p>
        </footer>
      </body>
    </html>
  )
}
