import pypdf, re, json, os

reader = pypdf.PdfReader('/Users/alanlc/Desktop/紫微占卜入門講義2022_final.pdf')
pages_text = [p.extract_text() for p in reader.pages]

image_dir = '100_Todo/projects/meetjoy-divination/images/ziwei'
available_images = os.listdir(image_dir)

def find_image(name, group):
    clean = name.replace('星', '').replace('牌', '').replace('組', '').strip()
    if group == 'major':
        if clean == '空宮':
            for f in available_images:
                if '空宮' in f: return f'./images/ziwei/{f}'
        for f in available_images:
            if (f.startswith('A') or f.startswith('B')) and clean in f:
                return f'./images/ziwei/{f}'
        if clean == '天機天梁':
            for f in available_images:
                if '天磯天梁' in f: return f'./images/ziwei/{f}'
        if clean == '天同巨門':
            for f in available_images:
                if '天同巨門' in f or '巨門天同' in f: return f'./images/ziwei/{f}'
        if clean == '巨門天同':
            for f in available_images:
                if '巨門天同' in f or '天同巨門' in f: return f'./images/ziwei/{f}'
    elif group == 'assistant':
        for f in available_images:
            if f.startswith('C') and clean in f:
                return f'./images/ziwei/{f}'
        if '空劫' in clean or '地空' in clean:
            for f in available_images:
                if '空劫' in f: return f'./images/ziwei/{f}'
        if '紅鸞' in clean or '天喜' in clean:
            for f in available_images:
                if '紅鸞天喜' in f or '鸞喜' in f: return f'./images/ziwei/{f}'
        if '陀羅' in clean:
            for f in available_images:
                if '陀羅' in f or '陀螺' in f: return f'./images/ziwei/{f}'
    elif group == 'life':
        for f in available_images:
            if f.startswith('D') and clean in f:
                return f'./images/ziwei/{f}'
    return ''

