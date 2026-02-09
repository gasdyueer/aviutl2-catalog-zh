/**
 * 安装器源组件
 */
import React from 'react';
import { INSTALLER_SOURCES } from '../../model/form';
import type { PackageInstallerSectionProps } from '../types';

type InstallerSourceSectionProps = Pick<PackageInstallerSectionProps, 'installer' | 'updateInstallerField'>;

export default function InstallerSourceSection({ installer, updateInstallerField }: InstallerSourceSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">下载源</div>
        <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/50">
          {INSTALLER_SOURCES.map((option) => {
            const isActive = installer.sourceType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
                onClick={() => updateInstallerField('sourceType', option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {installer.sourceType === 'direct' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="installer-direct-url">
              下载URL
            </label>
            <input
              id="installer-direct-url"
              value={installer.directUrl}
              onChange={(e) => updateInstallerField('directUrl', e.target.value)}
              placeholder="https://example.com/plugin.zip"
            />
          </div>
        )}
        {installer.sourceType === 'booth' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="installer-booth-url">
              BOOTH URL
            </label>
            <input
              id="installer-booth-url"
              value={installer.boothUrl}
              onChange={(e) => updateInstallerField('boothUrl', e.target.value)}
              placeholder="以 https://booth.pm/downloadables/... 开头的路径"
            />
          </div>
        )}
        {installer.sourceType === 'github' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="installer-github-owner"
              >
                GitHub ID (Owner)
              </label>
              <input
                id="installer-github-owner"
                value={installer.githubOwner}
                onChange={(e) => updateInstallerField('githubOwner', e.target.value)}
                placeholder="例: neosku"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="installer-github-repo">
                仓库名 (Repo)
              </label>
              <input
                id="installer-github-repo"
                value={installer.githubRepo}
                onChange={(e) => updateInstallerField('githubRepo', e.target.value)}
                placeholder="例: aviutl2-catalog"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="installer-github-pattern"
              >
                正则表达式模式
              </label>
              <input
                id="installer-github-pattern"
                value={installer.githubPattern}
                onChange={(e) => updateInstallerField('githubPattern', e.target.value)}
                placeholder="^aviutl_plugin_.*\\.zip$"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                请指定与发布文件名匹配的正则表达式。
              </p>
            </div>
          </div>
        )}
        {installer.sourceType === 'GoogleDrive' && (
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
              htmlFor="installer-google-drive-id"
            >
              文件ID
            </label>
            <input
              id="installer-google-drive-id"
              value={installer.googleDriveId}
              onChange={(e) => updateInstallerField('googleDriveId', e.target.value)}
              placeholder="Google Drive 共享链接中包含的ID（…/drive/folders/{文件夹ID}）"
            />
          </div>
        )}
      </div>
    </div>
  );
}
