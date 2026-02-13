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

function getSourceName(source: string): string {
  const names: Record<string, string> = {
    github: 'GitHub',
    hackernews: 'HackerNews',
    reddit: 'Reddit',
    anthropic: 'Anthropic',
    rss: 'RSS订阅'
  }
  return names[source] || source
}

export default function AllPage() {
  const report = getLatestReport()
  
  if (!report) {
    return <div>暂无数据</div>
  }
  
  const allItems = report.items
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  // 按来源分组统计
  const sourceStats = allItems.reduce((acc, item) => {
    acc[item.source] = (acc[item.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/today" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-block', marginBottom: '12px', fontSize: '0.875rem' }}>← 返回详细版</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>📋 {dateStr} 全部热点</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>共 {report.total} 条内容 | 按热度排序</p>
      </div>
      
      {/* 来源筛选标签 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
          全部 {report.total}
        </span>
        {Object.entries(sourceStats).map(([source, count]) => (
          <span key={source} style={{ background: '#f3f4f6', color: '#4b5563', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem' }}>
            {getEmoji(source)} {getSourceName(source)} {count}
          </span>
        ))}
      </div>
      
      {/* 全部列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {allItems.map((item, index) => (
          <div key={item.rank} className="card-soft p-5">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '1.25rem' }}>{getEmoji(item.source)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>#{index + 1}</span>
                    {index < 10 && <span className="badge-hot">TOP{index + 1}</span>}
                  </div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', margin: 0, lineHeight: 1.4 }}>{item.title}</h2>
                </div>
              </div>
              <span className="badge-score">{item.relevanceScore}分</span>
            </div>
            
            <p style={{ color: '#4b5563', marginBottom: '12px', lineHeight: 1.6, fontSize: '0.875rem' }}>
              {item.summary || item.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
                {item.stars && <span>⭐ {item.stars.toLocaleString()}</span>}
                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{getSourceName(item.source)}</span>
              </div>
              
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#4f46e5', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}
              >
                查看原文 →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* 底部提示 */}
      <div style={{ marginTop: '32px', textAlign: 'center', padding: '24px', background: '#f9fafb', borderRadius: '12px' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '8px' }}>已显示全部 {report.total} 条热点</p>
        <Link href="/today" style={{ color: '#4f46e5', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}>← 返回 TOP 10</Link>
      </div>
    </div>
  )
}
