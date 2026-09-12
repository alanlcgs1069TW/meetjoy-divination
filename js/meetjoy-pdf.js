/**
 * 🔮 癒見幸福 · 魔法占星學院
 * 全系統命盤 PDF 匯出與向量列印通用引擎 (MeetJoy PDF Engine Pro)
 * 支援 7 大命盤：人類圖、基因天命、西洋占星、脈輪占星、撲克命牌、文王六爻、四盤小六壬
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MeetJoyPDF = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // 動態懶加載 html2pdf.js CDN (備用直接下載檔案通道)
  let html2pdfLoading = false;
  let html2pdfReady = false;

  function loadHtml2Pdf() {
    if (html2pdfReady || html2pdfLoading) return;
    html2pdfLoading = true;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
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
    if (document.getElementById('meetjoy_pdf_styles')) return;

    const style = document.createElement('style');
    style.id = 'meetjoy_pdf_styles';
    style.textContent = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 8mm 10mm 8mm 10mm;
        }

        /* 隱藏無關的操作與導航元素 */
        nav, form, button, .no-print, #geo_info_text, .modal-backdrop, #meetjoy_pdf_modal {
          display: none !important;
        }

        body {
          background: #FFFFFF !important;
          color: #0F172A !important;
          padding: 0 !important;
          margin: 0 !important;
          font-size: 11px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        main {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
        }

        /* 抬頭與卡片美化 */
        .mb-8.bg-white\\/90 {
          margin-bottom: 8px !important;
          padding: 8px 12px !important;
          border-radius: 12px !important;
          border: 1px solid #E2E8F0 !important;
        }

        /* 避免關鍵卡片被硬生生截斷 */
        .crystal-center, .card-box, .bg-white, [id*="card"], [id*="container"] {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* 人類圖專屬排版優化：主舞台 3 欄並列，收在單頁 */
        .bg-gradient-to-b {
          background: #F8FAFC !important;
          border: 1px solid #CBD5E1 !important;
          border-radius: 16px !important;
          padding: 8px 12px !important;
          margin-bottom: 8px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 4px !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 > div:nth-child(1) {
          width: 25% !important;
          order: 1 !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 > div:nth-child(2) {
          width: 50% !important;
          order: 2 !important;
        }

        .grid.grid-cols-1.lg\\:grid-cols-12 > div:nth-child(3) {
          width: 25% !important;
          order: 3 !important;
        }

        #bodygraph_svg {
          max-height: 420px !important;
          width: auto !important;
        }

        #design_planet_list, #personality_planet_list {
          gap: 2px !important;
          font-size: 10px !important;
        }

        #design_planet_list > div, #personality_planet_list > div {
          padding: 2px 4px !important;
        }

        #chart_summary_cards {
          display: grid !important;
          grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          gap: 6px !important;
          margin-top: 8px !important;
          margin-bottom: 8px !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        #chart_summary_cards > div {
          border: 1px solid #CBD5E1 !important;
          background: #FFFFFF !important;
          border-radius: 10px !important;
          padding: 6px 8px !important;
          box-shadow: none !important;
        }

        #chart_summary_cards p {
          font-size: 9px !important;
        }

        #chart_summary_cards p.font-black {
          font-size: 11px !important;
        }

        /* 第二頁：通道與生活魔藥處方 */
        .mt-8.grid.grid-cols-1.md\\:grid-cols-2 {
          page-break-before: always !important;
          break-before: page !important;
          margin-top: 10px !important;
        }

        /* 六爻排盤優化 */
        #sanchuan_card, #hexagram_result, #gua_main_box, .gua-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* 占星星盤優化 */
        #astrology_wheel_container, svg {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* 基因天命全息圖優化 */
        #gene_keys_golden_path, .gk-sequence-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* 撲克牌陣優化 */
        .card-matrix, .playing-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 取得格式化當前日期時間字串 (如 2026-09-12 17:30)
  function getTimestampStr() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  // 彈出優雅匯出選擇視窗
  function showExportModal(options = {}) {
    const modalId = 'meetjoy_pdf_modal';
    let modal = document.getElementById(modalId);
    if (modal) modal.remove();

    const chartTitle = options.title || document.title.split('(')[0].replace('MeetJoy', '').trim() || '命盤鑑定報告';
    const filename = options.filename || `癒見幸福_${chartTitle.replace(/[\s·\/]/g, '_')}_${getTimestampStr()}`;

    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 no-print select-none';
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
                調用系統原生列印，100% 向量字體與 SVG 渲染，放大無鋸齒、檔案小且排版最佳。
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
                前端自動封裝為 PDF 檔案並自動觸發瀏覽器下載。
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

    // 關閉按鈕
    document.getElementById('btn_pdf_close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // 向量列印
    document.getElementById('btn_pdf_vector').addEventListener('click', () => {
      modal.remove();
      setTimeout(() => {
        window.print();
      }, 150);
    });

    // 直接下載
    document.getElementById('btn_pdf_download').addEventListener('click', () => {
      const btn = document.getElementById('btn_pdf_download');
      btn.disabled = true;
      btn.innerHTML = `<span class="text-xs text-amber-700 font-bold">⏳ 正在渲染並封裝 PDF，請稍候...</span>`;

      const runDownload = () => {
        if (typeof html2pdf === 'undefined') {
          alert('正在調用高畫質列印引擎為您輸出 PDF...');
          modal.remove();
          window.print();
          return;
        }

        const targetEl = document.querySelector('main') || document.body;
        const opt = {
          margin: [8, 10, 8, 10],
          filename: `${filename}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(targetEl).save().then(() => {
          modal.remove();
        }).catch(err => {
          console.error(err);
          modal.remove();
          window.print();
        });
      };

      if (typeof html2pdf !== 'undefined') {
        runDownload();
      } else {
        loadHtml2Pdf();
        let retry = 0;
        const timer = setInterval(() => {
          retry++;
          if (typeof html2pdf !== 'undefined') {
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

  // 統一對外公開接口
  function exportPDF(options = {}) {
    injectPrintStyles();
    loadHtml2Pdf();
    showExportModal(options);
  }

  // 初始化並注入共用按鈕小元件
  function init() {
    injectPrintStyles();
    loadHtml2Pdf();
  }

  // DOM 載入後自動就緒
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => init());
    } else {
      init();
    }
  }

  return {
    init,
    exportPDF,
    injectPrintStyles
  };
}));
