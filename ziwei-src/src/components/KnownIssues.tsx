import { useLang } from '../contexts/LangContext';

interface Props {
  onClose: () => void;
}

interface IssueText {
  title: string;
  body: string;
}

interface Issue {
  zh: IssueText;
  en: IssueText;
  cn: IssueText;
}

/**
 * 已知問題 / Known Issues 清單
 * 新增項目時，在這個陣列加一個物件即可（含 zh/en/cn 三語）。
 * 陣列為空時，Sidebar 自動隱藏「已知問題」按鈕（見 HAS_KNOWN_ISSUES export）。
 */
const ISSUES: Issue[] = [
  // 天馬公式已於 2026-05-20 修復，移除該條目
];

/** Sidebar 用來判斷是否顯示「已知問題」按鈕 */
export const HAS_KNOWN_ISSUES = ISSUES.length > 0;

const TITLES: Record<string, string> = {
  'zh-TW': '已知問題',
  'zh-CN': '已知问题',
  'en':    'Known Issues',
};

const EMPTY: Record<string, string> = {
  'zh-TW': '目前沒有已知問題。',
  'zh-CN': '目前没有已知问题。',
  'en':    'No known issues at this time.',
};

export function KnownIssues({ onClose }: Props) {
  const { locale } = useLang();
  const title = TITLES[locale] ?? TITLES['zh-TW'];
  const emptyMsg = EMPTY[locale] ?? EMPTY['zh-TW'];

  function pick(issue: Issue): IssueText {
    if (locale === 'en')    return issue.en;
    if (locale === 'zh-CN') return issue.cn;
    return issue.zh;
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box privacy-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="privacy-title">{title}</h2>
        <div className="privacy-body">
          {ISSUES.length === 0 ? (
            <p>{emptyMsg}</p>
          ) : (
            ISSUES.map((issue, i) => {
              const t = pick(issue);
              return (
                <section key={i}>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
