import json, re

with open('100_Todo/projects/meetjoy-divination/js/ziwei-cards-complete.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if '巨門太陽' exists
if '巨門太陽' not in content and '太陽巨門' not in content:
    card_jm_ty = {
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
            "upright": ["辯才無礙", "熱情正直", "聲名顯赫", "具說服力", "驅散陰霾"],
            "reversed": ["口舌爭端", "操心過度", "言多必失", "需多傾聽"]
        },
        "dimensions": {
            "personality": {"upright": "坦蕩熱情、口才出眾、富正義感", "reversed": "直言快語易得罪人、內心多慮"},
            "career": {"upright": "適合傳播、教學、公關與法務，發揮影響力", "reversed": "職場防小人挑撥，行事需留白紙黑字"},
            "love": {"upright": "熱情坦白、樂於分享生活瑣事", "reversed": "因口角起爭執、過於說教"},
            "wealth": {"upright": "靠口才與專業名望進財，財源順暢", "reversed": "因人情或是非破耗，避免爭議投資"},
            "luck": {"upright": "如旭日初升，前途光明", "reversed": "烏雲蔽日，宜沉穩修口德"}
        },
        "potion": "佛手柑精油 + 藍紋瑪瑙，梳理喉輪能量，帶來清亮明澈的溝通智慧。"
    }
    
    # Insert before 'global.MeetJoyZiweiCards'
    idx = content.rfind('global.MeetJoyZiweiCards')
    # Parse the json array
    match = re.search(r'const ZIWEI_COMPLETE_CARDS = (\[.*?\]);', content, re.DOTALL)
    if match:
        cards = json.loads(match.group(1))
        cards.insert(37, card_jm_ty)
        new_json = json.dumps(cards, ensure_ascii=False, indent=2)
        new_content = content[:match.start(1)] + new_json + content[match.end(1):]
        with open('100_Todo/projects/meetjoy-divination/js/ziwei-cards-complete.js', 'w', encoding='utf-8') as f_out:
            f_out.write(new_content)
        print('Added 巨門太陽! Total cards now:', len(cards))
else:
    print('Already contains 巨門太陽!')
