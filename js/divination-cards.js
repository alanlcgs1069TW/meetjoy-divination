/**
 * 癒見幸福 · 魔法占星學院
 * 線上占卜大典卡牌全庫 (Divination Cards Complete Database)
 * 包含：經典偉特塔羅 78 張 (大阿卡納 22 + 小阿卡納 56)、雷諾曼 36 張
 * 全卡牌注入【江戶浮世繪木版畫 (Ukiyo-e)】美學意象與愛倫院長生活魔藥處方
 * 100% 繁體中文（台灣）· Zero Attribution
 */

(function (global) {
  'use strict';

  const TAROT_CARDS = [
  {
    "id": "t_00",
    "name": "0. 愚者 (The Fool)",
    "ukiyoName": "浮世浪人",
    "element": "風",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "雲遊四海的浪人行者，站在富士絕頂崖邊，心懷純真信任，邁向未知江湖。",
    "reversed": "輕率魯莽、恐懼未知、缺乏防備。提醒暫停狂奔，審視足下深淵。",
    "potion": "迷迭香精油 + 白水晶，賦予清澈無畏的赤子勇氣。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【浮世浪人】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_01",
    "name": "I. 魔術師 (The Magician)",
    "ukiyoName": "陰陽術師",
    "element": "風",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "江戶天才陰陽咒術師，桌上陳列劍鏡符印，天地要素齊備，化虛為實的顯化之神。",
    "reversed": "賣弄幻術、注意力渙散、承諾空泛。提醒回歸真實本質，莫以巧言自欺。",
    "potion": "薄荷精油 + 黃水晶，聚精會神，打開顯化神諭之門。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【陰陽術師】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_02",
    "name": "II. 女祭司 (The High Priestess)",
    "ukiyoName": "御神水巫",
    "element": "水",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "深居神社幽境的巫女，手持古卷靜默觀照，直覺如古井深潭般清澈澄明。",
    "reversed": "情緒鬱結、直覺蔽塞、孤立冷漠。提醒打開心扉，接納感性潮汐的湧動。",
    "potion": "真正薰衣草精油 + 月光石，沉靜心靈微瀾，連結潛意識智慧。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【御神水巫】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_03",
    "name": "III. 皇后 (The Empress)",
    "ukiyoName": "豐饒之姬",
    "element": "土",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "盛裝端坐於櫻花林下的貴族姬樣，萬物萌發生機，母性慈愛與感官豐盛。",
    "reversed": "過度溺愛、自我耗竭、創造力停滯。提醒劃定心靈邊界，先滋養自我。",
    "potion": "大馬士革玫瑰精油 + 粉晶，喚醒深層自愛與大地豐盛共振。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【豐饒之姬】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_04",
    "name": "IV. 皇帝 (The Emperor)",
    "ukiyoName": "征夷將軍",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "端坐天守閣之征夷大將軍，威儀莊嚴、法令森嚴，以鐵腕秩序開拓太平盛世。",
    "reversed": "專斷剛愎、掌控焦慮、缺乏彈性。提醒放下過度戒心，學會信任同袍。",
    "potion": "雪松精油 + 紅瑪瑙，定錨核心中軸，展現沉穩王者魄力。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【征夷將軍】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_05",
    "name": "V. 教皇 (The Hierophant)",
    "ukiyoName": "高僧大師",
    "element": "土",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "古剎金堂內傳道解惑之高僧，承繼千年正法戒律，引領迷途靈魂尋得歸宿。",
    "reversed": "教條桎梏、墨守成規、迷信權威。勇敢質疑僵化教條，探尋自性之光。",
    "potion": "乳香精油 + 青金石，開啟靈性領悟，接引正向智者指引。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【高僧大師】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_06",
    "name": "VI. 戀人 (The Lovers)",
    "ukiyoName": "連理交杯",
    "element": "風",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "櫻花紛落下的合掌誓約，靈魂深處的和諧共振與神聖價值抉擇。",
    "reversed": "價值衝突、分歧猜疑、誘惑迷失。回歸本心核心標準，重拾真摯承諾。",
    "potion": "依蘭精油 + 紅紋石，點亮心輪溫暖，吸引同頻靈魂相遇。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【連理交杯】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_07",
    "name": "VII. 戰車 (The Chariot)",
    "ukiyoName": "甲冑武將",
    "element": "水",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "身披黑紅甲冑的先鋒大將，駕馭烈馬衝破敵陣，以堅定意志奪取勝局。",
    "reversed": "失控狂躁、橫衝直撞、後力不繼。收緊韁繩深呼吸，校正前進航道。",
    "potion": "黑胡椒精油 + 赤鐵礦，激發勇猛魄力，劈波斬浪克敵制勝。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【甲冑武將】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_08",
    "name": "VIII. 力量 (Strength)",
    "ukiyoName": "馴獅姬",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "素手撫摸狂暴神獸的柔弱姬君，以無邊慈悲融化暴戾，展現至高無上的溫柔韌性。",
    "reversed": "自我懷疑、暴躁失控、耐性告罄。溫和對待挫敗中的自己，以柔克剛。",
    "potion": "天竺葵精油 + 太陽石，平衡意志神經叢，點燃持久溫和的恆心。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【馴獅姬】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_09",
    "name": "IX. 隱士 (The Hermit)",
    "ukiyoName": "竹林幽客",
    "element": "土",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "提燈獨行於幽深雪夜的修道隱者，向內探尋本真自性，在孤獨中凝練真知。",
    "reversed": "孤芳自賞、逃避塵世、心門緊閉。適度向值得信任的知己分享靈魂微光。",
    "potion": "岩蘭草精油 + 黑曜石，深扎大地根基，在靜默中尋得定見。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【竹林幽客】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_10",
    "name": "X. 命運之輪 (Wheel of Fortune)",
    "ukiyoName": "浮世法輪",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "江戶海潮之上旋轉之命運水車，盛衰流轉，順應天地時序迎來撥雲見日。",
    "reversed": "抗拒無常、徒勞掙扎、故步自封。看透成敗循環本質，順水推舟乘勢而起。",
    "potion": "佛手柑精油 + 綠幽靈，轉動幸運齒輪，接納生命順流恩典。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【浮世法輪】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_11",
    "name": "XI. 正義 (Justice)",
    "ukiyoName": "明鏡法官",
    "element": "風",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "明鏡高懸之奉行所裁判長，手持天秤與寶劍，因果明察秋毫，客觀公正。",
    "reversed": "偏頗苛責、是非顛倒、推卸責任。放下主觀偏見，誠實面對自作自受之因果。",
    "potion": "尤加利精油 + 螢石，驅散雜念迷霧，維繫心靈天秤的和諧。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【明鏡法官】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_12",
    "name": "XII. 倒吊人 (The Hanged Man)",
    "ukiyoName": "松枝懸客",
    "element": "水",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "倒懸於千丈松枝上的求道行者，主動臣服反向視角，在靜止中參透天地玄機。",
    "reversed": "無謂犧牲、自憐抱怨、卡關抗拒。主動解開腳踝繩索，換個角度豁然開朗。",
    "potion": "絲柏精油 + 海藍寶，釋放緊繃執著，轉化生命困頓視角。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【松枝懸客】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_13",
    "name": "XIII. 死神 (Death)",
    "ukiyoName": "櫻吹雪",
    "element": "水",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "落櫻滿天下的送行死神，落葉歸根入土成泥，象徵徹底告別舊章、孕育新生。",
    "reversed": "緊抓不放、懼怕告別、苟延殘喘。勇敢對枯萎的過去道別，迎向朝霞曙光。",
    "potion": "沒藥精油 + 透石膏，淨化舊有沉重印記，迎接心靈鳳凰涅槃。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【櫻吹雪】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_14",
    "name": "XIV. 節制 (Temperance)",
    "ukiyoName": "茶道宗師",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "水火交融的茶道大師，提壺注水從容優雅，將極端衝突調和為無上甘露。",
    "reversed": "失衡失控、暴飲暴食、焦躁極端。暫停外在過度刺激，回歸自然調和節奏。",
    "potion": "羅馬洋甘菊精油 + 紫水晶，撫平激動波瀾，調和身心泉源。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【茶道宗師】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_15",
    "name": "XV. 惡魔 (The Devil)",
    "ukiyoName": "般若魅影",
    "element": "土",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "暗夜神社簷下的般若魅影，照見內心深處的貪婪執念與作繭自縛之虛妄鏈條。",
    "reversed": "擺脫誘惑、打破心魔、重獲自由。勇敢認清不再為你服務的執念，解鎖手銬。",
    "potion": "廣藿香精油 + 茶晶，淨化沉濁雜質，扎實保護個人能量場。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【般若魅影】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_16",
    "name": "XVI. 高塔 (The Tower)",
    "ukiyoName": "天雷天守",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "狂風暴雨中天雷擊裂金箔天守閣，幻象摧毀之時，正是真理重光奠基之日。",
    "reversed": "掩耳盜鈴、逃避破局、積弊難返。欣然接納震盪洗禮，在瓦礫堆中重建真我。",
    "potion": "茶樹精油 + 虎眼石，穩定驚魂未定的心神，在破局中重獲生機。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【天雷天守】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_17",
    "name": "XVII. 星星 (The Star)",
    "ukiyoName": "天河明珠",
    "element": "風",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "雨過天晴夜空下的七夕織女，手傾神露入清溪，星辰指路，心願正被宇宙應許。",
    "reversed": "希望幻滅、懷疑迷茫、灰心喪志。請相信北辰星宿永恆閃耀，耐心守候拂曉。",
    "potion": "橙花精油 + 天河石，喚醒心靈希望之泉，注入安詳寧靜。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【天河明珠】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_18",
    "name": "XVIII. 月亮 (The Moon)",
    "ukiyoName": "朧月夜",
    "element": "水",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "薄霧籠罩的古城池畔，朧月倒映水中，照見潛意識中的浮躁恐懼與暗湧波濤。",
    "reversed": "迷霧漸散、真相大白、恐懼消退。看清那些曾經嚇壞自己的幻象不過是微風剪影。",
    "potion": "快樂鼠尾草精油 + 拉長石，驅散心靈迷霧，穩固潛意識直覺。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【朧月夜】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_19",
    "name": "XIX. 太陽 (The Sun)",
    "ukiyoName": "天照初日",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "金光璀璨普照富士的神聖天照大神，光耀大地萬物復甦，生命力鼎盛歡慶勝利。",
    "reversed": "過度盲目、驕陽炙烤、精力耗盡。適度遮蔭調養生息，避免盛極而驕。",
    "potion": "甜橙精油 + 黃水晶，沐浴在金色暖陽中，綻放純粹自信喜悅。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【天照初日】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_20",
    "name": "XX. 審判 (Judgement)",
    "ukiyoName": "神輿天號",
    "element": "火",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "神鳴太鼓震天動地，喚醒沉睡靈魂，因果結算、第二人生重啟啟程之時。",
    "reversed": "自我苛責、猶豫拖延、錯失轉機。原諒過去無知的自己，放下法槌輕裝跨越。",
    "potion": "白千層精油 + 捷克隕石，震盪沉睡靈魂，開啟嶄新生命天命。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【神輿天號】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_21",
    "name": "XXI. 世界 (The World)",
    "ukiyoName": "萬象圓滿",
    "element": "土",
    "type": "major",
    "symbol": "🎴",
    "hanko": "浮世",
    "upright": "四靈守護天地調和的盛大江戶繪卷，階段性大功告成，四海大通，圓滿昇華。",
    "reversed": "功虧一簣、臨門一腳、拖延結案。集中精力完成最後一哩路，邁向更高螺旋。",
    "potion": "檀香精油 + 鈦晶，統合身心靈頻率，歡慶人生的盛大圓滿。",
    "ukiyoMotif": "江戶浮世繪大師木版畫筆觸，描繪【萬象圓滿】之和風神聖意象，金箔雲紋與波千鳥水紋相映。"
  },
  {
    "id": "t_22",
    "name": "權杖 (Wands) · 首 (Ace)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之首 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 首 (Ace)】：初始源泉、無限潛能、契機萌發。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 首 (Ace)】：開局猶豫、能量受阻、錯失良機。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_23",
    "name": "權杖 (Wands) · 二 (Two)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之二 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 二 (Two)】：平衡抉擇、夥伴合作、籌謀佈局。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 二 (Two)】：兩難矛盾、失衡衝突、猶豫不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_24",
    "name": "權杖 (Wands) · 三 (Three)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之三 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 三 (Three)】：初步成果、團隊協作、擴展遠景。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 三 (Three)】：基礎薄弱、溝通分歧、進展延誤。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_25",
    "name": "權杖 (Wands) · 四 (Four)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之四 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 四 (Four)】：穩固基石、安居守成、界線分明。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 四 (Four)】：固步自封、僵化防衛、停滯不前。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_26",
    "name": "權杖 (Wands) · 五 (Five)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之五 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 五 (Five)】：競爭挑戰、利益角逐、動盪考驗。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 五 (Five)】：內耗紛爭、疲憊退場、自我折損。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_27",
    "name": "權杖 (Wands) · 六 (Six)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之六 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 六 (Six)】：勝利榮耀、互惠分享、平順過渡。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 六 (Six)】：驕傲自滿、依賴成性、暫時受挫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_28",
    "name": "權杖 (Wands) · 七 (Seven)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之七 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 七 (Seven)】：堅持信念、評估抉擇、防禦守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 七 (Seven)】：焦慮懷疑、寡不敵眾、策略失靈。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_29",
    "name": "權杖 (Wands) · 八 (Eight)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之八 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 八 (Eight)】：迅速進展、專注修煉、脫離泥淖。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 八 (Eight)】：急躁冒進、耐心告罄、拖延不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_30",
    "name": "權杖 (Wands) · 九 (Nine)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之九 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 九 (Nine)】：豐盛在握、防線堅固、獨自守望。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 九 (Nine)】：過度防備、疲憊不堪、臨門退縮。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_31",
    "name": "權杖 (Wands) · 十 (Ten)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之十 ",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 十 (Ten)】：盛極大成、承擔重任、循環完結。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 十 (Ten)】：重擔壓垮、強弩之末、責任過荷。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_32",
    "name": "權杖 (Wands) · 侍從 (Page)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之侍從",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 侍從 (Page)】：好學求知、靈活信差、探索熱誠。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 侍從 (Page)】：幼稚任性、消息延遲、缺乏經驗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_33",
    "name": "權杖 (Wands) · 騎士 (Knight)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之騎士",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 騎士 (Knight)】：勇猛奔馳、果敢推進、全力出擊。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 騎士 (Knight)】：魯莽暴衝、耐力不足、方向偏頗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_34",
    "name": "權杖 (Wands) · 王后 (Queen)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之王后",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 王后 (Queen)】：內在滋養、成熟直覺、深層守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 王后 (Queen)】：情緒用事、過度控制、冷漠疏離。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_35",
    "name": "權杖 (Wands) · 國王 (King)",
    "ukiyoName": "和風浮世 · 武士刀與戰旗之國王",
    "element": "火",
    "type": "minor",
    "symbol": "🔥",
    "hanko": "和風",
    "upright": "正位展現【權杖 (Wands) · 國王 (King)】：掌舵掌控、成熟權威、格局顯化。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【權杖 (Wands) · 國王 (King)】：霸道專制、固執死板、威權壓迫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "虎眼石 + 黑胡椒精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_36",
    "name": "聖杯 (Cups) · 首 (Ace)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之首 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 首 (Ace)】：初始源泉、無限潛能、契機萌發。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 首 (Ace)】：開局猶豫、能量受阻、錯失良機。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_37",
    "name": "聖杯 (Cups) · 二 (Two)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之二 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 二 (Two)】：平衡抉擇、夥伴合作、籌謀佈局。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 二 (Two)】：兩難矛盾、失衡衝突、猶豫不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_38",
    "name": "聖杯 (Cups) · 三 (Three)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之三 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 三 (Three)】：初步成果、團隊協作、擴展遠景。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 三 (Three)】：基礎薄弱、溝通分歧、進展延誤。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_39",
    "name": "聖杯 (Cups) · 四 (Four)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之四 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 四 (Four)】：穩固基石、安居守成、界線分明。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 四 (Four)】：固步自封、僵化防衛、停滯不前。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_40",
    "name": "聖杯 (Cups) · 五 (Five)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之五 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 五 (Five)】：競爭挑戰、利益角逐、動盪考驗。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 五 (Five)】：內耗紛爭、疲憊退場、自我折損。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_41",
    "name": "聖杯 (Cups) · 六 (Six)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之六 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 六 (Six)】：勝利榮耀、互惠分享、平順過渡。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 六 (Six)】：驕傲自滿、依賴成性、暫時受挫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_42",
    "name": "聖杯 (Cups) · 七 (Seven)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之七 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 七 (Seven)】：堅持信念、評估抉擇、防禦守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 七 (Seven)】：焦慮懷疑、寡不敵眾、策略失靈。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_43",
    "name": "聖杯 (Cups) · 八 (Eight)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之八 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 八 (Eight)】：迅速進展、專注修煉、脫離泥淖。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 八 (Eight)】：急躁冒進、耐心告罄、拖延不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_44",
    "name": "聖杯 (Cups) · 九 (Nine)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之九 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 九 (Nine)】：豐盛在握、防線堅固、獨自守望。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 九 (Nine)】：過度防備、疲憊不堪、臨門退縮。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_45",
    "name": "聖杯 (Cups) · 十 (Ten)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之十 ",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 十 (Ten)】：盛極大成、承擔重任、循環完結。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 十 (Ten)】：重擔壓垮、強弩之末、責任過荷。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_46",
    "name": "聖杯 (Cups) · 侍從 (Page)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之侍從",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 侍從 (Page)】：好學求知、靈活信差、探索熱誠。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 侍從 (Page)】：幼稚任性、消息延遲、缺乏經驗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_47",
    "name": "聖杯 (Cups) · 騎士 (Knight)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之騎士",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 騎士 (Knight)】：勇猛奔馳、果敢推進、全力出擊。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 騎士 (Knight)】：魯莽暴衝、耐力不足、方向偏頗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_48",
    "name": "聖杯 (Cups) · 王后 (Queen)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之王后",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 王后 (Queen)】：內在滋養、成熟直覺、深層守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 王后 (Queen)】：情緒用事、過度控制、冷漠疏離。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_49",
    "name": "聖杯 (Cups) · 國王 (King)",
    "ukiyoName": "和風浮世 · 金繕朱漆酒器之國王",
    "element": "水",
    "type": "minor",
    "symbol": "🌊",
    "hanko": "和風",
    "upright": "正位展現【聖杯 (Cups) · 國王 (King)】：掌舵掌控、成熟權威、格局顯化。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【聖杯 (Cups) · 國王 (King)】：霸道專制、固執死板、威權壓迫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "海藍寶 + 玫瑰精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_50",
    "name": "寶劍 (Swords) · 首 (Ace)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之首 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 首 (Ace)】：初始源泉、無限潛能、契機萌發。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 首 (Ace)】：開局猶豫、能量受阻、錯失良機。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_51",
    "name": "寶劍 (Swords) · 二 (Two)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之二 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 二 (Two)】：平衡抉擇、夥伴合作、籌謀佈局。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 二 (Two)】：兩難矛盾、失衡衝突、猶豫不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_52",
    "name": "寶劍 (Swords) · 三 (Three)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之三 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 三 (Three)】：初步成果、團隊協作、擴展遠景。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 三 (Three)】：基礎薄弱、溝通分歧、進展延誤。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_53",
    "name": "寶劍 (Swords) · 四 (Four)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之四 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 四 (Four)】：穩固基石、安居守成、界線分明。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 四 (Four)】：固步自封、僵化防衛、停滯不前。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_54",
    "name": "寶劍 (Swords) · 五 (Five)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之五 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 五 (Five)】：競爭挑戰、利益角逐、動盪考驗。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 五 (Five)】：內耗紛爭、疲憊退場、自我折損。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_55",
    "name": "寶劍 (Swords) · 六 (Six)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之六 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 六 (Six)】：勝利榮耀、互惠分享、平順過渡。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 六 (Six)】：驕傲自滿、依賴成性、暫時受挫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_56",
    "name": "寶劍 (Swords) · 七 (Seven)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之七 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 七 (Seven)】：堅持信念、評估抉擇、防禦守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 七 (Seven)】：焦慮懷疑、寡不敵眾、策略失靈。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_57",
    "name": "寶劍 (Swords) · 八 (Eight)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之八 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 八 (Eight)】：迅速進展、專注修煉、脫離泥淖。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 八 (Eight)】：急躁冒進、耐心告罄、拖延不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_58",
    "name": "寶劍 (Swords) · 九 (Nine)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之九 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 九 (Nine)】：豐盛在握、防線堅固、獨自守望。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 九 (Nine)】：過度防備、疲憊不堪、臨門退縮。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_59",
    "name": "寶劍 (Swords) · 十 (Ten)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之十 ",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 十 (Ten)】：盛極大成、承擔重任、循環完結。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 十 (Ten)】：重擔壓垮、強弩之末、責任過荷。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_60",
    "name": "寶劍 (Swords) · 侍從 (Page)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之侍從",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 侍從 (Page)】：好學求知、靈活信差、探索熱誠。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 侍從 (Page)】：幼稚任性、消息延遲、缺乏經驗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_61",
    "name": "寶劍 (Swords) · 騎士 (Knight)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之騎士",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 騎士 (Knight)】：勇猛奔馳、果敢推進、全力出擊。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 騎士 (Knight)】：魯莽暴衝、耐力不足、方向偏頗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_62",
    "name": "寶劍 (Swords) · 王后 (Queen)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之王后",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 王后 (Queen)】：內在滋養、成熟直覺、深層守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 王后 (Queen)】：情緒用事、過度控制、冷漠疏離。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_63",
    "name": "寶劍 (Swords) · 國王 (King)",
    "ukiyoName": "和風浮世 · 淬鍊名刀切物之國王",
    "element": "風",
    "type": "minor",
    "symbol": "⚔️",
    "hanko": "和風",
    "upright": "正位展現【寶劍 (Swords) · 國王 (King)】：掌舵掌控、成熟權威、格局顯化。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【寶劍 (Swords) · 國王 (King)】：霸道專制、固執死板、威權壓迫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "青金石 + 薄荷精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_64",
    "name": "錢幣 (Pentacles) · 首 (Ace)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之首 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 首 (Ace)】：初始源泉、無限潛能、契機萌發。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 首 (Ace)】：開局猶豫、能量受阻、錯失良機。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_65",
    "name": "錢幣 (Pentacles) · 二 (Two)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之二 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 二 (Two)】：平衡抉擇、夥伴合作、籌謀佈局。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 二 (Two)】：兩難矛盾、失衡衝突、猶豫不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_66",
    "name": "錢幣 (Pentacles) · 三 (Three)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之三 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 三 (Three)】：初步成果、團隊協作、擴展遠景。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 三 (Three)】：基礎薄弱、溝通分歧、進展延誤。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_67",
    "name": "錢幣 (Pentacles) · 四 (Four)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之四 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 四 (Four)】：穩固基石、安居守成、界線分明。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 四 (Four)】：固步自封、僵化防衛、停滯不前。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_68",
    "name": "錢幣 (Pentacles) · 五 (Five)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之五 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 五 (Five)】：競爭挑戰、利益角逐、動盪考驗。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 五 (Five)】：內耗紛爭、疲憊退場、自我折損。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_69",
    "name": "錢幣 (Pentacles) · 六 (Six)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之六 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 六 (Six)】：勝利榮耀、互惠分享、平順過渡。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 六 (Six)】：驕傲自滿、依賴成性、暫時受挫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_70",
    "name": "錢幣 (Pentacles) · 七 (Seven)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之七 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 七 (Seven)】：堅持信念、評估抉擇、防禦守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 七 (Seven)】：焦慮懷疑、寡不敵眾、策略失靈。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_71",
    "name": "錢幣 (Pentacles) · 八 (Eight)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之八 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 八 (Eight)】：迅速進展、專注修煉、脫離泥淖。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 八 (Eight)】：急躁冒進、耐心告罄、拖延不決。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_72",
    "name": "錢幣 (Pentacles) · 九 (Nine)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之九 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 九 (Nine)】：豐盛在握、防線堅固、獨自守望。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 九 (Nine)】：過度防備、疲憊不堪、臨門退縮。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_73",
    "name": "錢幣 (Pentacles) · 十 (Ten)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之十 ",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 十 (Ten)】：盛極大成、承擔重任、循環完結。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 十 (Ten)】：重擔壓垮、強弩之末、責任過荷。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_74",
    "name": "錢幣 (Pentacles) · 侍從 (Page)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之侍從",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 侍從 (Page)】：好學求知、靈活信差、探索熱誠。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 侍從 (Page)】：幼稚任性、消息延遲、缺乏經驗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_75",
    "name": "錢幣 (Pentacles) · 騎士 (Knight)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之騎士",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 騎士 (Knight)】：勇猛奔馳、果敢推進、全力出擊。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 騎士 (Knight)】：魯莽暴衝、耐力不足、方向偏頗。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_76",
    "name": "錢幣 (Pentacles) · 王后 (Queen)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之王后",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 王后 (Queen)】：內在滋養、成熟直覺、深層守護。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 王后 (Queen)】：情緒用事、過度控制、冷漠疏離。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  },
  {
    "id": "t_77",
    "name": "錢幣 (Pentacles) · 國王 (King)",
    "ukiyoName": "和風浮世 · 江戶金幣小判之國王",
    "element": "土",
    "type": "minor",
    "symbol": "🪙",
    "hanko": "和風",
    "upright": "正位展現【錢幣 (Pentacles) · 國王 (King)】：掌舵掌控、成熟權威、格局顯化。對準當前能量，以積極正向姿態推進。",
    "reversed": "逆位提醒【錢幣 (Pentacles) · 國王 (King)】：霸道專制、固執死板、威權壓迫。宜放慢步調進行深度盤點，防範暗礁。",
    "potion": "黃水晶 + 雪松精油",
    "ukiyoMotif": "江戶浮世繪木版畫刻繪，背景為傳統浮世青海波紋飾與金箔點綴。"
  }
];

  // 實體 Light Language Cards 牌面：索引與 t_00 ～ t_77 一一對應，避免依名稱推測檔案。
  const TAROT_IMAGE_FILENAMES = [
    'LLC_01_0_Source.png', 'LLC_02_I_Miracle.png', 'LLC_03_II_Priestess.png', 'LLC_04_Ⅲ_MotherEarth.png',
    'LLC_05_IV_LightEmperor.png', 'LLC_06_V_Explorer.png', 'LLC_07_VI_TwinRay.png', 'LLC_08_VII_BreakThrough.png',
    'LLC_09_VIII_Balance.png', 'LLC_10_IX_WiseMan.png', 'LLC_11_X_Fortune.png', 'LLC_12_XI_Self-Awareness.png',
    'LLC_13_XII_Co-Creation.png', 'LLC_14_XIII_Death.png', 'LLC_15_XIV_Alchemy.png', 'LLC_16_XV_Duality.png',
    'LLC_17_XVI_Awakening.png', 'LLC_18_XVII_Star.png', 'LLC_19_XVIII_Moon.png', 'LLC_20_XIX_Sun.png',
    'LLC_21_XX_Multi-Dimension.png', 'LLC_22_XXI_Universe.png',
    'LLC_53_Spit1_Inspiration-.png', 'LLC_54_Spit2_Akashic.png', 'LLC_55_Spit3_Abundance.png', 'LLC_56_Spit4_NewVision.png',
    'LLC_57_Spit5_FreeWill.png', 'LLC_58_Spit6_Surrender.png', 'LLC_59_Spit7_Change.png', 'LLC_60_Spit8_Harmony.png',
    'LLC_61_Spit9_Integrity.png', 'LLC_62_Spit10_Trust.png', 'LLC_63_★_Andromeda.png', 'LLC_64_★_Arcturus.png',
    'LLC_65_★_Sirius.png', 'LLC_66_★_Pleades.png',
    'LLC_33_Heart1_Joy.png', 'LLC_34_Heart2_Innocence.png', 'LLC_35_Heart3_Love.png', 'LLC_36_Heart4_Anger.png',
    'LLC_37_Heart5_Curiosity.png', 'LLC_38_Heart6_Sorrow.png', 'LLC_39_Heart7_Fear.png', 'LLC_40_Heart8_Receptivity.png',
    'LLC_41_Heart9_Arigato.png', 'LLC_42_Heart10_Passion.png', 'LLC_67_★_Orion.png', 'LLC_68_★_ZetaReticuli.png',
    'LLC_69_★_Essassani.png', 'LLC_70_★_Mercury.png',
    'LLC_23_Mind1_Intention.png', 'LLC_24_Mind2_Perspective.png', 'LLC_25_Mind3_Creativity.png', 'LLC_26_Mind4_Logic.png',
    'LLC_27_Mind5_Darkness.png', 'LLC_28_Mind6_Paradox.png', 'LLC_29_Mind7_Limits.png', 'LLC_30_Mind8_Judge.png',
    'LLC_31_Mind9_Mindfulness.png', 'LLC_32_Mind10_IllusionNeptune.png', 'LLC_71_★_Venus.png', 'LLC_72_★_Mars.png',
    'LLC_73_★_Saturn.png', 'LLC_74_★_Uranus.png',
    'LLC_43_Life1_Birth.png', 'LLC_44_Life2_Reflection.png', 'LLC_45_Life3_Nurturing.png', 'LLC_46_Life4_Professional.png',
    'LLC_47_Life5_SoundBody.png', 'LLC_48_Life6_Contact.png', 'LLC_49_Life7_Quest.png', 'LLC_50_Life8_Stagnation.png',
    'LLC_51_Life-9_Sustainability.png', 'LLC_52_Life10_Reward.png', 'LLC_75_★_Atlantis.png', 'LLC_76_★_Lemuria.png',
    'LLC_77_★_Home.png', 'LLC_78_★_TheCoucilofLight.png'
  ];

  TAROT_CARDS.forEach((card, index) => {
    card.image = `images/tarot/${TAROT_IMAGE_FILENAMES[index]}`;
    card.backImage = 'images/tarot/tarot-back.jpg';
  });

  const LENORMAND_CARDS = [
  {
    "num": 1,
    "name": "01 騎士 (Rider)",
    "nameZh": "騎士",
    "nameEn": "Rider",
    "pips": "紅心 9",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "9",
    "suitColor": "#B82424",
    "symbol": "🏇",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 迅速顯化",
    "keywords": "即時吉信 · 迅速前行 · 貴人拜訪 · 突破契機",
    "desc": "象徵即將抵達的全新消息、拜訪者或突破契機。事情將以超乎預期的速度向前推進，帶來活躍的生機與清晰的方向。當前最宜保持敏捷思維，主動把握瞬息萬變的良機。",
    "potion": "甜橙精油 + 白水晶（思維敏銳，加速顯化）",
    "bgGradient": [
      "#FFF9EE",
      "#F5EAD4"
    ],
    "portalGradient": [
      "#EBF4FF",
      "#CDE0F5"
    ]
  },
  {
    "num": 2,
    "name": "02 幸運草 (Clover)",
    "nameZh": "幸運草",
    "nameEn": "Clover",
    "pips": "方塊 6",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "6",
    "suitColor": "#B82424",
    "symbol": "🍀",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 驚喜小確幸",
    "keywords": "微小幸運 · 轉機降臨 · 短暫希望 · 喜悅突破",
    "desc": "象徵日常中意外綻放的幸運與轉機。雖然這份好運看似短暫輕盈，卻足以為緊繃的局面破冰解圍。提醒你常懷感恩之心，在微小處發現豐盛，隨順當下的輕鬆與喜悅。",
    "potion": "綠薄荷精油 + 綠幽靈（迎來驚喜轉機，招財好運）",
    "bgGradient": [
      "#FFFDF6",
      "#F3F7EE"
    ],
    "portalGradient": [
      "#F0FDF4",
      "#DCFCE7"
    ]
  },
  {
    "num": 3,
    "name": "03 船 (Ship)",
    "nameZh": "船",
    "nameEn": "Ship",
    "pips": "黑桃 10",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "10",
    "suitColor": "#1E293B",
    "symbol": "⛵",
    "nature": "neutral",
    "natureLabel": "中性拓展 · 揚帆遠航",
    "keywords": "遠行跨界 · 人生宏願 · 貿易通商 · 順應轉化",
    "desc": "象徵深遠的旅程、人生視野的開拓與重大變動。無論是地理上的遠行、跨領域的拓展或商業航路，都代表著揚帆啟程的宏大願景。順隨潮流航向更寬廣的大海。",
    "potion": "迷迭香精油 + 青金石（遠行守護，拓展宏大格局）",
    "bgGradient": [
      "#FFFDF8",
      "#F2F7FA"
    ],
    "portalGradient": [
      "#E0F2FE",
      "#BAE6FD"
    ]
  },
  {
    "num": 4,
    "name": "04 房屋 (House)",
    "nameZh": "房屋",
    "nameEn": "House",
    "pips": "紅心 K",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "K",
    "suitColor": "#B82424",
    "symbol": "🏡",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 安住根基",
    "keywords": "溫暖庇護 · 家庭房產 · 內在安定 · 長遠基石",
    "desc": "象徵家庭的避風港、身心的安住之地與實質的資產基礎。代表穩固的安全感、家族血脈的庇護與內在平靜。當前是鞏固根基、照顧家人與建立長遠穩健架構的關鍵期。",
    "potion": "喜馬拉雅雪松 + 茶晶（定錨穩固根基，家宅平安）",
    "bgGradient": [
      "#FFFDF8",
      "#FAF5EB"
    ],
    "portalGradient": [
      "#FEF3C7",
      "#FDE68A"
    ]
  },
  {
    "num": 5,
    "name": "05 樹 (Tree)",
    "nameZh": "樹",
    "nameEn": "Tree",
    "pips": "紅心 7",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "7",
    "suitColor": "#B82424",
    "symbol": "🌳",
    "nature": "neutral",
    "natureLabel": "中性生命 · 扎根成長",
    "keywords": "健康療癒 · 歲月扎根 · 耐心生長 · 靈性滋養",
    "desc": "象徵長久的生命力、深層扎根與身心靈的健康療癒。如同參天大樹歷經四時風雨依然矗立，提醒你耐心累積、順應自然的生長節奏，給予自己休養生息的時間。",
    "potion": "絲柏精油 + 綠東陵（深層元氣修復，長青生長）",
    "bgGradient": [
      "#FFFDF8",
      "#F4F8F1"
    ],
    "portalGradient": [
      "#ECFDF5",
      "#D1FAE5"
    ]
  },
  {
    "num": 6,
    "name": "06 雲 (Clouds)",
    "nameZh": "雲",
    "nameEn": "Clouds",
    "pips": "梅花 K",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "K",
    "suitColor": "#1E293B",
    "symbol": "☁️",
    "nature": "negative",
    "natureLabel": "警示考驗 · 短暫迷茫",
    "keywords": "困惑猶豫 · 局勢未明 · 靜候風散 · 明辨是非",
    "desc": "象徵短暫的迷茫、疑慮與不明朗的局勢。一側晦暗濃雲，一側天光微露；正如雷諾曼的智慧，困惑終將隨風消散。請勿在迷霧中貿然做出重大決策，靜候真相浮現。",
    "potion": "尤加利精油 + 螢石（驅散心頭迷霧，思緒清明）",
    "bgGradient": [
      "#FFFDF8",
      "#F1F5F9"
    ],
    "portalGradient": [
      "#F8FAFC",
      "#E2E8F0"
    ]
  },
  {
    "num": 7,
    "name": "07 蛇 (Snake)",
    "nameZh": "蛇",
    "nameEn": "Snake",
    "pips": "梅花 Q",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "Q",
    "suitColor": "#1E293B",
    "symbol": "🐍",
    "nature": "negative",
    "natureLabel": "警示考驗 · 迂迴蛻變",
    "keywords": "複雜曲折 · 警惕誘惑 · 敏銳觀察 · 智慧蛻皮",
    "desc": "象徵迂迴曲折、隱微的阻礙或需要警惕的複雜人際。亦代表敏銳的洞察力與生命褪皮蛻變的契機。行事宜沉穩謹慎，明辨周圍人事言行，以智慧化解潛在的暗流。",
    "potion": "真正薰衣草 + 黑曜石（護衛氣場，轉化複雜暗流）",
    "bgGradient": [
      "#FFFDF8",
      "#F4F7F2"
    ],
    "portalGradient": [
      "#F0FDF4",
      "#DCFCE7"
    ]
  },
  {
    "num": 8,
    "name": "08 棺材 (Coffin)",
    "nameZh": "棺材",
    "nameEn": "Coffin",
    "pips": "方塊 9",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "9",
    "suitColor": "#B82424",
    "symbol": "⚰️",
    "nature": "negative",
    "natureLabel": "重大轉折 · 破繭歸零",
    "keywords": "舊章終結 · 歸零大生 · 徹底蛻變 · 釋放告別",
    "desc": "象徵重大階段的正式終結、舊模式的告別與不可逆的轉折。結束是為了迎來新生，當陳舊的包袱塵埃落定，靈魂便得以破繭而出。勇敢放手不再服務於你的事物。",
    "potion": "沒藥精油 + 透石膏（告別過去包袱，迎向純粹新生）",
    "bgGradient": [
      "#FFFDF8",
      "#F5F3F0"
    ],
    "portalGradient": [
      "#EDE9FE",
      "#DDD6FE"
    ]
  },
  {
    "num": 9,
    "name": "09 花束 (Bouquet)",
    "nameZh": "花束",
    "nameEn": "Bouquet",
    "pips": "黑桃 Q",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "Q",
    "suitColor": "#1E293B",
    "symbol": "💐",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 禮讚賞賜",
    "keywords": "歡慶禮物 · 社交聚會 · 賞心悅目 · 幸福降臨",
    "desc": "象徵美好的讚賞、令人心花怒放的禮物與社交聚會的溫馨喜悅。代表著他人對你才華的由衷認可、優雅的生活品味與和諧的情感流動。欣然接納來自宇宙的盛情餽贈。",
    "potion": "大馬士革玫瑰 + 粉晶（吸引社交貴人，綻放優雅自信）",
    "bgGradient": [
      "#FFFDF9",
      "#FDF2F8"
    ],
    "portalGradient": [
      "#FCE7F3",
      "#FBCFE8"
    ]
  },
  {
    "num": 10,
    "name": "10 鐮刀 (Scythe)",
    "nameZh": "鐮刀",
    "nameEn": "Scythe",
    "pips": "方塊 J",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "J",
    "suitColor": "#B82424",
    "symbol": "🌾",
    "nature": "negative",
    "natureLabel": "警示考驗 · 果敢決斷",
    "keywords": "迅速切割 · 快刀斬麻 · 斷捨離 · 收割成果",
    "desc": "象徵突如其來的決斷、果斷的切割與快刀斬亂麻的行動力。正如秋收揮鐮，割捨是為了收割成果。提醒你避開魯莽草率，在關鍵時刻展現決心，斬斷糾葛以迎轉機。",
    "potion": "黑胡椒精油 + 赤鐵礦（果斷決策，斬斷糾葛執念）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF3C7"
    ],
    "portalGradient": [
      "#FFFBEB",
      "#FDE68A"
    ]
  },
  {
    "num": 11,
    "name": "11 鞭子 (Whip)",
    "nameZh": "鞭子",
    "nameEn": "Whip",
    "pips": "梅花 J",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "J",
    "suitColor": "#1E293B",
    "symbol": "🪢",
    "nature": "negative",
    "natureLabel": "警示考驗 · 淬礪磨合",
    "keywords": "衝突辯論 · 反覆淬煉 · 耐力考驗 · 消除雜質",
    "desc": "象徵反覆出現的磨合、辯論溝通或體魄耐力的嚴格鍛鍊。可能伴隨內在矛盾或觀點碰撞，但這正是淬礪心智、消除雜質的修行過程。以耐力與理性化解爭端。",
    "potion": "肉桂精油 + 紅石榴石（調和內部摩擦，激發堅韌耐力）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF2F2"
    ],
    "portalGradient": [
      "#FEE2E2",
      "#FECACA"
    ]
  },
  {
    "num": 12,
    "name": "12 鳥 (Birds)",
    "nameZh": "鳥",
    "nameEn": "Birds",
    "pips": "方塊 7",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "7",
    "suitColor": "#B82424",
    "symbol": "🐦",
    "nature": "neutral",
    "natureLabel": "中性交流 · 訊息交織",
    "keywords": "熱絡交談 · 資訊流動 · 電話商討 · 平撫焦慮",
    "desc": "象徵熱絡的交談、訊息交織、電話通訊與短暫的思慮焦慮。雙鳥嘰喳鳴唱，代表資訊的流通與多方商討。保持心念安定，篩選紛雜流言，專注於真正有建設性的對話。",
    "potion": "佛手柑精油 + 藍紋瑪瑙（平撫紛擾焦慮，順暢人際溝通）",
    "bgGradient": [
      "#FFFDF8",
      "#F0FDF4"
    ],
    "portalGradient": [
      "#E0F2FE",
      "#BAE6FD"
    ]
  },
  {
    "num": 13,
    "name": "13 小孩 (Child)",
    "nameZh": "小孩",
    "nameEn": "Child",
    "pips": "黑桃 J",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "J",
    "suitColor": "#1E293B",
    "symbol": "👶",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 純真希望",
    "keywords": "全新開始 · 赤子純真 · 微型項目 · 好奇探索",
    "desc": "象徵純真的初創、新生的計劃、純粹的好奇心或年幼的孩童。一切正處於萌芽階段，充滿可塑性與無限潛能。放下過度複雜的防備，以赤子之心開啟探索世界的新篇章。",
    "potion": "甜橙精油 + 黃水晶（喚醒純真喜悅，啟動嶄新初創）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF9C3"
    ],
    "portalGradient": [
      "#FEF08A",
      "#FDE047"
    ]
  },
  {
    "num": 14,
    "name": "14 狐狸 (Fox)",
    "nameZh": "狐狸",
    "nameEn": "Fox",
    "pips": "梅花 9",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "9",
    "suitColor": "#1E293B",
    "symbol": "🦊",
    "nature": "neutral",
    "natureLabel": "中性謀略 · 警醒精明",
    "keywords": "職場生存 · 機智自保 · 防範心計 · 細節審查",
    "desc": "象徵職場中的機敏謀略、專業技能與防範心計的智慧。代表為生活奔波的生存本能，提醒你在合作與利益分配中保持清醒，審視合約與細節，自保而不失策略。",
    "potion": "乳香精油 + 虎眼石（提升職場機敏，明辨是非曲直）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF3C7"
    ],
    "portalGradient": [
      "#FDE68A",
      "#FCD34D"
    ]
  },
  {
    "num": 15,
    "name": "15 熊 (Bear)",
    "nameZh": "熊",
    "nameEn": "Bear",
    "pips": "梅花 10",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "10",
    "suitColor": "#1E293B",
    "symbol": "🐻",
    "nature": "neutral",
    "natureLabel": "中性實力 · 威嚴庇護",
    "keywords": "雄厚資本 · 權力靠山 · 母性守護 · 堅實底氣",
    "desc": "象徵雄厚的資源底氣、掌權者或母親般的庇護力量。代表財務的安全保障、穩如泰山的地位與強大的保護本能。你擁有足夠的資本與後盾，可以自信捍衛自己的疆界。",
    "potion": "岩蘭草精油 + 金髮晶（厚植財富底氣，穩固權力後盾）",
    "bgGradient": [
      "#FFFDF8",
      "#F5EBE1"
    ],
    "portalGradient": [
      "#E2E8F0",
      "#CBD5E1"
    ]
  },
  {
    "num": 16,
    "name": "16 星星 (Stars)",
    "nameZh": "星星",
    "nameEn": "Stars",
    "pips": "紅心 6",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "6",
    "suitColor": "#B82424",
    "symbol": "⭐",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 靈感引領",
    "keywords": "崇高願景 · 夢想成真 · 靈性指引 · 心靈澄澈",
    "desc": "象徵崇高的願景、指引迷津的靈感與夢想成真的神聖祝福。黑夜中璀璨的北極星為航向指引正道，代表靈性天命與深層信心。相信直覺引領，你的願望正被宇宙溫柔聽見。",
    "potion": "橙花精油 + 天河石（接收宇宙靈感，堅定心靈願景）",
    "bgGradient": [
      "#FFFDF8",
      "#F0F4FF"
    ],
    "portalGradient": [
      "#1E1B4B",
      "#0F172A"
    ]
  },
  {
    "num": 17,
    "name": "17 鸛鳥 (Stork)",
    "nameZh": "鸛鳥",
    "nameEn": "Stork",
    "pips": "紅心 Q",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "Q",
    "suitColor": "#B82424",
    "symbol": "🪶",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 良善變革",
    "keywords": "晉升改善 · 喬遷新居 · 迎向新生 · 週期升級",
    "desc": "象徵良性的環境變遷、生活品質的升級與積極的轉機。如鸛鳥遷徙築巢，帶來喬遷新居、職位晉升或迎來新生命的喜訊。積極擁抱變革，生活即將邁入全新境界。",
    "potion": "玫瑰草精油 + 海藍寶（迎接良善變革，生活進階升級）",
    "bgGradient": [
      "#FFFDF8",
      "#F0F9FF"
    ],
    "portalGradient": [
      "#E0F2FE",
      "#BAE6FD"
    ]
  },
  {
    "num": 18,
    "name": "18 狗 (Dog)",
    "nameZh": "狗",
    "nameEn": "Dog",
    "pips": "紅心 10",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "10",
    "suitColor": "#B82424",
    "symbol": "🐕",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 忠誠守護",
    "keywords": "真心摯友 · 信任盟友 · 陪伴相守 · 堅定信賴",
    "desc": "象徵忠誠守護的摯友、可靠的盟友與無條件的信任託付。在人生道路上，你並不孤單，身邊始終有真心相伴、願為你分憂解難的良伴。珍惜身邊純粹的情誼。",
    "potion": "羅馬洋甘菊 + 綠松石（鞏固真誠友誼，守護忠誠盟約）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF3C7"
    ],
    "portalGradient": [
      "#FEF08A",
      "#FDE047"
    ]
  },
  {
    "num": 19,
    "name": "19 塔 (Tower)",
    "nameZh": "塔",
    "nameEn": "Tower",
    "pips": "黑桃 6",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "6",
    "suitColor": "#1E293B",
    "symbol": "🏰",
    "nature": "neutral",
    "natureLabel": "中性格局 · 獨立威儀",
    "keywords": "體制權威 · 獨立自持 · 高瞻遠矚 · 孤峰格局",
    "desc": "象徵體制機構、高聳的格局、孤峰獨聳的成就或獨立獨處。代表官方權威、大型組織與抽離繁雜的高瞻遠矚。提醒你自律自持，在安靜獨處中看清全局走向。",
    "potion": "大西洋雪松 + 煙晶（靜定獨處，高瞻遠矚統籌全局）",
    "bgGradient": [
      "#FFFDF8",
      "#F1F5F9"
    ],
    "portalGradient": [
      "#CBD5E1",
      "#94A3B8"
    ]
  },
  {
    "num": 20,
    "name": "20 花園 (Garden)",
    "nameZh": "花園",
    "nameEn": "Garden",
    "pips": "黑桃 8",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "8",
    "suitColor": "#1E293B",
    "symbol": "⛲",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 公眾盛會",
    "keywords": "社交圈子 · 大眾認同 · 聚會展示 · 人脈交流",
    "desc": "象徵熱鬧的公共場合、大眾社交圈、發表展現與聚會網絡。代表走出私密空間，向世界展現自我，收穫人脈連結與群眾共鳴。積極融入社群，分享你的光芒。",
    "potion": "天竺葵精油 + 紫水晶（拓展社交共鳴，散發公眾魅力）",
    "bgGradient": [
      "#FFFDF8",
      "#F0FDF4"
    ],
    "portalGradient": [
      "#DCFCE7",
      "#BBF7D0"
    ]
  },
  {
    "num": 21,
    "name": "21 山 (Mountain)",
    "nameZh": "山",
    "nameEn": "Mountain",
    "pips": "梅花 8",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "8",
    "suitColor": "#1E293B",
    "symbol": "⛰️",
    "nature": "negative",
    "natureLabel": "警示考驗 · 沉著蓄力",
    "keywords": "巨大阻礙 · 延宕停滯 · 不可撼動 · 考驗耐心",
    "desc": "象徵龐大的外在阻礙、延宕不前與不可撼動的嚴苛考驗。巍峨群山阻斷去路，考驗著你的意志與恆心。切勿硬碰硬，可選擇暫時休整、迂迴前行，或等待融雪之日。",
    "potion": "歐洲赤松 + 縞瑪瑙（沉著面對考驗，堅若磐石蓄力）",
    "bgGradient": [
      "#FFFDF8",
      "#F1F5F9"
    ],
    "portalGradient": [
      "#E2E8F0",
      "#CBD5E1"
    ]
  },
  {
    "num": 22,
    "name": "22 十字路口 (Crossroads)",
    "nameZh": "十字路口",
    "nameEn": "Crossroads",
    "pips": "方塊 Q",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "Q",
    "suitColor": "#B82424",
    "symbol": "🔀",
    "nature": "neutral",
    "natureLabel": "中性抉擇 · 人生岔道",
    "keywords": "重要抉擇 · 多重道路 · 人生分水 · 權衡自主",
    "desc": "象徵站在人生的分水嶺，面臨多方權衡的抉擇。多條道路各具機遇與代價，代表主動選擇的自由與責任。回歸內心初衷，權衡利弊後堅定前行，不走回頭路。",
    "potion": "薄荷精油 + 彩虹螢石（清晰辨明抉擇，自信踏上新途）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF9C3"
    ],
    "portalGradient": [
      "#FEF08A",
      "#FDE047"
    ]
  },
  {
    "num": 23,
    "name": "23 老鼠 (Mice)",
    "nameZh": "老鼠",
    "nameEn": "Mice",
    "pips": "梅花 7",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "7",
    "suitColor": "#1E293B",
    "symbol": "🐁",
    "nature": "negative",
    "natureLabel": "警示考驗 · 漏財耗損",
    "keywords": "微小侵蝕 · 精力流失 · 焦慮損耗 · 及時止損",
    "desc": "象徵不知不覺間的侵蝕損耗、日常精力流失或財務漏洞。細微的焦慮正蠶食著安心感，提醒你盡快檢視生活中的耗損點，修補漏洞、清除雜念，及時止損以防蔓延。",
    "potion": "澳洲茶樹精油 + 黑曜石（修補能量漏洞，及時止損除耗）",
    "bgGradient": [
      "#FFFDF8",
      "#F5F5F4"
    ],
    "portalGradient": [
      "#E7E5E4",
      "#D6D3D1"
    ]
  },
  {
    "num": 24,
    "name": "24 心 (Heart)",
    "nameZh": "心",
    "nameEn": "Heart",
    "pips": "紅心 J",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "J",
    "suitColor": "#B82424",
    "symbol": "❤️",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 真愛盛放",
    "keywords": "純真愛戀 · 慈悲熱忱 · 敞開心扉 · 靈魂共振",
    "desc": "象徵熱烈的愛戀、真摯的深情、敞開的心輪與人道關懷。代表由衷的熱情、靈魂的共振與包容接納的力量。傾聽內心真正的渴望，用愛撫平一切創傷，世界因你而溫暖。",
    "potion": "依蘭依蘭精油 + 菱錳礦（打開心輪慈悲，沉浸真摯熱愛）",
    "bgGradient": [
      "#FFFDF9",
      "#FFF1F2"
    ],
    "portalGradient": [
      "#FFE4E6",
      "#FECDD3"
    ]
  },
  {
    "num": 25,
    "name": "25 戒指 (Ring)",
    "nameZh": "戒指",
    "nameEn": "Ring",
    "pips": "梅花 A",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "A",
    "suitColor": "#1E293B",
    "symbol": "💍",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 神聖盟約",
    "keywords": "長期契約 · 婚姻結合 · 忠誠合作 · 圓滿承諾",
    "desc": "象徵神聖的承諾、契約簽訂、婚姻聯姻或長期可靠的夥伴同盟。代表永恆的循環與互信的誓言。當前是確立正式關係、簽署協議與落實長期承諾的吉慶時刻。",
    "potion": "邁索爾檀香 + 鈦晶（鞏固神聖契約，迎來長遠合作）",
    "bgGradient": [
      "#FFFDF8",
      "#FEFCE8"
    ],
    "portalGradient": [
      "#FEF9C3",
      "#FEF08A"
    ]
  },
  {
    "num": 26,
    "name": "26 書 (Book)",
    "nameZh": "書",
    "nameEn": "Book",
    "pips": "方塊 10",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "10",
    "suitColor": "#B82424",
    "symbol": "📖",
    "nature": "neutral",
    "natureLabel": "中性求知 · 奧秘深藏",
    "keywords": "深層學識 · 尚未揭曉 · 專業研讀 · 調查秘密",
    "desc": "象徵深藏的秘密、專門的學問研讀或尚未揭露的事實真相。書頁合起代表未知的潛在機遇，開啟則象徵智慧的啟蒙。保持求知若渴的敬畏，深入探尋事物背後的底層邏輯。",
    "potion": "迷迭香精油 + 藍晶石（開啟深層智慧，洞悉底層機理）",
    "bgGradient": [
      "#FFFDF8",
      "#F3F4F6"
    ],
    "portalGradient": [
      "#EDE9FE",
      "#DDD6FE"
    ]
  },
  {
    "num": 27,
    "name": "27 信 (Letter)",
    "nameZh": "信",
    "nameEn": "Letter",
    "pips": "黑桃 7",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "7",
    "suitColor": "#1E293B",
    "symbol": "✉️",
    "nature": "neutral",
    "natureLabel": "中性書簡 · 白紙黑字",
    "keywords": "書面通知 · 合約文件 · 官方證明 · 訊息送達",
    "desc": "象徵書面形式的正式訊息、通知、合約文件或重要證書。代表具體而落實的文字通訊，白紙黑字有跡可循。留意即將送達的文件，仔細閱讀其中的條款與通知內容。",
    "potion": "尤加利精油 + 白水晶（精準書面通訊，傳遞重要佳音）",
    "bgGradient": [
      "#FFFDF8",
      "#FEFCE8"
    ],
    "portalGradient": [
      "#FEF9C3",
      "#FEF08A"
    ]
  },
  {
    "num": 28,
    "name": "28 男人 (Gentleman)",
    "nameZh": "男人",
    "nameEn": "Gentleman",
    "pips": "紅心 A",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "A",
    "suitColor": "#B82424",
    "symbol": "👨",
    "nature": "neutral",
    "natureLabel": "核心人物 · 陽性開創",
    "keywords": "理性果決 · 問卜者/男 · 重要男性 · 主動掌舵",
    "desc": "象徵積極主動的陽性能量、採取行動的核心人物或生命中的關鍵男性（若問卜者為男性則代表自身）。代表理性推進、剛毅果決與主動掌舵的力量。",
    "potion": "黑胡椒精油 + 太陽石（點燃陽性行動力，自信掌舵開創）",
    "bgGradient": [
      "#FFFDF8",
      "#F0F4F8"
    ],
    "portalGradient": [
      "#E2E8F0",
      "#CBD5E1"
    ]
  },
  {
    "num": 29,
    "name": "29 女人 (Lady)",
    "nameZh": "女人",
    "nameEn": "Lady",
    "pips": "黑桃 A",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "A",
    "suitColor": "#1E293B",
    "symbol": "👩",
    "nature": "neutral",
    "natureLabel": "核心人物 · 陰性滋養",
    "keywords": "直覺敏感 · 問卜者/女 · 重要女性 · 溫潤包容",
    "desc": "象徵溫潤包容的陰性能量、滋養支持的核心人物或生命中的關鍵女性（若問卜者為女性則代表自身）。代表直覺敏感、優雅接納與深層情感的流動。",
    "potion": "快樂鼠尾草 + 月光石（喚醒陰性直覺力，溫潤包容滋養）",
    "bgGradient": [
      "#FFFDF8",
      "#FDF2F8"
    ],
    "portalGradient": [
      "#FCE7F3",
      "#FBCFE8"
    ]
  },
  {
    "num": 30,
    "name": "30 百合 (Lily)",
    "nameZh": "百合",
    "nameEn": "Lily",
    "pips": "黑桃 K",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "K",
    "suitColor": "#1E293B",
    "symbol": "⚜️",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 純潔智德",
    "keywords": "歲月靜好 · 長者成熟 · 清白祥和 · 崇高福分",
    "desc": "象徵純潔的品德、祥和長壽、家族長輩的智德與成熟清明的狀態。代表歷經風霜後的寧靜從容、平穩安康與崇高的道德福分。保持風骨，享受歲月沉澱的美好。",
    "potion": "真正薰衣草 + 透石膏（涵養高雅品德，歲月靜好福分）",
    "bgGradient": [
      "#FFFDF8",
      "#F8FAFC"
    ],
    "portalGradient": [
      "#F1F5F9",
      "#E2E8F0"
    ]
  },
  {
    "num": 31,
    "name": "31 太陽 (Sun)",
    "nameZh": "太陽",
    "nameEn": "Sun",
    "pips": "方塊 A",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "A",
    "suitColor": "#B82424",
    "symbol": "☀️",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 璀璨勝利",
    "keywords": "光明勝利 · 旺盛活力 · 榮耀成就 · 絕對自信",
    "desc": "象徵至高無上的光明、勝利成功、旺盛的活力與無與倫比的自信。金光普照大地，驅散一切陰霾疑慮，帶來豐收與榮耀。當前正值運勢巔峰，盡情揮灑你的才華與光彩。",
    "potion": "甜橙精油 + 太陽石（激發至高活力，迎向璀璨成功）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF3C7"
    ],
    "portalGradient": [
      "#FEF08A",
      "#FBBF24"
    ]
  },
  {
    "num": 32,
    "name": "32 月亮 (Moon)",
    "nameZh": "月亮",
    "nameEn": "Moon",
    "pips": "紅心 8",
    "suit": "hearts",
    "suitSymbol": "♥",
    "pipRank": "8",
    "suitColor": "#B82424",
    "symbol": "🌙",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 直覺名望",
    "keywords": "藝術才華 · 直覺靈感 · 榮譽聲望 · 情感潮湧",
    "desc": "象徵藝術才華、名利聲望、深層直覺與情感浪潮。代表世人的認可讚賞、靈性創作的靈感噴湧與潛意識的潮起潮落。信任你的第六感，將感受轉化為動人的創造力。",
    "potion": "茉莉精油 + 月光石（深化靈性直覺，收穫榮耀美譽）",
    "bgGradient": [
      "#FFFDF8",
      "#EFF6FF"
    ],
    "portalGradient": [
      "#1E293B",
      "#0F172A"
    ]
  },
  {
    "num": 33,
    "name": "33 鑰匙 (Key)",
    "nameZh": "鑰匙",
    "nameEn": "Key",
    "pips": "方塊 8",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "8",
    "suitColor": "#B82424",
    "symbol": "🗝️",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 命運解鎖",
    "keywords": "必然成功 · 關鍵解方 · 豁然開朗 · 命運之門",
    "desc": "象徵命運的關鍵突破、解開一切困局的解方與必然的成功。鎖孔開啟，豁然開朗，阻礙煙消雲散。你已經握有通往新天地的決定性鑰匙，大膽啟程，奇蹟就在眼前。",
    "potion": "檸檬精油 + 虎眼石（開啟關鍵突破，解鎖宿命寶藏）",
    "bgGradient": [
      "#FFFDF8",
      "#FEF3C7"
    ],
    "portalGradient": [
      "#FEF08A",
      "#FDE047"
    ]
  },
  {
    "num": 34,
    "name": "34 魚 (Fish)",
    "nameZh": "魚",
    "nameEn": "Fish",
    "pips": "方塊 K",
    "suit": "diamonds",
    "suitSymbol": "♦",
    "pipRank": "K",
    "suitColor": "#B82424",
    "symbol": "🐟",
    "nature": "positive",
    "natureLabel": "至尊大吉 · 金流豐饒",
    "keywords": "富足財富 · 商業興盛 · 資本流動 · 價值倍增",
    "desc": "象徵源源不絕的財源流動、商業繁榮、靈活的資本與豐饒收穫。游魚悠遊於深水，代表富裕、貿易暢通與資源的多樣化。積極運作金流，讓價值在流動中倍數增長。",
    "potion": "肉桂精油 + 黃水晶（迎來豐饒金流，商機暢通倍增）",
    "bgGradient": [
      "#FFFDF8",
      "#F0F9FF"
    ],
    "portalGradient": [
      "#E0F2FE",
      "#BAE6FD"
    ]
  },
  {
    "num": 35,
    "name": "35 錨 (Anchor)",
    "nameZh": "錨",
    "nameEn": "Anchor",
    "pips": "黑桃 9",
    "suit": "spades",
    "suitSymbol": "♠",
    "pipRank": "9",
    "suitColor": "#1E293B",
    "symbol": "⚓",
    "nature": "positive",
    "natureLabel": "正面吉牌 · 長期定錨",
    "keywords": "穩固安全 · 終生事業 · 歷久彌堅 · 安心扎根",
    "desc": "象徵歷經風浪後的安全定錨、終身事業的穩固根基與長久承諾。玄鐵定海，風浪平息，代表安居樂業、永續經營與踏實的信賴感。你已尋得真正的避風港，安心扎根。",
    "potion": "喜馬拉雅雪松 + 赤鐵礦（終身安全定錨，建立永續基業）",
    "bgGradient": [
      "#FFFDF8",
      "#F1F5F9"
    ],
    "portalGradient": [
      "#E2E8F0",
      "#CBD5E1"
    ]
  },
  {
    "num": 36,
    "name": "36 十字架 (Cross)",
    "nameZh": "十字架",
    "nameEn": "Cross",
    "pips": "梅花 6",
    "suit": "clubs",
    "suitSymbol": "♣",
    "pipRank": "6",
    "suitColor": "#1E293B",
    "symbol": "✝️",
    "nature": "negative",
    "natureLabel": "神聖試煉 · 昇華轉化",
    "keywords": "命定功課 · 靈魂昇華 · 承擔使命 · 破繭成光",
    "desc": "象徵靈魂的神聖考驗、命中注定的承擔與深刻的靈性轉化。肩負重擔雖感沉重，卻是淬鍊品格、消弭宿業的必經階梯。心懷虔敬與信念，在風雨過後必見生命更深邃的光芒。",
    "potion": "乳香精油 + 紫水晶（靈魂神聖轉化，重負昇華為光）",
    "bgGradient": [
      "#FFFDF8",
      "#F5F3FF"
    ],
    "portalGradient": [
      "#DDD6FE",
      "#C4B5FD"
    ]
  }
];

  const LENORMAND_ARTS = {
  "1": "<path d=\"M40 250 Q130 230 220 250 L220 280 L40 280 Z\" fill=\"#7BA05B\" opacity=\"0.4\"/>\n            <path d=\"M30 265 Q130 250 230 265 L230 285 L30 285 Z\" fill=\"#5F8241\" opacity=\"0.6\"/>\n            <circle cx=\"170\" cy=\"110\" r=\"38\" fill=\"#FDE68A\" opacity=\"0.4\"/>\n            <circle cx=\"170\" cy=\"110\" r=\"24\" fill=\"#FEF08A\" opacity=\"0.7\"/>\n            <g transform=\"translate(62, 115)\">\n              <path d=\"M45 75 Q60 55 85 60 Q105 50 115 35 Q118 45 110 60 Q125 70 120 90 Q110 85 95 88 Q75 105 60 115 L52 135 L42 135 L48 105 Q35 110 25 125 L15 125 L25 95 Q30 85 45 75 Z\" fill=\"#6B4226\"/>\n              <path d=\"M105 40 Q118 20 128 25 Q132 35 125 45 Q115 50 105 40 Z\" fill=\"#543118\"/>\n              <path d=\"M110 25 Q100 20 90 35 Q85 45 80 55\" stroke=\"#D97706\" stroke-width=\"4\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M95 88 L115 115 L125 115 L108 85\" fill=\"#543118\"/>\n              <path d=\"M85 88 L105 125 L112 125 L95 85\" fill=\"#6B4226\"/>\n              <path d=\"M48 95 L25 120 L18 120 L38 90\" fill=\"#543118\"/>\n              <path d=\"M25 95 Q5 90 0 110 Q10 115 28 102\" fill=\"#D97706\"/>\n              <path d=\"M68 62 Q75 42 82 45 Q88 52 82 65 Z\" fill=\"#1E3A8A\"/>\n              <circle cx=\"82\" cy=\"40\" r=\"7\" fill=\"#FBBF24\"/>\n              <path d=\"M72 48 Q40 50 30 42 Q42 65 65 65\" fill=\"#DC2626\"/>\n              <path d=\"M92 48 L108 38 L114 44 L98 54 Z\" fill=\"#FFFDF9\" stroke=\"#B45309\" stroke-width=\"1.5\"/>\n              <line x1=\"98\" y1=\"42\" x2=\"108\" y2=\"48\" stroke=\"#DC2626\" stroke-width=\"1.5\"/>\n            </g>\n            <polygon points=\"185,90 188,97 195,100 188,103 185,110 182,103 175,100 182,97\" fill=\"#D97706\"/>\n            <polygon points=\"75,85 77,90 82,92 77,94 75,99 73,94 68,92 73,90\" fill=\"#D97706\"/>",
  "2": "<circle cx=\"130\" cy=\"176\" r=\"68\" fill=\"#86EFAC\" opacity=\"0.3\"/>\n            <circle cx=\"130\" cy=\"176\" r=\"50\" fill=\"#4ADE80\" opacity=\"0.3\"/>\n            <g transform=\"translate(130, 176)\">\n              <path d=\"M0 25 Q10 65 -5 85\" stroke=\"#15803D\" stroke-width=\"5\" stroke-linecap=\"round\" fill=\"none\"/>\n              <g transform=\"translate(0, -32)\">\n                <path d=\"M0 20 C-22 -5 -32 -25 -15 -35 C0 -42 0 -25 0 -15 C0 -25 0 -42 15 -35 C32 -25 22 -5 0 20 Z\" fill=\"#16A34A\" stroke=\"#14532D\" stroke-width=\"1.5\"/>\n                <path d=\"M0 20 L0 -28\" stroke=\"#86EFAC\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              </g>\n              <g transform=\"translate(0, 32) rotate(180)\">\n                <path d=\"M0 20 C-22 -5 -32 -25 -15 -35 C0 -42 0 -25 0 -15 C0 -25 0 -42 15 -35 C32 -25 22 -5 0 20 Z\" fill=\"#15803D\" stroke=\"#14532D\" stroke-width=\"1.5\"/>\n                <path d=\"M0 20 L0 -28\" stroke=\"#86EFAC\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              </g>\n              <g transform=\"translate(-32, 0) rotate(-90)\">\n                <path d=\"M0 20 C-22 -5 -32 -25 -15 -35 C0 -42 0 -25 0 -15 C0 -25 0 -42 15 -35 C32 -25 22 -5 0 20 Z\" fill=\"#22C55E\" stroke=\"#14532D\" stroke-width=\"1.5\"/>\n                <path d=\"M0 20 L0 -28\" stroke=\"#BBF7D0\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              </g>\n              <g transform=\"translate(32, 0) rotate(90)\">\n                <path d=\"M0 20 C-22 -5 -32 -25 -15 -35 C0 -42 0 -25 0 -15 C0 -25 0 -42 15 -35 C32 -25 22 -5 0 20 Z\" fill=\"#16A34A\" stroke=\"#14532D\" stroke-width=\"1.5\"/>\n                <path d=\"M0 20 L0 -28\" stroke=\"#86EFAC\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              </g>\n              <circle cx=\"0\" cy=\"0\" r=\"5\" fill=\"#FEF08A\"/>\n              <circle cx=\"-1\" cy=\"-1\" r=\"2\" fill=\"#FFFFFF\"/>\n            </g>\n            <polygon points=\"175,120 178,127 185,130 178,133 175,140 172,133 165,130 172,127\" fill=\"#EAB308\"/>\n            <polygon points=\"85,210 87,215 92,217 87,219 85,224 83,219 78,217 83,215\" fill=\"#EAB308\"/>",
  "3": "<path d=\"M22 230 Q65 215 110 230 T200 230 T238 230 L238 296 L22 296 Z\" fill=\"#0284C7\" opacity=\"0.8\"/>\n            <path d=\"M22 248 Q75 235 130 248 T238 248 L238 296 L22 296 Z\" fill=\"#0369A1\"/>\n            <path d=\"M22 268 Q90 255 160 268 T238 268 L238 296 L22 296 Z\" fill=\"#075985\"/>\n            <path d=\"M50 232 Q70 228 90 235\" stroke=\"#FFFFFF\" stroke-width=\"2\" fill=\"none\"/>\n            <path d=\"M140 250 Q165 244 190 252\" stroke=\"#FFFFFF\" stroke-width=\"2\" fill=\"none\"/>\n            <path d=\"M60 100 Q68 93 75 100 Q82 93 90 100\" stroke=\"#0369A1\" stroke-width=\"1.8\" fill=\"none\"/>\n            <path d=\"M175 115 Q181 109 187 115 Q193 109 199 115\" stroke=\"#0369A1\" stroke-width=\"1.5\" fill=\"none\"/>\n            <g transform=\"translate(65, 110)\">\n              <path d=\"M5 110 Q20 128 65 128 Q115 128 135 110 L125 95 L15 95 Z\" fill=\"#78350F\" stroke=\"#451A03\" stroke-width=\"2\"/>\n              <path d=\"M12 102 L128 102\" stroke=\"#F59E0B\" stroke-width=\"2\"/>\n              <line x1=\"125\" y1=\"95\" x2=\"148\" y2=\"78\" stroke=\"#451A03\" stroke-width=\"2.5\"/>\n              <line x1=\"38\" y1=\"95\" x2=\"38\" y2=\"35\" stroke=\"#451A03\" stroke-width=\"2.5\"/>\n              <line x1=\"72\" y1=\"95\" x2=\"72\" y2=\"20\" stroke=\"#451A03\" stroke-width=\"3\"/>\n              <line x1=\"104\" y1=\"95\" x2=\"104\" y2=\"38\" stroke=\"#451A03\" stroke-width=\"2.5\"/>\n              <path d=\"M38 40 Q55 52 38 68 Q52 78 38 90 L38 40 Z\" fill=\"#F8FAFC\" stroke=\"#94A3B8\" stroke-width=\"1\"/>\n              <path d=\"M72 26 Q95 40 72 58 Q92 70 72 88 L72 26 Z\" fill=\"#FFFFFF\" stroke=\"#94A3B8\" stroke-width=\"1.2\"/>\n              <path d=\"M104 42 Q120 54 104 70 Q118 80 104 90 L104 42 Z\" fill=\"#F1F5F9\" stroke=\"#94A3B8\" stroke-width=\"1\"/>\n              <polygon points=\"72,20 85,24 72,28\" fill=\"#DC2626\"/>\n            </g>",
  "4": "<path d=\"M22 245 Q130 235 238 245 L238 296 L22 296 Z\" fill=\"#65A30D\"/>\n            <path d=\"M110 248 L140 248 L155 296 L95 296 Z\" fill=\"#A8A29E\"/>\n            <path d=\"M165 95 Q175 80 170 65 Q180 50 175 35\" stroke=\"#D6D3D1\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/>\n            <g transform=\"translate(60, 100)\">\n              <rect x=\"95\" y=\"15\" width=\"16\" height=\"35\" fill=\"#78350F\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <rect x=\"92\" y=\"12\" width=\"22\" height=\"6\" rx=\"1\" fill=\"#9A3412\"/>\n              <rect x=\"15\" y=\"55\" width=\"110\" height=\"90\" fill=\"#FDFBF7\" stroke=\"#451A03\" stroke-width=\"2\"/>\n              <polygon points=\"70,12 5,60 135,60\" fill=\"#B91C1C\" stroke=\"#7F1D1D\" stroke-width=\"2\"/>\n              <polygon points=\"70,18 15,58 125,58\" fill=\"#DC2626\"/>\n              <circle cx=\"70\" cy=\"42\" r=\"9\" fill=\"#FEF08A\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <line x1=\"61\" y1=\"42\" x2=\"79\" y2=\"42\" stroke=\"#451A03\" stroke-width=\"1.2\"/>\n              <line x1=\"70\" y1=\"33\" x2=\"70\" y2=\"51\" stroke=\"#451A03\" stroke-width=\"1.2\"/>\n              <path d=\"M55 145 L55 105 Q70 95 85 105 L85 145 Z\" fill=\"#92400E\" stroke=\"#451A03\" stroke-width=\"1.8\"/>\n              <circle cx=\"80\" cy=\"125\" r=\"2.2\" fill=\"#FDE047\"/>\n              <rect x=\"25\" y=\"80\" width=\"22\" height=\"28\" rx=\"2\" fill=\"#FEF08A\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <line x1=\"36\" y1=\"80\" x2=\"36\" y2=\"108\" stroke=\"#451A03\" stroke-width=\"1\"/>\n              <line x1=\"25\" y1=\"94\" x2=\"47\" y2=\"94\" stroke=\"#451A03\" stroke-width=\"1\"/>\n              <rect x=\"93\" y=\"80\" width=\"22\" height=\"28\" rx=\"2\" fill=\"#FEF08A\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <line x1=\"104\" y1=\"80\" x2=\"104\" y2=\"108\" stroke=\"#451A03\" stroke-width=\"1\"/>\n              <line x1=\"93\" y1=\"94\" x2=\"115\" y2=\"94\" stroke=\"#451A03\" stroke-width=\"1\"/>\n            </g>\n            <circle cx=\"45\" cy=\"235\" r=\"14\" fill=\"#15803D\"/>\n            <circle cx=\"215\" cy=\"235\" r=\"14\" fill=\"#15803D\"/>\n            <circle cx=\"45\" cy=\"235\" r=\"5\" fill=\"#E11D48\"/>\n            <circle cx=\"215\" cy=\"235\" r=\"5\" fill=\"#E11D48\"/>",
  "5": "<path d=\"M22 250 Q130 240 238 250 L238 296 L22 296 Z\" fill=\"#854D0E\" opacity=\"0.3\"/>\n            <path d=\"M22 260 Q130 252 238 260 L238 296 L22 296 Z\" fill=\"#713F12\" opacity=\"0.5\"/>\n            <g stroke=\"#78350F\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\">\n              <path d=\"M120 248 Q100 265 80 285\"/>\n              <path d=\"M128 250 Q125 270 120 290\"/>\n              <path d=\"M135 250 Q150 268 175 285\"/>\n              <path d=\"M112 252 Q90 270 70 275\"/>\n              <path d=\"M145 252 Q165 270 190 275\"/>\n            </g>\n            <path d=\"M110 250 Q122 190 115 155 Q125 170 130 150 Q135 170 148 155 Q138 190 150 250 Z\" fill=\"#78350F\" stroke=\"#451A03\" stroke-width=\"2\"/>\n            <path d=\"M124 180 Q128 210 126 245\" stroke=\"#543118\" stroke-width=\"2\" fill=\"none\"/>\n            <circle cx=\"130\" cy=\"115\" r=\"45\" fill=\"#15803D\" opacity=\"0.9\"/>\n            <circle cx=\"95\" cy=\"130\" r=\"35\" fill=\"#16A34A\" opacity=\"0.95\"/>\n            <circle cx=\"165\" cy=\"130\" r=\"35\" fill=\"#16A34A\" opacity=\"0.95\"/>\n            <circle cx=\"110\" cy=\"95\" r=\"32\" fill=\"#22C55E\"/>\n            <circle cx=\"150\" cy=\"95\" r=\"32\" fill=\"#22C55E\"/>\n            <circle cx=\"130\" cy=\"80\" r=\"28\" fill=\"#4ADE80\"/>\n            <circle cx=\"115\" cy=\"95\" r=\"4\" fill=\"#FEF08A\"/>\n            <circle cx=\"145\" cy=\"115\" r=\"4\" fill=\"#FEF08A\"/>\n            <circle cx=\"130\" cy=\"78\" r=\"3.5\" fill=\"#FEF08A\"/>\n            <circle cx=\"90\" cy=\"135\" r=\"3\" fill=\"#FEF08A\"/>",
  "6": "<g transform=\"translate(160, 110)\">\n              <circle cx=\"0\" cy=\"0\" r=\"32\" fill=\"#FDE047\" opacity=\"0.8\"/>\n              <line x1=\"0\" y1=\"-45\" x2=\"0\" y2=\"-36\" stroke=\"#EAB308\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n              <line x1=\"32\" y1=\"-32\" x2=\"25\" y2=\"-25\" stroke=\"#EAB308\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n              <line x1=\"45\" y1=\"0\" x2=\"36\" y2=\"0\" stroke=\"#EAB308\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n              <line x1=\"32\" y1=\"32\" x2=\"25\" y2=\"25\" stroke=\"#EAB308\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n              <line x1=\"0\" y1=\"45\" x2=\"0\" y2=\"36\" stroke=\"#EAB308\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n            </g>\n            <g fill=\"#475569\">\n              <circle cx=\"75\" cy=\"165\" r=\"38\"/>\n              <circle cx=\"105\" cy=\"145\" r=\"32\"/>\n              <circle cx=\"60\" cy=\"190\" r=\"28\"/>\n            </g>\n            <g fill=\"#334155\">\n              <circle cx=\"85\" cy=\"175\" r=\"34\"/>\n              <circle cx=\"115\" cy=\"180\" r=\"28\"/>\n            </g>\n            <line x1=\"60\" y1=\"225\" x2=\"52\" y2=\"250\" stroke=\"#64748B\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"80\" y1=\"225\" x2=\"72\" y2=\"250\" stroke=\"#64748B\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"100\" y1=\"225\" x2=\"92\" y2=\"250\" stroke=\"#64748B\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <g fill=\"#F8FAFC\" stroke=\"#CBD5E1\" stroke-width=\"1.5\">\n              <circle cx=\"140\" cy=\"160\" r=\"36\"/>\n              <circle cx=\"175\" cy=\"165\" r=\"32\"/>\n              <circle cx=\"130\" cy=\"190\" r=\"28\"/>\n              <circle cx=\"165\" cy=\"195\" r=\"26\"/>\n            </g>\n            <path d=\"M110 160 Q135 130 165 140 T200 180\" stroke=\"#FEF08A\" stroke-width=\"2\" fill=\"none\"/>",
  "7": "<path d=\"M130 65 Q115 130 145 190 T120 280\" stroke=\"#78350F\" stroke-width=\"10\" stroke-linecap=\"round\" fill=\"none\"/>\n            <path d=\"M125 140 Q170 125 195 145\" stroke=\"#78350F\" stroke-width=\"5\" stroke-linecap=\"round\" fill=\"none\"/>\n            <circle cx=\"190\" cy=\"165\" r=\"14\" fill=\"#DC2626\" stroke=\"#991B1B\" stroke-width=\"1.5\"/>\n            <path d=\"M190 151 Q192 145 196 142\" stroke=\"#451A03\" stroke-width=\"2\" fill=\"none\"/>\n            <path d=\"M192 145 Q198 140 205 143\" fill=\"#15803D\"/>\n            <path d=\"M120 80 Q150 75 160 95 Q170 120 135 125 Q100 130 115 165 Q130 200 160 195 Q180 190 170 220 Q160 250 125 255 Q105 258 95 270\" stroke=\"#047857\" stroke-width=\"14\" stroke-linecap=\"round\" fill=\"none\"/>\n            <path d=\"M120 80 Q150 75 160 95 Q170 120 135 125 Q100 130 115 165 Q130 200 160 195 Q180 190 170 220 Q160 250 125 255 Q105 258 95 270\" stroke=\"#10B981\" stroke-width=\"10\" stroke-linecap=\"round\" fill=\"none\"/>\n            <path d=\"M120 80 Q150 75 160 95 Q170 120 135 125 Q100 130 115 165 Q130 200 160 195 Q180 190 170 220 Q160 250 125 255\" stroke=\"#FBBF24\" stroke-width=\"2.5\" stroke-dasharray=\"3,4\" fill=\"none\"/>\n            <g transform=\"translate(112, 78)\">\n              <ellipse cx=\"0\" cy=\"0\" rx=\"9\" ry=\"6\" fill=\"#065F46\" transform=\"rotate(-30)\"/>\n              <circle cx=\"-3\" cy=\"-2\" r=\"2.2\" fill=\"#FEF08A\"/>\n              <circle cx=\"-3\" cy=\"-2\" r=\"1\" fill=\"#000000\"/>\n              <path d=\"M-8 0 L-16 -2 M-16 -2 L-20 -5 M-16 -2 L-20 1\" stroke=\"#DC2626\" stroke-width=\"1.5\" stroke-linecap=\"round\" fill=\"none\"/>\n            </g>",
  "8": "<circle cx=\"130\" cy=\"115\" r=\"42\" fill=\"#C4B5FD\" opacity=\"0.4\"/>\n            <g transform=\"translate(130, 185)\">\n              <polygon points=\"-75,45 75,45 65,58 -65,58\" fill=\"#334155\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n              <polygon points=\"-65,45 -80,-10 -55,-45 55,-45 80,-10 65,45\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n              <polygon points=\"-52,35 -65,-8 -45,-36 45,-36 65,-8 52,35\" fill=\"#64748B\" stroke=\"#334155\" stroke-width=\"1.5\"/>\n              <g stroke=\"#F59E0B\" stroke-width=\"3\" stroke-linecap=\"round\">\n                <line x1=\"0\" y1=\"-25\" x2=\"0\" y2=\"20\"/>\n                <line x1=\"-18\" y1=\"-8\" x2=\"18\" y2=\"-8\"/>\n              </g>\n              <circle cx=\"0\" cy=\"-8\" r=\"4\" fill=\"#FBBF24\"/>\n            </g>\n            <g transform=\"translate(180, 190)\">\n              <path d=\"M-5 45 Q5 15 -10 -15\" stroke=\"#15803D\" stroke-width=\"2.5\" fill=\"none\"/>\n              <path d=\"M-10 -15 Q-25 -25 -20 -35 Q-10 -30 -10 -15 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1\"/>\n              <path d=\"M-10 -15 Q0 -40 10 -35 Q5 -20 -10 -15 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1\"/>\n              <circle cx=\"-10\" cy=\"-25\" r=\"2.5\" fill=\"#FDE047\"/>\n            </g>",
  "9": "<circle cx=\"130\" cy=\"165\" r=\"62\" fill=\"#F472B6\" opacity=\"0.3\"/>\n            <g transform=\"translate(130, 175)\">\n              <polygon points=\"-25,45 25,45 45,95 -45,95\" fill=\"#FEF3C7\" stroke=\"#D97706\" stroke-width=\"1.5\"/>\n              <path d=\"M-18 55 C-35 45 -35 70 -12 60 C-35 75 -10 85 0 65 C10 85 35 75 12 60 C35 70 35 45 18 55 Z\" fill=\"#E11D48\" stroke=\"#9F1239\" stroke-width=\"1.5\"/>\n              <circle cx=\"0\" cy=\"58\" r=\"5\" fill=\"#BE123C\"/>\n              <path d=\"M-8 62 Q-15 90 -25 105\" stroke=\"#E11D48\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M8 62 Q15 90 25 105\" stroke=\"#E11D48\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M-45 15 Q-60 -10 -40 -30 Q-20 -15 -45 15 Z\" fill=\"#15803D\"/>\n              <path d=\"M45 15 Q60 -10 40 -30 Q20 -15 45 15 Z\" fill=\"#15803D\"/>\n              <path d=\"M0 -30 Q0 -65 15 -60 Q10 -35 0 -30 Z\" fill=\"#16A34A\"/>\n              <circle cx=\"0\" cy=\"10\" r=\"22\" fill=\"#E11D48\" stroke=\"#9F1239\" stroke-width=\"1.5\"/>\n              <circle cx=\"0\" cy=\"10\" r=\"14\" fill=\"#F43F5E\"/>\n              <circle cx=\"0\" cy=\"10\" r=\"7\" fill=\"#FDA4AF\"/>\n              <circle cx=\"-32\" cy=\"15\" r=\"17\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1.5\"/>\n              <circle cx=\"-32\" cy=\"15\" r=\"10\" fill=\"#FDE047\"/>\n              <circle cx=\"32\" cy=\"15\" r=\"17\" fill=\"#F472B6\" stroke=\"#DB2777\" stroke-width=\"1.5\"/>\n              <circle cx=\"32\" cy=\"15\" r=\"10\" fill=\"#FBCFE8\"/>\n              <circle cx=\"-16\" cy=\"-22\" r=\"15\" fill=\"#A855F7\" stroke=\"#7E22CE\" stroke-width=\"1.5\"/>\n              <circle cx=\"16\" cy=\"-22\" r=\"15\" fill=\"#38BDF8\" stroke=\"#0284C7\" stroke-width=\"1.5\"/>\n            </g>\n            <polygon points=\"65,115 67,120 72,122 67,124 65,129 63,124 58,122 63,120\" fill=\"#E11D48\"/>\n            <polygon points=\"195,110 197,115 202,117 197,119 195,124 193,119 188,117 193,115\" fill=\"#E11D48\"/>",
  "10": "<g stroke=\"#D97706\" stroke-width=\"2\" stroke-linecap=\"round\">\n              <path d=\"M50 280 Q60 220 50 180\"/>\n              <path d=\"M70 280 Q75 210 80 170\"/>\n              <path d=\"M90 280 Q92 230 105 185\"/>\n              <path d=\"M170 280 Q165 225 155 185\"/>\n              <path d=\"M190 280 Q188 215 180 170\"/>\n              <path d=\"M210 280 Q205 220 215 180\"/>\n            </g>\n            <g fill=\"#F59E0B\">\n              <ellipse cx=\"50\" cy=\"180\" rx=\"6\" ry=\"12\" transform=\"rotate(-15 50 180)\"/>\n              <ellipse cx=\"80\" cy=\"170\" rx=\"6\" ry=\"12\" transform=\"rotate(10 80 170)\"/>\n              <ellipse cx=\"105\" cy=\"185\" rx=\"6\" ry=\"12\" transform=\"rotate(20 105 185)\"/>\n              <ellipse cx=\"155\" cy=\"185\" rx=\"6\" ry=\"12\" transform=\"rotate(-20 155 185)\"/>\n              <ellipse cx=\"180\" cy=\"170\" rx=\"6\" ry=\"12\" transform=\"rotate(-10 180 170)\"/>\n              <ellipse cx=\"215\" cy=\"180\" rx=\"6\" ry=\"12\" transform=\"rotate(15 215 180)\"/>\n            </g>\n            <g transform=\"translate(130, 160)\">\n              <line x1=\"35\" y1=\"95\" x2=\"-45\" y2=\"-45\" stroke=\"#78350F\" stroke-width=\"7\" stroke-linecap=\"round\"/>\n              <line x1=\"-15\" y1=\"-2\" x2=\"-25\" y2=\"12\" stroke=\"#451A03\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n              <rect x=\"-48\" y=\"-52\" width=\"12\" height=\"12\" fill=\"#D97706\" rx=\"2\" transform=\"rotate(45 -42 -46)\"/>\n              <path d=\"M-45 -45 C-30 -95 30 -115 85 -75 C45 -85 5 -75 -15 -40 C-30 -15 -42 -35 -45 -45 Z\" fill=\"#E2E8F0\" stroke=\"#475569\" stroke-width=\"2\"/>\n              <path d=\"M-42 -48 C-25 -92 32 -112 85 -75\" stroke=\"#FFFFFF\" stroke-width=\"2.5\" fill=\"none\"/>\n            </g>",
  "11": "<g transform=\"translate(130, 175)\">\n              <circle cx=\"0\" cy=\"0\" r=\"50\" fill=\"#EF4444\" opacity=\"0.2\"/>\n              <g stroke=\"#78350F\" stroke-width=\"2.5\" stroke-linecap=\"round\">\n                <line x1=\"45\" y1=\"65\" x2=\"-45\" y2=\"-65\"/>\n                <line x1=\"50\" y1=\"62\" x2=\"-35\" y2=\"-72\"/>\n                <line x1=\"40\" y1=\"68\" x2=\"-55\" y2=\"-58\"/>\n              </g>\n              <rect x=\"30\" y=\"45\" width=\"22\" height=\"12\" rx=\"2\" fill=\"#B45309\" transform=\"rotate(33 41 51)\"/>\n              <line x1=\"-50\" y1=\"65\" x2=\"30\" y2=\"-45\" stroke=\"#1E293B\" stroke-width=\"6\" stroke-linecap=\"round\"/>\n              <circle cx=\"-53\" cy=\"69\" r=\"6\" fill=\"#F59E0B\"/>\n              <path d=\"M30 -45 Q65 -75 55 -95 Q45 -115 15 -90\" stroke=\"#0F172A\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/>\n              <circle cx=\"-5\" cy=\"5\" r=\"8\" fill=\"#DC2626\"/>\n              <path d=\"M-8 12 Q-12 35 -5 45\" stroke=\"#DC2626\" stroke-width=\"2.5\" fill=\"none\"/>\n              <path d=\"M-2 12 Q5 35 12 45\" stroke=\"#DC2626\" stroke-width=\"2.5\" fill=\"none\"/>\n            </g>",
  "12": "<path d=\"M30 200 Q90 185 140 195 T230 170\" stroke=\"#78350F\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n            <circle cx=\"85\" cy=\"180\" r=\"5\" fill=\"#F472B6\"/>\n            <circle cx=\"170\" cy=\"175\" r=\"5\" fill=\"#F472B6\"/>\n            <circle cx=\"210\" cy=\"165\" r=\"4\" fill=\"#F472B6\"/>\n            <g transform=\"translate(90, 160)\">\n              <path d=\"M-15 15 L-35 30 L-25 18 Z\" fill=\"#0284C7\"/>\n              <ellipse cx=\"0\" cy=\"5\" rx=\"16\" ry=\"12\" fill=\"#0284C7\"/>\n              <ellipse cx=\"-2\" cy=\"5\" rx=\"12\" ry=\"8\" fill=\"#0369A1\"/>\n              <circle cx=\"12\" cy=\"-6\" r=\"8\" fill=\"#38BDF8\"/>\n              <circle cx=\"14\" cy=\"-8\" r=\"1.8\" fill=\"#0F172A\"/>\n              <polygon points=\"19,-8 28,-5 19,-3\" fill=\"#F59E0B\"/>\n              <line x1=\"2\" y1=\"16\" x2=\"2\" y2=\"24\" stroke=\"#451A03\" stroke-width=\"2\"/>\n            </g>\n            <g transform=\"translate(160, 155)\">\n              <path d=\"M15 15 L35 30 L25 18 Z\" fill=\"#D97706\"/>\n              <ellipse cx=\"0\" cy=\"5\" rx=\"16\" ry=\"12\" fill=\"#D97706\"/>\n              <ellipse cx=\"2\" cy=\"5\" rx=\"12\" ry=\"8\" fill=\"#B45309\"/>\n              <circle cx=\"-12\" cy=\"-6\" r=\"8\" fill=\"#FBBF24\"/>\n              <circle cx=\"-14\" cy=\"-8\" r=\"1.8\" fill=\"#0F172A\"/>\n              <polygon points=\"-19,-8 -28,-5 -19,-3\" fill=\"#EA580C\"/>\n              <line x1=\"-2\" y1=\"16\" x2=\"-2\" y2=\"24\" stroke=\"#451A03\" stroke-width=\"2\"/>\n            </g>\n            <circle cx=\"125\" cy=\"130\" r=\"3\" fill=\"#6366F1\"/>\n            <path d=\"M128 130 L128 115 Q135 112 138 118\" stroke=\"#6366F1\" stroke-width=\"1.5\" fill=\"none\"/>",
  "13": "<path d=\"M22 250 Q130 230 238 250 L238 296 L22 296 Z\" fill=\"#84CC16\"/>\n            <circle cx=\"190\" cy=\"95\" r=\"24\" fill=\"#F59E0B\" opacity=\"0.6\"/>\n            <circle cx=\"190\" cy=\"95\" r=\"16\" fill=\"#FBBF24\"/>\n            <g transform=\"translate(100, 150)\">\n              <circle cx=\"15\" cy=\"15\" r=\"12\" fill=\"#FDE047\" stroke=\"#CA8A04\" stroke-width=\"1.5\"/>\n              <path d=\"M8 12 Q15 6 22 12\" stroke=\"#78350F\" stroke-width=\"2.5\" fill=\"none\"/>\n              <path d=\"M5 28 L25 28 L32 60 L-2 60 Z\" fill=\"#38BDF8\" stroke=\"#0284C7\" stroke-width=\"1.5\"/>\n              <path d=\"M24 35 L42 28\" stroke=\"#CA8A04\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n              <path d=\"M6 35 L-12 25\" stroke=\"#CA8A04\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n              <path d=\"M6 60 L-2 88 L6 88\" stroke=\"#CA8A04\" stroke-width=\"3.5\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M24 60 L38 82 L46 82\" stroke=\"#CA8A04\" stroke-width=\"3.5\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M-12 25 Q-30 -10 -40 -35\" stroke=\"#64748B\" stroke-width=\"1.2\" fill=\"none\"/>\n            </g>\n            <g transform=\"translate(60, 100)\">\n              <ellipse cx=\"-15\" cy=\"-25\" rx=\"14\" ry=\"17\" fill=\"#EF4444\"/>\n              <ellipse cx=\"5\" cy=\"-35\" rx=\"13\" ry=\"16\" fill=\"#8B5CF6\"/>\n              <ellipse cx=\"-2\" cy=\"-15\" rx=\"12\" ry=\"15\" fill=\"#10B981\"/>\n            </g>",
  "14": "<path d=\"M22 240 Q130 225 238 240 L238 296 L22 296 Z\" fill=\"#4B5563\"/>\n            <g stroke=\"#92400E\" stroke-width=\"2\" stroke-linecap=\"round\">\n              <path d=\"M40 270 Q45 220 35 190\"/>\n              <path d=\"M55 275 Q65 210 50 180\"/>\n              <path d=\"M195 270 Q185 210 200 180\"/>\n              <path d=\"M215 275 Q210 220 225 190\"/>\n            </g>\n            <g transform=\"translate(125, 175)\">\n              <path d=\"M-30 45 C-70 50 -80 0 -50 -10 C-35 -15 -20 20 -30 45 Z\" fill=\"#EA580C\" stroke=\"#9A3412\" stroke-width=\"1.5\"/>\n              <path d=\"M-55 -8 Q-75 5 -60 30\" fill=\"#FFFFFF\"/>\n              <path d=\"M-25 40 Q-30 15 -15 -5 Q5 -15 20 15 Q25 35 15 48 Z\" fill=\"#EA580C\" stroke=\"#9A3412\" stroke-width=\"1.5\"/>\n              <path d=\"M0 10 Q12 18 10 38 Q2 35 -5 20 Z\" fill=\"#FFFFFF\"/>\n              <g transform=\"translate(8, -12)\">\n                <polygon points=\"0,0 -8,-25 5,-15\" fill=\"#EA580C\" stroke=\"#9A3412\" stroke-width=\"1\"/>\n                <polygon points=\"12,0 20,-25 7,-15\" fill=\"#EA580C\" stroke=\"#9A3412\" stroke-width=\"1\"/>\n                <polygon points=\"-12,-8 18,-8 3,18\" fill=\"#EA580C\" stroke=\"#9A3412\" stroke-width=\"1.5\"/>\n                <polygon points=\"-10,-5 2,16 -3,4\" fill=\"#FFFFFF\"/>\n                <polygon points=\"16,-5 4,16 9,4\" fill=\"#FFFFFF\"/>\n                <circle cx=\"3\" cy=\"18\" r=\"2.2\" fill=\"#000000\"/>\n                <ellipse cx=\"-2\" cy=\"2\" rx=\"2\" ry=\"1.2\" fill=\"#000000\" transform=\"rotate(-15 -2 2)\"/>\n                <ellipse cx=\"8\" cy=\"2\" rx=\"2\" ry=\"1.2\" fill=\"#000000\" transform=\"rotate(15 8 2)\"/>\n              </g>\n            </g>",
  "15": "<polygon points=\"40,210 55,160 70,210\" fill=\"#334155\"/>\n            <polygon points=\"190,210 205,160 220,210\" fill=\"#334155\"/>\n            <path d=\"M22 245 L80 225 L180 225 L238 245 L238 296 L22 296 Z\" fill=\"#64748B\" stroke=\"#334155\" stroke-width=\"2\"/>\n            <g transform=\"translate(130, 160)\">\n              <path d=\"M-55 45 C-65 15 -45 -20 -15 -25 C25 -30 65 0 65 45 Z\" fill=\"#451A03\" stroke=\"#270E02\" stroke-width=\"2\"/>\n              <ellipse cx=\"-42\" cy=\"45\" rx=\"18\" ry=\"22\" fill=\"#381402\"/>\n              <rect x=\"25\" y=\"20\" width=\"22\" height=\"42\" rx=\"8\" fill=\"#451A03\"/>\n              <g transform=\"translate(50, -10)\">\n                <circle cx=\"-5\" cy=\"-18\" r=\"6\" fill=\"#381402\"/>\n                <ellipse cx=\"5\" cy=\"-2\" rx=\"18\" ry=\"15\" fill=\"#451A03\"/>\n                <ellipse cx=\"14\" cy=\"2\" rx=\"10\" ry=\"7\" fill=\"#78350F\"/>\n                <circle cx=\"20\" cy=\"0\" r=\"3\" fill=\"#000000\"/>\n                <circle cx=\"6\" cy=\"-5\" r=\"2.2\" fill=\"#FEF08A\"/>\n                <circle cx=\"6\" cy=\"-5\" r=\"1.2\" fill=\"#000000\"/>\n              </g>\n            </g>",
  "16": "<circle cx=\"130\" cy=\"170\" r=\"85\" fill=\"#312E81\" opacity=\"0.6\"/>\n            <circle cx=\"130\" cy=\"170\" r=\"55\" fill=\"#4338CA\" opacity=\"0.4\"/>\n            <circle cx=\"50\" cy=\"100\" r=\"1.5\" fill=\"#FFFFFF\"/>\n            <circle cx=\"85\" cy=\"80\" r=\"2\" fill=\"#FFFFFF\"/>\n            <circle cx=\"195\" cy=\"90\" r=\"2.5\" fill=\"#FFFFFF\"/>\n            <circle cx=\"215\" cy=\"130\" r=\"1.5\" fill=\"#FFFFFF\"/>\n            <circle cx=\"45\" cy=\"220\" r=\"2\" fill=\"#FFFFFF\"/>\n            <circle cx=\"75\" cy=\"245\" r=\"1.8\" fill=\"#FFFFFF\"/>\n            <circle cx=\"205\" cy=\"235\" r=\"2\" fill=\"#FFFFFF\"/>\n            <line x1=\"50\" y1=\"100\" x2=\"85\" y2=\"80\" stroke=\"#818CF8\" stroke-width=\"0.8\" opacity=\"0.5\"/>\n            <line x1=\"85\" y1=\"80\" x2=\"110\" y2=\"105\" stroke=\"#818CF8\" stroke-width=\"0.8\" opacity=\"0.5\"/>\n            <g transform=\"translate(130, 165)\">\n              <circle cx=\"0\" cy=\"0\" r=\"48\" fill=\"#FEF08A\" opacity=\"0.15\"/>\n              <circle cx=\"0\" cy=\"0\" r=\"25\" fill=\"#FEF08A\" opacity=\"0.3\"/>\n              <path d=\"M0 -65 L7 -15 L45 0 L7 15 L0 65 L-7 15 L-45 0 L-7 -15 Z\" fill=\"#FEF08A\" stroke=\"#F59E0B\" stroke-width=\"1\"/>\n              <path d=\"M-30 -30 L-5 -12 L0 -42 L5 -12 L30 -30 L12 -5 L42 0 L12 5 L30 30 L5 12 L0 42 L-5 12 L-30 30 L-12 5 L-42 0 L-12 -5 Z\" fill=\"#FDE047\" opacity=\"0.85\"/>\n              <circle cx=\"0\" cy=\"0\" r=\"6\" fill=\"#FFFFFF\"/>\n            </g>",
  "17": "<polygon points=\"30,296 90,240 150,296\" fill=\"#991B1B\"/>\n            <rect x=\"105\" y=\"225\" width=\"25\" height=\"35\" fill=\"#78350F\"/>\n            <ellipse cx=\"117\" cy=\"225\" rx=\"20\" ry=\"8\" fill=\"#B45309\" stroke=\"#78350F\" stroke-width=\"2\"/>\n            <g transform=\"translate(130, 135)\">\n              <path d=\"M-5 -5 C-35 -35 -75 -45 -95 -25 C-75 -15 -45 -10 -5 5 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1.5\"/>\n              <path d=\"M-95 -25 C-85 -10 -65 0 -45 -10\" fill=\"#0F172A\"/>\n              <path d=\"M5 -5 C35 -35 75 -45 95 -25 C75 -15 45 -10 5 5 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1.5\"/>\n              <path d=\"M95 -25 C85 -10 65 0 45 -10\" fill=\"#0F172A\"/>\n              <ellipse cx=\"0\" cy=\"5\" rx=\"14\" ry=\"18\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1.2\"/>\n              <path d=\"M0 -8 Q-2 -30 2 -42\" stroke=\"#FFFFFF\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/>\n              <polygon points=\"2,-45 4,-68 0,-45\" fill=\"#EA580C\"/>\n              <line x1=\"-3\" y1=\"22\" x2=\"-8\" y2=\"65\" stroke=\"#EA580C\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n              <line x1=\"3\" y1=\"22\" x2=\"8\" y2=\"62\" stroke=\"#EA580C\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>\n            </g>",
  "18": "<path d=\"M22 250 Q130 235 238 250 L238 296 L22 296 Z\" fill=\"#65A30D\"/>\n            <g transform=\"translate(125, 170)\">\n              <path d=\"M-30 45 Q-55 20 -40 -5\" stroke=\"#D97706\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M-25 45 C-30 15 -10 -15 15 -10 C25 5 28 35 25 55 Z\" fill=\"#D97706\" stroke=\"#B45309\" stroke-width=\"1.5\"/>\n              <rect x=\"8\" y=\"20\" width=\"12\" height=\"38\" rx=\"5\" fill=\"#F59E0B\"/>\n              <rect x=\"-6\" y=\"20\" width=\"12\" height=\"38\" rx=\"5\" fill=\"#D97706\"/>\n              <path d=\"M6 -5 Q18 0 24 -2\" stroke=\"#DC2626\" stroke-width=\"4.5\" stroke-linecap=\"round\" fill=\"none\"/>\n              <circle cx=\"16\" cy=\"3\" r=\"3.5\" fill=\"#FEF08A\"/>\n              <g transform=\"translate(16, -22)\">\n                <circle cx=\"0\" cy=\"0\" r=\"16\" fill=\"#F59E0B\"/>\n                <path d=\"M-8 -6 Q-18 10 -10 22\" stroke=\"#B45309\" stroke-width=\"8\" stroke-linecap=\"round\" fill=\"none\"/>\n                <ellipse cx=\"10\" cy=\"4\" rx=\"10\" ry=\"7\" fill=\"#FEF08A\"/>\n                <circle cx=\"16\" cy=\"1\" r=\"3\" fill=\"#000000\"/>\n                <circle cx=\"3\" cy=\"-4\" r=\"2.5\" fill=\"#451A03\"/>\n                <circle cx=\"4\" cy=\"-5\" r=\"0.8\" fill=\"#FFFFFF\"/>\n              </g>\n            </g>",
  "19": "<path d=\"M22 260 Q130 245 238 260 L238 296 L22 296 Z\" fill=\"#334155\"/>\n            <path d=\"M40 220 Q90 205 150 220 T230 220\" stroke=\"#F8FAFC\" stroke-width=\"12\" stroke-linecap=\"round\" opacity=\"0.6\" fill=\"none\"/>\n            <g transform=\"translate(130, 160)\">\n              <polygon points=\"-32,100 -22,-50 22,-50 32,100\" fill=\"#64748B\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n              <line x1=\"-24\" y1=\"-20\" x2=\"24\" y2=\"-20\" stroke=\"#475569\" stroke-width=\"1.5\"/>\n              <line x1=\"-27\" y1=\"20\" x2=\"27\" y2=\"20\" stroke=\"#475569\" stroke-width=\"1.5\"/>\n              <line x1=\"-30\" y1=\"60\" x2=\"30\" y2=\"60\" stroke=\"#475569\" stroke-width=\"1.5\"/>\n              <rect x=\"-26\" y=\"-62\" width=\"52\" height=\"12\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"1.8\"/>\n              <rect x=\"-22\" y=\"-72\" width=\"10\" height=\"10\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"1.5\"/>\n              <rect x=\"-5\" y=\"-72\" width=\"10\" height=\"10\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"1.5\"/>\n              <rect x=\"12\" y=\"-72\" width=\"10\" height=\"10\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"1.5\"/>\n              <line x1=\"0\" y1=\"-72\" x2=\"0\" y2=\"-92\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n              <polygon points=\"0,-92 18,-86 0,-80\" fill=\"#DC2626\"/>\n              <path d=\"M-6 -20 L-6 -5 Q0 -2 6 -5 L6 -20 Q0 -24 -6 -20 Z\" fill=\"#FDE047\" stroke=\"#1E293B\" stroke-width=\"1.2\"/>\n              <path d=\"M-6 20 L-6 35 Q0 38 6 35 L6 20 Q0 16 -6 20 Z\" fill=\"#FDE047\" stroke=\"#1E293B\" stroke-width=\"1.2\"/>\n            </g>",
  "20": "<path d=\"M40 280 L40 160 Q130 110 220 160 L220 280 Z\" stroke=\"#15803D\" stroke-width=\"16\" fill=\"none\"/>\n            <circle cx=\"45\" cy=\"180\" r=\"5\" fill=\"#F43F5E\"/>\n            <circle cx=\"85\" cy=\"135\" r=\"5\" fill=\"#F43F5E\"/>\n            <circle cx=\"175\" cy=\"135\" r=\"5\" fill=\"#F43F5E\"/>\n            <circle cx=\"215\" cy=\"180\" r=\"5\" fill=\"#F43F5E\"/>\n            <g transform=\"translate(130, 205)\">\n              <ellipse cx=\"0\" cy=\"45\" rx=\"55\" ry=\"16\" fill=\"#E2E8F0\" stroke=\"#64748B\" stroke-width=\"2\"/>\n              <ellipse cx=\"0\" cy=\"42\" rx=\"48\" ry=\"12\" fill=\"#38BDF8\"/>\n              <rect x=\"-8\" y=\"10\" width=\"16\" height=\"32\" fill=\"#CBD5E1\" stroke=\"#64748B\" stroke-width=\"1.5\"/>\n              <ellipse cx=\"0\" cy=\"10\" rx=\"28\" ry=\"8\" fill=\"#E2E8F0\" stroke=\"#64748B\" stroke-width=\"1.8\"/>\n              <ellipse cx=\"0\" cy=\"8\" rx=\"22\" ry=\"6\" fill=\"#38BDF8\"/>\n              <path d=\"M0 6 C-12 -25 -25 -10 -25 15\" stroke=\"#BAE6FD\" stroke-width=\"2.5\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M0 6 C12 -25 25 -10 25 15\" stroke=\"#BAE6FD\" stroke-width=\"2.5\" stroke-linecap=\"round\" fill=\"none\"/>\n              <circle cx=\"0\" cy=\"-5\" r=\"3\" fill=\"#FFFFFF\"/>\n            </g>",
  "21": "<polygon points=\"22,270 70,140 140,270\" fill=\"#64748B\"/>\n            <polygon points=\"120,270 190,135 238,270\" fill=\"#64748B\"/>\n            <polygon points=\"50,296 130,85 210,296\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n            <polygon points=\"130,85 105,140 120,130 130,145 142,132 155,140\" fill=\"#F8FAFC\" stroke=\"#E2E8F0\" stroke-width=\"1.2\"/>\n            <polygon points=\"70,140 55,175 70,168 85,175\" fill=\"#E2E8F0\"/>\n            <polygon points=\"190,135 175,170 190,165 205,170\" fill=\"#E2E8F0\"/>\n            <path d=\"M40 210 Q130 195 220 210\" stroke=\"#FFFFFF\" stroke-width=\"12\" stroke-linecap=\"round\" opacity=\"0.6\" fill=\"none\"/>",
  "22": "<rect x=\"22\" y=\"56\" width=\"216\" height=\"240\" fill=\"#65A30D\" rx=\"12\"/>\n            <path d=\"M105 296 L115 210 Q115 150 40 100 L55 100 Q130 150 130 210 L155 296 Z\" fill=\"#FDE68A\" stroke=\"#B45309\" stroke-width=\"1.5\"/>\n            <path d=\"M125 210 Q135 150 210 100 L225 100 Q145 150 135 210 Z\" fill=\"#FDE68A\" stroke=\"#B45309\" stroke-width=\"1.5\"/>\n            <g transform=\"translate(130, 195)\">\n              <rect x=\"-4\" y=\"-35\" width=\"8\" height=\"50\" fill=\"#78350F\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <polygon points=\"-4,-35 -38,-35 -48,-27 -38,-19 -4,-19\" fill=\"#B45309\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <line x1=\"-32\" y1=\"-27\" x2=\"-10\" y2=\"-27\" stroke=\"#FEF08A\" stroke-width=\"2\"/>\n              <polygon points=\"4,-25 38,-25 48,-17 38,-9 4,-9\" fill=\"#B45309\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n              <line x1=\"10\" y1=\"-17\" x2=\"32\" y2=\"-17\" stroke=\"#FEF08A\" stroke-width=\"2\"/>\n            </g>",
  "23": "<rect x=\"22\" y=\"240\" width=\"216\" height=\"56\" fill=\"#78350F\"/>\n            <line x1=\"22\" y1=\"265\" x2=\"238\" y2=\"265\" stroke=\"#451A03\" stroke-width=\"1.5\"/>\n            <g transform=\"translate(145, 230)\">\n              <polygon points=\"0,15 45,15 25,-15\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1.5\"/>\n              <circle cx=\"15\" cy=\"8\" r=\"4\" fill=\"#F59E0B\"/>\n              <circle cx=\"28\" cy=\"2\" r=\"3\" fill=\"#F59E0B\"/>\n            </g>\n            <g transform=\"translate(100, 225)\">\n              <path d=\"M-25 10 Q-50 20 -45 -5\" stroke=\"#A8A29E\" stroke-width=\"2.5\" fill=\"none\"/>\n              <ellipse cx=\"0\" cy=\"5\" rx=\"18\" ry=\"12\" fill=\"#78716C\" stroke=\"#44403C\" stroke-width=\"1.2\"/>\n              <circle cx=\"8\" cy=\"-6\" r=\"6\" fill=\"#A8A29E\"/>\n              <circle cx=\"8\" cy=\"-6\" r=\"3.5\" fill=\"#F472B6\"/>\n              <polygon points=\"12,0 24,6 15,10\" fill=\"#78716C\"/>\n              <circle cx=\"24\" cy=\"6\" r=\"1.5\" fill=\"#000000\"/>\n              <circle cx=\"15\" cy=\"3\" r=\"1.5\" fill=\"#000000\"/>\n            </g>\n            <g transform=\"translate(195, 235)\">\n              <path d=\"M15 10 Q35 25 30 -5\" stroke=\"#A8A29E\" stroke-width=\"2\" fill=\"none\"/>\n              <ellipse cx=\"0\" cy=\"5\" rx=\"14\" ry=\"9\" fill=\"#78716C\"/>\n              <circle cx=\"-6\" cy=\"-4\" r=\"5\" fill=\"#F472B6\"/>\n            </g>",
  "24": "<circle cx=\"130\" cy=\"170\" r=\"72\" fill=\"#FB7185\" opacity=\"0.3\"/>\n            <circle cx=\"130\" cy=\"170\" r=\"50\" fill=\"#F43F5E\" opacity=\"0.3\"/>\n            <g stroke=\"#F59E0B\" stroke-width=\"2\" stroke-linecap=\"round\" opacity=\"0.8\">\n              <line x1=\"130\" y1=\"80\" x2=\"130\" y2=\"65\"/>\n              <line x1=\"130\" y1=\"260\" x2=\"130\" y2=\"275\"/>\n              <line x1=\"40\" y1=\"170\" x2=\"25\" y2=\"170\"/>\n              <line x1=\"220\" y1=\"170\" x2=\"235\" y2=\"170\"/>\n              <line x1=\"65\" y1=\"105\" x2=\"52\" y2=\"92\"/>\n              <line x1=\"195\" y1=\"105\" x2=\"208\" y2=\"92\"/>\n              <line x1=\"65\" y1=\"235\" x2=\"52\" y2=\"248\"/>\n              <line x1=\"195\" y1=\"235\" x2=\"208\" y2=\"248\"/>\n            </g>\n            <g transform=\"translate(130, 165)\">\n              <path d=\"M0 45 C-55 10 -65 -35 -30 -50 C-5 -58 0 -25 0 -25 C0 -25 5 -58 30 -50 C65 -35 55 10 0 45 Z\" fill=\"#E11D48\" stroke=\"#9F1239\" stroke-width=\"2.5\"/>\n              <path d=\"M-5 -22 C-15 -42 -28 -42 -22 -30 C-18 -22 -10 -15 -5 -22 Z\" fill=\"#FDA4AF\"/>\n              <circle cx=\"-18\" cy=\"-28\" r=\"4\" fill=\"#FFFFFF\"/>\n            </g>",
  "25": "<circle cx=\"130\" cy=\"175\" r=\"65\" fill=\"#FDE047\" opacity=\"0.3\"/>\n            <g stroke=\"#38BDF8\" stroke-width=\"1.8\" stroke-linecap=\"round\">\n              <line x1=\"130\" y1=\"85\" x2=\"130\" y2=\"70\"/>\n              <line x1=\"110\" y1=\"90\" x2=\"98\" y2=\"80\"/>\n              <line x1=\"150\" y1=\"90\" x2=\"162\" y2=\"80\"/>\n            </g>\n            <g transform=\"translate(130, 180)\">\n              <circle cx=\"0\" cy=\"15\" r=\"42\" fill=\"none\" stroke=\"#D97706\" stroke-width=\"10\"/>\n              <circle cx=\"0\" cy=\"15\" r=\"42\" fill=\"none\" stroke=\"#FBBF24\" stroke-width=\"7\"/>\n              <circle cx=\"0\" cy=\"15\" r=\"38\" fill=\"none\" stroke=\"#FEF08A\" stroke-width=\"1.5\"/>\n              <polygon points=\"-12,-22 12,-22 8,-12 -8,-12\" fill=\"#D97706\"/>\n              <polygon points=\"0,-48 18,-32 12,-20 -12,-20 -18,-32\" fill=\"#FFFFFF\" stroke=\"#38BDF8\" stroke-width=\"1.5\"/>\n              <polygon points=\"0,-48 0,-20 8,-20 14,-32\" fill=\"#E0F2FE\"/>\n              <polygon points=\"0,-48 0,-20 -8,-20 -14,-32\" fill=\"#BAE6FD\"/>\n            </g>",
  "26": "<circle cx=\"130\" cy=\"170\" r=\"65\" fill=\"#818CF8\" opacity=\"0.25\"/>\n            <g transform=\"translate(130, 175)\">\n              <path d=\"M-65 42 Q0 25 65 42 L65 -35 Q0 -52 -65 -35 Z\" fill=\"#7C2D12\" stroke=\"#451A03\" stroke-width=\"2\"/>\n              <path d=\"M-60 38 Q0 22 60 38 L60 -30 Q0 -46 -60 -30 Z\" fill=\"#FEF3C7\" stroke=\"#D97706\" stroke-width=\"1\"/>\n              <line x1=\"0\" y1=\"-46\" x2=\"0\" y2=\"28\" stroke=\"#451A03\" stroke-width=\"2.5\"/>\n              <path d=\"M0 25 Q15 45 18 65 L25 58 L30 68 Q25 45 0 25 Z\" fill=\"#DC2626\"/>\n              <line x1=\"-50\" y1=\"-15\" x2=\"-10\" y2=\"-18\" stroke=\"#B45309\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              <line x1=\"-50\" y1=\"-2\" x2=\"-10\" y2=\"-5\" stroke=\"#B45309\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              <line x1=\"-50\" y1=\"12\" x2=\"-10\" y2=\"8\" stroke=\"#B45309\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              <line x1=\"10\" y1=\"-18\" x2=\"50\" y2=\"-15\" stroke=\"#B45309\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              <line x1=\"10\" y1=\"-5\" x2=\"50\" y2=\"-2\" stroke=\"#B45309\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              <line x1=\"10\" y1=\"8\" x2=\"50\" y2=\"12\" stroke=\"#B45309\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n              <polygon points=\"-65,-35 -50,-35 -65,-20\" fill=\"#F59E0B\"/>\n              <polygon points=\"65,-35 50,-35 65,-20\" fill=\"#F59E0B\"/>\n            </g>",
  "27": "<g transform=\"translate(130, 175)\">\n              <rect x=\"-65\" y=\"-40\" width=\"130\" height=\"85\" rx=\"3\" fill=\"#FFFDF8\" stroke=\"#B45309\" stroke-width=\"1.8\"/>\n              <path d=\"M-65 -40 L0 10 L65 -40\" stroke=\"#D97706\" stroke-width=\"1.5\" fill=\"none\"/>\n              <path d=\"M-65 45 L-15 -3\" stroke=\"#E5E7EB\" stroke-width=\"1.2\" fill=\"none\"/>\n              <path d=\"M65 45 L15 -3\" stroke=\"#E5E7EB\" stroke-width=\"1.2\" fill=\"none\"/>\n              <circle cx=\"0\" cy=\"10\" r=\"14\" fill=\"#DC2626\" stroke=\"#991B1B\" stroke-width=\"1.5\"/>\n              <circle cx=\"0\" cy=\"10\" r=\"10\" fill=\"#B91C1C\"/>\n              <text x=\"0\" y=\"14\" text-anchor=\"middle\" font-family=\"'Cinzel', serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#FEF08A\">M</text>\n              <path d=\"M45 -55 Q80 -70 95 -100 Q75 -65 55 -40 Z\" fill=\"#E2E8F0\" stroke=\"#94A3B8\" stroke-width=\"1\"/>\n              <line x1=\"45\" y1=\"-55\" x2=\"35\" y2=\"-40\" stroke=\"#451A03\" stroke-width=\"2.5\"/>\n            </g>",
  "28": "<ellipse cx=\"130\" cy=\"170\" r=\"65\" fill=\"#F8FAFC\" stroke=\"#C5A059\" stroke-width=\"2\"/>\n            <g transform=\"translate(130, 165)\" fill=\"#1E293B\">\n              <path d=\"M-40 55 C-35 25 -20 15 -10 10 L10 10 C20 15 35 25 40 55 Z\"/>\n              <polygon points=\"-8,10 8,10 0,22\" fill=\"#FFFFFF\"/>\n              <path d=\"M0 -38 C15 -38 22 -25 20 -5 C18 10 5 15 -5 12 C-15 10 -22 -5 -18 -20 C-15 -35 -5 -38 0 -38 Z\"/>\n              <path d=\"M-12 -25 L-22 -12 L-14 -10 L-18 -2 L-8 3\"/>\n              <path d=\"M-5 -38 C12 -42 24 -25 24 -10 C18 -20 5 -32 -5 -38 Z\" fill=\"#0F172A\"/>\n            </g>",
  "29": "<ellipse cx=\"130\" cy=\"170\" r=\"65\" fill=\"#FFFDF9\" stroke=\"#C5A059\" stroke-width=\"2\"/>\n            <g transform=\"translate(130, 165)\" fill=\"#4C1D95\">\n              <path d=\"M-38 55 C-32 30 -15 20 -8 15 L8 15 C15 20 32 30 38 55 Z\"/>\n              <path d=\"M-10 22 Q0 28 10 22\" stroke=\"#FEF08A\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\"/>\n              <path d=\"M-5 -35 C-22 -35 -26 -15 -20 0 C-15 12 -5 15 5 12 C15 8 20 -2 18 -15 C15 -30 5 -35 -5 -35 Z\"/>\n              <path d=\"M8 -20 L18 -10 L12 -8 L16 0 L8 6\"/>\n              <circle cx=\"-16\" cy=\"-28\" r=\"12\"/>\n              <circle cx=\"-6\" cy=\"-35\" r=\"5\" fill=\"#EC4899\"/>\n            </g>",
  "30": "<circle cx=\"130\" cy=\"170\" r=\"62\" fill=\"#E2E8F0\" opacity=\"0.4\"/>\n            <path d=\"M130 260 Q125 200 130 160\" stroke=\"#15803D\" stroke-width=\"4\" stroke-linecap=\"round\" fill=\"none\"/>\n            <path d=\"M130 220 Q105 210 95 190 Q120 200 130 215 Z\" fill=\"#16A34A\"/>\n            <path d=\"M130 200 Q155 190 165 170 Q140 180 130 195 Z\" fill=\"#16A34A\"/>\n            <g transform=\"translate(130, 150)\">\n              <path d=\"M0 10 C-35 0 -45 -35 -30 -50 C-15 -35 0 0 0 10 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1.2\"/>\n              <path d=\"M0 10 C35 0 45 -35 30 -50 C15 -35 0 0 0 10 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1.2\"/>\n              <path d=\"M0 15 C-20 -20 -15 -65 0 -70 C15 -65 20 -20 0 15 Z\" fill=\"#FFFFFF\" stroke=\"#CBD5E1\" stroke-width=\"1.5\"/>\n              <line x1=\"0\" y1=\"5\" x2=\"-12\" y2=\"-38\" stroke=\"#CA8A04\" stroke-width=\"2\"/>\n              <ellipse cx=\"-13\" cy=\"-39\" rx=\"3.5\" ry=\"2\" fill=\"#EAB308\"/>\n              <line x1=\"0\" y1=\"5\" x2=\"0\" y2=\"-45\" stroke=\"#CA8A04\" stroke-width=\"2\"/>\n              <ellipse cx=\"0\" cy=\"-46\" rx=\"3.5\" ry=\"2\" fill=\"#EAB308\"/>\n              <line x1=\"0\" y1=\"5\" x2=\"12\" y2=\"-38\" stroke=\"#CA8A04\" stroke-width=\"2\"/>\n              <ellipse cx=\"13\" cy=\"-39\" rx=\"3.5\" ry=\"2\" fill=\"#EAB308\"/>\n            </g>",
  "31": "<circle cx=\"130\" cy=\"175\" r=\"75\" fill=\"#FDE047\" opacity=\"0.3\"/>\n            <g transform=\"translate(130, 175)\" stroke=\"#D97706\" stroke-width=\"2.5\" fill=\"#F59E0B\">\n              <polygon points=\"0,-72 -6,-45 6,-45\"/>\n              <polygon points=\"0,72 -6,45 6,45\"/>\n              <polygon points=\"-72,0 -45,-6 -45,6\"/>\n              <polygon points=\"72,0 45,-6 45,6\"/>\n              <polygon points=\"-51,-51 -42,-30 -30,-42\"/>\n              <polygon points=\"51,-51 30,-42 42,-30\"/>\n              <polygon points=\"-51,51 -30,42 -42,30\"/>\n              <polygon points=\"51,51 42,30 30,42\"/>\n            </g>\n            <g transform=\"translate(130, 175)\">\n              <circle cx=\"0\" cy=\"0\" r=\"38\" fill=\"#FDE047\" stroke=\"#D97706\" stroke-width=\"2\"/>\n              <path d=\"M-22 -8 Q-14 -16 -6 -8\" stroke=\"#92400E\" stroke-width=\"2\" fill=\"none\"/>\n              <circle cx=\"-14\" cy=\"-5\" r=\"2.2\" fill=\"#78350F\"/>\n              <path d=\"M6 -8 Q14 -16 22 -8\" stroke=\"#92400E\" stroke-width=\"2\" fill=\"none\"/>\n              <circle cx=\"14\" cy=\"-5\" r=\"2.2\" fill=\"#78350F\"/>\n              <path d=\"M0 -6 L0 8 L5 12\" stroke=\"#92400E\" stroke-width=\"2\" fill=\"none\"/>\n              <path d=\"M-10 18 Q0 26 10 18\" stroke=\"#92400E\" stroke-width=\"2\" fill=\"none\"/>\n            </g>",
  "32": "<path d=\"M22 250 Q130 240 238 250 L238 296 L22 296 Z\" fill=\"#1E3A8A\"/>\n            <line x1=\"90\" y1=\"260\" x2=\"170\" y2=\"260\" stroke=\"#93C5FD\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <line x1=\"105\" y1=\"275\" x2=\"155\" y2=\"275\" stroke=\"#93C5FD\" stroke-width=\"2\" stroke-linecap=\"round\"/>\n            <g transform=\"translate(130, 155)\">\n              <circle cx=\"0\" cy=\"0\" r=\"58\" fill=\"#3B82F6\" opacity=\"0.2\"/>\n              <path d=\"M-10 -45 C25 -35 35 35 -10 45 C15 30 18 -30 -10 -45 Z\" fill=\"#F8FAFC\" stroke=\"#94A3B8\" stroke-width=\"1.5\"/>\n              <circle cx=\"0\" cy=\"0\" r=\"45\" fill=\"none\" stroke=\"#FDE047\" stroke-width=\"1.8\" stroke-dasharray=\"4,3\"/>\n              <path d=\"M8 -2 C14 2 12 8 6 12 Q10 18 4 22\" stroke=\"#94A3B8\" stroke-width=\"1.5\" fill=\"none\"/>\n              <circle cx=\"6\" cy=\"-8\" r=\"2\" fill=\"#64748B\"/>\n            </g>",
  "33": "<circle cx=\"130\" cy=\"175\" r=\"70\" fill=\"#FDE047\" opacity=\"0.3\"/>\n            <g transform=\"translate(130, 175) rotate(-45)\">\n              <path d=\"M0 -60 C-25 -60 -25 -25 0 -25 C25 -25 25 -60 0 -60 Z\" fill=\"none\" stroke=\"#D97706\" stroke-width=\"8\"/>\n              <path d=\"M0 -60 C-25 -60 -25 -25 0 -25 C25 -25 25 -60 0 -60 Z\" fill=\"none\" stroke=\"#FBBF24\" stroke-width=\"5\"/>\n              <circle cx=\"0\" cy=\"-42\" r=\"6\" fill=\"#FFFBEB\" stroke=\"#D97706\" stroke-width=\"1.5\"/>\n              <line x1=\"0\" y1=\"-25\" x2=\"0\" y2=\"55\" stroke=\"#D97706\" stroke-width=\"8\" stroke-linecap=\"round\"/>\n              <line x1=\"0\" y1=\"-25\" x2=\"0\" y2=\"55\" stroke=\"#FDE047\" stroke-width=\"5\" stroke-linecap=\"round\"/>\n              <path d=\"M0 35 L18 35 L18 55 L0 55 M10 42 L18 42 M10 48 L18 48\" stroke=\"#D97706\" stroke-width=\"4\" stroke-linecap=\"square\" fill=\"none\"/>\n              <rect x=\"-8\" y=\"-22\" width=\"16\" height=\"6\" rx=\"2\" fill=\"#B45309\"/>\n            </g>",
  "34": "<circle cx=\"130\" cy=\"175\" r=\"70\" fill=\"#38BDF8\" opacity=\"0.3\"/>\n            <circle cx=\"130\" cy=\"115\" r=\"5\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1\"/>\n            <circle cx=\"120\" cy=\"235\" r=\"4\" fill=\"#FBBF24\" stroke=\"#D97706\" stroke-width=\"1\"/>\n            <g transform=\"translate(130, 140) rotate(35)\">\n              <path d=\"M-30 0 Q0 -15 25 0 Q0 15 -30 0 Z\" fill=\"#EA580C\" stroke=\"#C2410C\" stroke-width=\"1.5\"/>\n              <path d=\"M-30 0 Q-50 -18 -45 -5 Q-50 18 -30 0 Z\" fill=\"#F97316\"/>\n              <circle cx=\"18\" cy=\"-3\" r=\"1.8\" fill=\"#000000\"/>\n              <path d=\"M0 -8 Q10 -15 5 -5\" fill=\"#FB923C\"/>\n            </g>\n            <g transform=\"translate(130, 210) rotate(-145)\">\n              <path d=\"M-30 0 Q0 -15 25 0 Q0 15 -30 0 Z\" fill=\"#F59E0B\" stroke=\"#D97706\" stroke-width=\"1.5\"/>\n              <path d=\"M-30 0 Q-50 -18 -45 -5 Q-50 18 -30 0 Z\" fill=\"#FBBF24\"/>\n              <circle cx=\"18\" cy=\"-3\" r=\"1.8\" fill=\"#000000\"/>\n              <path d=\"M0 -8 Q10 -15 5 -5\" fill=\"#FCD34D\"/>\n            </g>",
  "35": "<path d=\"M22 255 Q130 245 238 255 L238 296 L22 296 Z\" fill=\"#1E293B\"/>\n            <g transform=\"translate(130, 175)\">\n              <path d=\"M0 -55 Q18 -40 0 -20 Q-18 0 0 20 Q18 40 45 45\" stroke=\"#D97706\" stroke-width=\"4\" stroke-dasharray=\"6,2\" fill=\"none\"/>\n              <circle cx=\"0\" cy=\"-60\" r=\"14\" fill=\"none\" stroke=\"#334155\" stroke-width=\"6\"/>\n              <circle cx=\"0\" cy=\"-60\" r=\"14\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"3\"/>\n              <rect x=\"-48\" y=\"-45\" width=\"96\" height=\"10\" rx=\"3\" fill=\"#78350F\" stroke=\"#451A03\" stroke-width=\"1.8\"/>\n              <circle cx=\"-48\" cy=\"-40\" r=\"6\" fill=\"#F59E0B\"/>\n              <circle cx=\"48\" cy=\"-40\" r=\"6\" fill=\"#F59E0B\"/>\n              <rect x=\"-6\" y=\"-45\" width=\"12\" height=\"95\" rx=\"3\" fill=\"#334155\" stroke=\"#0F172A\" stroke-width=\"2\"/>\n              <path d=\"M-55 20 Q0 68 55 20 L55 35 Q0 85 -55 35 Z\" fill=\"#334155\" stroke=\"#0F172A\" stroke-width=\"2\"/>\n              <polygon points=\"-55,20 -68,15 -50,38\" fill=\"#64748B\"/>\n              <polygon points=\"55,20 68,15 50,38\" fill=\"#64748B\"/>\n            </g>",
  "36": "<polygon points=\"130,56 70,296 190,296\" fill=\"#FEF08A\" opacity=\"0.3\"/>\n            <polygon points=\"90,270 170,270 185,296 75,296\" fill=\"#475569\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n            <rect x=\"105\" y=\"255\" width=\"50\" height=\"15\" fill=\"#64748B\" stroke=\"#1E293B\" stroke-width=\"1.8\"/>\n            <g transform=\"translate(130, 160)\">\n              <circle cx=\"0\" cy=\"-20\" r=\"32\" fill=\"none\" stroke=\"#D97706\" stroke-width=\"4\"/>\n              <circle cx=\"0\" cy=\"-20\" r=\"28\" fill=\"none\" stroke=\"#FDE047\" stroke-width=\"1.5\"/>\n              <rect x=\"-10\" y=\"-75\" width=\"20\" height=\"110\" rx=\"2\" fill=\"#64748B\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n              <rect x=\"-42\" y=\"-30\" width=\"84\" height=\"20\" rx=\"2\" fill=\"#64748B\" stroke=\"#1E293B\" stroke-width=\"2\"/>\n              <circle cx=\"0\" cy=\"-20\" r=\"7\" fill=\"#F59E0B\" stroke=\"#B45309\" stroke-width=\"1.5\"/>\n              <circle cx=\"0\" cy=\"-20\" r=\"3\" fill=\"#FFFBEB\"/>\n            </g>"
};

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