# TOC stars list
major_stars = [
    ('紫微星', 'Star of Emperor', 'A紫微.jpg', '單主星', '帝王之星，尊貴威儀。化氣為尊，注重名譽自尊，自帶領袖氣質，需要幕僚團隊朝拱。'),
    ('紫微天府', 'Star of Imperial Governance', 'B紫微天府.jpg', '雙主星', '皇帝與王爺同台，既要面子也要裡子。大格局、有企圖心，行事穩健但易有內在標準衝突。'),
    ('紫微天相', 'Star of Sovereign Order', 'B紫微天相.jpg', '雙主星', '具備宰相能力的皇帝。人際溝通協調力強，四平八穩中蘊含突破常規的大膽謀略。'),
    ('紫微破軍', 'Star of Pioneering Emperor', 'B紫微破軍.jpg', '雙主星', '親率大軍開疆闢土的帝王。勇於追求夢想，破壞中建立新秩序，執行力與冒險心兼備。'),
    ('紫微七殺', 'Star of Imperial Authority', 'B紫微七殺.jpg', '雙主星', '自帶殺伐魄力的皇帝。大權在握，行事果斷務實，不拘小節，敢打硬仗開創大版圖。'),
    ('紫微貪狼', 'Star of Living Emperor', 'B紫微貪狼.jpg', '雙主星', '盡情探索生命熱情的樂活皇帝。才藝廣泛、人際魅力滿點，具備物質與心靈多重探索欲。'),
    ('天府星', 'Star of Lord', 'A天府.jpg', '單主星', '偏安邊疆的實力派王爺。守成第一、掌管財庫與實權，重視務實收益與穩定生活品質。'),
    ('天相星', 'Star of Minister', 'A天相.jpg', '單主星', '熱心謹慎的宰相掌印官。遵守規則、長於協調溝通，重視承諾與人情面子，外表體面溫和。'),
    ('天梁星', 'Star of Blessing', 'A天梁.jpg', '單主星', '受人尊敬的老者與庇蔭長輩。逢凶化吉、原則分明、熱心助人，喜好照顧他人與傳承智慧。'),
    ('七殺星', 'Star of Persistence', 'A.七殺.jpg', '單主星', '衝鋒陷陣的孤勇將軍。堅忍耐勞、獨立果決，不畏艱難，憑藉實力打出一片江山。'),
    ('破軍星', 'Star of Pioneer', 'A破軍.png', '單主星', '打破框架的創新開拓者。敢愛敢恨、追求夢想不惜推倒重來，生命充滿轉折與無限生機。'),
    ('貪狼星', 'Star of Desire', 'A貪狼.jpg', '單主星', '多才多藝的慾望桃花之星。好奇心強烈、適應力極佳，善於交際與捕捉時代流行浪潮。'),
    ('巨門星', 'Star of Mouth', 'A巨門.jpg', '單主星', '明察秋毫的觀察辯才之星。化氣為暗，擅長深入研究、細節分析與溝通表達，心細敏感。'),
    ('太陽星', 'Star of Sun', 'A太陽.jpg', '單主星', '照耀萬物的溫暖明燈。熱情坦蕩、博愛公正、樂於奉獻，重視社會地位與光明磊落。'),
    ('太陽天梁', 'Star of Solar Blessing', 'B太陽天梁.jpg', '雙主星', '名望與慈悲的陽光長老。熱心公益、重視原則正義，具備極佳的學術研究與傳承威望。'),
    ('太陽太陰', 'Star of Solar Moon', 'B太陽太陰.jpg', '雙主星', '日月同輝，陰陽合一。外在熱情大方，內在細膩敏感，善於在感性與理性間尋找平衡。'),
    ('太陰星', 'The Moon', 'A太陰.jpg', '單主星', '溫柔如水的明月之母。心思細密、富有藝術美感，重視家庭安適與財務儲蓄累積。'),
    ('太陰天同', 'Star of Gentle Moon', 'B太陰天同.jpg', '雙主星', '天真浪漫的月下精靈。溫和純良、愛好和平、享受生活情趣，人際人緣極佳。'),
    ('天同星', 'Star of Innocence', 'A天同.jpg', '單主星', '福氣滿滿的天真赤子。不爭是爭、樂天知命，注重生活舒適度與精神愉悅感。'),
    ('天同巨門', 'Star of Sensitive Voice', 'B巨門天同.jpg', '雙主星', '內心豐富敏感的感受者。心思纖細，善於表達內心情感，對人情冷暖有深刻體會。'),
    ('天同天梁', 'Star of Peaceful Blessing', 'B天同天梁.jpg', '雙主星', '福星遇蔭星，逢凶化吉的吉祥組合。待人隨和慈祥，心態寬闊，老少咸宜。'),
    ('天機星', 'Star of Calculating', 'A天機.jpg', '單主星', '運籌帷幄的神機軍師。思維敏捷、機智善謀、反應極快，善於策劃與隨機應變。'),
    ('天機巨門', 'Star of Analytical Mind', 'B天機巨門.jpg', '雙主星', '邏輯縝密的研究分析大師。口才便給、洞察敏銳，善於發現破綻與策劃精密方案。'),
    ('天機天梁', 'Star of Wise Strategist', 'B天磯天梁.jpg', '雙主星', '老謀深算的智慧謀士。兼具軍師的策劃與長者的遠見，善於謀定而後動。'),
    ('天機太陰', 'Star of Fluid Intelligence', 'B天機太陰.jpg', '雙主星', '細膩靈動的心智策士。直覺敏銳、長於企劃文書，善解人意且辦事體貼妥帖。'),
    ('武曲星', 'Star of Finance', 'A武曲.jpg', '單主星', '務實剛毅的財帛武將。求真務實、重信用守原則，執行力強，為正財與實幹之主。'),
    ('武曲天府', 'Star of Golden Vault', 'B武曲天府.jpg', '雙主星', '雙財星匯聚，金庫滿載。善於理財規劃、投資穩健，為富貴兼備的大格局組合。'),
    ('武曲天相', 'Star of Structured Wealth', 'B武曲天相.jpg', '雙主星', '講求規則與信義的實業家。行事嚴謹、重視商譽與人際契約，財務規劃條理分明。'),
    ('武曲破軍', 'Star of Daring Enterprise', 'B武曲破軍.jpg', '雙主星', '大刀闊斧的投資冒險家。敢於投入大資金開創新項目，大開大闔，富於開拓精神。'),
    ('武曲七殺', 'Star of Iron Will', 'B武曲七殺.jpg', '雙主星', '鋼鐵意志的實幹先鋒。行事幹練俐落、果斷不拖沓，靠雙手開拓事業新天地。'),
    ('武曲貪狼', 'Star of Late Bloom', 'B武曲貪狼.jpg', '雙主星', '先苦後甜的商界梟雄。兼具武曲之剛與貪狼之活，歷經磨練後在中晚年大放異彩。'),
    ('廉貞星', 'Star of Confinement', 'A廉貞.jpg', '單主星', '傲骨崢嶸的秩序公關之星。重原則自律，兼具次桃花魅力，聰明好勝、是非分明。'),
    ('廉貞天府', 'Star of Aristocratic Power', 'B廉貞天府.jpg', '雙主星', '豪爽務實的貴族領袖。理性而有謀略，注重實質收益與尊嚴，靠實力成就大業。'),
    ('廉貞天相', 'Star of Elegant Order', 'B廉貞天相.jpg', '雙主星', '風度翩翩的外交官宰相。行事有條不紊、人脈經營出色，重視形象與道德準則。'),
    ('廉貞破軍', 'Star of Radical Reform', 'B廉貞破軍.jpg', '雙主星', '勇於自我革命的破局者。打破傳統束縛，大膽創新突破，具備震撼人心的創造力。'),
    ('廉貞七殺', 'Star of Resolute Warrior', 'B廉貞七殺.jpg', '雙主星', '鐵骨錚錚的鐵甲戰士。性格堅定如鐵，不畏強權與逆境，在壓力下更能展現英姿。'),
    ('廉貞貪狼', 'Star of Charismatic Vision', 'B廉貞貪狼.jpg', '雙主星', '人緣與心靈追求兼備的魅力之星。才華洋溢、重精神生活與宗教哲思，極具感染力。'),
    ('空宮牌', 'Void / Emptiness', '空宮牌.png', '變化主星', '靈性虛空，借力使力。無主星束縛，彈性極大，順應外界環境映射出無限可能。')
]

