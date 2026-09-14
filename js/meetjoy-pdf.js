/**
 * 🔮 癒見幸福 · 魔法占星學院
 * 全系統命盤 PDF 匯出與向量列印通用引擎 (MeetJoy PDF Engine Pro)
 * 支援 8 大命盤：人類圖、基因天命、西洋占星、脈輪占星、撲克命牌、文王六爻、四盤小六壬、西洋地占
 * 內嵌官方 app.meetjoy.net 行銷 QR Code 與「命盤第一主角 (The Chart is the Hero)」列印守護
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MeetJoyPDF = factory();
  }
}(typeof self !== "undefined" ? self : this, function () {

  // 官方 app.meetjoy.net 高精度 QR Code (DataURL，零網路依賴)
  const MEETJOY_QR_DATAURL = "data:image/png;base64,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";

  // 動態懶加載 html2pdf.js CDN (備用直接下載檔案通道)
  let html2pdfLoading = false;
  let html2pdfReady = false;

  function loadHtml2Pdf() {
    if (html2pdfReady || html2pdfLoading) return;
    html2pdfLoading = true;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => {
      html2pdfReady = true;
      html2pdfLoading = false;
    };
    script.onerror = () => {
      html2pdfLoading = false;
    };
    document.head.appendChild(script);
  }

  // 自動注入專屬列印樣式
  function injectPrintStyles() {
    if (document.getElementById("meetjoy_pdf_styles")) return;

    const style = document.createElement("style");
    style.id = "meetjoy_pdf_styles";
    style.textContent = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 6mm 8mm 6mm 8mm;
        }

        /* 隱藏無關的操作、導航、表單與開關元素 */
        nav, form, button, .no-print, #geo_info_text, .modal-backdrop, #meetjoy_pdf_modal,
        #btn_toggle_inputs, #subsequence_tabs_bar, .subseq-tab, [onclick*="setLayoutPreset"],
        input, select, textarea, .hide-for-print, .btn-locale, .locale-menu-wrap, #btn_copy_link {
          display: none !important;
        }

        /* 全局純淨白底與高對比文字 */
        body {
          background: #FFFFFF !important;
          color: #0F172A !important;
          padding: 0 !important;
          margin: 0 !important;
          font-size: 10px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        main {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
        }

        /* ======================================================================
           🌟 官方行銷神聖頁首 (Print Marketing Header)
           ====================================================================== */
        .meetjoy-print-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-bottom: 2px solid #C8A97E !important;
          padding-bottom: 8px !important;
          margin-bottom: 10px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .meetjoy-print-header-left {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        .meetjoy-print-logo {
          width: 48px !important;
          height: 48px !important;
          border-radius: 10px !important;
          border: 1px solid #C8A97E !important;
        }

        .meetjoy-print-title {
          font-size: 16px !important;
          font-weight: 900 !important;
          color: #1A2217 !important;
          letter-spacing: 0.5px !important;
          margin: 0 !important;
        }

        .meetjoy-print-subtitle {
          font-size: 10px !important;
          color: #64748B !important;
          margin-top: 2px !important;
        }

        .meetjoy-print-header-right {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          background: #FAF8F5 !important;
          border: 1px solid #E2D9C8 !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
        }

        .meetjoy-print-qr {
          width: 52px !important;
          height: 52px !important;
          border-radius: 4px !important;
          display: block !important;
        }

        .meetjoy-print-qr-text {
          font-size: 8.5px !important;
          color: #4A5D40 !important;
          line-height: 1.3 !important;
          text-align: left !important;
          font-weight: 600 !important;
        }

        .meetjoy-print-qr-link {
          font-size: 9px !important;
          color: #8C6D3B !important;
          font-weight: bold !important;
        }

        /* ======================================================================
           🌟 官方行銷頁尾 (Print Marketing Footer)
           ====================================================================== */
        .meetjoy-print-footer {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          border-top: 1px solid #E2D9C8 !important;
          padding-top: 6px !important;
          margin-top: 12px !important;
          font-size: 8.5px !important;
          color: #64748B !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* 避免關鍵卡片被切斷 */
        .crystal-center, .card-box, .bg-white, [id*="card"], [id*="container"], article.palace {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* ======================================================================
           1. 人類圖專屬排版 (The Chart is the Hero)
           ====================================================================== */
        .bg-gradient-to-b {
          background: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          border-radius: 12px !important;
          padding: 6px 10px !important;
          margin-bottom: 6px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 6px !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 > div:nth-child(1) {
          width: 23% !important;
          order: 1 !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 > div:nth-child(2) {
          width: 54% !important;
          order: 2 !important;
          display: flex !important;
          justify-content: center !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 > div:nth-child(3) {
          width: 23% !important;
          order: 3 !important;
        }

        #bodygraph_svg {
          max-height: 500px !important;
          width: 100% !important;
          margin: 0 auto !important;
        }

        #chart_summary_cards {
          display: grid !important;
          grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          gap: 4px !important;
          margin-top: 6px !important;
          margin-bottom: 6px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        #chart_summary_cards > div {
          border: 1px solid #CBD5E1 !important;
          background: #F8FAFC !important;
          border-radius: 8px !important;
          padding: 4px 6px !important;
          text-align: center !important;
        }

        /* ======================================================================
           2. 基因天命專屬排版 (黃金之路全息圖居中放大，11 球端點一覽無遺)
           ====================================================================== */
        #gene_keys_golden_path {
          display: block !important;
          width: 100% !important;
          margin: 0 auto 6px auto !important;
          background: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          border-radius: 12px !important;
          padding: 6px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        #gene_keys_svg {
          max-height: 520px !important;
          width: 100% !important;
          margin: 0 auto !important;
          display: block !important;
        }

        .lg\\:col-span-4 > div:first-child {
          display: none !important;
        }

        #sphere_detail_card {
          border: 1px solid #CBD5E1 !important;
          background: #F8FAFC !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          margin-top: 6px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* ======================================================================
           3. 紫微斗數專屬排版 (十二宮 4 欄九宮盤居中放大)
           ====================================================================== */
        #summary {
          display: grid !important;
          grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
          gap: 4px !important;
          margin-bottom: 6px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        #summary > div {
          border: 1px solid #CBD5E1 !important;
          background: #F8FAFC !important;
          border-radius: 8px !important;
          padding: 4px 6px !important;
          text-align: center !important;
        }

        #chart, .chart-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 4px !important;
          width: 100% !important;
          margin: 0 auto 6px auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        article.palace, .palace-cell {
          border: 1px solid #94A3B8 !important;
          border-radius: 8px !important;
          padding: 4px 6px !important;
          background: #FFFFFF !important;
          min-height: 105px !important;
          font-size: 9.5px !important;
        }

        /* ======================================================================
           4. 西洋占星專屬排版 (雙環星盤居中大圖)
           ====================================================================== */
        #astrology_wheel_container {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin: 0 auto 8px auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        #astrology_wheel_container svg {
          max-height: 500px !important;
          width: auto !important;
          margin: 0 auto !important;
        }

        .planet-table, .aspect-grid {
          font-size: 9.5px !important;
          border-collapse: collapse !important;
          width: 100% !important;
        }

        .planet-table th, .planet-table td {
          border: 1px solid #CBD5E1 !important;
          padding: 3px 5px !important;
          text-align: center !important;
        }

        /* ======================================================================
           5. 文王六爻、四盤小六壬、西洋地占專屬排版
           ====================================================================== */
        #sanchuan_card, #hexagram_result, #gua_main_box, .gua-card, #geomancy_tree_board {
          border: 1px solid #CBD5E1 !important;
          border-radius: 10px !important;
          padding: 8px 12px !important;
          margin-bottom: 8px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .print-page-break {
          page-break-before: always !important;
          break-before: page !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 取得格式化當前日期時間字串
  function getTimestampStr() {
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // 動態在 main 頂部與底部注入行銷 Header 與 Footer
  function attachPrintBranding(chartTitle) {
    detachPrintBranding(); // 先清空

    const mainEl = document.querySelector("main") || document.body;

    // 1. 頁首
    const header = document.createElement("div");
    header.id = "meetjoy_dynamic_print_header";
    header.className = "meetjoy-print-header";
    header.innerHTML = `
      <div class="meetjoy-print-header-left">
        <img src="/apple-touch-icon.png" class="meetjoy-print-logo" alt="MeetJoy Logo" onerror="this.style.display=none">
        <div>
          <h2 class="meetjoy-print-title">🔮 癒見幸福 · 魔法占星學院</h2>
          <p class="meetjoy-print-subtitle">
            鑑定報告：<strong style="color:#0F172A;">${chartTitle}</strong> ｜ 排盤時間：${getTimestampStr()}
          </p>
        </div>
      </div>
      <div class="meetjoy-print-header-right">
        <img src="${MEETJOY_QR_DATAURL}" class="meetjoy-print-qr" alt="app.meetjoy.net QR Code">
        <div>
          <div class="meetjoy-print-qr-text">手機掃碼開啟<br>線上神聖排盤系統</div>
          <div class="meetjoy-print-qr-link">app.meetjoy.net</div>
        </div>
      </div>
    `;

    // 2. 頁尾
    const footer = document.createElement("div");
    footer.id = "meetjoy_dynamic_print_footer";
    footer.className = "meetjoy-print-footer";
    footer.innerHTML = `
      <span>本鑑定報告由 <strong>癒見幸福療身心靈推廣中心 · 魔法占星學院 愛倫院長</strong> 研發監製</span>
      <span>官方網站：<strong>https://meetjoy.net</strong> ｜ 線上神聖排盤：<strong>https://app.meetjoy.net</strong></span>
    `;

    if (mainEl.firstChild) {
      mainEl.insertBefore(header, mainEl.firstChild);
    } else {
      mainEl.appendChild(header);
    }
    mainEl.appendChild(footer);
  }

  // 列印後清理注入的行銷元素
  function detachPrintBranding() {
    const h = document.getElementById("meetjoy_dynamic_print_header");
    if (h) h.remove();
    const f = document.getElementById("meetjoy_dynamic_print_footer");
    if (f) f.remove();
  }

  // 彈出優雅匯出選擇視窗
  function showExportModal(options = {}) {
    const modalId = "meetjoy_pdf_modal";
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const chartTitle = options.title || document.title.split("(")[0].replace("MeetJoy", "").trim() || "命盤鑑定報告";
    const filename = options.filename || `癒見幸福_${chartTitle.replace(/[\\s·\\/]/g, "_")}_${getTimestampStr().replace(/[- :]/g, "")}`;

    modal = document.createElement("div");
    modal.id = modalId;
    modal.className = "fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 no-print select-none";
    modal.innerHTML = `
      <div class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-amber-900/20 text-slate-800 animate-in fade-in zoom-in duration-200">
        <div class="text-center mb-5">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
            📄
          </div>
          <h3 class="text-lg font-black text-slate-900">匯出命盤鑑定報告 (PDF)</h3>
          <p class="text-xs text-slate-500 mt-1">
            ${chartTitle} ｜ 癒見幸福 · 魔法占星學院
          </p>
        </div>

        <div class="space-y-3 mb-6">
          <!-- 選項 1：高清向量列印 / 另存為 PDF (強烈推薦) -->
          <button type="button" id="btn_pdf_vector" class="w-full p-4 rounded-2xl border-2 border-[#C8A97E] bg-gradient-to-r from-amber-50 to-orange-50/50 hover:bg-amber-100/60 transition flex items-start gap-3.5 text-left group">
            <span class="text-2xl mt-0.5">🖨️</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-black text-sm text-slate-900">向量列印 / 另存 PDF</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8A97E] text-stone-900">強烈推薦</span>
              </div>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                自動植入官方 app.meetjoy.net 行銷 QR Code，命盤第一頁置頂居中放大，100% 向量銳利清晰。
              </p>
            </div>
          </button>

          <!-- 選項 2：直接下載 PDF 檔案 -->
          <button type="button" id="btn_pdf_download" class="w-full p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition flex items-start gap-3.5 text-left group">
            <span class="text-2xl mt-0.5">📥</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-slate-800">直接下載 PDF 檔案 (.pdf)</span>
              </div>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                前端一鍵自動封裝完整命盤與行銷 QR Code 並觸發下載。
              </p>
            </div>
          </button>
        </div>

        <div class="flex gap-2.5">
          <button type="button" id="btn_pdf_close" class="w-full py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition">
            取消
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("btn_pdf_close").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    // 向量列印處理
    document.getElementById("btn_pdf_vector").addEventListener("click", () => {
      modal.remove();
      attachPrintBranding(chartTitle);

      const cleanup = () => {
        detachPrintBranding();
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);

      setTimeout(() => {
        window.print();
        setTimeout(cleanup, 2000); // 備用防漏清理
      }, 150);
    });

    // 直接下載處理
    document.getElementById("btn_pdf_download").addEventListener("click", () => {
      const btn = document.getElementById("btn_pdf_download");
      btn.disabled = true;
      btn.innerHTML = `<span class="text-xs text-amber-700 font-bold">⏳ 正在渲染命盤與行銷 QR Code，請稍候...</span>`;

      attachPrintBranding(chartTitle);

      const runDownload = () => {
        if (typeof html2pdf === "undefined") {
          modal.remove();
          window.print();
          detachPrintBranding();
          return;
        }

        const targetEl = document.querySelector("main") || document.body;
        const opt = {
          margin: [6, 8, 6, 8],
          filename: `${filename}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(targetEl).save().then(() => {
          modal.remove();
          detachPrintBranding();
        }).catch(err => {
          console.error(err);
          modal.remove();
          window.print();
          detachPrintBranding();
        });
      };

      if (typeof html2pdf !== "undefined") {
        runDownload();
      } else {
        loadHtml2Pdf();
        let retry = 0;
        const timer = setInterval(() => {
          retry++;
          if (typeof html2pdf !== "undefined") {
            clearInterval(timer);
            runDownload();
          } else if (retry > 25) {
            clearInterval(timer);
            runDownload();
          }
        }, 200);
      }
    });
  }

  function exportPDF(options = {}) {
    injectPrintStyles();
    loadHtml2Pdf();
    showExportModal(options);
  }

  function init() {
    injectPrintStyles();
    loadHtml2Pdf();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => init());
    } else {
      init();
    }
  }

  return {
    init,
    exportPDF,
    injectPrintStyles,
    MEETJOY_QR_DATAURL
  };
}));