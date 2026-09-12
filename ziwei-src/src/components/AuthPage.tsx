import { useState } from 'react';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'register' | 'forgot';

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    // Eye open
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    // Eye with slash
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

interface Props {
  onClose: () => void;
}

export function AuthPage({ onClose }: Props) {
  const [mode, setMode]     = useState<AuthMode>('login');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (mode === 'forgot') {
        const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: siteUrl,
        });
        if (err) throw err;
        setMessage('重設密碼連結已寄出，請查收信件。Check your email.');

      } else if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onClose(); // onAuthStateChange in App.tsx picks up the session

      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setMessage('帳號已建立！請查收驗證信後再登入。Account created — check your email.');
      }
    } catch (err) {
      const msg = (err as Error).message ?? '';
      // Make common Supabase error messages more readable
      if (msg.includes('Invalid login credentials')) {
        setError('Email 或密碼錯誤。');
      } else if (msg.includes('User already registered')) {
        setError('此 Email 已註冊，請直接登入。');
      } else if (msg.includes('Password should be')) {
        setError('密碼至少需要 6 個字元。');
      } else {
        setError(msg || '發生錯誤，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box auth-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="auth-title">
          {mode === 'login'    && '登入 Sign in'}
          {mode === 'register' && '免費註冊 Sign up'}
          {mode === 'forgot'   && '忘記密碼 Reset'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="請輸入 Email"
              className="modal-input" required autoFocus
            />
          </div>

          {mode !== 'forgot' && (
            <div className="modal-field">
              <label>密碼 Password</label>
              <div className="pw-row">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="至少 6 個字元 · min. 6 characters"
                  className="modal-input" required minLength={6}
                />
                <button type="button" className="btn-show-pw" onClick={() => setShowPw(v => !v)}>
                  <EyeIcon visible={showPw} />
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="auth-forgot-row">
              <button type="button" className="auth-link" onClick={() => { setMode('forgot'); setError(''); setMessage(''); }}>
                忘記密碼？Forgot password?
              </button>
            </div>
          )}

          {error   && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <button type="submit" className="btn-confirm" disabled={loading}>
            {loading ? '處理中...' : (
              mode === 'login'    ? '登入 Sign in' :
              mode === 'register' ? '建立帳號 Sign up free' :
                                    '寄送重設連結 Send Reset Link'
            )}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' && (
            <button className="auth-link" onClick={() => { setMode('register'); setError(''); setMessage(''); }}>
              點我免費註冊 Create an account
            </button>
          )}
          {(mode === 'register' || mode === 'forgot') && (
            <button className="auth-link" onClick={() => { setMode('login'); setError(''); setMessage(''); }}>
              ← 返回登入 Back to Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
