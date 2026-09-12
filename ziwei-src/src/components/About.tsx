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
      name: '癒見幸福療身心靈推廣中心 · 魔法占星學院',
      website: { url: 'https://meetjoy.net', label: '學院官網' },
      body: (
        <>
          本星盤大典依據正統紫微斗數星曜佈局與三合四化流派演算法，落實十四主星、六吉六煞、祿羊陀馬、長生博士十二神等完整天星步序，並由愛倫院長團隊精心校準驗證，提供大眾精準、清晰且易於實踐的生活魔藥排盤體驗。
        </>
      ),
    },
    en: {
      name: 'MeetJoy Healing Center · Magic Astrology Academy',
      website: { url: 'https://meetjoy.net', label: 'Academy Website' },
      body: (
        <>
          This astrolabe chart system is developed based on classical Zi Wei Dou Shu algorithms, covering the 14 major stars, lucky and tough stars, Chang Sheng and Bo Shi cycles, decadal and yearly transits, with precise algorithmic validation by the MeetJoy Academy team.
        </>
      ),
    },
    cn: {
      name: '癒見幸福療身心靈推廣中心 · 魔法占星學院',
      website: { url: 'https://meetjoy.net', label: '學院官網' },
      body: (
        <>
          本星盤大典依據正統紫微斗數星曜佈局與三合四化流派演算法，落實十四主星、六吉六煞、祿羊陀馬、長生博士十二神等完整天星步序，並由愛倫院長團隊精心校準驗證，提供大眾精準、清晰且易於實踐的生活魔藥排盤體驗。
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
