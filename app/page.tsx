import fs from 'fs'
import path from 'path'
import Link from 'next/link'

interface HotspotItem {
  rank: number
  title: string
  description: string
  summary?: string
  url: string
  stars?: number
  score?: number
  comments?: number
  source: string
  relevanceScore: number
  suggestedTopic?: string
  tags: string[]
}

interface HotspotReport {
  date: string
  total: number
  items: HotspotItem[]
}

// 读取最新的热点报告
function getLatestReport(): HotspotReport | null {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data', 'archive')
    const dates = fs.readdirSync(dataDir).sort().reverse()
    
    if (dates.length === 0) return null
    
    const latestDate = dates[0]
    const filePath = path.join(dataDir, latestDate, 'full.json')
    
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error('读取报告失败:', error)
    return null
  }
}

// 获取emoji
function getEmoji(source: string): string {
  const emojis: Record<string, string> = {
    github: '🐙',
    hackernews: '🟠',
    reddit: '🔴',
    anthropic: '✳️',
    rss: '📰'
  }
  return emojis[source] || '📰'
}

export default function HomePage() {
  const report = getLatestReport()
  
  if (!report) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">暂无数据</h1>
        <p className="text-gray-600">等待首次热点抓取...</p>
      </div>
    )
  }
  
  const top3 = report.items.slice(0, 3)
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN')
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 {dateStr} 热点简报</h1>
        <p className="text-gray-600">共 {report.total} 条高质量内容 | 每日7:30更新</p>
      </div>
      
      <div className="grid gap-6 mb-12">
        {top3.map((item, index) => (
          <div key={item.rank} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getEmoji(item.source)}</span>
                <div>
                  <span className="text-sm text-gray-500">#{item.rank}</span>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                </div>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                {item.relevanceScore}分
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {item.summary || item.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {item.stars && <span className="mr-4">⭐ {item.stars.toLocaleString()}</span>}
                {item.score && <span className="mr-4">👍 {item.score}</span>}
                {item.comments !== undefined && <span>💬 {item.comments}</span>}
              </div>
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                查看原文 →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-4">
        <Link 
          href="/today"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          查看详细版 (TOP 10)
        </Link>
        
        <Link 
          href="/history"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          浏览历史归档
        </Link>
      </div>
    </div>
  )
}