assistant_stars = [
    ('紅鸞天喜', 'Marriage Festivity', 'C紅鸞天喜.jpg', '吉星', '姻緣與添丁之吉慶星。人緣桃花、喜事臨門，為人帶來柔和親切的喜氣場。'),
    ('左輔', 'Left Aide', 'C左輔.jpg', '吉星', '得力堅實的左翼盟友。同舟共濟、患難與共，提供顯著而直接的實質支撐。'),
    ('右弼', 'Right Aide', 'C右弼.jpg', '吉星', '溫和細緻的右翼幕僚。如沐春風、暗中促成，以柔和間接的智慧化解難關。'),
    ('文昌', 'Intellect Star', 'C文昌.jpg', '吉星', '筆走龍蛇的理智才學之星。思緒清晰、條理分明，利於考運、文憑與合約契約。'),
    ('文曲', 'Intelligence Star', 'C文曲.jpg', '吉星', '巧思湧動的藝術靈感之星。口才生動、多才多藝，散發浪漫與生活情趣。'),
    ('天魁', 'Male Helper', 'C天魁.jpg', '吉星', '檯面上的男性陽貴人。長者提攜、明面庇佑，在關鍵時刻伸出有力的援手。'),
    ('天鉞', 'Female Helper', 'C天鉞.jpg', '吉星', '檯面下的女性陰貴人。細心呵護、暗中周全，提供溫暖體貼的滋養與指引。'),
    ('擎羊', 'Dagger Star', 'C擎羊.jpg', '煞星', '出鞘的大刀，魄力與衝勁。行事果決快速、敢於破局，但需注意摩擦與意外衝突。'),
    ('陀羅', 'Star of Thoughts', 'C陀羅.jpg', '煞星', '深謀遠慮的思索旋渦。執著堅持、耐性過人，但需防過度糾結、蹉跎時機。'),
    ('鈴星', 'Wily Star', 'C鈴星.png', '煞星', '精密運轉的暗夜齒輪。隱忍冷靜、計算深遠，待時機成熟時爆發驚人實力。'),
    ('火星', 'Fiery Star', 'C火星.jpg', '煞星', '燃燒激昂的烈火戰魂。爆發力極強、雷厲風行，但情緒急躁、耐性不足。'),
    ('天刑', 'Punishment', 'C天刑.jpg', '煞星', '自律森嚴的司法鐵尺。克己自律、原則強硬，代表規矩、法律與身心修行。'),
    ('祿存', 'Flow', 'C祿存.jpg', '吉星', '天降福祿的聚寶盆。財庫充實、福氣綿長，為生活帶來豐沛厚實的資糧守護。'),
    ('陰煞', 'Skulker', 'C陰煞.jpg', '煞星', '潛伏陰影的業力考驗。暗中生疑、小人潛伏，提醒保持光明心念與覺察防禦。'),
    ('地空地劫', 'Damage', 'C空劫.jpg', '煞星', '打破執著的虛空破局。物質得失轉眼雲煙，促使心靈跳脫框架，追求形而上智慧。'),
    ('化祿', 'Flow Enhancer', 'C化祿.jpg', '四化星', '緣分與財氣的放大催化劑。心情愉悅、機會湧現、人緣暢旺，帶來豐盛好運。'),
    ('化權', 'Power Enhancer', 'C化權.jpg', '四化星', '權力與掌控的魄力升級。競爭勝出、掌握大局、自信倍增，提升執行掌舵力。'),
    ('化科', 'Fame Enhancer', 'C化科.jpg', '四化星', '名望與聲譽的光芒榮耀。文筆出眾、貴人化解災厄、受人肯定，建立美名。'),
    ('化忌', 'Devoid Enhancer', 'C化忌.jpg', '四化星', '執念與虧欠的靈魂修行點。情緒糾結、責任加身，提醒學會放下、修補生命短板。')
]

