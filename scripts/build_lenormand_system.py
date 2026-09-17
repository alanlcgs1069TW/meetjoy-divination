# -*- coding: utf-8 -*-
"""
癒見幸福 · 雷諾曼系統專用重構建置腳本
1. 建立正統 36 張雷諾曼卡牌資料庫 (包含序號、中英文名、撲克對應、屬性、象徵物、正統釋義、魔藥處方)
2. 建立精美高解析 SVG 向量卡面呈現函數 renderLenormandCardFace
3. 將其無縫注入 js/divination-cards.js 並提供驗證
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_JS = os.path.join(BASE_DIR, "js", "divination-cards.js")

# 從第一步保存的 cards_meta 載入卡牌資料
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 重新載入完整的 cards_meta
cards_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cards_meta_data.json")

# 如果 cards_meta_data.json 不存在，先建立
from cards_meta_def import cards_meta

with open(SRC_JS, "r", encoding="utf-8") as f:
    orig_js = f.read()

# 找到 TAROT_CARDS 結束點 (即 const LENORMAND_CARDS = [ 的位置)
split_token = "  const LENORMAND_CARDS = ["
if split_token not in orig_js:
    raise ValueError("Cannot find split token in divination-cards.js")

tarot_part = orig_js.split(split_token)[0]

lenormand_cards_data = []
card_arts_dict = {}

for c in cards_meta:
    pad_num = f"{c['num']:02d}"
    card_obj = {
        "num": c["num"],
        "name": f"{pad_num} {c['nameZh']} ({c['nameEn']})",
        "nameZh": c["nameZh"],
        "nameEn": c["nameEn"],
        "pips": c["pips"],
        "suit": c["suit"],
        "suitSymbol": c["suitSymbol"],
        "pipRank": c["pipRank"],
        "suitColor": c["suitColor"],
        "symbol": c["symbol"],
        "nature": c["nature"],
        "natureLabel": c["natureLabel"],
        "keywords": c["keywords"],
        "desc": c["desc"],
        "potion": c["potion"],
        "bgGradient": c["bgGradient"],
        "portalGradient": c["portalGradient"]
    }
    lenormand_cards_data.append(card_obj)
    card_arts_dict[c["num"]] = c["art"].strip()

cards_json_str = json.dumps(lenormand_cards_data, ensure_ascii=False, indent=2)
arts_json_str = json.dumps(card_arts_dict, ensure_ascii=False, indent=2)

js_code_template = """
  const LENORMAND_CARDS = __CARDS_JSON__;

  const LENORMAND_ARTS = __ARTS_JSON__;

  const xmlEscape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

  /**
   * 癒見幸福 · 典雅古典雷諾曼卡面呈現機制 (Classical European Salon Lenormand)
   * 遵循歐洲經典比例 (aspect-[1/1.54])，包含雙層金色古典邊紋、編號圓章、傳統撲克花色點數角標、
   * 拱型核心古典向量插畫、雙語標題飾牌與精準核心關鍵詞。
   */
  function renderLenormandCardFace(card) {
    if (!card) return '';
    const num = Number(card.num) || 1;
    const cardData = LENORMAND_CARDS.find(c => c.num === num) || card;
    const padNum = String(num).padStart(2, '0');
    const nameZh = xmlEscape(cardData.nameZh || '雷諾曼');
    const nameEn = xmlEscape(cardData.nameEn || 'Lenormand');
    const keywords = xmlEscape(cardData.keywords || '');
    const suitSymbol = xmlEscape(cardData.suitSymbol || '♥');
    const pipRank = xmlEscape(cardData.pipRank || 'A');
    const suitColor = cardData.suitColor || '#B82424';
    const bgGrad = cardData.bgGradient || ['#FFFDF8', '#F5EAD4'];
    const portalGrad = cardData.portalGradient || ['#E0F2FE', '#BAE6FD'];
    const artSvg = LENORMAND_ARTS[num] || '<circle cx="130" cy="175" r="40" fill="#D4AF37"/>';

    return `<svg viewBox="0 0 260 400" class="lenormand-card-svg w-full h-full block select-none" role="img" aria-label="${nameZh} ${nameEn} 雷諾曼卡面" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 象牙溫潤漸層底紙 -->
        <linearGradient id="leno-bg-${num}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgGrad[0]}"/>
          <stop offset="100%" stop-color="${bgGrad[1]}"/>
        </linearGradient>
        <!-- 核心拱門背景漸層 -->
        <linearGradient id="leno-portal-${num}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${portalGrad[0]}"/>
          <stop offset="100%" stop-color="${portalGrad[1]}"/>
        </linearGradient>
        <!-- 典雅金色邊框漸層 -->
        <linearGradient id="leno-gold-${num}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E6CA65"/>
          <stop offset="50%" stop-color="#C5A059"/>
          <stop offset="100%" stop-color="#9E7831"/>
        </linearGradient>
      </defs>

      <!-- 卡牌主底板 -->
      <rect width="260" height="400" rx="14" fill="url(#leno-bg-${num})"/>

      <!-- 歐式古典雙層金邊框 -->
      <rect x="6" y="6" width="248" height="388" rx="10" fill="none" stroke="url(#leno-gold-${num})" stroke-width="1.6"/>
      <rect x="9.5" y="9.5" width="241" height="381" rx="8" fill="none" stroke="#E6CA65" stroke-width="0.8" stroke-dasharray="4,2"/>

      <!-- 四角古典巴洛克捲紋 -->
      <g stroke="#C5A059" stroke-width="1.4" fill="none">
        <path d="M12 24 C12 16 16 12 24 12"/>
        <path d="M248 24 C248 16 244 12 236 12"/>
        <path d="M12 376 C12 384 16 388 24 388"/>
        <path d="M248 376 C248 384 244 388 236 388"/>
      </g>
      <circle cx="16" cy="16" r="1.5" fill="#D4AF37"/>
      <circle cx="244" cy="16" r="1.5" fill="#D4AF37"/>
      <circle cx="16" cy="384" r="1.5" fill="#D4AF37"/>
      <circle cx="244" cy="384" r="1.5" fill="#D4AF37"/>

      <!-- 頂部標頭區 (序號 + 傳統撲克牌角標) -->
      <!-- 左上：卡牌序號金幣印章 -->
      <g transform="translate(32, 32)">
        <circle cx="0" cy="0" r="14" fill="#FFFDF8" stroke="url(#leno-gold-${num})" stroke-width="1.6"/>
        <circle cx="0" cy="0" r="11" fill="none" stroke="#E6CA65" stroke-width="0.6"/>
        <text x="0" y="4.5" text-anchor="middle" font-family="'Cinzel', 'Noto Serif TC', serif" font-size="12" font-weight="900" fill="#2E2218">${padNum}</text>
      </g>

      <!-- 右上：歐洲正統沙龍撲克插角 (Playing Card Insert) -->
      <g transform="translate(186, 18)">
        <rect width="54" height="28" rx="5" fill="#FFFDF8" stroke="url(#leno-gold-${num})" stroke-width="1.4"/>
        <rect x="2" y="2" width="50" height="24" rx="3" fill="none" stroke="#E6CA65" stroke-width="0.5"/>
        <text x="27" y="19" text-anchor="middle" font-family="'Cinzel', 'Noto Serif TC', serif" font-size="14" font-weight="900" fill="${suitColor}">${suitSymbol} ${pipRank}</text>
      </g>

      <!-- 核心拱門神聖視窗 -->
      <g>
        <rect x="20" y="54" width="220" height="240" rx="12" fill="url(#leno-portal-${num})" stroke="url(#leno-gold-${num})" stroke-width="1.8"/>
        <rect x="23" y="57" width="214" height="234" rx="10" fill="none" stroke="#E6CA65" stroke-width="0.7" opacity="0.8"/>
        <!-- 向量象徵藝術核心 -->
        ${artSvg}
      </g>

      <!-- 底部古典題名飾牌 (Cartouche) -->
      <g>
        <rect x="20" y="304" width="220" height="82" rx="8" fill="#FFFDF8" stroke="url(#leno-gold-${num})" stroke-width="1.5"/>
        <rect x="23" y="307" width="214" height="76" rx="6" fill="none" stroke="#E6CA65" stroke-width="0.6"/>
        <!-- 中文主名 (繁體中文 · 典雅大氣) -->
        <text x="130" y="329" text-anchor="middle" font-family="'Noto Serif TC', serif" font-size="16" font-weight="900" fill="#2E2218" letter-spacing="3">${nameZh}</text>
        <!-- 英文副名 -->
        <text x="130" y="347" text-anchor="middle" font-family="'Cinzel', serif" font-style="italic" font-size="11.5" font-weight="700" fill="#8C6527" letter-spacing="1.5">${nameEn}</text>
        <!-- 裝飾細金線 -->
        <line x1="45" y1="354" x2="215" y2="354" stroke="#DFC07A" stroke-width="0.8"/>
        <!-- 核心關鍵詞 -->
        <text x="130" y="370" text-anchor="middle" font-family="'Noto Serif TC', serif" font-size="9" font-weight="700" fill="#715233">${keywords}</text>
      </g>
    </svg>`;
  }

  /**
   * 向下相容的 Ukiyo-e 藝術渲染函數 (如塔羅或其他模組呼叫時可用)
   */
  function renderUkiyoeArt(card, system) {
    if (system === 'lenormand') {
      return renderLenormandCardFace(card);
    }
    const title = String(card.name || '神諭牌');
    const seed = [...title].reduce((sum, char) => sum + char.codePointAt(0), 17);
    const hue = seed % 2 ? '#173a5e' : '#294d42';
    return `<svg viewBox="0 0 264 370" class="ukiyoe-art"><rect width="264" height="370" fill="${hue}"/><text x="132" y="185" text-anchor="middle" fill="#fff" font-size="14">${xmlEscape(title)}</text></svg>`;
  }

  global.MeetJoyDivination = {
    TAROT_CARDS,
    LENORMAND_CARDS,
    renderLenormandCardFace,
    renderUkiyoeArt
  };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
"""

render_code = js_code_template.replace("__CARDS_JSON__", cards_json_str).replace("__ARTS_JSON__", arts_json_str)

full_output = tarot_part + render_code

with open(SRC_JS, "w", encoding="utf-8") as f:
    f.write(full_output)

print(f"Successfully reconstructed {SRC_JS} with {len(lenormand_cards_data)} Lenormand cards and renderLenormandCardFace!")
