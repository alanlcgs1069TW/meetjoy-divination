import { useState } from 'react';
import { useLang } from '../contexts/LangContext';

interface Props {
  userEmail?: string;
  onClose: () => void;
}

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/report-bug`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function compressToBase64(file: File): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const MAX = 1280;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      resolve({ base64: canvas.toDataURL('image/jpeg', 0.75).split(',')[1], mime: 'image/jpeg' });
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function BugReportModal({ userEmail, onClose }: Props) {
  const { locale } = useLang();
  const isEn = locale === 'en';
  const isCN = locale === 'zh-CN';

  const [title, setTitle]             = useState('');
  const [description, setDesc]        = useState('');
  const [steps, setSteps]             = useState('');
  const [email, setEmail]             = useState(userEmail ?? '');
  const [browser, setBrowser]         = useState(
    typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 300) : ''
  );
  const [screenshotFiles, setScreenshots] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [sizeError, setSizeError]     = useState(false);
  const [formatError, setFormatError] = useState(false);

  const MAX_SHOTS = 3;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setSizeError(false);
    setFormatError(false);
    const ok: File[] = [];
    let badFormat = false, badSize = false;
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) { badFormat = true; continue; } // 不支援格式 → 直接擋
      if (f.size > 5 * 1024 * 1024)        { badSize = true;   continue; } // 超過 5 MB → 直接擋
      ok.push(f);
    }
    if (badFormat) setFormatError(true);
    if (badSize)   setSizeError(true);
    if (ok.length) setScreenshots(prev => [...prev, ...ok].slice(0, MAX_SHOTS));
    e.target.value = ''; // 允許重複選同一檔
  }

  function removeShot(idx: number) {
    setScreenshots(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const screenshots = await Promise.all(
        screenshotFiles.map(async f => {
          const c = await compressToBase64(f);
          return { base64: c.base64, mime: c.mime };
        })
      );
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Edge Function 閘道要求授權標頭；anon key 為可公開金鑰
          'Authorization': `Bearer ${ANON_KEY}`,
          'apikey': ANON_KEY,
        },
        body: JSON.stringify({
          title, description, steps, email, browser,
          screenshots,
          // 向後相容：舊版 Edge Function 仍讀單張欄位
          screenshot: screenshots[0]?.base64,
          screenshotMime: screenshots[0]?.mime,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  const UI = {
    heading:      isEn ? 'Submit a Report'                   : isCN ? '意见反馈'              : '意見回報',
    titleLabel:   isEn ? 'Title *'                           : isCN ? '标题 *'                : '標題 *',
    titlePh:      isEn ? 'Short summary'                     : isCN ? '简短描述'               : '簡短描述',
    descLabel:    isEn ? 'Description *'                     : isCN ? '详细说明 *'             : '詳細說明 *',
    descPh:       isEn ? 'Describe the issue or suggestion'  : isCN ? '描述问题或建议'          : '描述問題或建議',
    stepsLabel:   isEn ? 'Steps / Additional Details'        : isCN ? '重现步骤 / 补充说明'     : '重現步驟 / 補充說明',
    stepsPh:      isEn ? 'Optional'                          : isCN ? '选填'                  : '選填',
    emailLabel:   isEn ? 'Your Email'                        : isCN ? '你的 Email'             : '你的 Email',
    emailPh:      isEn ? 'Optional'                          : isCN ? '选填，方便我们回复'       : '選填，方便我們回覆',
    browserLabel: isEn ? 'Browser / Device'                  : isCN ? '浏览器 / 设备'           : '瀏覽器 / 裝置',
    shotLabel:    isEn ? 'Screenshots'                       : isCN ? '截图'                   : '截圖',
    shotHint:     isEn ? 'Optional · JPG / PNG / WebP · up to 3 · max 5 MB each' : isCN ? '选填 · JPG / PNG / WebP · 最多 3 张 · 每张最大 5 MB' : '選填 · JPG / PNG / WebP · 最多 3 張 · 每張最大 5 MB',
    shotSizeErr:  isEn ? 'File too large (max 5 MB).'        : isCN ? '档案过大（最大 5 MB）。'  : '檔案過大（最大 5 MB）。',
    shotFormatErr: isEn ? 'Unsupported format — only JPG / PNG / WebP.' : isCN ? '格式不支持，仅接受 JPG / PNG / WebP。' : '格式不支援，僅接受 JPG / PNG / WebP。',
    submit:       isEn ? 'Submit'                            : isCN ? '提交'                   : '送出',
    sending:      isEn ? 'Sending…'                          : isCN ? '提交中…'                : '傳送中…',
    done:         isEn ? 'Report submitted! Thank you.'      : isCN ? '提交成功，感谢你！'       : '回報成功，感謝你！',
    error:        isEn ? 'Failed to submit. Please try again.' : isCN ? '提交失败，请再试一次。' : '送出失敗，請再試一次。',
    close:        isEn ? 'Close'                             : isCN ? '关闭'                   : '關閉',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box bug-report-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{UI.heading}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {status === 'done' ? (
          <div className="bug-report-success">
            <div className="bug-report-success-msg">{UI.done}</div>
            <button className="btn-primary" onClick={onClose}>{UI.close}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bug-report-form">
            <label>
              <span className="bug-field-label">{UI.titleLabel}<span className="field-count">{title.length}/200</span></span>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={UI.titlePh}
                required
                maxLength={200}
              />
            </label>

            <label>
              <span className="bug-field-label">{UI.descLabel}<span className="field-count">{description.length}/2000</span></span>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder={UI.descPh}
                required
                rows={4}
                maxLength={2000}
              />
            </label>

            <label>
              <span className="bug-field-label">{UI.stepsLabel}<span className="field-count">{steps.length}/2000</span></span>
              <textarea
                value={steps}
                onChange={e => setSteps(e.target.value)}
                placeholder={UI.stepsPh}
                rows={3}
                maxLength={2000}
              />
            </label>

            <label>
              <span className="bug-field-label">{UI.emailLabel}<span className="field-count">{email.length}/254</span></span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={UI.emailPh}
                maxLength={254}
              />
            </label>

            <label>
              <span className="bug-field-label">{UI.browserLabel}<span className="field-count">{browser.length}/300</span></span>
              <input
                type="text"
                value={browser}
                onChange={e => setBrowser(e.target.value)}
                maxLength={300}
              />
            </label>

            <div className="bug-report-screenshot">
              <span className="bug-report-screenshot-label">
                {UI.shotLabel}
                <span className="bug-report-screenshot-hint">{UI.shotHint}</span>
              </span>
              {screenshotFiles.length < MAX_SHOTS && (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="bug-report-file-input"
                />
              )}
              {formatError && <div className="bug-report-error">{UI.shotFormatErr}</div>}
              {sizeError && <div className="bug-report-error">{UI.shotSizeErr}</div>}
              {screenshotFiles.length > 0 && (
                <div className="bug-report-preview-grid">
                  {screenshotFiles.map((f, i) => (
                    <div key={i} className="bug-report-preview-item">
                      <img
                        className="bug-report-preview"
                        src={URL.createObjectURL(f)}
                        alt={`preview ${i + 1}`}
                      />
                      <button
                        type="button"
                        className="bug-report-preview-remove"
                        onClick={() => removeShot(i)}
                        aria-label="remove"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="bug-report-error">{UI.error}</div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? UI.sending : UI.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
