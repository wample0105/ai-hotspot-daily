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
