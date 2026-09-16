/**
 * 癒見幸福 · 魔法占星學院
 * 紫微斗數全套 70 張牌卡資料庫 (主星 39 組 + 輔星 19 組 + 長生星 12 組)
 * 嚴格取材自桌面講義：《紫微占卜入門講義2022_final.pdf》與牌卡 logo 版
 * 100% 繁體中文（台灣）· Zero Attribution · 愛倫院長魔法魔藥師視角
 */

(function (global) {
  'use strict';

  const ZIWEI_COMPLETE_CARDS = [
  {
    "id": "zm_01",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "紫微星",
    "english": "Star of Emperor",
    "nature": "單主星",
    "image": "./images/ziwei/A紫微.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "帝王之星，尊貴威儀。化氣為尊，注重名譽自尊，自帶領袖氣質，需要幕僚團隊朝拱。",
    "upright": "正牌呈現【紫微星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【紫微星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【紫微星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_02",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "紫微天府",
    "english": "Star of Imperial Governance",
    "nature": "雙主星",
    "image": "./images/ziwei/B紫微天府.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "皇帝與王爺同台，既要面子也要裡子。大格局、有企圖心，行事穩健但易有內在標準衝突。",
    "upright": "正牌呈現【紫微天府】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【紫微天府】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【紫微天府】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_03",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "紫微天相",
    "english": "Star of Sovereign Order",
    "nature": "雙主星",
    "image": "./images/ziwei/B紫微天相.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "具備宰相能力的皇帝。人際溝通協調力強，四平八穩中蘊含突破常規的大膽謀略。",
    "upright": "正牌呈現【紫微天相】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【紫微天相】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【紫微天相】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_04",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "紫微破軍",
    "english": "Star of Pioneering Emperor",
    "nature": "雙主星",
    "image": "./images/ziwei/B紫微破軍.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "親率大軍開疆闢土的帝王。勇於追求夢想，破壞中建立新秩序，執行力與冒險心兼備。",
    "upright": "正牌呈現【紫微破軍】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【紫微破軍】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【紫微破軍】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_05",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "紫微七殺",
    "english": "Star of Imperial Authority",
    "nature": "雙主星",
    "image": "./images/ziwei/B紫微七殺.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "自帶殺伐魄力的皇帝。大權在握，行事果斷務實，不拘小節，敢打硬仗開創大版圖。",
    "upright": "正牌呈現【紫微七殺】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【紫微七殺】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【紫微七殺】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_06",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "紫微貪狼",
    "english": "Star of Living Emperor",
    "nature": "雙主星",
    "image": "./images/ziwei/B紫微貪狼.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "盡情探索生命熱情的樂活皇帝。才藝廣泛、人際魅力滿點，具備物質與心靈多重探索欲。",
    "upright": "正牌呈現【紫微貪狼】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【紫微貪狼】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【紫微貪狼】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_07",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天府星",
    "english": "Star of Lord",
    "nature": "單主星",
    "image": "./images/ziwei/A天府.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "偏安邊疆的實力派王爺。守成第一、掌管財庫與實權，重視務實收益與穩定生活品質。",
    "upright": "正牌呈現【天府星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天府星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天府星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_08",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天相星",
    "english": "Star of Minister",
    "nature": "單主星",
    "image": "./images/ziwei/A天相.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "熱心謹慎的宰相掌印官。遵守規則、長於協調溝通，重視承諾與人情面子，外表體面溫和。",
    "upright": "正牌呈現【天相星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天相星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天相星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_09",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天梁星",
    "english": "Star of Blessing",
    "nature": "單主星",
    "image": "./images/ziwei/A天梁.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "受人尊敬的老者與庇蔭長輩。逢凶化吉、原則分明、熱心助人，喜好照顧他人與傳承智慧。",
    "upright": "正牌呈現【天梁星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天梁星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天梁星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_10",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "七殺星",
    "english": "Star of Persistence",
    "nature": "單主星",
    "image": "./images/ziwei/A七殺.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "衝鋒陷陣的孤勇將軍。堅忍耐勞、獨立果決，不畏艱難，憑藉實力打出一片江山。",
    "upright": "正牌呈現【七殺星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【七殺星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【七殺星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_11",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "破軍星",
    "english": "Star of Pioneer",
    "nature": "單主星",
    "image": "./images/ziwei/A破軍.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "打破框架的創新開拓者。敢愛敢恨、追求夢想不惜推倒重來，生命充滿轉折與無限生機。",
    "upright": "正牌呈現【破軍星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【破軍星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【破軍星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_12",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "貪狼星",
    "english": "Star of Desire",
    "nature": "單主星",
    "image": "./images/ziwei/A貪狼.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "多才多藝的慾望桃花之星。好奇心強烈、適應力極佳，善於交際與捕捉時代流行浪潮。",
    "upright": "正牌呈現【貪狼星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【貪狼星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【貪狼星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_13",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "巨門星",
    "english": "Star of Mouth",
    "nature": "單主星",
    "image": "./images/ziwei/A巨門.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "明察秋毫的觀察辯才之星。化氣為暗，擅長深入研究、細節分析與溝通表達，心細敏感。",
    "upright": "正牌呈現【巨門星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【巨門星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【巨門星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_14",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "太陽星",
    "english": "Star of Sun",
    "nature": "單主星",
    "image": "./images/ziwei/A太陽.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "照耀萬物的溫暖明燈。熱情坦蕩、博愛公正、樂於奉獻，重視社會地位與光明磊落。",
    "upright": "正牌呈現【太陽星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【太陽星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【太陽星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_15",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "太陽天梁",
    "english": "Star of Solar Blessing",
    "nature": "雙主星",
    "image": "./images/ziwei/B太陽天梁.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "名望與慈悲的陽光長老。熱心公益、重視原則正義，具備極佳的學術研究與傳承威望。",
    "upright": "正牌呈現【太陽天梁】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【太陽天梁】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【太陽天梁】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_16",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "太陽太陰",
    "english": "Star of Solar Moon",
    "nature": "雙主星",
    "image": "./images/ziwei/B太陽太陰.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "日月同輝，陰陽合一。外在熱情大方，內在細膩敏感，善於在感性與理性間尋找平衡。",
    "upright": "正牌呈現【太陽太陰】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【太陽太陰】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【太陽太陰】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_17",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "太陰星",
    "english": "The Moon",
    "nature": "單主星",
    "image": "./images/ziwei/A太陰.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "溫柔如水的明月之母。心思細密、富有藝術美感，重視家庭安適與財務儲蓄累積。",
    "upright": "正牌呈現【太陰星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【太陰星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【太陰星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_18",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "太陰天同",
    "english": "Star of Gentle Moon",
    "nature": "雙主星",
    "image": "./images/ziwei/B太陰天同.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "天真浪漫的月下精靈。溫和純良、愛好和平、享受生活情趣，人際人緣極佳。",
    "upright": "正牌呈現【太陰天同】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【太陰天同】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【太陰天同】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_19",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天同星",
    "english": "Star of Innocence",
    "nature": "單主星",
    "image": "./images/ziwei/A天同.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "福氣滿滿的天真赤子。不爭是爭、樂天知命，注重生活舒適度與精神愉悅感。",
    "upright": "正牌呈現【天同星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天同星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天同星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_20",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天同巨門",
    "english": "Star of Sensitive Voice",
    "nature": "雙主星",
    "image": "./images/ziwei/B天同巨門.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "內心豐富敏感的感受者。心思纖細，善於表達內心情感，對人情冷暖有深刻體會。",
    "upright": "正牌呈現【天同巨門】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天同巨門】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天同巨門】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_21",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天同天梁",
    "english": "Star of Peaceful Blessing",
    "nature": "雙主星",
    "image": "./images/ziwei/B天同天梁.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "福星遇蔭星，逢凶化吉的吉祥組合。待人隨和慈祥，心態寬闊，老少咸宜。",
    "upright": "正牌呈現【天同天梁】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天同天梁】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天同天梁】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_22",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天機星",
    "english": "Star of Calculating",
    "nature": "單主星",
    "image": "./images/ziwei/A天機.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "運籌帷幄的神機軍師。思維敏捷、機智善謀、反應極快，善於策劃與隨機應變。",
    "upright": "正牌呈現【天機星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天機星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天機星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_23",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天機巨門",
    "english": "Star of Analytical Mind",
    "nature": "雙主星",
    "image": "./images/ziwei/A天機巨門.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "邏輯縝密的研究分析大師。口才便給、洞察敏銳，善於發現破綻與策劃精密方案。",
    "upright": "正牌呈現【天機巨門】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天機巨門】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天機巨門】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_24",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天機天梁",
    "english": "Star of Wise Strategist",
    "nature": "雙主星",
    "image": "./images/ziwei/B天機天梁.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "老謀深算的智慧謀士。兼具軍師的策劃與長者的遠見，善於謀定而後動。",
    "upright": "正牌呈現【天機天梁】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天機天梁】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天機天梁】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_25",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "天機太陰",
    "english": "Star of Fluid Intelligence",
    "nature": "雙主星",
    "image": "./images/ziwei/A天機太陰.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "細膩靈動的心智策士。直覺敏銳、長於企劃文書，善解人意且辦事體貼妥帖。",
    "upright": "正牌呈現【天機太陰】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【天機太陰】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【天機太陰】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_26",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "武曲星",
    "english": "Star of Finance",
    "nature": "單主星",
    "image": "./images/ziwei/A武曲.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "務實剛毅的財帛武將。求真務實、重信用守原則，執行力強，為正財與實幹之主。",
    "upright": "正牌呈現【武曲星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【武曲星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【武曲星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_27",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "武曲天府",
    "english": "Star of Golden Vault",
    "nature": "雙主星",
    "image": "./images/ziwei/B武曲天府.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "雙財星匯聚，金庫滿載。善於理財規劃、投資穩健，為富貴兼備的大格局組合。",
    "upright": "正牌呈現【武曲天府】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【武曲天府】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【武曲天府】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_28",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "武曲天相",
    "english": "Star of Structured Wealth",
    "nature": "雙主星",
    "image": "./images/ziwei/B武曲天相.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "講求規則與信義的實業家。行事嚴謹、重視商譽與人際契約，財務規劃條理分明。",
    "upright": "正牌呈現【武曲天相】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【武曲天相】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【武曲天相】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_29",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "武曲破軍",
    "english": "Star of Daring Enterprise",
    "nature": "雙主星",
    "image": "./images/ziwei/B武曲破軍.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "大刀闊斧的投資冒險家。敢於投入大資金開創新項目，大開大闔，富於開拓精神。",
    "upright": "正牌呈現【武曲破軍】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【武曲破軍】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【武曲破軍】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_30",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "武曲七殺",
    "english": "Star of Iron Will",
    "nature": "雙主星",
    "image": "./images/ziwei/B武曲七殺.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "鋼鐵意志的實幹先鋒。行事幹練俐落、果斷不拖沓，靠雙手開拓事業新天地。",
    "upright": "正牌呈現【武曲七殺】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【武曲七殺】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【武曲七殺】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_31",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "武曲貪狼",
    "english": "Star of Late Bloom",
    "nature": "雙主星",
    "image": "./images/ziwei/B武曲貪狼.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "先苦後甜的商界梟雄。兼具武曲之剛與貪狼之活，歷經磨練後在中晚年大放異彩。",
    "upright": "正牌呈現【武曲貪狼】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【武曲貪狼】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【武曲貪狼】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_32",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "廉貞星",
    "english": "Star of Confinement",
    "nature": "單主星",
    "image": "./images/ziwei/A廉貞.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "傲骨崢嶸的秩序公關之星。重原則自律，兼具次桃花魅力，聰明好勝、是非分明。",
    "upright": "正牌呈現【廉貞星】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【廉貞星】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【廉貞星】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_33",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "廉貞天府",
    "english": "Star of Aristocratic Power",
    "nature": "雙主星",
    "image": "./images/ziwei/B廉貞天府.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "豪爽務實的貴族領袖。理性而有謀略，注重實質收益與尊嚴，靠實力成就大業。",
    "upright": "正牌呈現【廉貞天府】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【廉貞天府】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【廉貞天府】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_34",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "廉貞天相",
    "english": "Star of Elegant Order",
    "nature": "雙主星",
    "image": "./images/ziwei/B廉貞天相.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "風度翩翩的外交官宰相。行事有條不紊、人脈經營出色，重視形象與道德準則。",
    "upright": "正牌呈現【廉貞天相】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【廉貞天相】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【廉貞天相】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_35",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "廉貞破軍",
    "english": "Star of Radical Reform",
    "nature": "雙主星",
    "image": "./images/ziwei/B廉偵破軍.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "勇於自我革命的破局者。打破傳統束縛，大膽創新突破，具備震撼人心的創造力。",
    "upright": "正牌呈現【廉貞破軍】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【廉貞破軍】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【廉貞破軍】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_36",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "廉貞七殺",
    "english": "Star of Resolute Warrior",
    "nature": "雙主星",
    "image": "./images/ziwei/B廉貞七殺.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "鐵骨錚錚的鐵甲戰士。性格堅定如鐵，不畏強權與逆境，在壓力下更能展現英姿。",
    "upright": "正牌呈現【廉貞七殺】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【廉貞七殺】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【廉貞七殺】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_37",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "廉貞貪狼",
    "english": "Star of Charismatic Vision",
    "nature": "雙主星",
    "image": "./images/ziwei/B廉貞貪狼.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "人緣與心靈追求兼備的魅力之星。才華洋溢、重精神生活與宗教哲思，極具感染力。",
    "upright": "正牌呈現【廉貞貪狼】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【廉貞貪狼】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【廉貞貪狼】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "zm_39",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "巨門太陽",
    "english": "Star of Verbal Radiance",
    "nature": "雙主星",
    "image": "./images/ziwei/B巨門太陽.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "陽光驅散迷霧的明燈。太陽的熱情坦蕩化解了巨門的暗曜多疑，長於演說傳播、溝通協調，聲名遠播。",
    "upright": "正牌【巨門太陽】代表說服力極強，熱情誠懇，能以清晰生動的言論啟發他人，迎來光明機遇。",
    "reversed": "倒牌【巨門太陽】提醒避免口無遮攔或得理不饒人，說話宜留三分餘地，防範口舌是非。",
    "keywords": {
      "upright": [
        "辯才無礙",
        "熱情正直",
        "聲名顯赫",
        "具說服力",
        "驅散陰霾"
      ],
      "reversed": [
        "口舌爭端",
        "操心過度",
        "言多必失",
        "需多傾聽"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "坦蕩熱情、口才出眾、富正義感",
        "reversed": "直言快語易得罪人、內心多慮"
      },
      "career": {
        "upright": "適合傳播、教學、公關與法務，發揮影響力",
        "reversed": "職場防小人挑撥，行事需留白紙黑字"
      },
      "love": {
        "upright": "熱情坦白、樂於分享生活瑣事",
        "reversed": "因口角起爭執、過於說教"
      },
      "wealth": {
        "upright": "靠口才與專業名望進財，財源順暢",
        "reversed": "因人情或是非破耗，避免爭議投資"
      },
      "luck": {
        "upright": "如旭日初升，前途光明",
        "reversed": "烏雲蔽日，宜沉穩修口德"
      }
    },
    "potion": "佛手柑精油 + 藍紋瑪瑙，梳理喉輪能量，帶來清亮明澈的溝通智慧。"
  },
  {
    "id": "zm_38",
    "group": "major",
    "groupLabel": "主星牌",
    "name": "空宮牌",
    "english": "Void / Emptiness",
    "nature": "變化主星",
    "image": "./images/ziwei/A空宮.jpg",
    "backImage": "./images/ziwei/牌背-主星.jpg",
    "description": "靈性虛空，借力使力。無主星束縛，彈性極大，順應外界環境映射出無限可能。",
    "upright": "正牌呈現【空宮牌】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。",
    "reversed": "倒牌提示【空宮牌】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。",
    "keywords": {
      "upright": [
        "企圖心強",
        "有能力",
        "大格局",
        "得貴人助",
        "穩健前行"
      ],
      "reversed": [
        "力不從心",
        "缺乏幫手",
        "焦躁固執",
        "受人牽制",
        "需調頻休整"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "聰明、自信、有格局",
        "reversed": "心浮氣躁、容易自命不凡"
      },
      "career": {
        "upright": "事業穩健、領導力出眾、有團隊助力",
        "reversed": "孤軍奮戰、受外在雜音干擾"
      },
      "love": {
        "upright": "重視共鳴、互相尊寵、關係體面和睦",
        "reversed": "要求過高、缺乏溝通耐心"
      },
      "wealth": {
        "upright": "理財有方、格局宏大、投資有遠見",
        "reversed": "排場開銷大、投資需防衝動"
      },
      "luck": {
        "upright": "運勢高昂、聲名顯赫",
        "reversed": "表面風光、實則需補強底層細節"
      }
    },
    "potion": "雪松精油 + 黃水晶，穩定【空宮牌】核心領導磁場，吸引大氣盟友。"
  },
  {
    "id": "za_01",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "紅鸞天喜",
    "english": "Marriage Festivity",
    "nature": "吉星",
    "image": "./images/ziwei/C鸞喜.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "姻緣與添丁之吉慶星。人緣桃花、喜事臨門，為人帶來柔和親切的喜氣場。",
    "upright": "正牌【紅鸞天喜】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【紅鸞天喜】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【紅鸞天喜】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_02",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "左輔",
    "english": "Left Aide",
    "nature": "吉星",
    "image": "./images/ziwei/C左輔.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "得力堅實的左翼盟友。同舟共濟、患難與共，提供顯著而直接的實質支撐。",
    "upright": "正牌【左輔】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【左輔】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【左輔】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_03",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "右弼",
    "english": "Right Aide",
    "nature": "吉星",
    "image": "./images/ziwei/C右弼.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "溫和細緻的右翼幕僚。如沐春風、暗中促成，以柔和間接的智慧化解難關。",
    "upright": "正牌【右弼】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【右弼】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【右弼】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_04",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "文昌",
    "english": "Intellect Star",
    "nature": "吉星",
    "image": "./images/ziwei/C文昌.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "筆走龍蛇的理智才學之星。思緒清晰、條理分明，利於考運、文憑與合約契約。",
    "upright": "正牌【文昌】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【文昌】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【文昌】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_05",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "文曲",
    "english": "Intelligence Star",
    "nature": "吉星",
    "image": "./images/ziwei/C文曲.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "巧思湧動的藝術靈感之星。口才生動、多才多藝，散發浪漫與生活情趣。",
    "upright": "正牌【文曲】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【文曲】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【文曲】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_06",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "天魁",
    "english": "Male Helper",
    "nature": "吉星",
    "image": "./images/ziwei/C天魁.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "檯面上的男性陽貴人。長者提攜、明面庇佑，在關鍵時刻伸出有力的援手。",
    "upright": "正牌【天魁】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【天魁】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【天魁】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_07",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "天鉞",
    "english": "Female Helper",
    "nature": "吉星",
    "image": "./images/ziwei/C天鉞.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "檯面下的女性陰貴人。細心呵護、暗中周全，提供溫暖體貼的滋養與指引。",
    "upright": "正牌【天鉞】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【天鉞】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【天鉞】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_08",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "擎羊",
    "english": "Dagger Star",
    "nature": "煞星",
    "image": "./images/ziwei/C擎羊.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "出鞘的大刀，魄力與衝勁。行事果決快速、敢於破局，但需注意摩擦與意外衝突。",
    "upright": "正牌【擎羊】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【擎羊】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【擎羊】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_09",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "陀羅",
    "english": "Star of Thoughts",
    "nature": "煞星",
    "image": "./images/ziwei/C陀螺.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "深謀遠慮的思索旋渦。執著堅持、耐性過人，但需防過度糾結、蹉跎時機。",
    "upright": "正牌【陀羅】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【陀羅】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【陀羅】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_10",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "鈴星",
    "english": "Wily Star",
    "nature": "煞星",
    "image": "./images/ziwei/C鈴星.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "精密運轉的暗夜齒輪。隱忍冷靜、計算深遠，待時機成熟時爆發驚人實力。",
    "upright": "正牌【鈴星】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【鈴星】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【鈴星】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_11",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "火星",
    "english": "Fiery Star",
    "nature": "煞星",
    "image": "./images/ziwei/C火星.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "燃燒激昂的烈火戰魂。爆發力極強、雷厲風行，但情緒急躁、耐性不足。",
    "upright": "正牌【火星】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【火星】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【火星】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_12",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "天刑",
    "english": "Punishment",
    "nature": "煞星",
    "image": "./images/ziwei/C天刑.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "自律森嚴的司法鐵尺。克己自律、原則強硬，代表規矩、法律與身心修行。",
    "upright": "正牌【天刑】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【天刑】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【天刑】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_13",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "祿存",
    "english": "Flow",
    "nature": "吉星",
    "image": "./images/ziwei/C祿存.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "天降福祿的聚寶盆。財庫充實、福氣綿長，為生活帶來豐沛厚實的資糧守護。",
    "upright": "正牌【祿存】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【祿存】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【祿存】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_14",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "陰煞",
    "english": "Skulker",
    "nature": "煞星",
    "image": "./images/ziwei/C陰煞.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "潛伏陰影的業力考驗。暗中生疑、小人潛伏，提醒保持光明心念與覺察防禦。",
    "upright": "正牌【陰煞】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【陰煞】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【陰煞】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_15",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "地空地劫",
    "english": "Damage",
    "nature": "煞星",
    "image": "./images/ziwei/C空劫.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "打破執著的虛空破局。物質得失轉眼雲煙，促使心靈跳脫框架，追求形而上智慧。",
    "upright": "正牌【地空地劫】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【地空地劫】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【地空地劫】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_16",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "化祿",
    "english": "Flow Enhancer",
    "nature": "四化星",
    "image": "./images/ziwei/C化祿.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "緣分與財氣的放大催化劑。心情愉悅、機會湧現、人緣暢旺，帶來豐盛好運。",
    "upright": "正牌【化祿】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【化祿】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【化祿】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_17",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "化權",
    "english": "Power Enhancer",
    "nature": "四化星",
    "image": "./images/ziwei/C化權.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "權力與掌控的魄力升級。競爭勝出、掌握大局、自信倍增，提升執行掌舵力。",
    "upright": "正牌【化權】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【化權】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【化權】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_18",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "化科",
    "english": "Fame Enhancer",
    "nature": "四化星",
    "image": "./images/ziwei/C化科.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "名望與聲譽的光芒榮耀。文筆出眾、貴人化解災厄、受人肯定，建立美名。",
    "upright": "正牌【化科】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【化科】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【化科】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "za_19",
    "group": "assistant",
    "groupLabel": "輔星牌",
    "name": "化忌",
    "english": "Devoid Enhancer",
    "nature": "四化星",
    "image": "./images/ziwei/C化忌.jpg",
    "backImage": "./images/ziwei/牌背-輔星.jpg",
    "description": "執念與虧欠的靈魂修行點。情緒糾結、責任加身，提醒學會放下、修補生命短板。",
    "upright": "正牌【化忌】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。",
    "reversed": "倒牌【化忌】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。",
    "keywords": {
      "upright": [
        "助緣顯現",
        "催化變革",
        "突破常規",
        "機遇來臨"
      ],
      "reversed": [
        "溝通摩擦",
        "阻礙磨耗",
        "需謹言慎行",
        "防範小人"
      ]
    },
    "dimensions": {
      "personality": {
        "upright": "熱心活絡、反應敏銳",
        "reversed": "糾結執著、耐性不足"
      },
      "career": {
        "upright": "得外部奧援、破局推進",
        "reversed": "事務拖延、需防合約爭議"
      },
      "love": {
        "upright": "情意流動、熱情升溫",
        "reversed": "猜疑誤解、情緒起伏大"
      },
      "wealth": {
        "upright": "財路活水、進帳順利",
        "reversed": "突發開支、避免投機風險"
      },
      "luck": {
        "upright": "逢凶化吉、順水推舟",
        "reversed": "暗潮洶湧、靜心守成為上"
      }
    },
    "potion": "真正薰衣草精油 + 黑曜石，淨化【化忌】外在干擾，穩固心靈護盾。"
  },
  {
    "id": "zl_01",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "長生",
    "english": "Newborn",
    "nature": "長生運勢",
    "number": 1,
    "image": "./images/ziwei/D1長生.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "生命的誕生活力。一切初始、萬象更新，代表新的緣分、喜事與生機盎然。",
    "upright": "正牌【長生】運勢處於自然順流期，氣數相應，時間數值為 1（可代表 1 天、1 週或 1 個月內顯現成果）。",
    "reversed": "倒牌【長生】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 1 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 1",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「1」（天／週／月），當前處於【長生】生命週期階段。",
      "energy": "氣數旺衰等級：1 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【長生】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_02",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "沐浴",
    "english": "Bath",
    "nature": "長生運勢",
    "number": 2,
    "image": "./images/ziwei/D2沐浴.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "洗滌身心的純真與脆弱。充滿好奇、桃花初顯，代表轉變期中的調適與摸索。",
    "upright": "正牌【沐浴】運勢處於自然順流期，氣數相應，時間數值為 2（可代表 2 天、2 週或 2 個月內顯現成果）。",
    "reversed": "倒牌【沐浴】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 2 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 2",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「2」（天／週／月），當前處於【沐浴】生命週期階段。",
      "energy": "氣數旺衰等級：2 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【沐浴】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_03",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "冠帶",
    "english": "Adulthood",
    "nature": "長生運勢",
    "number": 3,
    "image": "./images/ziwei/D3冠帶.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "戴上成年的冠冕。學有所成、蓄勢待發，邁向成熟擔當的人生上升期。",
    "upright": "正牌【冠帶】運勢處於自然順流期，氣數相應，時間數值為 3（可代表 3 天、3 週或 3 個月內顯現成果）。",
    "reversed": "倒牌【冠帶】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 3 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 3",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「3」（天／週／月），當前處於【冠帶】生命週期階段。",
      "energy": "氣數旺衰等級：3 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【冠帶】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_04",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "臨官",
    "english": "Duty",
    "nature": "長生運勢",
    "number": 4,
    "image": "./images/ziwei/D4臨官.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "走向職場就職任官。獨立自強、發揮才能，展現專業威望與實幹作為。",
    "upright": "正牌【臨官】運勢處於自然順流期，氣數相應，時間數值為 4（可代表 4 天、4 週或 4 個月內顯現成果）。",
    "reversed": "倒牌【臨官】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 4 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 4",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「4」（天／週／月），當前處於【臨官】生命週期階段。",
      "energy": "氣數旺衰等級：4 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【臨官】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_05",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "帝旺",
    "english": "Summit",
    "nature": "長生運勢",
    "number": 5,
    "image": "./images/ziwei/D5帝旺.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "能量達到巔峰極致。氣勢磅礴、無堅不摧，但需防過剛易折，盛極思動。",
    "upright": "正牌【帝旺】運勢處於自然順流期，氣數相應，時間數值為 5（可代表 5 天、5 週或 5 個月內顯現成果）。",
    "reversed": "倒牌【帝旺】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 5 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 5",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「5」（天／週／月），當前處於【帝旺】生命週期階段。",
      "energy": "氣數旺衰等級：5 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【帝旺】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_06",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "衰",
    "english": "Decline",
    "nature": "長生運勢",
    "number": 6,
    "image": "./images/ziwei/D6衰.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "頂峰之後的退潮沉澱。氣力漸收、守成為主，宜休養生息、轉化內在智慧。",
    "upright": "正牌【衰】運勢處於自然順流期，氣數相應，時間數值為 6（可代表 6 天、6 週或 6 個月內顯現成果）。",
    "reversed": "倒牌【衰】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 6 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 6",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「6」（天／週／月），當前處於【衰】生命週期階段。",
      "energy": "氣數旺衰等級：6 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【衰】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_07",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "病",
    "english": "Illness",
    "nature": "長生運勢",
    "number": 7,
    "image": "./images/ziwei/D7病.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "能量失調的預警微光。身心疲憊、警訊亮起，提醒暫停腳步進行深度排毒保養。",
    "upright": "正牌【病】運勢處於自然順流期，氣數相應，時間數值為 7（可代表 7 天、7 週或 7 個月內顯現成果）。",
    "reversed": "倒牌【病】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 7 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 7",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「7」（天／週／月），當前處於【病】生命週期階段。",
      "energy": "氣數旺衰等級：7 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【病】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_08",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "死",
    "english": "Death",
    "nature": "長生運勢",
    "number": 8,
    "image": "./images/ziwei/D8死.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "循環告一段落的寂靜。徹底歸零、舊事已矣，為下一個生命週期的重啟蓄力。",
    "upright": "正牌【死】運勢處於自然順流期，氣數相應，時間數值為 8（可代表 8 天、8 週或 8 個月內顯現成果）。",
    "reversed": "倒牌【死】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 8 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 8",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「8」（天／週／月），當前處於【死】生命週期階段。",
      "energy": "氣數旺衰等級：8 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【死】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_09",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "墓",
    "english": "Tomb",
    "nature": "長生運勢",
    "number": 9,
    "image": "./images/ziwei/D9墓.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "收納入庫的聚斂深藏。守舊保全、低調內斂，注重積蓄力量與穩固防線。",
    "upright": "正牌【墓】運勢處於自然順流期，氣數相應，時間數值為 9（可代表 9 天、9 週或 9 個月內顯現成果）。",
    "reversed": "倒牌【墓】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 9 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 9",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「9」（天／週／月），當前處於【墓】生命週期階段。",
      "energy": "氣數旺衰等級：9 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【墓】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_10",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "絕",
    "english": "Extinct",
    "nature": "長生運勢",
    "number": 10,
    "image": "./images/ziwei/D10絕.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "絕處逢生的神秘奇異點。徹底斷絕舊緣、真空妙有，醞釀顛覆性的破局重生。",
    "upright": "正牌【絕】運勢處於自然順流期，氣數相應，時間數值為 10（可代表 10 天、10 週或 10 個月內顯現成果）。",
    "reversed": "倒牌【絕】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 10 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 10",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「10」（天／週／月），當前處於【絕】生命週期階段。",
      "energy": "氣數旺衰等級：10 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【絕】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_11",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "胎",
    "english": "Fertilize",
    "nature": "長生運勢",
    "number": 11,
    "image": "./images/ziwei/D11胎.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "母胎孕育的萌芽靈感。新種子悄然著床，希望的微光在黑暗中悄悄滋長。",
    "upright": "正牌【胎】運勢處於自然順流期，氣數相應，時間數值為 11（可代表 11 天、11 週或 11 個月內顯現成果）。",
    "reversed": "倒牌【胎】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 11 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 11",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「11」（天／週／月），當前處於【胎】生命週期階段。",
      "energy": "氣數旺衰等級：11 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【胎】生命節律，喚醒身心生命力。"
  },
  {
    "id": "zl_12",
    "group": "life",
    "groupLabel": "長生星牌",
    "name": "養",
    "english": "Nourish",
    "nature": "長生運勢",
    "number": 12,
    "image": "./images/ziwei/D12養.jpg",
    "backImage": "./images/ziwei/牌背-長生.jpg",
    "description": "溫柔滋養的蓄勢階段。受人照料、修復身心，等待瓜熟蒂落破殼而出。",
    "upright": "正牌【養】運勢處於自然順流期，氣數相應，時間數值為 12（可代表 12 天、12 週或 12 個月內顯現成果）。",
    "reversed": "倒牌【養】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 12 個週期前後。",
    "keywords": {
      "upright": [
        "氣數逢 12",
        "順應週期",
        "生機萌動",
        "水到渠成"
      ],
      "reversed": [
        "逆勢沉潛",
        "蓄力轉機",
        "自我調整",
        "等待時機"
      ]
    },
    "dimensions": {
      "timing": "時間指標為「12」（天／週／月），當前處於【養】生命週期階段。",
      "energy": "氣數旺衰等級：12 / 12，提示應隨時局變化而靈活調整步調。"
    },
    "potion": "甜橙精油 + 白水晶，調頻【養】生命節律，喚醒身心生命力。"
  }
];

  global.MeetJoyZiweiCards = {
    cards: ZIWEI_COMPLETE_CARDS,
    getGroup(group) {
      return ZIWEI_COMPLETE_CARDS.filter(c => c.group === group);
    },
    getById(id) {
      return ZIWEI_COMPLETE_CARDS.find(c => c.id === id);
    },
    getByName(name) {
      return ZIWEI_COMPLETE_CARDS.find(c => c.name === name || c.name.replace('星', '') === name.replace('星', ''));
    }
  };

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
