import fs from 'fs'
import path from 'path'
import Link from 'next/link'

interface ArchiveItem {
  date: string
  dateStr: string
  count: number
  month: string
}

function getArchives(): ArchiveItem[] {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data', 'archive')
    
    if (!fs.existsSync(dataDir)) {
      return []
    }
    
    const dates = fs.readdirSync(dataDir)
      .filter(name => fs.statSync(path.join(dataDir, name)).isDirectory())
      .sort()
      .reverse()
    
    return dates.map(date => {
      const filePath = path.join(dataDir, date, 'full.json')
      let count = 0
      const dateObj = new Date(date)
      
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const data = JSON.parse(content)
        count = data.total || 0
      } catch {
        // 忽略读取错误
      }
      
      return {
        date,
        dateStr: dateObj.toLocaleDateString('zh-CN', {
          month: 'short',
          day: 'numeric'
        }),
        count,
        month: dateObj.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
      }
    })
  } catch (error) {
    console.error('读取归档失败:', error)
    return []
  }
}

// 获取所有月份
function getMonths(archives: ArchiveItem[]): string[] {
  const months = [...new Set(archives.map(a => a.month))]
  return months.sort().reverse()
}

export default function HistoryPage() {
  const archives = getArchives()
  const months = getMonths(archives)
  const currentMonth = months[0] || ''
  
  if (archives.length === 0) {
    return (
      <div className="text-center py-20">
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📚</div>
        <h1 className="text-2xl font-bold mb-4">暂无历史归档</h1>
        <p className="text-gray-600 mb-6">数据积累中，明天就会有第一条记录~ 🌱</p>
        
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', maxWidth: '400px', margin: '0 auto' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            💡 每天7:30自动更新，记得明天来看哦！
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link href="/" style={{ color: '#4f46e5', textDecoration: 'none', display: 'inline-block', marginBottom: '12px', fontSize: '0.875rem' }}>← 返回首页</Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>📚 历史归档</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>共 {archives.length} 天数据 · 永久保存 · 每日7:30更新</p>
      </div>
      
      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div className="card-soft p-4" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5' }}>{archives.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>累计天数</div>
        </div>
        <div className="card-soft p-4" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5' }}>{archives.reduce((sum, a) => sum + a.count, 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>总热点数</div>
        </div>
      </div>
      
      {/* 月份选择器 */}
      {months.length > 1 && (
        <div className="card-soft p-4 mb-6">
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>📅 选择月份</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {months.map((month, index) => (
              <button
                key={month}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: index === 0 ? '#4f46e5' : '#f3f4f6',
                  color: index === 0 ? 'white' : '#4b5563'
                }}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* 时间线视图 */}
      <div className="mb-4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>📋 时间线</h2>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{currentMonth}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {archives.map((archive, index) => (
          <Link
            key={archive.date}
            href={`/history/${archive.date}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 0',
              textDecoration: 'none',
              borderBottom: index < archives.length - 1 ? '1px solid #f3f4f6' : 'none',
              position: 'relative'
            }}
          >
            {/* 时间线 */}
            <div style={{ 
              position: 'absolute', 
              left: '24px', 
              top: 0, 
              bottom: index < archives.length - 1 ? 0 : '50%',
              width: '2px', 
              background: '#e5e7eb',
              zIndex: 0
            }} />
            
            {/* 日期标记 */}
            <div 
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                zIndex: 1,
                flexShrink: 0,
                marginRight: '16px'
              }}
            >
              <span>{new Date(archive.date).getDate()}日</span>
              <span style={{ fontSize: '0.625rem', opacity: 0.9 }}>{['日','一','二','三','四','五','六'][new Date(archive.date).getDay()]}</span>
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                {new Date(archive.date).toLocaleDateString('zh-CN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {archive.count} 条热点 · 点击查看详情
              </div>
            </div>
            
            <span style={{ color: '#4f46e5', fontSize: '0.875rem', marginLeft: '8px' }}>→</span>
          </Link>
        ))}
      </div>
      
      {/* 底部提示 */}
      <div style={{ marginTop: '24px', textAlign: 'center', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>💡 每天7:30自动更新 · 历史数据永久保存</p>
      </div>
    </div>
  )
}
