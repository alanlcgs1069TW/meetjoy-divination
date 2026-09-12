/**
 * 癒見幸福 · 魔法占星學院
 * 西洋地占排盤核心演算引擎 (Geomancy Calculation Engine)
 * 遵循古典阿格里帕 (Agrippa) 與阿拉伯 (Arabic) 地占體系，純繁體中文（台灣）呈現
 */

(function(global) {
  'use strict';

  // 16 個地占圖形資料庫
  // dots: [火, 風, 水, 土] 由上至下，1 = 單點（主動/奇數），2 = 雙點（被動/偶數）
  const GEOMANCY_FIGURES = [
    {
      id: "via",
      latin: "Via",
      zh: "道途",
      nick: "人生高速公路",
      symbol: "⚏",
      dots: [1, 1, 1, 1],
      totalDots: 4,
      isEven: true,
      planet: "月亮（虧月）",
      planetLatin: "Moon (Waning)",
      planetSymbol: "☽",
      sign: "巨蟹座",
      signLatin: "Cancer",
      signSymbol: "♋",
      element: "水",
      elementLatin: "Water",
      quality: "中性偏動態",
      favorable: "中性",
      keyword: "移動、改變、旅行、流動、轉折、啟程",
      summary: "四線全主動，象徵奔騰不息的河流與行者足跡。任何停滯的事情都將被推動，但也意味著無法久留原地。",
      story: "四個元素全部醒著、全部在動，就像深夜還在狂奔的旅人。它從不給你一個安穩不變的避難所，只清晰提醒你：不管你想不想面對，命運的改變已經在路上了。",
      daily: "適合問「要不要搬家」「該不該轉職」「這段關係會不會有變化」。它指向動比不動順，順應水流而行才是智慧。",
      extended: {
        career: "適合轉職、外派、調動、開拓新市場；抗拒既有的制度調整只會徒增消耗。",
        love: "關係進入急遽變動期，雙方互動節奏加快，宜順水推舟溝通下一步，不宜僵持死守現狀。",
        wealth: "金流周轉迅速，進得快也出得快，適合短線流動資金調度，不宜重壓長期死板投資。",
        health: "注意舟車勞頓與消化系統（水元素），保持充足水分與規律作息。",
        timing: "迅速、短時間內即見分曉，事情正處於動態發酵中。"
      },
      potion: {
        herb: "佛手柑、薄荷、迷迭香",
        oil: "檸檬薄荷複方精油",
        action: "清空隨身包包多餘雜物，在玄關點燃一支清新柑橘線香，向前方敞開心胸邁步。",
        quote: "「當水流遇到礁石，它不抱怨，只是優雅地繞過去。」"
      }
    },
    {
      id: "populus",
      latin: "Populus",
      zh: "群眾",
      nick: "廣場上沉默的大眾",
      symbol: "⚏",
      dots: [2, 2, 2, 2],
      totalDots: 8,
      isEven: true,
      planet: "月亮（盈月）",
      planetLatin: "Moon (Waxing)",
      planetSymbol: "☽",
      sign: "巨蟹座",
      signLatin: "Cancer",
      signSymbol: "♋",
      element: "水",
      elementLatin: "Water",
      quality: "中性偏靜態",
      favorable: "中性",
      keyword: "聚會、大眾、被動、隨波逐流、看風向、社群",
      summary: "八點全被動，象徵廣場上密集的人潮。自身無特定立場，完全受身邊周遭環境與同伴影響。",
      story: "Populus 像廣場上黑壓壓的人群——沒有人帶頭，但只要一人鼓掌，全場就會跟著鼓掌。它的力量來自眾人的共識與共鳴，切忌逆勢單打獨鬥。",
      daily: "問「大家怎麼看這件事」「該不該公開發布」時特別靈驗。它提醒你：當前事情並非你一人能決斷，務必審時度勢。",
      extended: {
        career: "重視團隊合作與群眾口碑，公關活動、社群推廣有利；獨行俠容易被群體邊緣化。",
        love: "容易受到長輩、朋友圈或外界八卦評價影響；若彼此公開戀情能獲得大眾祝福。",
        wealth: "適合群眾募資、大眾零售或指數型基金；切忌私下孤注一擲盲目跟風炒作。",
        health: "注意群聚感染、體液滯留或水腫，宜多參與戶外散步活動。",
        timing: "受大環境牽制，需要等待風向明朗或眾人達成共識才能拍板。"
      },
      potion: {
        herb: "洋甘菊、薰衣草、天竺葵",
        oil: "安撫甜橙雪松精油",
        action: "喝一杯溫暖洋甘菊茶，給自己留半小時靜默，不受社群動態雜音干擾。",
        quote: "「在喧囂的人海中，你的心依然可以是一片澄澈的湖泊。」"
      }
    },
    {
      id: "puer",
      latin: "Puer",
      zh: "少年",
      nick: "衝動的熱血少年",
      symbol: "⚏",
      dots: [1, 1, 2, 1],
      totalDots: 5,
      isEven: false,
      planet: "火星",
      planetLatin: "Mars",
      planetSymbol: "♂",
      sign: "牡羊座",
      signLatin: "Aries",
      signSymbol: "♈",
      element: "火",
      elementLatin: "Fire",
      quality: "強烈主動",
      favorable: "凶中帶吉（適合突破）",
      keyword: "熱情、衝動、勇氣、冒險、攻擊性、速戰速決",
      summary: "如同出鞘的利劍，燃燒著無畏與荷爾蒙。除了情感（水線被動）外皆為主動，勇往直前卻缺乏細膩耐心。",
      story: "他像一個等不及紅燈變綠燈就想衝出斑馬線的熱血少年。有種、有力、有拚勁，但也最容易因為一時口快或輕敵而撞得鼻青臉腫。",
      daily: "問「該不該主動爭取」「這場硬仗要不要接」時展現破局魄力；但問感情或長期合作時，代表火氣太大、容易口角。",
      extended: {
        career: "主動出擊、毛遂自薦大有斬獲；在談判桌上宜收斂鋒芒，以免引發正面衝突。",
        love: "激情燃燒迅速，但也容易爭吵吃醋；需要學會傾聽對方的脆弱，不要只顧宣洩情緒。",
        wealth: "衝動消費、投機短線頻繁，容易破財；應把能量放在開拓新業務而非賭博式下注。",
        health: "防範頭部擦傷、發炎、發燒或運動扭傷，切忌疲勞駕駛。",
        timing: "極為迅速，必須搶在三到五天之內把握第一時間窗口。"
      },
      potion: {
        herb: "杜松漿果、黑胡椒、薑",
        oil: "乳香生薑暖身精油",
        action: "進行 15 分鐘劇烈排汗運動釋放焦躁，隨後飲用一杯溫薑茶暖胃凝神。",
        quote: "「真正的勇士，懂得把出鞘的怒火化為開疆拓土的溫柔專注。」"
      }
    },
    {
      id: "puella",
      latin: "Puella",
      zh: "少女",
      nick: "優雅的溫柔少女",
      symbol: "⚏",
      dots: [1, 2, 1, 1],
      totalDots: 5,
      isEven: false,
      planet: "金星",
      planetLatin: "Venus",
      planetSymbol: "♀",
      sign: "天秤座",
      signLatin: "Libra",
      signSymbol: "♎",
      element: "風",
      elementLatin: "Air",
      quality: "柔和協調",
      favorable: "大吉（喜慶安撫）",
      keyword: "和諧、美好、魅力、優雅、藝術、以柔克剛",
      summary: "象徵天秤座的平衡與金星的柔美。懂得透過圓融的社交手段與美感魅力化解衝突，讓緊繃局勢如沐春風。",
      story: "與熱血少年 Puer 相呼應的優雅姊妹。她從不正面硬碰硬，卻總能在微笑、傾聽與一杯香氣撲鼻的下午茶中，讓原本劍拔弩張的談判安靜融化。",
      daily: "問感情複合、人際破冰、美學設計、求和道歉時是上上籤。它告訴你：放軟身段，柔軟勝過強硬千百倍。",
      extended: {
        career: "適合公關斡旋、品牌形象建立、藝術與設計專案；用溫和幽默化解職場冷戰。",
        love: "桃花緣極佳，相處甜蜜浪漫；若之前有誤會，只要一方給予台階，即可順利破冰重修舊好。",
        wealth: "因美感、品味或人脈關係帶來進帳；但需提防因為犒賞自己而購買非必要奢侈品。",
        health: "注重皮膚保養、腰部與腎臟循環平衡，適合瑜伽或伸展運動。",
        timing: "節奏平緩舒適，在愉快的社交聚會或週末午後自然水到渠成。"
      },
      potion: {
        herb: "大馬士革玫瑰、天竺葵、依蘭",
        oil: "玫瑰橙花調和精油",
        action: "在桌前擺放一朵粉色鮮花，書寫一張溫暖感恩小卡給你想念的夥伴。",
        quote: "「溫柔不是軟弱，而是看透世界鋒芒後依然選擇微笑的強大。」"
      }
    },
    {
      id: "fortuna_major",
      latin: "Fortuna Major",
      zh: "大吉",
      nick: "穩紮穩打的大幸運",
      symbol: "⚏",
      dots: [2, 2, 1, 1],
      totalDots: 6,
      isEven: true,
      planet: "太陽（日間）",
      planetLatin: "Sun (Diurnal)",
      planetSymbol: "☉",
      sign: "獅子座",
      signLatin: "Leo",
      signSymbol: "♌",
      element: "火",
      elementLatin: "Fire",
      quality: "強盛光芒",
      favorable: "大吉（全盤至尊）",
      keyword: "靠實力獲勝、深厚基業、尊榮、保護力、徹底成功",
      summary: "十六圖形中至尊貴的大吉之象。下半身紮根穩固，上半身光芒四射，代表靠長期積累與深厚內功迎來的長久勝利。",
      story: "它的幸運不是從天上掉餡餅，而是春耕夏耘後秋天必定迎來的萬畝金黃。前期雖有辛勤耕耘，但根基穩固無比，任何風雨都吹不倒。",
      daily: "問「能不能成功」「長期走向好不好」，出現 Fortuna Major 幾乎等於天地蓋章。它保證最終勝利，只提醒你：要有耐心等果實成熟。",
      extended: {
        career: "升遷有望、掌權掌舵、領導地位獲得肯定，創立長青品牌的大好時機。",
        love: "成熟穩定、以誠相待的長久良緣，雙方能攜手建立共同家庭與人生目標。",
        wealth: "財庫豐厚，正財大旺，不動產或核心本業穩健增長，富足綿長。",
        health: "生命力旺盛，元氣充沛，若有舊疾亦能逐步找到良醫根治。",
        timing: "中期至長期見效，越往後越有力量，不宜急功近利短炒收割。"
      },
      potion: {
        herb: "金盞花、乳香、甜橙",
        oil: "皇家乳香向日葵精油",
        action: "早晨迎著晨光深呼吸 7 次，在金色筆記本寫下今年最渴望建構的 3 個宏大目標。",
        quote: "「太陽升起從不喧囂，因為光芒本身就是不可動搖的存在。」"
      }
    },
    {
      id: "fortuna_minor",
      latin: "Fortuna Minor",
      zh: "小吉",
      nick: "曇花一現的小確幸",
      symbol: "⚏",
      dots: [1, 1, 2, 2],
      totalDots: 6,
      isEven: true,
      planet: "太陽（夜間）",
      planetLatin: "Sun (Nocturnal)",
      planetSymbol: "☉",
      sign: "獅子座",
      signLatin: "Leo",
      signSymbol: "♌",
      element: "火",
      elementLatin: "Fire",
      quality: "速效閃爍",
      favorable: "小吉（見好就收）",
      keyword: "借力使力、外部助力、速效、來得快去得快、見好就收",
      summary: "上半身衝刺跳躍，下半身根基稍淺。象徵搭上順風車或突如其來的外來好運，必須果斷抓住且見好就收。",
      story: "如同夜空閃爍的煙火，耀眼奪目卻不耐久留。它給你的好運是一艘快艇，能幫你快速突破眼前暗礁，但到了岸邊就要果斷下船，莫貪戀船位。",
      daily: "問「這個機會能不能賺一筆」「眼下這個合作要不要搶」，答案是肯定的；但若問長遠十年規劃，則需另謀深遠地基。",
      extended: {
        career: "擅用外部資源、主管賞識或時勢話題快速累積戰果；專案宜快打結案，不宜拖泥帶水。",
        love: "浪漫火花閃現，容易一見鍾情；若想轉化為長期承諾，需要補足柴米油鹽的日常互信。",
        wealth: "短期偏財、波段獲利或業績獎金豐厚；賺到獲利務必先落袋為安，不可加碼追高。",
        health: "精力瞬間爆發後容易虛耗，留意心血管與眼部疲勞，需及時休養生息。",
        timing: "就在眼前數天內，稍縱即逝，需眼明手快立即出手。"
      },
      potion: {
        herb: "迷迭香、葡萄柚、月桂葉",
        oil: "能量葡萄柚雪松精油",
        action: "為自己定下一條清晰的「停損／停利線」，在手機行事曆設定鬧鐘果斷執行。",
        quote: "「聰明的衝浪手懂得乘風破浪，更懂得在浪退去前優雅回到岸上。」"
      }
    },
    {
      id: "acquisitio",
      latin: "Acquisitio",
      zh: "獲得",
      nick: "口袋滿滿的收穫者",
      symbol: "⚏",
      dots: [2, 1, 2, 1],
      totalDots: 6,
      isEven: true,
      planet: "木星",
      planetLatin: "Jupiter",
      planetSymbol: "♃",
      sign: "射手座",
      signLatin: "Sagittarius",
      signSymbol: "♐",
      element: "火",
      elementLatin: "Fire",
      quality: "繁榮擴張",
      favorable: "大吉（收穫富足）",
      keyword: "豐收、擴張、進帳、成功吸收、掌握在手、格局宏大",
      summary: "開口向上承接的兩只聚寶盆，天地恩賜盡收囊中。任何與求財、晉升、吸收新知或擴張領地有關的提問，皆為極吉。",
      story: "這是一張肚子裝得滿滿的圖形——杯子正著放，天上降下來的甘霖雨露一滴都沒浪費。它代表你不僅有遇見好運的命，更有接得住好運的容量。",
      daily: "問「提案會不會過」「投資能不能賺錢」「要不要擴編團隊」，Acquisitio 出現代表可以放心前進，市場容量撐得住你的雄心。",
      extended: {
        career: "獲得資源挹注、團隊擴展、拿得大客戶合約；眼界宜放大，走出舒適圈佈局未來。",
        love: "收穫深情與體貼，彼此在精神與物質層面皆能互利共榮，是能互相成就的好伴侶。",
        wealth: "正偏財皆旺，收入大幅增長，資產版圖擴大，適合穩健擴充資產組合。",
        health: "胃口大開、體力充沛；唯一需注意避免飲食過度奢靡或體重增加。",
        timing: "順風順水，事情將在未來數週內結出豐盛果實。"
      },
      potion: {
        herb: "肉桂、丁香、羅勒",
        oil: "肉桂甜橙黃金豐盛精油",
        action: "整理乾淨錢包與銀行帳戶，在存摺夾入一片月桂葉，許下對未來的感恩心願。",
        quote: "「世界本就豐盛無虞，你所需要的只是把雙手張開、把器皿洗淨。」"
      }
    },
    {
      id: "amissio",
      latin: "Amissio",
      zh: "失落",
      nick: "手滑的失物達人",
      symbol: "⚏",
      dots: [1, 2, 1, 2],
      totalDots: 6,
      isEven: true,
      planet: "金星（逆行）",
      planetLatin: "Venus (Retrograde)",
      planetSymbol: "♀",
      sign: "金牛座",
      signLatin: "Taurus",
      signSymbol: "♉",
      element: "土",
      elementLatin: "Earth",
      quality: "流失宣洩",
      favorable: "凶（但利斷捨離）",
      keyword: "失去、破財、放手、滑落、解脫、斷捨離",
      summary: "Acquisitio 的顛倒鏡像，開口朝下傾倒的杯子，手中緊抓的東西終將從指縫溜走。利於擺脫麻煩與舊疾，不利求財爭產。",
      story: "兩個倒扣的杯子，不管裡面裝了多貴的甘露，一翻過來全灑進了泥土裡。它是財富的漏斗，但在心靈層面，它也是「告別執念與毒素」的最高處方。",
      daily: "問找不找得回失物、投資會不會回本時，代表認賠止損；但若問「能不能擺脫糾纏惡習」「這場病能不能痊癒」，反而是吉相！",
      extended: {
        career: "提防預算遭刪減、案子被搶或部屬離職；不宜強行加碼挽留，應專注保溫核心。",
        love: "若關係充滿內耗，暗示放手才是雙方的解脫；不宜在金錢與承諾上過度糾葛。",
        wealth: "嚴防破財、被開罰單、合約違約或借貸不還；當期務必採取最保守的防禦姿態。",
        health: "利於排毒、手術割除病灶、減重瘦身；宜多喝水排除代謝廢物。",
        timing: "不可挽回，事情已成既定流失趨勢，盡早止損才是上策。"
      },
      potion: {
        herb: "雪松、絲柏、岩蘭草",
        oil: "深層釋放絲柏精油",
        action: "丟棄抽屜裡三樣過期或損壞的舊物，在筆記本寫下「我願意放下不再服務於我的執念」。",
        quote: "「樹木唯有在秋天落盡枯葉，才能在初春重新生出翠綠的生機。」"
      }
    },
    {
      id: "laetitia",
      latin: "Laetitia",
      zh: "喜悅",
      nick: "彩虹般的歡欣",
      symbol: "⚏",
      dots: [1, 2, 2, 2],
      totalDots: 7,
      isEven: false,
      planet: "木星（逆行）",
      planetLatin: "Jupiter (Retrograde)",
      planetSymbol: "♃",
      sign: "雙魚座",
      signLatin: "Pisces",
      signSymbol: "♓",
      element: "水",
      elementLatin: "Water",
      quality: "向上昂首",
      favorable: "大吉（喜氣洋洋）",
      keyword: "歡笑、希望、向上提升、苦盡甘來、解除憂慮、開展",
      summary: "如同一座昂首向天的噴泉，下承深厚地脈，上湧歡樂泉水。代表心靈的陰霾被徹底吹散，光明與希望重回生活。",
      story: "它是十六圖形裡笑容最燦爛的一尊。古老占卜師說，它就像久旱逢甘霖後的彩虹——只要它出現，心中的大石頭就能放下一大半，壓抑已久的心事終於能透口氣。",
      daily: "問「低潮何時過去」「心情能不能好轉」「這場考試能不能通過」，Laetitia 是極佳的喜訊，象徵柳暗花明又一村。",
      extended: {
        career: "工作氛圍撥雲見日，同事關係融洽，提案贏得讚賞，利於慶功與文化建設。",
        love: "真誠的歡笑與浪漫，能走出過往情傷陰影，遇見能讓你發自內心感到快樂的對象。",
        wealth: "財務壓力大幅舒緩，有意外的獎金或回饋金入帳，生活餘裕增加。",
        health: "精神奕奕、情緒高昂，身心靈自癒力啟動，適合戶外休閒放鬆。",
        timing: "迅速回溫，好消息通常在一到兩週內即會傳來。"
      },
      potion: {
        herb: "香蜂草、甜橙、橙花",
        oil: "心輪綻放橙花精油",
        action: "放一首輕快雀躍的音樂，跟著旋律輕輕擺動身體 3 分鐘，為自己泡一杯蜂蜜檸檬水。",
        quote: "「真正的喜悅不需要宏大理由，一朵花開、一縷清風，都是宇宙在對你微笑。」"
      }
    },
    {
      id: "tristitia",
      latin: "Tristitia",
      zh: "憂傷",
      nick: "扛著石頭的苦行者",
      symbol: "⚏",
      dots: [2, 2, 2, 1],
      totalDots: 7,
      isEven: false,
      planet: "土星",
      planetLatin: "Saturn",
      planetSymbol: "♄",
      sign: "水瓶座",
      signLatin: "Aquarius",
      signSymbol: "♒",
      element: "風",
      elementLatin: "Air",
      quality: "向下沉墜",
      favorable: "凶（但利奠基埋葬）",
      keyword: "沉重、壓抑、哀傷、扎根、考驗、深層反省",
      summary: "一根深深打入泥土的木樁，向下沉墜的沉重能量。象徵嚴苛的考驗與精神負擔，但若是奠定基石或深藏秘密則極為穩固。",
      story: "它像一個在暴風雨中默默扛著巨石的苦行者。外在環境可能給了你沉重的枷鎖，但如果你正在打地基、買房產、或者需要把秘密深埋地下，它的堅實無人能破。",
      daily: "問心情或戀愛往往代表冰封低落；但問「這座橋梁耐不耐震」「長期契約能不能維持二十年」，它反而是最牢固的背書。",
      extended: {
        career: "責任繁重、進度緩慢、長官要求嚴苛；此時宜蹲下練功，把基礎扎得比誰都深。",
        love: "氣氛沉重冷戰，雙方背負各自的家庭或財務包袱；切莫互相苛責，需要給予喘息空間。",
        wealth: "資金週轉凝滯，不宜進行任何高風險投資；適合買進不動產或鎖定長期定存。",
        health: "留意骨骼關節、牙齒脊椎或慢性疲勞憂鬱，注意排解內心積壓的負面情緒。",
        timing: "緩慢漫長，需要以年或季度為單位耐心熬過考驗期。"
      },
      potion: {
        herb: "廣藿香、岩蘭草、黑雲杉",
        oil: "大地之根岩蘭草精油",
        action: "赤腳踩在泥土或草地上 10 分鐘，將手掌貼在大樹上，將心中的重擔交托給大地母親。",
        quote: "「把根扎得最深的大樹，才能在未來的狂風暴雨中傲然挺立。」"
      }
    },
    {
      id: "coniunctio",
      latin: "Coniunctio",
      zh: "聯合",
      nick: "十字路口的相遇",
      symbol: "⚏",
      dots: [2, 1, 1, 2],
      totalDots: 6,
      isEven: true,
      planet: "水星（逆行）",
      planetLatin: "Mercury (Retrograde)",
      planetSymbol: "☿",
      sign: "處女座",
      signLatin: "Virgo",
      signSymbol: "♍",
      element: "土",
      elementLatin: "Earth",
      quality: "中性收斂",
      favorable: "中性（隨鄰星而定）",
      keyword: "結合、匯聚、交涉、聯姻、契約、資訊交會",
      summary: "兩個三角形首尾相接形成緊密的結。象徵不同力量的匯流與整合，吉星相伴則錦上添花，凶星環伺則同流合污。",
      story: "十字路口的會面——好的東西遇在一起是強強聯手，壞的東西湊在一塊是狼狽為奸。它自己沒有道德立場，唯一的任務就是把分開的人、事、物緊緊繫在一起。",
      daily: "問簽約、合夥、破鏡重圓、失物找回非常有效。它保證「雙方一定會見面商談」，但結果好壞取決於兩旁的證人與吉凶環境。",
      extended: {
        career: "商務談判、合約簽署、跨部門跨界整合；務必把合約條款白紙黑字寫清楚。",
        love: "復合機率高，雙方有密切的訊息互動與交集；是談論訂婚、同居的關鍵轉折點。",
        wealth: "共同合夥投資、資源互換共用；需建立透明的對帳機制，避免日後帳目不清。",
        health: "注意呼吸道、神經傳導與消化吸收系統，飲食宜均衡清淡。",
        timing: "雙方一旦接上線，事情將在數日內快速收攏閉環。"
      },
      potion: {
        herb: "薰衣草、茶樹、尤加利",
        oil: "清晰連結真正薰衣草精油",
        action: "仔細整理通訊錄與未回覆的信件，用最誠懇簡練的文字回覆一位重要的合作夥伴。",
        quote: "「世間所有的相聚，都是宇宙為了完成某一項神聖功課所安排的共振。」"
      }
    },
    {
      id: "carcer",
      latin: "Carcer",
      zh: "禁錮",
      nick: "上鎖的牢籠",
      symbol: "⚏",
      dots: [1, 2, 2, 1],
      totalDots: 6,
      isEven: true,
      planet: "土星（逆行）",
      planetLatin: "Saturn (Retrograde)",
      planetSymbol: "♄",
      sign: "摩羯座",
      signLatin: "Capricorn",
      signSymbol: "♑",
      element: "土",
      elementLatin: "Earth",
      quality: "封閉收縮",
      favorable: "凶（但利保密防守）",
      keyword: "束縛、監禁、延誤、卡關、安全感、保密防守",
      summary: "四方緊縮的鐵籠與保險箱。象徵動彈不得的僵局與被動等待，但若用於守護秘密、安全防守或自我閉關則固若金湯。",
      story: "鎖鏈環環相扣，把門窗鎖得死死的。多數時候代表案子卡在主管桌上、公文送不出去、人被困在舊環境。但若你問「我的秘密會不會洩漏」，它就是世上最牢靠的防盜門。",
      daily: "問簽證、升遷、跳槽常代表動彈不得；若問「這筆錢鎖在定期存款安不安全」，則是老天替你加了三道防盜密碼鎖。",
      extended: {
        career: "面臨組織體制束縛或流程瓶頸，動彈不得；宜在體制內修煉內功，勿作無謂衝撞。",
        love: "感到被伴侶過度掌控或窒息感，兩人陷入冷戰僵局；需要設定健康的個人界線。",
        wealth: "資金被套牢或被強制凍結，難以變現；切勿借錢拆借，只能耐心等待解套。",
        health: "注意便秘、結石、血液循環不暢或關節僵硬，宜多做拉筋運動與深層排汗。",
        timing: "嚴重延遲，非短時間內可解決，需做好打持久戰的心理準備。"
      },
      potion: {
        herb: "黑胡椒、牛膝草、馬鬱蘭",
        oil: "破冰解套馬鬱蘭精油",
        action: "打開家中所有窗戶通風 20 分鐘，整理乾淨雜亂的衣櫃，給空間注入流動的新鮮空氣。",
        quote: "「即便身處深谷牢籠，只要心念清明，任何障礙都只是磨礪靈魂的磨刀石。」"
      }
    },
    {
      id: "caput_draconis",
      latin: "Caput Draconis",
      zh: "龍首",
      nick: "破殼而出的起點",
      symbol: "⚏",
      dots: [2, 1, 1, 1],
      totalDots: 5,
      isEven: false,
      planet: "北交點（木星/金星交感）",
      planetLatin: "North Node",
      planetSymbol: "☊",
      sign: "射手座",
      signLatin: "Sagittarius",
      signSymbol: "♐",
      element: "火",
      elementLatin: "Fire",
      quality: "啟程向上",
      favorable: "大吉（利起步開創）",
      keyword: "開始、入口、新契機、順勢而為、破土而出、靈感",
      summary: "命運龍門的昂首起點。象徵一切美好事物的萌芽與起步，對開創新局、入學、立約、啟動新專案具有極強推力。",
      story: "如同神龍破水而出，抬頭望向璀璨星空。它是命運大門的入口，雖然前方的路還很長，但只要邁出第一步，冥冥中就會有貴人與因緣在前方鋪路。",
      daily: "問「現在是不是開創新事業的好時機」「要不要踏出第一步」，龍首給予毫不猶豫的綠燈，代表你站在幸運的風口上。",
      extended: {
        career: "新職位、新企劃順利啟動，受到上級貴人提攜；適合舉辦發布會或公開亮相。",
        love: "新戀情的萌芽，遇見具備未來感與心靈契合的優質對象；利於告白與確立名分。",
        wealth: "開啟新的收入渠道與財路，新業務帶來第一桶金，後勢看漲。",
        health: "精力復甦，適合開展全新的健康作息飲食計畫或運動鍛鍊。",
        timing: "就在當下，現在就是最適合起步的良辰吉日。"
      },
      potion: {
        herb: "乳香、沒藥、月桂",
        oil: "神聖起航月桂乳香精油",
        action: "買一本全新的手帳本，在扉頁鄭重寫下啟動專案的日期與第一項里程碑。",
        quote: "「種一棵樹最好的時間是十年前，其次就是現在。」"
      }
    },
    {
      id: "cauda_draconis",
      latin: "Cauda Draconis",
      zh: "龍尾",
      nick: "曲終人散的終點",
      symbol: "⚏",
      dots: [1, 1, 1, 2],
      totalDots: 5,
      isEven: false,
      planet: "南交點（火星/土星交感）",
      planetLatin: "South Node",
      planetSymbol: "☋",
      sign: "處女座",
      signLatin: "Virgo",
      signSymbol: "♍",
      element: "火",
      elementLatin: "Fire",
      quality: "退場消散",
      favorable: "凶（利結尾退場）",
      keyword: "結束、退場、背叛、破壞、爛尾、斷絕因果",
      summary: "巨龍擺尾沉入幽暗深淵。象徵因緣已盡、能量潰散，若出現在起手第一卦，古老占卜師往往建議立即止步停占。",
      story: "它是龍首的另一端——曲終人散的帷幕。事情已經走到了結尾，若在此時還想強留、硬搶，只會招致無謂的折磨與反噬。唯一的出路是優雅退場。",
      daily: "問分手、離職、結案、清償債務時，它是「快刀斬亂麻」的訊號；但若問開啟新戀情或創業，則是嚴重的警告訊號。",
      extended: {
        career: "合夥破裂、專案草草收尾、背後有小人暗中作梗；切忌硬撐，應迅速擬定退場協議。",
        love: "因緣已盡，甚至可能伴隨欺瞞或背叛；莫再自我催眠，乾脆俐落抽身才能保全自尊。",
        wealth: "嚴防詐騙、借貸賴帳或資產縮水；切勿再投入任何一分沉沒成本。",
        health: "提防下肢、泌尿系統或排泄毒素積聚，需進行徹底的身體檢查排雷。",
        timing: "大局已定，已無挽回餘地，宜在數日內迅速了結相關手續。"
      },
      potion: {
        herb: "杜松、迷迭香、白鼠尾草",
        oil: "淨化結界白鼠尾草精油",
        action: "使用白鼠尾草或秘魯聖木淨化個人空間，將已終結的人事物封存在檔案夾不再翻看。",
        quote: "「承認結束需要無比的慈悲，因為每一個優雅的句號，都在為下一段壯麗的序言讓路。」"
      }
    },
    {
      id: "albus",
      latin: "Albus",
      zh: "純白",
      nick: "清醒的智者",
      symbol: "⚏",
      dots: [2, 2, 1, 2],
      totalDots: 7,
      isEven: false,
      planet: "水星",
      planetLatin: "Mercury",
      planetSymbol: "☿",
      sign: "雙子座",
      signLatin: "Gemini",
      signSymbol: "♊",
      element: "風",
      elementLatin: "Air",
      quality: "清晰明澈",
      favorable: "大吉（智慧洞察）",
      keyword: "智慧、冷靜、純潔、清晰、明辨是非、深思熟慮",
      summary: "如同一只敞開迎向天光的白銀聖杯。象徵極致的理性、智性洞察與和平，遠離混亂的情緒風暴，看清事情本質。",
      story: "它不是衝鋒陷陣的猛將，而是端坐在中軍帳裡輕搖羽扇的軍師。任憑外面暴風驟雨，它始終冷靜如一面鏡子，把局勢的每一處破綻照得一清二楚。",
      daily: "問「該不該衝」「要不要先緩一緩」，Albus 提醒你先看清合約細節、諮詢專家智慧，謀定而後動必能全勝。",
      extended: {
        career: "依靠策劃、法律合規、數據分析贏得主導權；適合發表學術報告、制定制度規章。",
        love: "精神交流契合，彼此尊重彼此的獨立思想；少了激情的盲目，多了一份長久的相知相惜。",
        wealth: "精準理財、資產透明度高，靠專業知識與理性決策帶來穩定增值。",
        health: "神經系統放鬆，思緒澄明平靜，睡眠品質大幅提升。",
        timing: "事緩則圓，給自己三到五天沉澱思考，答案自然清晰浮現。"
      },
      potion: {
        herb: "薄荷、尤加利、綠薄荷",
        oil: "明澈心智綠薄荷精油",
        action: "在安靜的書桌前點燃一盞白蠟燭，在白紙中央畫一個圓，將腦中所有雜念條列寫下並逐一釐清。",
        quote: "「真正的平靜不是沒有風浪，而是在狂風中心依然擁有一顆不起波瀾的水晶之心。」"
      }
    },
    {
      id: "rubeus",
      latin: "Rubeus",
      zh: "赤紅",
      nick: "失控的慾望",
      symbol: "⚏",
      dots: [2, 1, 2, 2],
      totalDots: 7,
      isEven: false,
      planet: "火星（逆行）",
      planetLatin: "Mars (Retrograde)",
      planetSymbol: "♂",
      sign: "天蠍座",
      signLatin: "Scorpio",
      signSymbol: "♏",
      element: "水",
      elementLatin: "Water",
      quality: "洶湧暗流",
      favorable: "大凶（警惕衝動與狂躁）",
      keyword: "慾望、狂躁、衝動、暴力、毒性、暗流湧動、情緒失控",
      summary: "Albus 的顛倒對照——朝向地獄倒扣的燃燒毒杯。象徵被恐懼、嫉妒或貪婪驅使的情緒風暴，起手第一卦逢之必停。",
      story: "血紅色的酒杯打翻在地，烈火灼燒著神智。當 Rubeus 出現時，代表你或對方正被極度強烈的執念、嫉妒或憤怒所綁架，此時所做的任何決定日後都將付出慘痛代價。",
      daily: "問「要不要發脾氣攤牌」「要不要衝動做決定」，Rubeus 嚴正警告：立刻停止！把手機放下，深呼吸，去喝一杯冰水冷靜！",
      extended: {
        career: "面臨辦公室惡意鬥爭、謠言中傷或合約陷阱；切忌情緒失控反擊，應暗中保留證據。",
        love: "致命的吸引力伴隨病態佔有慾、嫉妒與信任危機；切勿在盛怒下說出傷人狠話。",
        wealth: "高風險賭徒心理作祟，容易落入殺豬盤或詐騙陷阱；請將金庫鑰匙交由信任之人保管。",
        health: "注意血液發炎、高血壓、外傷出血或生殖泌尿系統發炎，切勿過度熬夜酗酒。",
        timing: "險象環生，眼下絕非行動良機，必須先自我隔離並冷卻情緒。"
      },
      potion: {
        herb: "羅馬洋甘菊、岩蘭草、黑雲杉",
        oil: "冰鎮熄火羅馬洋甘菊精油",
        action: "將手腕放在冷水龍頭下沖水 60 秒，閉上雙眼默數 100 下，在平靜前拒絕做出任何承諾或回覆。",
        quote: "「不要在暴風雨正盛時砍倒自家的桅杆；平靜下來，狂風自會散去。」"
      }
    }
  ];

  function getFigureById(id) {
    return GEOMANCY_FIGURES.find(f => f.id === id) || null;
  }

  function getFigureByDots(dots) {
    if (!dots || dots.length !== 4) return null;
    return GEOMANCY_FIGURES.find(f => 
      f.dots[0] === dots[0] &&
      f.dots[1] === dots[1] &&
      f.dots[2] === dots[2] &&
      f.dots[3] === dots[3]
    ) || null;
  }

  function addFigures(figA, figB) {
    const dotsA = figA.dots;
    const dotsB = figB.dots;
    const resultDots = [
      dotsA[0] === dotsB[0] ? 2 : 1,
      dotsA[1] === dotsB[1] ? 2 : 1,
      dotsA[2] === dotsB[2] ? 2 : 1,
      dotsA[3] === dotsB[3] ? 2 : 1
    ];
    return getFigureByDots(resultDots);
  }

  function generateShieldChart(mothers) {
    if (!mothers || mothers.length !== 4) {
      throw new Error("必須提供 4 個母親圖形 (M1 ~ M4)");
    }

    const m1 = mothers[0];
    const m2 = mothers[1];
    const m3 = mothers[2];
    const m4 = mothers[3];

    // 四女兒 (D5 ~ D8)
    const d5 = getFigureByDots([m1.dots[0], m2.dots[0], m3.dots[0], m4.dots[0]]);
    const d6 = getFigureByDots([m1.dots[1], m2.dots[1], m3.dots[1], m4.dots[1]]);
    const d7 = getFigureByDots([m1.dots[2], m2.dots[2], m3.dots[2], m4.dots[2]]);
    const d8 = getFigureByDots([m1.dots[3], m2.dots[3], m3.dots[3], m4.dots[3]]);

    // 四姪女 (N9 ~ N12)
    const n9 = addFigures(m1, m2);
    const n10 = addFigures(m3, m4);
    const n11 = addFigures(d5, d6);
    const n12 = addFigures(d7, d8);

    // 兩證人 (W13, W14)
    const w13 = addFigures(n9, n10); // 右證人
    const w14 = addFigures(n11, n12); // 左證人

    // 法官 (J15)
    const j15 = addFigures(w13, w14);

    // 調解者 (R16)
    const r16 = addFigures(j15, m1);

    const isJudgeEven = j15.isEven;
    const isWarningStart = (m1.id === 'rubeus' || m1.id === 'cauda_draconis');

    return {
      mothers: [m1, m2, m3, m4],
      daughters: [d5, d6, d7, d8],
      nieces: [n9, n10, n11, n12],
      witnesses: {
        right: w13,
        left: w14
      },
      judge: j15,
      reconciler: r16,
      allSlots: {
        m1, m2, m3, m4,
        d5, d6, d7, d8,
        n9, n10, n11, n12,
        w13, w14, j15, r16
      },
      isValid: isJudgeEven,
      isWarningStart
    };
  }

  // 十二宮位基本定義
  const HOUSE_BASE_DEFINITIONS = [
    { num: 1, roman: "I", name: "命宮 (自身)", themes: "提問者本質、心理動機、當前活力、自我認同" },
    { num: 2, roman: "II", name: "財帛宮 (金錢)", themes: "正財收入、資產流動、物質安全感、可動用的資源" },
    { num: 3, roman: "III", name: "兄弟宮 (溝通)", themes: "人際往來、合約信件、短途出差、學習與手足關係" },
    { num: 4, roman: "IV", name: "田宅宮 (根基)", themes: "原生家庭、不動產、居住環境、事情最終歸宿底牌" },
    { num: 5, roman: "V", name: "男女宮 (戀愛)", themes: "桃花戀情、歡樂聚會、子女懷孕、創意與冒險投資" },
    { num: 6, roman: "VI", name: "奴僕宮 (工作健康)", themes: "日常勞務、部屬同事、寵物、身心小病痛與工作習慣" },
    { num: 7, roman: "VII", name: "夫妻宮 (合夥對手)", themes: "親密伴侶、合夥人、談判對象、公開競爭對手" },
    { num: 8, roman: "VIII", name: "疾厄宮 (轉化偏財)", themes: "他人財富、投資借貸、深層恐懼、生死與蛻變危機" },
    { num: 9, roman: "IX", name: "遷移宮 (心靈遠行)", themes: "出國旅行、跨界拓展、高等教育、精神哲學與指引" },
    { num: 10, roman: "X", name: "官祿宮 (事業名望)", themes: "職涯成就、社會地位、主管長官態度、專案最終成果" },
    { num: 11, roman: "XI", name: "福德宮 (人脈貴人)", themes: "社群圈子、知心好友、貴人援手、對未來的希望願景" },
    { num: 12, roman: "XII", name: "玄秘宮 (隱患暗敵)", themes: "隱藏危機、暗中小人、自我懷疑、盲點與潛意識業力" }
  ];

  /**
   * 十二宮位映射演算法
   * 支援兩種流派：
   * 1. agrippa (阿格里帕流派，預設)：
   *    House 1~4 = M1~M4, House 5~8 = D5~D8, House 9~12 = N9~N12
   * 2. arabic (古典阿拉伯流派)：
   *    四母親坐四正宮 (Angular): H1=M1, H10=M2, H7=M3, H4=M4
   *    四女兒坐四續宮 (Succedent): H2=D5, H11=D6, H8=D7, H5=D8
   *    四姪女坐四果宮 (Cadent): H3=N9, H12=N10, H9=N11, H6=N12
   */
  const SCHOOL_SLOT_MAPPINGS = {
    agrippa: {
      1: "m1", 2: "m2", 3: "m3", 4: "m4",
      5: "d5", 6: "d6", 7: "d7", 8: "d8",
      9: "n9", 10: "n10", 11: "n11", 12: "n12"
    },
    arabic: {
      1: "m1", 10: "m2", 7: "m3", 4: "m4",
      2: "d5", 11: "d6", 8: "d7", 5: "d8",
      3: "n9", 12: "n10", 9: "n11", 6: "n12"
    }
  };

  // 十二宮位古典固定星盤守護地占符號 (宮位盤外圈固定對應，對照 IMG_7975 / IMG_7976 經典盤位天體守護)
  const FIXED_HOUSE_FIGURE_IDS = {
    1:  "puer",          // I 少年 (Puer) [1, 1, 2, 1] - 命宮
    2:  "laetitia",      // II 喜悅 (Laetitia) [1, 2, 2, 2] - 財帛
    3:  "caput_draconis",// III 龍首 (Caput Draconis) [2, 1, 1, 1] - 兄弟
    4:  "albus",         // IV 純白 (Albus) [2, 2, 1, 2] - 田宅
    5:  "puella",        // V 少女 (Puella) [1, 2, 1, 1] - 子女
    6:  "cauda_draconis",// VI 龍尾 (Cauda Draconis) [1, 1, 1, 2] - 奴僕
    7:  "rubeus",        // VII 赤紅 (Rubeus) [2, 1, 2, 2] - 夫妻
    8:  "tristitia",     // VIII 憂傷 (Tristitia) [2, 2, 2, 1] - 疾厄
    9:  "fortuna_minor", // IX 小吉 (Fortuna Minor) [1, 1, 2, 2] - 遷移
    10: "carcer",        // X 禁錮 (Carcer) [1, 2, 2, 1] - 官祿
    11: "coniunctio",    // XI 聯合 (Coniunctio) [2, 1, 1, 2] - 福德
    12: "fortuna_major"  // XII 大吉 (Fortuna Major) [2, 2, 1, 1] - 相貌
  };

  const FIXED_HOUSE_ZODIAC_FIGURES = {};
  for (let h = 1; h <= 12; h++) {
    FIXED_HOUSE_ZODIAC_FIGURES[h] = getFigureById(FIXED_HOUSE_FIGURE_IDS[h]);
  }

  // 標準黃道十二星座順序 (從牡羊座起逆時針輪轉)
  const ZODIAC_SIGNS_ORDER = [
    { name: "牡羊座", symbol: "♈", latin: "Aries" },
    { name: "金牛座", symbol: "♉", latin: "Taurus" },
    { name: "雙子座", symbol: "♊", latin: "Gemini" },
    { name: "巨蟹座", symbol: "♋", latin: "Cancer" },
    { name: "獅子座", symbol: "♌", latin: "Leo" },
    { name: "處女座", symbol: "♍", latin: "Virgo" },
    { name: "天秤座", symbol: "♎", latin: "Libra" },
    { name: "天蠍座", symbol: "♏", latin: "Scorpio" },
    { name: "射手座", symbol: "♐", latin: "Sagittarius" },
    { name: "摩羯座", symbol: "♑", latin: "Capricorn" },
    { name: "水瓶座", symbol: "♒", latin: "Aquarius" },
    { name: "雙魚座", symbol: "♓", latin: "Pisces" }
  ];

  // 外圍十二星座方形排列定義 (參照 IMG_7974 原始預設)
  const ZODIAC_SQUARE = [
    { sign: "金牛座", symbol: "♉", latin: "Taurus", side: "top", pos: "left" },
    { sign: "牡羊座", symbol: "♈", latin: "Aries", side: "top", pos: "center" },
    { sign: "雙魚座", symbol: "♓", latin: "Pisces", side: "top", pos: "right" },
    { sign: "水瓶座", symbol: "♒", latin: "Aquarius", side: "right", pos: "top" },
    { sign: "摩羯座", symbol: "♑", latin: "Capricorn", side: "right", pos: "center" },
    { sign: "射手座", symbol: "♐", latin: "Sagittarius", side: "right", pos: "bottom" },
    { sign: "天蠍座", symbol: "♏", latin: "Scorpio", side: "bottom", pos: "right" },
    { sign: "天秤座", symbol: "♎", latin: "Libra", side: "bottom", pos: "center" },
    { sign: "處女座", symbol: "♍", latin: "Virgo", side: "bottom", pos: "left" },
    { sign: "獅子座", symbol: "♌", latin: "Leo", side: "left", pos: "bottom" },
    { sign: "巨蟹座", symbol: "♋", latin: "Cancer", side: "left", pos: "center" },
    { sign: "雙子座", symbol: "♊", latin: "Gemini", side: "left", pos: "top" }
  ];

  function generateHouseChart(shieldChart, school = "agrippa") {
    const mapping = SCHOOL_SLOT_MAPPINGS[school] || SCHOOL_SLOT_MAPPINGS.agrippa;
    const houses = HOUSE_BASE_DEFINITIONS.map(h => {
      const slot = mapping[h.num];
      const figure = shieldChart.allSlots[slot];
      return {
        ...h,
        slot,
        figure
      };
    });

    return {
      school,
      houses,
      witnesses: shieldChart.witnesses,
      judge: shieldChart.judge,
      reconciler: shieldChart.reconciler
    };
  }

  function generatePlanetaryChart(shieldChart, houseChart = null, customAscSign = null, offset = 0) {
    const slots = [
      shieldChart.mothers[0], shieldChart.mothers[1], shieldChart.mothers[2], shieldChart.mothers[3],
      shieldChart.daughters[0], shieldChart.daughters[1], shieldChart.daughters[2], shieldChart.daughters[3],
      shieldChart.nieces[0], shieldChart.nieces[1], shieldChart.nieces[2], shieldChart.nieces[3],
      shieldChart.witnesses.right, shieldChart.witnesses.left,
      shieldChart.judge
    ];

    const elementCounts = { "火": 0, "風": 0, "水": 0, "土": 0 };
    const planetCounts = {};
    const signCounts = {};

    slots.forEach(fig => {
      if (fig) {
        elementCounts[fig.element] = (elementCounts[fig.element] || 0) + 1;
        const pKey = fig.planet.split('（')[0];
        planetCounts[pKey] = (planetCounts[pKey] || 0) + 1;
        signCounts[fig.sign] = (signCounts[fig.sign] || 0) + 1;
      }
    });

    let dominantElement = "火";
    let maxEl = -1;
    for (const el in elementCounts) {
      if (elementCounts[el] > maxEl) {
        maxEl = elementCounts[el];
        dominantElement = el;
      }
    }

    let dominantPlanet = "太陽";
    let maxPl = -1;
    for (const pl in planetCounts) {
      if (planetCounts[pl] > maxPl) {
        maxPl = planetCounts[pl];
        dominantPlanet = pl;
      }
    }

    // 計算行星盤外圈 12 宮位飛臨星座 (根據上升星座與旋轉偏移動態變動)
    let ascSignName = "巨蟹座";
    if (customAscSign && customAscSign !== 'auto') {
      ascSignName = customAscSign;
    } else if (houseChart && houseChart.houses && houseChart.houses[0] && houseChart.houses[0].figure) {
      ascSignName = houseChart.houses[0].figure.sign;
    }

    let ascIndex = ZODIAC_SIGNS_ORDER.findIndex(z => z.name === ascSignName || z.name.includes(ascSignName));
    if (ascIndex === -1) ascIndex = 3; // 預設巨蟹座 (Index 3，對照 IMG_7974 第一宮命宮為巨蟹座)

    const houseSigns = {};
    for (let h = 1; h <= 12; h++) {
      const idx = (ascIndex + (h - 1) + offset) % 12;
      const normalizedIdx = (idx + 12) % 12;
      houseSigns[h] = ZODIAC_SIGNS_ORDER[normalizedIdx];
    }

    return {
      elementCounts,
      dominantElement,
      planetCounts,
      dominantPlanet,
      signCounts,
      ascSign: ZODIAC_SIGNS_ORDER[ascIndex],
      houseSigns,
      offset
    };
  }

  function generateReading(shieldChart, category = "general", school = "agrippa") {
    const judge = shieldChart.judge;
    const wRight = shieldChart.witnesses.right;
    const wLeft = shieldChart.witnesses.left;
    const reconciler = shieldChart.reconciler;
    const m1 = shieldChart.mothers[0];

    let warningMessage = null;
    if (m1.id === "rubeus") {
      warningMessage = "【神聖警告】第一母親卦抽得 Rubeus（赤紅）：古典地占傳統認為此時提問者心緒極度狂躁、憤怒或受慾望執念矇蔽，盤象極易失真。請務必先平息情緒、靜心沉澱後再重新起盤。";
    } else if (m1.id === "cauda_draconis") {
      warningMessage = "【神聖警告】第一母親卦抽得 Cauda Draconis（龍尾）：代表此提問所涉之事已至窮途末路、大局已定或存在背叛盲點，多問無益，唯有放手斷捨離方能自保。";
    }

    let verdictLevel = "中性";
    let verdictSummary = "";
    if (["fortuna_major", "acquisitio", "laetitia", "caput_draconis", "albus"].includes(judge.id)) {
      verdictLevel = "大吉";
      verdictSummary = `法官現身 ${judge.zh}（${judge.latin}），這是一張充滿光明、智慧與實力收成的上上吉盤！所問之事能得善終，成果豐盛。`;
    } else if (["puella", "fortuna_minor"].includes(judge.id)) {
      verdictLevel = "吉利";
      verdictSummary = `法官現身 ${judge.zh}（${judge.latin}），整體走向吉祥順遂，但帶有速效或需柔軟借力之特質，宜見好就收、以柔克剛。`;
    } else if (["via", "populus", "coniunctio"].includes(judge.id)) {
      verdictLevel = "中平變動";
      verdictSummary = `法官現身 ${judge.zh}（${judge.latin}），局勢呈現動態流轉或隨大眾風向擺動，勝負端看後續如何順應形勢整合資源。`;
    } else {
      verdictLevel = "阻礙挑戰";
      verdictSummary = `法官現身 ${judge.zh}（${judge.latin}），眼前將面臨拖延、流失或體制框架之嚴峻考驗，不宜盲目強求，應以防守深扎根基為先。`;
    }

    let triangleAnalysis = "";
    const isRightFavorable = ["fortuna_major", "acquisitio", "laetitia", "puella", "albus", "caput_draconis"].includes(wRight.id);
    const isLeftFavorable = ["fortuna_major", "acquisitio", "laetitia", "puella", "albus", "caput_draconis"].includes(wLeft.id);

    if (isRightFavorable && isLeftFavorable) {
      triangleAnalysis = `【內外同心・天地共鳴】：右證人（提問者）為 ${wRight.zh}（${wRight.latin}），展現出極佳的準備度、清晰的心態與正面動能；左證人（外在環境／對方）亦為 ${wLeft.zh}（${wLeft.latin}），說明時機成熟、外在條件全力相挺。內外兩股吉力交會，直接推動法官結出善果！`;
    } else if (isRightFavorable && !isLeftFavorable) {
      triangleAnalysis = `【我有誠意・外在卡關】：右證人（提問者）為 ${wRight.zh}（${wRight.latin}），你的實力與誠意無庸置疑；但左證人（外在環境／對方）卻顯現 ${wLeft.zh}（${wLeft.latin}），暗示對方公司可能正遭遇自身困境（如預算凍結、決策僵化），或者外在時機尚未成熟。法官最終判決提醒你：問題不在你身上，莫自我懷疑，而應給予環境時間發酵。`;
    } else if (!isRightFavorable && isLeftFavorable) {
      triangleAnalysis = `【天賜良機・自身怯懦】：左證人（外在環境）為 ${wLeft.zh}（${wLeft.latin}），外在機會大門已經為你敞開；然而右證人（提問者）卻出現 ${wRight.zh}（${wRight.latin}），代表你內心充滿焦慮、衝動或信心動搖，尚未做好全面承接的心理準備。法官提醒你：先修復自我內在狀態，才能穩穩接住天賜良機！`;
    } else {
      triangleAnalysis = `【內憂外患・磨礪修煉】：右證人（提問者）為 ${wRight.zh}，左證人（外在環境）為 ${wLeft.zh}，內在焦慮碰上外在緊縮，雙方皆處於高壓或耗損狀態。法官指出這是一場靈魂的深度淬鍊，切忌意氣用事，應先退回防線守住本心。`;
    }

    const reconcilerText = `調解者（Judge of Judges）為 ${reconciler.zh}（${reconciler.latin}）：由最終法官與第一母親交感而生，它揭示了「若想打破目前僵局，最深層的破局鑰匙」。它叮嚀你：${reconciler.daily} 保持 ${reconciler.keyword} 的心靈彈性，就能順利打通最後一哩路。`;

    const houseChart = generateHouseChart(shieldChart, school);
    let categoryAnalysis = "";
    if (category === "career") {
      const h10 = houseChart.houses[9];
      const h6 = houseChart.houses[5];
      const h2 = houseChart.houses[1];
      categoryAnalysis = `【事業官運深度指引】：
• 事業官祿（第10宮）坐落【${h10.figure.zh}】：${h10.figure.extended.career}
• 職場日常（第6宮）坐落【${h6.figure.zh}】：${h6.figure.summary}
• 成果回饋（第2宮）坐落【${h2.figure.zh}】：${h2.figure.extended.wealth}`;
    } else if (category === "love") {
      const h7 = houseChart.houses[6];
      const h5 = houseChart.houses[4];
      const h1 = houseChart.houses[0];
      categoryAnalysis = `【感情緣分深度指引】：
• 伴侶關係（第7宮）坐落【${h7.figure.zh}】：${h7.figure.extended.love}
• 戀愛氛圍（第5宮）坐落【${h5.figure.zh}】：${h5.figure.daily}
• 自身心境（第1宮）坐落【${h1.figure.zh}】：${h1.figure.summary}`;
    } else if (category === "wealth") {
      const h2 = houseChart.houses[1];
      const h8 = houseChart.houses[7];
      const h10 = houseChart.houses[9];
      categoryAnalysis = `【財富金流深度指引】：
• 正財收入（第2宮）坐落【${h2.figure.zh}】：${h2.figure.extended.wealth}
• 投資偏財（第8宮）坐落【${h8.figure.zh}】：${h8.figure.daily}
• 業務格局（第10宮）坐落【${h10.figure.zh}】：${h10.figure.extended.career}`;
    } else {
      const h1 = houseChart.houses[0];
      const h4 = houseChart.houses[3];
      const h10 = houseChart.houses[9];
      categoryAnalysis = `【綜合全息核心宮位】：
• 當前自身（第1宮）坐落【${h1.figure.zh}】：${h1.figure.summary}
• 事業願景（第10宮）坐落【${h10.figure.zh}】：${h10.figure.extended.career}
• 事情歸宿（第4宮）坐落【${h4.figure.zh}】：象徵整件事沉澱後的底定基石，${h4.figure.daily}`;
    }

    const potion = {
      name: `【${judge.zh} × ${reconciler.zh}】靈魂調頻魔藥`,
      herbs: `${judge.potion.herb}、${reconciler.potion.herb}`,
      oil: judge.potion.oil,
      ritualAction: judge.potion.action,
      soulQuote: judge.potion.quote
    };

    return {
      warningMessage,
      verdictLevel,
      verdictSummary,
      triangleAnalysis,
      reconcilerText,
      categoryAnalysis,
      potion
    };
  }

  function castRandomMothers() {
    const mothers = [];
    for (let i = 0; i < 4; i++) {
      const dots = [
        Math.random() < 0.5 ? 1 : 2,
        Math.random() < 0.5 ? 1 : 2,
        Math.random() < 0.5 ? 1 : 2,
        Math.random() < 0.5 ? 1 : 2
      ];
      mothers.push(getFigureByDots(dots));
    }
    return mothers;
  }

  function dotsFromCounts(counts) {
    if (!counts || counts.length !== 4) return null;
    const dots = counts.map(c => (c % 2 === 1 ? 1 : 2));
    return getFigureByDots(dots);
  }

  global.GeomancyCalc = {
    FIGURES: GEOMANCY_FIGURES,
    HOUSE_BASE_DEFINITIONS,
    SCHOOL_SLOT_MAPPINGS,
    FIXED_HOUSE_ZODIAC_FIGURES,
    ZODIAC_SIGNS_ORDER,
    ZODIAC_SQUARE,
    getFigureById,
    getFigureByDots,
    addFigures,
    generateShieldChart,
    generateHouseChart,
    generatePlanetaryChart,
    generateReading,
    castRandomMothers,
    dotsFromCounts
  };

})(typeof window !== 'undefined' ? window : this);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = global.GeomancyCalc || (typeof window !== 'undefined' ? window.GeomancyCalc : this.GeomancyCalc);
}