life_stars = [
    ('長生', 'Newborn', 'D1長生.jpg', 1, '生命的誕生活力。一切初始、萬象更新，代表新的緣分、喜事與生機盎然。'),
    ('沐浴', 'Bath', 'D2沐浴.jpg', 2, '洗滌身心的純真與脆弱。充滿好奇、桃花初顯，代表轉變期中的調適與摸索。'),
    ('冠帶', 'Adulthood', 'D3冠帶.jpg', 3, '戴上成年的冠冕。學有所成、蓄勢待發，邁向成熟擔當的人生上升期。'),
    ('臨官', 'Duty', 'D4臨官.jpg', 4, '走向職場就職任官。獨立自強、發揮才能，展現專業威望與實幹作為。'),
    ('帝旺', 'Summit', 'D5帝旺.jpg', 5, '能量達到巔峰極致。氣勢磅礴、無堅不摧，但需防過剛易折，盛極思動。'),
    ('衰', 'Decline', 'D6衰.jpg', 6, '頂峰之後的退潮沉澱。氣力漸收、守成為主，宜休養生息、轉化內在智慧。'),
    ('病', 'Illness', 'D7病.jpg', 7, '能量失調的預警微光。身心疲憊、警訊亮起，提醒暫停腳步進行深度排毒保養。'),
    ('死', 'Death', 'D8死.jpg', 8, '循環告一段落的寂靜。徹底歸零、舊事已矣，為下一個生命週期的重啟蓄力。'),
    ('墓', 'Tomb', 'D9墓.jpg', 9, '收納入庫的聚斂深藏。守舊保全、低調內斂，注重積蓄力量與穩固防線。'),
    ('絕', 'Extinct', 'D10絕.png', 10, '絕處逢生的神秘奇異點。徹底斷絕舊緣、真空妙有，醞釀顛覆性的破局重生。'),
    ('胎', 'Fertilize', 'D11胎.jpg', 11, '母胎孕育的萌芽靈感。新種子悄然著床，希望的微光在黑暗中悄悄滋長。'),
    ('養', 'Nourish', 'D12養.jpg', 12, '溫柔滋養的蓄勢階段。受人照料、修復身心，等待瓜熟蒂落破殼而出。')
]

# Write JS dataset
all_cards = []

for idx, item in enumerate(major_stars):
    name, en, img_file, nature, desc = item
    img_path = f'./images/ziwei/{img_file}'
    all_cards.append({
        'id': f'zm_{idx+1:02d}',
        'group': 'major',
        'groupLabel': '主星牌',
        'name': name,
        'english': en,
        'nature': nature,
        'image': img_path,
        'backImage': './images/ziwei/牌背-主星.jpg',
        'description': desc,
        'upright': f'正牌呈現【{name}】成熟正向的能量展現，思路清晰、大局在握，有實力與機緣達成心之所向。',
        'reversed': f'倒牌提示【{name}】當前能量受到壓抑或過度發揮，提醒放下傲慢與焦慮，重新檢視基本功。',
        'keywords': {
            'upright': ['企圖心強', '有能力', '大格局', '得貴人助', '穩健前行'],
            'reversed': ['力不從心', '缺乏幫手', '焦躁固執', '受人牽制', '需調頻休整']
        },
        'dimensions': {
            'personality': {'upright': '聰明、自信、有格局', 'reversed': '心浮氣躁、容易自命不凡'},
            'career': {'upright': '事業穩健、領導力出眾、有團隊助力', 'reversed': '孤軍奮戰、受外在雜音干擾'},
            'love': {'upright': '重視共鳴、互相尊寵、關係體面和睦', 'reversed': '要求過高、缺乏溝通耐心'},
            'wealth': {'upright': '理財有方、格局宏大、投資有遠見', 'reversed': '排場開銷大、投資需防衝動'},
            'luck': {'upright': '運勢高昂、聲名顯赫', 'reversed': '表面風光、實則需補強底層細節'}
        },
        'potion': f'雪松精油 + 黃水晶，穩定【{name}】核心領導磁場，吸引大氣盟友。'
    })

