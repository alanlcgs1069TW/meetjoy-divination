import { useLang } from '../contexts/LangContext';

interface Props {
  onClose: () => void;
}

interface CreditText {
  name: string;
  website?: { url: string; label: string };
  body: React.ReactNode;
}

interface Credit {
  zh: CreditText;
  en: CreditText;
  cn: CreditText;
}

/**
 * 致謝清單 / Acknowledgements
 * 新增 contributor 時，在這個陣列加一個物件即可（含 zh/en/cn 三語）。
 */
const CREDITS: Credit[] = [
  {
    zh: {
      name: 'ISZN 國際紫微斗數學會',
      website: { url: 'https://iszntw.ezycourse.com/zh/home/', label: '學會官網' },
      body: (
        <>
          本工具的紫微斗數排盤邏輯，主要依據 ISZN 國際紫微斗數學會的教學體系，並以其官方排盤軟體{' '}
          <a href="https://www.dreamkinin.com" target="_blank" rel="noopener noreferrer">紫微攻略</a>
          {' '}作為驗證標準。感謝學會多年來在華人世界系統化推廣紫微斗數，提供清晰的算法定義與學習路徑，讓這個小工具能成型。
        </>
      ),
    },
    en: {
      name: 'ISZN International Zi Wei Dou Shu Association',
      website: { url: 'https://iszntw.ezycourse.com/en/home/', label: 'Official Website' },
      body: (
        <>
          The Zi Wei Dou Shu chart logic in this tool is primarily based on the teaching system of the ISZN International Zi Wei Dou Shu Association, validated against their official chart software{' '}
          <a href="https://www.dreamkinin.com" target="_blank" rel="noopener noreferrer">紫微攻略 (Zi Wei Gong Lue)</a>
          . We are grateful for the Association&apos;s long-standing efforts in systematically spreading Zi Wei Dou Shu across the Chinese-speaking world, providing the clear algorithmic definitions and learning path that made this small tool possible.
        </>
      ),
    },
    cn: {
      name: 'ISZN 国际紫微斗数学会',
      website: { url: 'https://iszntw.ezycourse.com/zh/home/', label: '学会官网' },
      body: (
        <>
          本工具的紫微斗数排盘逻辑，主要依据 ISZN 国际紫微斗数学会的教学体系，并以其官方排盘软件{' '}
          <a href="https://www.dreamkinin.com" target="_blank" rel="noopener noreferrer">紫微攻略</a>
          {' '}作为验证标准。感谢学会多年来在华人世界系统化推广紫微斗数，提供清晰的算法定义与学习路径，让这个小工具能成形。
        </>
      ),
    },
  },
];

const TITLES: Record<string, string> = {
  'zh-TW': '致謝',
  'zh-CN': '致谢',
  'en':    'With Thanks',
};

const INTRO: Record<string, string> = {
  'zh-TW': '感謝以下單位與個人，讓這個工具成為可能。',
  'zh-CN': '感谢以下单位与个人，让这个工具成为可能。',
  'en':    'With gratitude to the following for making this tool possible.',
};

// 收尾小註：說明非營利、純個人 AI 學習，語氣輕
const NOTE: Record<string, string> = {
  'zh-TW': '這個小工具是我在學習、體驗 AI 的過程中做給自己用的，並非商業產品、也無意營利。如果可以對你有幫助，那對我來說會是個小確幸。',
  'zh-CN': '这个小工具是我在学习、体验 AI 的过程中做给自己用的，并非商业产品、也无意营利。如果可以对你有帮助，那对我来说会是个小确幸。',
  'en':    "This is a personal project I built to learn and experiment with AI. It's not a commercial product. If you find it helpful, that would honestly make my day.",
};

export function About({ onClose }: Props) {
  const { locale } = useLang();
  const title = TITLES[locale] ?? TITLES['zh-TW'];
  const intro = INTRO[locale] ?? INTRO['zh-TW'];
  const note  = NOTE[locale]  ?? NOTE['zh-TW'];

  function pick(credit: Credit): CreditText {
    if (locale === 'en')    return credit.en;
    if (locale === 'zh-CN') return credit.cn;
    return credit.zh;
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box privacy-box about-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="privacy-title">{title}</h2>
        <div className="privacy-body">
          <p>{intro}</p>
          {CREDITS.map((credit, i) => {
            const t = pick(credit);
            return (
              <section key={i}>
                <h3>
                  {t.name}
                  {t.website && (
                    <>
                      {' · '}
                      <a href={t.website.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85em', fontWeight: 'normal' }}>
                        {t.website.label}
                      </a>
                    </>
                  )}
                </h3>
                <p>{t.body}</p>
              </section>
            );
          })}
          <p className="about-note">{note}</p>
        </div>
      </div>
    </div>
  );
}
