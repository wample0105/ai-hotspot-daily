import fs from 'fs'
import path from 'path'
import Link from 'next/link'

interface ArchiveItem {
  date: string
  dateStr: string
  count: number
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
      
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const data = JSON.parse(content)
        count = data.total || 0
      } catch {
        // 忽略读取错误
      }
      
      return {
        date,
        dateStr: new Date(date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        }),
        count
      }
    })
  } catch (error) {
    console.error('读取归档失败:', error)
    return []
  }
}

export default function HistoryPage() {
  const archives = getArchives()
  
  if (archives.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">暂无历史归档</h1>
        <p className="text-gray-600">等待数据同步...</p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">← 返回首页</Link>
        <h1 className="text-3xl font-bold">📚 历史归档</h1>
        <p className="text-gray-600">共 {archives.length} 天数据 | 永久保存</p>
      </div>
      
      <div className="grid gap-4">
        {archives.map((archive) => (
          <Link
            key={archive.date}
            href={`/history/${archive.date}`}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-800 w-14 h-14 rounded-lg flex items-center justify-center text-2xl">
                  📅
                </div>
                <div>
                  <h2 className="text-xl font-bold">{archive.dateStr}</h2>
                  <p className="text-gray-500">{archive.count} 条热点</p>
                </div>
              </div>
              
              <span className="text-blue-600">查看详情 →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