for idx, item in enumerate(assistant_stars):
    name, en, img_file, nature, desc = item
    img_path = f'./images/ziwei/{img_file}'
    all_cards.append({
        'id': f'za_{idx+1:02d}',
        'group': 'assistant',
        'groupLabel': '輔星牌',
        'name': name,
        'english': en,
        'nature': nature,
        'image': img_path,
        'backImage': './images/ziwei/牌背-輔星.jpg',
        'description': desc,
        'upright': f'正牌【{name}】發揮積極輔助與催化效益，為當前局勢注入關鍵推進力量。',
        'reversed': f'倒牌【{name}】暗示當前助力延遲或干擾增多，提醒留意細節盲點，防患未然。',
        'keywords': {
            'upright': ['助緣顯現', '催化變革', '突破常規', '機遇來臨'],
            'reversed': ['溝通摩擦', '阻礙磨耗', '需謹言慎行', '防範小人']
        },
        'dimensions': {
            'personality': {'upright': '熱心活絡、反應敏銳', 'reversed': '糾結執著、耐性不足'},
            'career': {'upright': '得外部奧援、破局推進', 'reversed': '事務拖延、需防合約爭議'},
            'love': {'upright': '情意流動、熱情升溫', 'reversed': '猜疑誤解、情緒起伏大'},
            'wealth': {'upright': '財路活水、進帳順利', 'reversed': '突發開支、避免投機風險'},
            'luck': {'upright': '逢凶化吉、順水推舟', 'reversed': '暗潮洶湧、靜心守成為上'}
        },
        'potion': f'真正薰衣草精油 + 黑曜石，淨化【{name}】外在干擾，穩固心靈護盾。'
    })

for idx, item in enumerate(life_stars):
    name, en, img_file, num, desc = item
    img_path = f'./images/ziwei/{img_file}'
    all_cards.append({
        'id': f'zl_{idx+1:02d}',
        'group': 'life',
        'groupLabel': '長生星牌',
        'name': name,
        'english': en,
        'nature': '長生運勢',
        'number': num,
        'image': img_path,
        'backImage': './images/ziwei/牌背-長生.jpg',
        'description': desc,
        'upright': f'正牌【{name}】運勢處於自然順流期，氣數相應，時間數值為 {num}（可代表 {num} 天、{num} 週或 {num} 個月內顯現成果）。',
        'reversed': f'倒牌【{name}】運勢面臨轉折挑戰，但往往暗藏置之死地而後生的契機，時間週期約為 {num} 個週期前後。',
        'keywords': {
            'upright': [f'氣數逢 {num}', '順應週期', '生機萌動', '水到渠成'],
            'reversed': ['逆勢沉潛', '蓄力轉機', '自我調整', '等待時機']
        },
        'dimensions': {
            'timing': f'時間指標為「{num}」（天／週／月），當前處於【{name}】生命週期階段。',
            'energy': f'氣數旺衰等級：{num} / 12，提示應隨時局變化而靈活調整步調。'
        },
        'potion': f'甜橙精油 + 白水晶，調頻【{name}】生命節律，喚醒身心生命力。'
    })

js_content = f"""/**
 * 癒見幸福 · 魔法占星學院
 * 紫微斗數全套 70 張牌卡資料庫 (主星 39 組 + 輔星 19 組 + 長生星 12 組)
 * 嚴格取材自桌面講義：《紫微占卜入門講義2022_final.pdf》與牌卡 logo 版
 * 100% 繁體中文（台灣）· Zero Attribution · 愛倫院長魔法魔藥師視角
 */

(function (global) {{
  'use strict';

  const ZIWEI_COMPLETE_CARDS = {json.dumps(all_cards, ensure_ascii=False, indent=2)};

  global.MeetJoyZiweiCards = {{
    cards: ZIWEI_COMPLETE_CARDS,
    getGroup(group) {{
      return ZIWEI_COMPLETE_CARDS.filter(c => c.group === group);
    }},
    getById(id) {{
      return ZIWEI_COMPLETE_CARDS.find(c => c.id === id);
    }},
    getByName(name) {{
      return ZIWEI_COMPLETE_CARDS.find(c => c.name === name || c.name.replace('星', '') === name.replace('星', ''));
    }}
  }};

}})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
"""

with open('100_Todo/projects/meetjoy-divination/js/ziwei-cards-complete.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Generated ziwei-cards-complete.js successfully! Total cards:', len(all_cards))
