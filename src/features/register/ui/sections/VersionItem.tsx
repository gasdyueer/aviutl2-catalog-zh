/**
 * 版本项目组件
 */
import React, { memo, useCallback } from 'react';
import { Calendar, ChevronDown, Folder, FolderOpen, Plus } from 'lucide-react';
import type { VersionItemProps } from '../types';
import DeleteButton from '../components/DeleteButton';
import VersionFileCard from './VersionFileCard';
const VersionItem = memo(
  function VersionItem({
    version,
    isOpen,
    toggleVersionOpen,
    removeVersion,
    updateVersionField,
    addVersionFile,
    removeVersionFile,
    updateVersionFile,
    chooseFileForHash,
    openDatePicker,
    versionDateRefs,
  }: VersionItemProps) {
    const handleToggle = useCallback(
      (event: React.SyntheticEvent<HTMLDetailsElement>) => {
        toggleVersionOpen(version.key, event.currentTarget.open);
      },
      [toggleVersionOpen, version.key],
    );

    const handleRemove = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        removeVersion(version.key);
      },
      [removeVersion, version.key],
    );

    const handleDateRef = useCallback(
      (el: HTMLInputElement | null) => {
        if (el) {
          versionDateRefs.current.set(version.key, el);
        } else {
          versionDateRefs.current.delete(version.key);
        }
      },
      [versionDateRefs, version.key],
    );

    return (
      <details
        open={isOpen}
        onToggle={handleToggle}
        className="group rounded-xl border border-slate-200 bg-white shadow-sm transition-all open:ring-2 open:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900"
      >
        <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isOpen ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
            >
              {isOpen ? <FolderOpen size={18} /> : <Folder size={18} />}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold ${version.version ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 italic'}`}
              >
                {version.version || '版本未设置'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {version.release_date ? `公开日: ${version.release_date}` : '公开日未设置'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DeleteButton onClick={handleRemove} ariaLabel="删除此版本" />
            <span className="text-slate-400 transition-transform group-open:rotate-180">
              <ChevronDown size={20} />
            </span>
          </div>
        </summary>
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor={`version-${version.key}-name`}
              >
                版本名称<span className="text-red-500">*</span>
              </label>
              <input
                id={`version-${version.key}-name`}
                value={version.version}
                onChange={(e) => updateVersionField(version.key, 'version', e.target.value)}
                placeholder="v1.0.0"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor={`version-${version.key}-release`}
              >
                公开日<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  max="9999-12-31"
                  className="flex-1"
                  id={`version-${version.key}-release`}
                  value={version.release_date}
                  onChange={(e) => updateVersionField(version.key, 'release_date', e.target.value)}
                  ref={handleDateRef}
                />
                <button
                  type="button"
                  className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  onClick={() => openDatePicker(version.key)}
                  aria-label="打开日历"
                >
                  <Calendar size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">文件结构</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">请计算主要文件的哈希值</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={() => addVersionFile(version.key)}
              >
                <Plus size={14} />
                <span>添加文件</span>
              </button>
            </div>
            <div className="space-y-3">
              {version.files.map((file, idx) => (
                <VersionFileCard
                  key={file.key}
                  versionKey={version.key}
                  file={file}
                  index={idx}
                  removeVersionFile={removeVersionFile}
                  updateVersionFile={updateVersionFile}
                  chooseFileForHash={chooseFileForHash}
                />
              ))}
              {!version.files.length && (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  请添加文件
                </div>
              )}
            </div>
          </div>
        </div>
      </details>
    );
  },
  (prev: Readonly<VersionItemProps>, next: Readonly<VersionItemProps>) =>
    prev.version === next.version &&
    prev.isOpen === next.isOpen &&
    prev.toggleVersionOpen === next.toggleVersionOpen &&
    prev.removeVersion === next.removeVersion &&
    prev.updateVersionField === next.updateVersionField &&
    prev.addVersionFile === next.addVersionFile &&
    prev.removeVersionFile === next.removeVersionFile &&
    prev.updateVersionFile === next.updateVersionFile &&
    prev.chooseFileForHash === next.chooseFileForHash &&
    prev.openDatePicker === next.openDatePicker &&
    prev.versionDateRefs === next.versionDateRefs,
);

export default VersionItem;
