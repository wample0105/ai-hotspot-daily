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
    return null
  }
}

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

export default function TodayPage() {
  const report = getLatestReport()
  
  if (!report) {
    return <div>暂无数据</div>
  }
  
  const top10 = report.items.slice(0, 10)
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN')
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首页</Link>
          <h1 className="text-3xl font-bold">🔥 {dateStr} 详细报告</h1>
          <p className="text-gray-600">共 {report.total} 条高质量内容 | TOP 10</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {top10.map((item) => (
          <div key={item.rank} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getEmoji(item.source)}</span>
                <div>
                  <span className="text-sm text-gray-500">#{item.rank}</span>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                </div>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                {item.relevanceScore}分
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">📋 摘要：</span>
                {item.summary || item.description}
              </p>
              
              {item.suggestedTopic && (
                <p className="text-gray-600">
                  <span className="font-semibold">📝 选题建议：</span>
                  {item.suggestedTopic}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {item.stars && <span>⭐ {item.stars.toLocaleString()} stars</span>}
                {item.score && <span>👍 {item.score}</span>}
                {item.comments !== undefined && <span>💬 {item.comments}</span>}
                <span className="text-gray-400">|</span>
                <span>来源: {item.source}</span>
              </div>
              
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                查看原文 →
              </a>
            </div>
            
            {item.tags.length > 0 && (
              <div className="mt-4 flex gap-2">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500">显示前10条，共 {report.total} 条</p>
      </div>
    </div>
  )
}
