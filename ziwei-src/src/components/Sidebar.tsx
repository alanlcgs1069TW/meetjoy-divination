import { useState } from 'react';
import { useLang } from '../contexts/LangContext';
import { SUPPORTED_LOCALES } from '../i18n';
import { HAS_KNOWN_ISSUES } from './KnownIssues';

declare const __GIT_HASH__: string;
declare const __GIT_DATE__: string;

interface AuthState {
  isLoggedIn: boolean;
  email?: string;
}

interface Props {
  auth: AuthState;
  onClose: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onSyncClick: () => void;
  onPrivacyClick: () => void;
  onKnownIssuesClick: () => void;
  onAboutClick: () => void;
  onBugReportClick: () => void;
  syncStatus?: string;
  /** 盤面預設：飛化上色 / 自化箭頭 的預設開關（持久化，改動立即套用當前盤） */
  defaultFeixing: boolean;
  defaultZihua: boolean;
  onDefaultFeixingChange: (on: boolean) => void;
  onDefaultZihuaChange: (on: boolean) => void;
}

export function Sidebar({ auth, onClose, onLoginClick, onLogout, onSyncClick, onPrivacyClick, onKnownIssuesClick, onAboutClick, onBugReportClick, syncStatus, defaultFeixing, defaultZihua, onDefaultFeixingChange, onDefaultZihuaChange }: Props) {
  const { locale, setLocale } = useLang();
  const [showDate, setShowDate] = useState(false);
  const hash = typeof __GIT_HASH__ !== 'undefined' ? __GIT_HASH__ : 'dev';
  const date = typeof __GIT_DATE__ !== 'undefined' ? __GIT_DATE__ : '';
  const T: Record<string, { title: string; register: string; sync: string; logout: string; language: string; privacy: string; knownIssues: string; about: string; bugReport: string; chartDefaults: string; feixing: string; zihua: string; on: string; off: string }> = {
    'en':    { title: 'Settings',  register: 'Sign up / Sign in', sync: 'Sync & Back Up', logout: 'Sign out', language: 'Language', privacy: 'Privacy Policy', knownIssues: 'Known Issues', about: 'With Thanks',       bugReport: 'Report',   chartDefaults: 'Chart Defaults', feixing: 'Fēihuà colouring', zihua: 'Zìhuà arrows', on: 'On', off: 'Off' },
    'zh-TW': { title: '設定選單', register: '免費註冊 / 登入',    sync: '備份同步',        logout: '登出',     language: '語言',     privacy: '隱私政策',      knownIssues: '已知問題',     about: '致謝',              bugReport: '意見回報', chartDefaults: '盤面預設',       feixing: '飛化上色',          zihua: '自化箭頭',      on: '開', off: '關' },
    };
  const UI = T[locale] ?? T['zh-TW'];
  return (
    <div className="sidebar-overlay">
      <div className="sidebar-backdrop" onClick={onClose} />
      <div className="sidebar-drawer">
        <div className="sidebar-title">{UI.title}</div>

        {!auth.isLoggedIn ? (
          <>
            <button className="sidebar-item" onClick={() => { onLoginClick(); onClose(); }}>
              <span className="sidebar-icon">👤</span>
              {UI.register}
            </button>
            <div className="sidebar-local-notice">
              {locale === 'en'
                ? 'Sign in to back up your charts to the cloud.'
                : '登入後可選擇備份至雲端。'}
            </div>
          </>
        ) : (
          <>
            <div className="sidebar-account">
              <span className="sidebar-icon">👤</span>
              <span className="sidebar-email">{auth.email}</span>
            </div>
            <button className="sidebar-item" onClick={onSyncClick}>
              <span className="sidebar-icon">☁</span>
              {UI.sync}
            </button>
            {syncStatus && <div className={`sidebar-sync-status${syncStatus.startsWith('⚠') ? ' sidebar-sync-error' : ''}`}>{syncStatus}</div>}
            <button className="sidebar-item sidebar-item-logout" onClick={() => { onLogout(); onClose(); }}>
              <span className="sidebar-icon">↪</span>
              {UI.logout}
            </button>
          </>
        )}

        <div className="sidebar-locale">
          <div className="sidebar-locale-label">{UI.language}</div>
          <div className="sidebar-locale-btns">
            {SUPPORTED_LOCALES.map(l => (
              <button
                key={l.code}
                className={`sidebar-locale-btn${locale === l.code ? ' active' : ''}`}
                onClick={() => setLocale(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-locale sidebar-chart-defaults">
          <div className="sidebar-locale-label">{UI.chartDefaults}</div>
          {[
            { label: UI.feixing, value: defaultFeixing, onChange: onDefaultFeixingChange },
            { label: UI.zihua,   value: defaultZihua,   onChange: onDefaultZihuaChange },
          ].map(row => (
            <div key={row.label} className="sidebar-default-row">
              <span className="sidebar-default-label">{row.label}</span>
              <div className="sidebar-locale-btns">
                <button
                  className={`sidebar-locale-btn${row.value ? ' active' : ''}`}
                  onClick={() => row.onChange(true)}
                >{UI.on}</button>
                <button
                  className={`sidebar-locale-btn${!row.value ? ' active' : ''}`}
                  onClick={() => row.onChange(false)}
                >{UI.off}</button>
              </div>
            </div>
          ))}
        </div>

        <button className="sidebar-item sidebar-item-bug" onClick={() => { onBugReportClick(); onClose(); }}>
          <span className="sidebar-icon">📝</span>
          {UI.bugReport}
        </button>

        {HAS_KNOWN_ISSUES && (
          <button className="sidebar-item sidebar-item-bug" onClick={() => { onKnownIssuesClick(); onClose(); }}>
            <span className="sidebar-icon">🔧</span>
            {UI.knownIssues}
          </button>
        )}

        <button className="sidebar-item sidebar-item-bug" onClick={() => { onAboutClick(); onClose(); }}>
          <span className="sidebar-icon">❤</span>
          {UI.about}
        </button>

        <div className="sidebar-footer">
          <div className="sidebar-version" onClick={() => setShowDate(v => !v)} style={{ cursor: 'pointer' }}>
            #{hash}{showDate && date ? <span className="sidebar-version-date"> · {date}</span> : null}
          </div>
          <button className="sidebar-privacy" onClick={() => { onPrivacyClick(); onClose(); }}>{UI.privacy}</button>
        </div>
      </div>
    </div>
  );
}
