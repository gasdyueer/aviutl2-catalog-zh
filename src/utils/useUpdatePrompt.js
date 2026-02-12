import { useCallback, useEffect, useState } from 'react';
import { logError } from './index.js';

function resolvePubDate(update) {
  if (!update || typeof update !== 'object') return { raw: '', label: '' };
  const candidates = [
    update.pubDate,
    update.pub_date,
    update.publishDate,
    update.publishedAt,
    update.published_at,
    update.releaseDate,
    update.date,
  ];
  const raw = candidates.find((val) => typeof val === 'string' && val.trim()) || '';
  if (!raw) return { raw: '', label: '' };
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return { raw, label: '' };
  let label = '';
  try {
    label = new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric' }).format(parsed);
  } catch {
    label = `${parsed.getMonth() + 1}月${parsed.getDate()}日`;
  }
  return { raw, label };
}

export function useUpdatePrompt(options = {}) {
  const { autoCheck = true } = options;
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    // 汉化版本禁用自动更新检查
    // 避免从原项目获取不兼容的更新
    return undefined;
  }, [autoCheck]);

  const dismissUpdate = useCallback(() => {
    if (updateBusy) return;
    setUpdateInfo(null);
    setUpdateError('');
  }, [updateBusy]);

  const confirmUpdate = useCallback(async () => {
    // 汉化版本禁用更新功能
    // 此版本为静态汉化版本，不支持自动更新
    console.warn('汉化版本已禁用自动更新功能');
    setUpdateError('汉化版本不支持自动更新。请手动下载新版本。');
  }, []);

  return {
    updateInfo,
    updateBusy,
    updateError,
    dismissUpdate,
    confirmUpdate,
  };
}
