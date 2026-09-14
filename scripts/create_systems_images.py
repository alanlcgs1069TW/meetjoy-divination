#!/usr/bin/env python3
"""
Generate and prepare 10 standard square images (600x600 px) for MeetJoy Divination systems.
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = '/Users/alanlc/Documents/claudeai/100_Todo/projects/meetjoy-divination/images/systems'
os.makedirs(OUT_DIR, exist_ok=True)

FONT_PATH = '/System/Library/Fonts/STHeiti Medium.ttc'

def get_font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()

def crop_center_square(img_path, out_path, size=600):
    if not os.path.exists(img_path):
        print(f"⚠️ Source missing: {img_path}")
        return False
    with Image.open(img_path) as im:
        im = im.convert('RGB')
        w, h = im.size
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        im_crop = im.crop((left, top, left + min_dim, top + min_dim))
        im_resized = im_crop.resize((size, size), Image.Resampling.LANCZOS)
        im_resized.save(out_path, 'JPEG', quality=92)
        print(f"✅ Cropped: {os.path.basename(out_path)}")
        return True

# 1. Numerology
crop_center_square(
    '/Users/alanlc/Desktop/生命數字能量諮詢.PNG',
    os.path.join(OUT_DIR, 'numerology.jpg')
)

# 2. Human Design
crop_center_square(
    '/Users/alanlc/Documents/claudeai/100_Todo/drafts/marketing-copy/images/2026-09-06_human_design_9_centers.jpg',
    os.path.join(OUT_DIR, 'human-design.jpg')
)

# 3. Gene Keys
crop_center_square(
    '/Users/alanlc/Documents/claudeai/100_Todo/projects/meetjoy-divination/logs/render_activation.png',
    os.path.join(OUT_DIR, 'gene-keys.jpg')
)

# 4. Ziwei
crop_center_square(
    '/Users/alanlc/Documents/claudeai/100_Todo/drafts/marketing-copy/images/2026-09-10_ziwei_four_malefics_cover.png',
    os.path.join(OUT_DIR, 'ziwei.jpg')
)

# 5. Liu Yao
crop_center_square(
    '/Users/alanlc/Documents/claudeai/100_Todo/drafts/marketing-copy/images/2026-09-10_track_b_liuyao_divination.png',
    os.path.join(OUT_DIR, 'liu-yao.jpg')
)

# 6. Western Astrology
crop_center_square(
    '/Users/alanlc/Documents/claudeai/100_Todo/drafts/marketing-copy/images/2026-09-02_12houses_cover.jpg',
    os.path.join(OUT_DIR, 'astrology.jpg')
)

# 7. Chakra Astrology
crop_center_square(
    '/Users/alanlc/Documents/claudeai/100_Todo/drafts/marketing-copy/images/2026-09-02_mandala_chakras.jpg',
    os.path.join(OUT_DIR, 'chakra-astrology.jpg')
)

# 8. Destiny Cards (Playing Cards Composition)
def create_destiny_cards_cover():
    card_dir = '/Users/alanlc/Documents/claudeai/100_Todo/projects/meetjoy-divination/images/cards'
    canvas = Image.new('RGB', (600, 600), color='#19231A')
    draw = ImageDraw.Draw(canvas)

    # Velvet table background with radial highlight
    for r in range(350, 0, -2):
        alpha = int((350 - r) / 350 * 35)
        draw.ellipse([300 - r, 300 - r, 300 + r, 300 + r], fill=(25 + alpha, 35 + alpha, 26 + alpha))

    # Gold concentric rings
    draw.ellipse([40, 40, 560, 560], outline='#C8A97E', width=2)
    draw.ellipse([50, 50, 550, 550], outline='#8C7355', width=1)

    # Load 3 cards: c1 (Ace of Spades / Hearts), c13 (King), c26
    cards_to_load = ['c1.png', 'c13.png', 'c26.png']
    angles = [-18, 0, 18]
    x_offsets = [170, 300, 430]

    for c_name, ang, x_pos in zip(cards_to_load, angles, x_offsets):
        p = os.path.join(card_dir, c_name)
        if os.path.exists(p):
            with Image.open(p) as card:
                card = card.convert('RGBA')
                card = card.resize((210, 280), Image.Resampling.LANCZOS)
                # Shadow
                shadow = Image.new('RGBA', card.size, (0, 0, 0, 160))
                rot_shadow = shadow.rotate(ang, expand=True, resample=Image.Resampling.BICUBIC)
                canvas.paste(rot_shadow, (x_pos - 100 + 8, 170 + 12), rot_shadow)
                # Rotate card
                rot_card = card.rotate(ang, expand=True, resample=Image.Resampling.BICUBIC)
                canvas.paste(rot_card, (x_pos - 100, 170), rot_card)

    # Label Banner
    draw.rectangle([80, 490, 520, 545], fill='#1E261D', outline='#C8A97E', width=2)
    font_title = get_font(26)
    font_sub = get_font(13)
    draw.text((300, 506), "撲克命牌 · 生命之書", fill='#F7E7CE', font=font_title, anchor='mm')
    draw.text((300, 532), "52張神聖卡片全息密碼 ｜ 7大行星週期", fill='#C8A97E', font=font_sub, anchor='mm')

    out_p = os.path.join(OUT_DIR, 'destiny-cards.jpg')
    canvas.save(out_p, 'JPEG', quality=92)
    print(f"✅ Created: {os.path.basename(out_p)}")

create_destiny_cards_cover()

# 9. Geomancy (Sacred Shield Composition)
def create_geomancy_cover():
    canvas = Image.new('RGB', (600, 600), color='#1C1B18')
    draw = ImageDraw.Draw(canvas)

    # Earth concentric sacred circles
    for r in range(320, 0, -2):
        draw.ellipse([300 - r, 300 - r, 300 + r, 300 + r], fill=(28 + int((320 - r) * 0.08), 27 + int((320 - r) * 0.06), 24 + int((320 - r) * 0.03)))

    draw.ellipse([50, 50, 550, 550], outline='#C8A97E', width=3)
    draw.ellipse([65, 65, 535, 535], outline='#8C7355', width=1)
    draw.ellipse([140, 140, 460, 460], outline='#C8A97E', width=1)

    # Draw Shield lines
    draw.polygon([(180, 120), (420, 120), (420, 310), (300, 440), (180, 310)], outline='#D4AF37', width=3)
    draw.line([(300, 120), (300, 440)], fill='#C8A97E', width=2)
    draw.line([(180, 230), (420, 230)], fill='#C8A97E', width=2)

    # Draw sacred dots (Fortuna Major: 2, 2, 1, 1; Via: 1, 1, 1, 1; Populus: 2, 2, 2, 2)
    def draw_geomantic_figure(cx, cy, pattern, dot_color='#F7E7CE'):
        # pattern: list of 4 ints (1 or 2)
        spacing = 16
        for i, val in enumerate(pattern):
            y = cy - 24 + i * spacing
            if val == 1:
                draw.ellipse([cx - 4, y - 4, cx + 4, y + 4], fill=dot_color)
            else:
                draw.ellipse([cx - 12, y - 4, cx - 4, y + 4], fill=dot_color)
                draw.ellipse([cx + 4, y - 4, cx + 12, y + 4], fill=dot_color)

    # Place key geomantic figures in the shield
    draw_geomantic_figure(240, 175, [2, 2, 1, 1])  # Fortuna Major
    draw_geomantic_figure(360, 175, [1, 1, 2, 2])  # Fortuna Minor
    draw_geomantic_figure(240, 270, [1, 1, 1, 1])  # Via
    draw_geomantic_figure(360, 270, [2, 2, 2, 2])  # Populus
    draw_geomantic_figure(300, 360, [2, 1, 1, 2], dot_color='#EAB308')  # Judge: Conjunctio

    # Label Banner
    draw.rectangle([80, 490, 520, 545], fill='#25211B', outline='#C8A97E', width=2)
    font_title = get_font(26)
    font_sub = get_font(13)
    draw.text((300, 506), "西洋地占 · 神聖排盤", fill='#F7E7CE', font=font_title, anchor='mm')
    draw.text((300, 532), "大地之針 16 卦家族樹 ｜ 左右證人與法官審判", fill='#C8A97E', font=font_sub, anchor='mm')

    out_p = os.path.join(OUT_DIR, 'geomancy.jpg')
    canvas.save(out_p, 'JPEG', quality=92)
    print(f"✅ Created: {os.path.basename(out_p)}")

create_geomancy_cover()

# 10. Xiao Liu Ren (Four-Plates Divine Compass)
def create_xiao_liu_ren_cover():
    canvas = Image.new('RGB', (600, 600), color='#14211D')
    draw = ImageDraw.Draw(canvas)

    # Celestial jade background gradient
    for r in range(320, 0, -2):
        draw.ellipse([300 - r, 300 - r, 300 + r, 300 + r], fill=(20 + int((320 - r) * 0.05), 33 + int((320 - r) * 0.08), 29 + int((320 - r) * 0.06)))

    draw.ellipse([50, 50, 550, 550], outline='#10B981', width=3)
    draw.ellipse([65, 65, 535, 535], outline='#C8A97E', width=1)
    draw.ellipse([160, 160, 440, 440], outline='#C8A97E', width=2)

    # 6 sectors for Six Gods
    import math
    gods = [
        ("大安", "#10B981", "身心安定 · 事事順遂"),
        ("留連", "#F59E0B", "牽絆拖延 · 靜觀其變"),
        ("速喜", "#EF4444", "喜事臨門 · 立即行動"),
        ("赤口", "#EC4899", "口舌防非 · 謹言慎行"),
        ("小吉", "#3B82F6", "和合吉祥 · 貴人相助"),
        ("空亡", "#6B7280", "萬事成空 · 修心歸零")
    ]

    font_god = get_font(28)
    for i, (name, color, desc) in enumerate(gods):
        angle = math.radians(i * 60 - 90)
        # Position around circle
        x = 300 + int(175 * math.cos(angle))
        y = 300 + int(175 * math.sin(angle))
        # Draw node badge
        draw.ellipse([x - 42, y - 42, x + 42, y + 42], fill='#1E2E28', outline=color, width=3)
        draw.text((x, y + 2), name, fill='#F7E7CE', font=font_god, anchor='mm')

    # Central Taiji / Compass
    draw.ellipse([250, 250, 350, 350], fill='#1E261D', outline='#C8A97E', width=2)
    font_center = get_font(22)
    draw.text((300, 300), "六神\n四盤", fill='#C8A97E', font=font_center, anchor='mm')

    # Label Banner
    draw.rectangle([80, 490, 520, 545], fill='#1B2A24', outline='#10B981', width=2)
    font_title = get_font(26)
    font_sub = get_font(13)
    draw.text((300, 506), "四盤小六壬 · 神數排盤", fill='#F7E7CE', font=font_title, anchor='mm')
    draw.text((300, 532), "地人神星四盤同參 ｜ 掌訣即時隨機神斷", fill='#10B981', font=font_sub, anchor='mm')

    out_p = os.path.join(OUT_DIR, 'xiao-liu-ren.jpg')
    canvas.save(out_p, 'JPEG', quality=92)
    print(f"✅ Created: {os.path.basename(out_p)}")

create_xiao_liu_ren_cover()

print("\n🎉 全部 10 大命盤系統專屬標準方形圖（600x600 px）製作完成！")
