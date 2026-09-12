import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  onDone: () => void;
}

export function ResetPasswordModal({ onDone }: Props) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(onDone, 1500);
    } catch (err) {
      const msg = (err as Error).message ?? '';
      if (msg.includes('Password should be')) {
        setError('密碼至少需要 6 個字元。Password must be at least 6 characters.');
      } else if (msg.includes('different from the old password')) {
        setError('新密碼不能與舊密碼相同。New password must be different from the old one.');
      } else {
        setError(msg || '發生錯誤，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box auth-box">
        <button className="modal-close" onClick={async () => {
          await supabase.auth.signOut();
          onDone();
        }}>✕</button>
        <div className="auth-title">設定新密碼 Set New Password</div>

        {done ? (
          <div className="form-success">密碼已更新！Password updated!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-field">
              <label>新密碼 New Password</label>
              <div className="pw-row">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="至少 6 個字元"
                  className="modal-input"
                  required minLength={6} autoFocus
                />
                <button type="button" className="btn-show-pw" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-confirm" disabled={loading}>
              {loading ? '處理中...' : '確認更新 Update'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
