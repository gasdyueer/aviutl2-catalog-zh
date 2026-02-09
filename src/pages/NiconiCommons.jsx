import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, ExternalLink, Search } from 'lucide-react';
import { open } from '@tauri-apps/plugin-shell';
import { useCatalog } from '../utils/catalogStore.jsx';
import { normalize } from '../utils/index.js';

function toNiconiId(value) {
  return String(value || '').trim();
}

// 列表用自定义复选框
function Checkbox({ checked, onChange, ariaLabel }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md border text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
        checked
          ? 'border-blue-500 bg-blue-600 shadow-sm shadow-blue-500/30'
          : 'border-slate-300 bg-white text-transparent hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900/60 dark:hover:border-slate-500'
      }`}
    >
      <Check size={14} className={`transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
    </button>
  );
}

export default function NiconiCommons() {
  const { items } = useCatalog();
  const deselectedIdsRef = useRef([]);
  const skipPersistRef = useRef(true);
  const [query, setQuery] = useState('');
  const [selectedMap, setSelectedMap] = useState({});
  const [copyState, setCopyState] = useState({ ok: false, message: '', count: 0 });

  // 提取符合条件的项目
  const eligibleItems = useMemo(() => {
    return (items || [])
      .filter((item) => item && item.installed)
      .map((item) => ({ ...item, niconiCommonsId: toNiconiId(item.niconiCommonsId) }))
      .filter((item) => item.niconiCommonsId);
  }, [items]);

  const sortedEligible = useMemo(() => {
    return eligibleItems.toSorted((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ja'));
  }, [eligibleItems]);

  const queryKey = useMemo(() => normalize(query || ''), [query]);

  const filteredItems = useMemo(() => {
    if (!queryKey) return sortedEligible;
    return sortedEligible.filter((item) => {
      const nameKey = normalize(item.name || '');
      const idKey = normalize(item.id || '');
      const authorKey = normalize(item.author || '');
      const commonsKey = normalize(item.niconiCommonsId || '');
      return (
        nameKey.includes(queryKey) ||
        idKey.includes(queryKey) ||
        authorKey.includes(queryKey) ||
        commonsKey.includes(queryKey)
      );
    });
  }, [sortedEligible, queryKey]);

  // 恢复已保存的未选择ID并反映到初始选择
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('niconiCommonsDeselectedIds');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          deselectedIdsRef.current = parsed.map(String).filter(Boolean);
        }
      }
    } catch {}
    const deselectedSet = new Set(deselectedIdsRef.current);
    setSelectedMap(() => {
      const next = {};
      eligibleItems.forEach((item) => {
        if (!deselectedSet.has(item.id)) next[item.id] = true;
      });
      return next;
    });
  }, [eligibleItems]);

  // 选择变更时保存未选择ID
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    const deselected = eligibleItems.filter((item) => !selectedMap[item.id]).map((item) => item.id);
    deselectedIdsRef.current = deselected;
    try {
      window.localStorage.setItem('niconiCommonsDeselectedIds', JSON.stringify(deselected));
    } catch {}
  }, [eligibleItems, selectedMap]);

  const selectedItems = useMemo(() => {
    return eligibleItems.filter((item) => selectedMap[item.id]);
  }, [eligibleItems, selectedMap]);

  const selectedIds = useMemo(() => {
    return selectedItems.map((item) => item.niconiCommonsId).filter(Boolean);
  }, [selectedItems]);

  const selectedCount = selectedIds.length;
  const totalEligible = eligibleItems.length;
  const visibleCount = filteredItems.length;
  const allVisibleSelected = visibleCount > 0 && filteredItems.every((item) => selectedMap[item.id]);

  function toggleItem(id) {
    setSelectedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function toggleAllVisible() {
    setSelectedMap((prev) => {
      const next = { ...prev };
      if (allVisibleSelected) {
        filteredItems.forEach((item) => {
          delete next[item.id];
        });
      } else {
        filteredItems.forEach((item) => {
          next[item.id] = true;
        });
      }
      return next;
    });
  }

  // 复制ID
  async function copyIds(list) {
    if (!list.length) return;
    try {
      await navigator.clipboard.writeText(list.join(' '));
      setCopyState({ ok: true, message: `已复制 ${list.length} 项`, count: list.length });
    } catch {
      setCopyState({ ok: false, message: '复制失败', count: 0 });
    }
  }

  useEffect(() => {
    if (!copyState.message) return;
    const timer = setTimeout(() => setCopyState({ ok: false, message: '', count: 0 }), 2000);
    return () => clearTimeout(timer);
  }, [copyState.message]);

  return (
    <div className="max-w-4xl mx-auto select-none">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">NicoNico Commons ID</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            显示已安装且注册了NicoNico Commons ID的包列表
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn--primary cursor-pointer ${copyState.ok ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
            onClick={() => copyIds(selectedIds)}
            disabled={selectedCount === 0}
            type="button"
          >
            {copyState.ok ? <Check size={16} /> : <Copy size={16} />}
            {copyState.ok ? `已复制 ${copyState.count} 项` : '复制NicoNico Commons ID'}
          </button>
        </div>
      </div>

      {/* 説明 */}
      <details className="group mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-700 dark:text-slate-200">
          <span>什么是NicoNico Commons ID</span>
          <ChevronDown size={16} className="text-slate-400 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            <b>NicoNico Commons</b>
            是一项支持创作者创作活动，让创作者能够安心进行创作，促进创作者之间的交流、协作和作品利用的服务。
            <br />
            在NicoNico，您可以将制作中使用的工具和素材（例如：AviUtl2本体、插件、脚本、素材等）注册为<b>父作品</b>，
            从而建立作品之间的联系（内容树）。
            <br />
            在向NicoNico投稿视频时注册父作品，您的支持之情会传达给工具和素材的制作者，成为他们创作活动的动力。
            <br />
            此外，在NicoNico，通过"儿童津贴"等机制，还能为制作者带来经济回报。
            <br />
            请务必尝试注册父作品。
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ※注意：注册父作品不会减少您自身的收益。
          </p>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={async () => {
              try {
                await open('https://qa.nicovideo.jp/faq/show/863');
              } catch {}
            }}
            type="button"
          >
            <ExternalLink size={12} />
            父子注册方法
          </button>
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>显示 {visibleCount}项</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span>选择 {selectedCount}项</span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="search"
            placeholder="包名/ID/作者/Commons ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {visibleCount === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            {totalEligible === 0 ? '没有符合条件的包' : '无匹配项'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide grid grid-cols-[2.5rem_minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-2">
                <div className="flex items-center justify-center">
                  <Checkbox checked={allVisibleSelected} onChange={toggleAllVisible} ariaLabel="全选显示项" />
                </div>
                <span>包名</span>
                <span>作者</span>
                <span>NicoNico Commons ID</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 grid grid-cols-[2.5rem_minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1fr)] gap-2 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    tabIndex={0}
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={!!selectedMap[item.id]}
                        onChange={() => toggleItem(item.id)}
                        ariaLabel={`选择 ${item.name || item.id}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {item.name || item.id}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.id}</div>
                    </div>
                    <div className="min-w-0 text-sm text-slate-600 dark:text-slate-300 truncate">{item.author}</div>
                    <div
                      className="text-sm font-mono text-slate-700 dark:text-slate-200 truncate"
                      title={item.niconiCommonsId}
                    >
                      {item.niconiCommonsId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
