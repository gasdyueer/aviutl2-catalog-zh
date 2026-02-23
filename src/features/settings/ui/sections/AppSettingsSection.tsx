import type { CSSProperties } from 'react';
import { Check, FolderOpen, Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import type { AppSettingsSectionProps } from '../types';
import SettingToggleRow from './SettingToggleRow';

const iconBlockStyle: CSSProperties = { display: 'block' };

export default function AppSettingsSection({
  form,
  packageStateEnabled,
  saving,
  success,
  onAviutl2RootChange,
  onPortableToggle,
  onPackageStateEnabledToggle,
  onPickAviutl2Root,
  onToggleTheme,
  onSave,
}: AppSettingsSectionProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2">
        <SettingsIcon size={18} className="text-slate-500 dark:text-slate-400" />
        <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">应用设置</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="settings-aviutl2-root">
            AviUtl2 文件夹
          </label>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            请指定包含 aviutl2.exe 的文件夹。
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              id="settings-aviutl2-root"
              name="aviutl2Root"
              value={form.aviutl2Root}
              onChange={onAviutl2RootChange}
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm cursor-text select-text"
              placeholder="包含 aviutl2.exe 的文件夹"
            />
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              type="button"
              onClick={onPickAviutl2Root}
            >
              <FolderOpen size={16} />
              浏览
            </button>
          </div>
        </div>

        <SettingToggleRow
          title={
            <>
              便携模式{' '}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">（推荐关闭）</span>
            </>
          }
          description="将插件和脚本保存到与 aviutl2.exe 相同层级的 data 文件夹中"
          checked={form.isPortableMode}
          onToggle={() => onPortableToggle(!form.isPortableMode)}
        />

        <SettingToggleRow
          title="深色模式"
          checked={form.theme !== 'lightmode'}
          onToggle={onToggleTheme}
          thumbContent={
            form.theme === 'lightmode' ? (
              <Sun size={12} className="text-slate-400" style={iconBlockStyle} />
            ) : (
              <Moon size={12} className="text-blue-600" style={iconBlockStyle} />
            )
          }
        />

        <SettingToggleRow
          title="匿名统计发送"
          description="为了提供基于使用情况的显示，我们会匿名发送已安装/卸载的包ID以及已安装的包ID。感谢您的合作。"
          checked={packageStateEnabled}
          onToggle={() => onPackageStateEnabledToggle(!packageStateEnabled)}
        />

        <div className="flex flex-wrap items-center justify-end gap-2 border-slate-100 dark:border-slate-800">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 disabled:opacity-60 cursor-pointer ${
              success ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            onClick={onSave}
            disabled={saving || Boolean(success)}
            type="button"
          >
            {success && <Check size={16} />}
            {success ? '已保存' : '保存设置'}
          </button>
        </div>
      </div>
    </section>
  );
}
