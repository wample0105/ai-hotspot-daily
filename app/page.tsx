'use client'

import { useState, useEffect } from 'react'
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

// 骨架屏组件
function SkeletonCard() {
  return (
    <div className="card-soft p-6">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '80px', height: '16px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '60%', height: '24px' }} />
          </div>
        </div>
        <div className="skeleton" style={{ width: '60px', height: '28px', borderRadius: '20px' }} />
      </div>
      <div className="skeleton" style={{ width: '100%', height: '60px', marginBottom: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '80px', height: '16px' }} />
        <div className="skeleton" style={{ width: '80px', height: '20px' }} />
      </div>
    </div>
  )
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

// 分享功能
function shareToWeixin(title: string, url: string) {
  if (navigator.share) {
    navigator.share({
      title: title,
      url: url,
    }).catch(() => {})
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(`${title} ${url}`)
    alert('链接已复制，可粘贴到微信分享')
  }
}

export default function HomePage() {
  const [report, setReport] = useState<HotspotReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/data/archive/2026-02-13/full.json')
      .then(res => res.json())
      .then(data => {
        setReport(data)
        setLoading(false)
      })
      .catch(err => {
        setError('加载失败，请刷新重试')
        setLoading(false)
      })
  }, [])

  // 骨架屏状态
  if (loading) {
    return (
      <div>
        <div className="mb-8 text-center">
          <div className="skeleton" style={{ width: '280px', height: '36px', margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ width: '200px', height: '20px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gap: '20px', marginBottom: '48px' }}>
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <div className="skeleton" style={{ width: '140px', height: '48px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ width: '120px', height: '48px', borderRadius: '12px' }} />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="text-center py-16">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😅</div>
        <h1 className="text-xl mb-4">{error || '暂无数据'}</h1>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          刷新页面
        </button>
      </div>
    )
  }

  const top3 = report.items.slice(0, 3)
  const dateStr = new Date(report.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl mb-2">
          📊 {dateStr} 热点简报
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          共 {report.total} 条高质量内容 | 每日7:30更新
        </p>
      </div>
      
      {/* Cards Grid */}
      <div style={{ display: 'grid', gap: '20px', marginBottom: '48px' }}>
        {top3.map((item) => (
          <div key={item.rank} className="card-soft p-6">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <span className="emoji-lg">{getEmoji(item.source)}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>#{item.rank}</span>
                    {item.rank <= 3 && <span className="badge-hot">HOT</span>}
                  </div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0, lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {item.title}
                  </h2>
                </div>
              </div>
              <span className="badge-score">{item.relevanceScore}分</span>
            </div>
            
            <p style={{ color: '#4b5563', marginBottom: '16px', lineHeight: 1.6, fontSize: '0.875rem' }}>
              {item.summary || item.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.stars && <span>⭐ {item.stars.toLocaleString()}</span>}
                <button 
                  onClick={() => shareToWeixin(item.title, item.url)}
                  className="btn-share"
                >
                  📤 分享
                </button>
              </div>
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="link-blue"
                style={{ fontSize: '0.875rem' }}
              >
                查看原文 →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/today" className="btn-primary">
          查看详细版
        </Link>
        <Link href="/history" className="btn-secondary">
          浏览历史
        </Link>
      </div>
    </div>
  )
}
