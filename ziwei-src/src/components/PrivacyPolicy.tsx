interface Props {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box privacy-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="privacy-title">隱私政策 Privacy Policy</h2>
        <div className="privacy-body">

          <section>
            <h3>資料收集 Data Collection</h3>
            <p>
              本應用程式不會收集任何個人識別資料。命盤資料（姓名、生日、時辰）僅儲存於您的裝置本機（localStorage），或在您自願登入帳號後備份至您個人的雲端空間。
            </p>
            <p className="privacy-en">
              This app does not collect personally identifiable information. Chart data (name, birth date, birth time) is stored locally on your device (localStorage), or backed up to the cloud only when you choose to sign in.
            </p>
          </section>

          <section>
            <h3>帳號與雲端備份 Account &amp; Cloud Backup</h3>
            <p>
              若您選擇免費註冊，我們僅儲存您的 Email 及加密後的密碼，用於識別帳號與雲端備份。我們不會將您的資料出售或分享給任何第三方。
            </p>
            <p className="privacy-en">
              If you sign up, we store only your email address and an encrypted password for authentication and cloud backup. We do not sell or share your data with any third party.
            </p>
          </section>

          <section>
            <h3>本機運算 Local Computation</h3>
            <p>
              所有排盤運算均在您的裝置本機完成，生辰資料不會傳送至任何伺服器進行運算。
            </p>
            <p className="privacy-en">
              All chart calculations are performed locally on your device. Birth data is never sent to a server for computation.
            </p>
          </section>

          <section>
            <h3>Cookies</h3>
            <p>
              本應用程式使用 localStorage 儲存設定與命盤資料，不使用第三方追蹤 Cookie。
            </p>
            <p className="privacy-en">
              This app uses localStorage to save settings and chart data. No third-party tracking cookies are used.
            </p>
          </section>

          <section>
            <h3>聯絡我們 Contact</h3>
            <p>
              如有任何隱私相關問題，請來信：<a href="mailto:your-email@example.com">your-email@example.com</a>
            </p>
            <p className="privacy-en">
              For any privacy-related questions, please email us at <a href="mailto:your-email@example.com">your-email@example.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
