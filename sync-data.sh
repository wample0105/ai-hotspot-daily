#!/bin/bash
# sync-data.sh - 同步热点数据到网站项目

SOURCE_DIR="/Users/wample/.openclaw/workspace/media-team/hotspot/output/archive"
TARGET_DIR="/Users/wample/.openclaw/workspace/hotspot-site/public/data/archive"

# 创建目标目录
mkdir -p "$TARGET_DIR"

# 复制最新数据
echo "🔄 同步热点数据..."
cp -r "$SOURCE_DIR"/* "$TARGET_DIR/" 2>/dev/null || true

# 统计
DATE_COUNT=$(ls -1 "$TARGET_DIR" 2>/dev/null | wc -l)
echo "✅ 已同步 $DATE_COUNT 天的数据"

# Git 提交（如果在 Git 仓库中）
if [ -d "/Users/wample/.openclaw/workspace/hotspot-site/.git" ]; then
  cd /Users/wample/.openclaw/workspace/hotspot-site
  
  # 检查是否有变更
  if [ -n "$(git status --porcelain public/data/)" ]; then
    git add public/data/
    git commit -m "sync: $(date +%Y-%m-%d) hotspot data"
    echo "📝 已提交到 Git"
  else
    echo "ℹ️ 无新数据需要提交"
  fi
fi

echo "✅ 同步完成"
