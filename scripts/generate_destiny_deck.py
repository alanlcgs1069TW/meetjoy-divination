#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
撲克命牌 1080 規格全套 53 張神聖卡牌批次生成器
- 參考用戶手繪真跡風格：手繪禪繞曼陀羅、彩色鉛筆/水彩斑斕質感、星曜符號、生命之樹、第三眼等靈性圖騰
- 直接整合用戶真跡截圖：c40 (AS 黑桃 A) 與 c23 (10C 梅花 10)
- 輸出標準 1080x1440 高清卡牌至 images/cards/ (c0.png ~ c52.png)
"""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

W, H = 1080, 1440

SUITS = {
    'H': {
        'name': 'Hearts', 'zh': '紅心', 'symbol': '♥',
        'color': (220, 38, 38), 'pale_bg': (255, 245, 245),
        'theme': '情感 · 慈悲 · 心靈連結',
        'palette': [
            (235, 75, 80), (245, 145, 140), (250, 195, 90),
            (140, 195, 150), (210, 100, 150), (255, 240, 235),
            (45, 30, 35), (225, 175, 65), (180, 80, 110), (240, 120, 90)
        ]
    },
    'C': {
        'name': 'Clubs', 'zh': '梅花', 'symbol': '♣',
        'color': (30, 41, 59), 'pale_bg': (245, 250, 248),
        'theme': '心智 · 智慧 · 靈感激盪',
        'palette': [
            (45, 95, 165), (65, 185, 155), (245, 190, 70),
            (215, 85, 85), (165, 110, 205), (250, 248, 235),
            (30, 40, 50), (215, 170, 60), (90, 160, 120), (230, 130, 60)
        ]
    },
    'D': {
        'name': 'Diamonds', 'zh': '方塊', 'symbol': '♦',
        'color': (217, 119, 6), 'pale_bg': (255, 252, 245),
        'theme': '物質 · 價值 · 豐盛實踐',
        'palette': [
            (235, 135, 35), (175, 75, 195), (240, 90, 70),
            (75, 175, 145), (255, 215, 85), (255, 248, 230),
            (45, 30, 25), (215, 160, 50), (200, 110, 45), (130, 85, 170)
        ]
    },
    'S': {
        'name': 'Spades', 'zh': '黑桃', 'symbol': '♠',
        'color': (15, 23, 42), 'pale_bg': (248, 248, 252),
        'theme': '靈性 · 意志 · 終極蛻變',
        'palette': [
            (40, 55, 80), (145, 95, 195), (235, 155, 55),
            (215, 75, 75), (85, 165, 135), (248, 248, 242),
            (25, 25, 30), (220, 175, 65), (110, 70, 140), (190, 60, 90)
        ]
    },
    'JOKER': {
        'name': 'Joker', 'zh': '小丑', 'symbol': '★',
        'color': (147, 51, 234), 'pale_bg': (253, 248, 255),
        'theme': '全知 · 愚者 · 無限可能',
        'palette': [
            (155, 65, 215), (235, 65, 135), (245, 195, 45),
            (45, 185, 175), (65, 125, 225), (255, 245, 255),
            (35, 25, 45), (225, 175, 65), (180, 50, 160), (250, 140, 50)
        ]
    }
}

RANKS = [
    ('A', 'Ace', '原初真理 · 神聖起點'),
    ('2', 'Two', '雙生和諧 · 鏡像連結'),
    ('3', 'Three', '三位一體 · 靈感創造'),
    ('4', 'Four', '四方基石 · 恆久秩序'),
    ('5', 'Five', '五星之光 · 冒險自由'),
    ('6', 'Six', '六芒調和 · 業力平衡'),
    ('7', 'Seven', '七星蓮花 · 靈性覺醒'),
    ('8', 'Eight', '無限循環 · 掌控力量'),
    ('9', 'Nine', '九重圓滿 · 宇宙大愛'),
    ('10', 'Ten', '天命果實 · 巔峰成就'),
    ('J', 'Jack', '青年騎士 · 直覺先鋒'),
    ('Q', 'Queen', '滋養女王 · 直覺守護'),
    ('K', 'King', '智慧之尊 · 終極統御')
]

DESKTOP_AS = "/Users/alanlc/Desktop/截圖 2026-09-12 中午12.04.56.png"
DESKTOP_10C = "/Users/alanlc/Desktop/截圖 2026-09-12 中午12.05.40.png"

def get_fonts():
    font_paths_georgia = [
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Georgia.ttf",
        "/Library/Fonts/Georgia.ttf"
    ]
    font_paths_zh = [
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Supplemental/Songti.ttc"
    ]
    font_paths_sym = [
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/AppleGothic.ttf",
        "/System/Library/Fonts/STHeiti Medium.ttc"
    ]

    f_georgia = None
    for p in font_paths_georgia:
        if os.path.exists(p):
            f_georgia = p
            break

    f_zh = None
    for p in font_paths_zh:
        if os.path.exists(p):
            f_zh = p
            break

    f_sym = None
    for p in font_paths_sym:
        if os.path.exists(p):
            f_sym = p
            break

    f_corner_rank = ImageFont.truetype(f_georgia or f_zh, 84)
    f_corner_suit = ImageFont.truetype(f_sym or f_zh, 72)
    f_title_en = ImageFont.truetype(f_georgia or f_zh, 64)
    f_title_zh = ImageFont.truetype(f_zh, 42)
    f_sub = ImageFont.truetype(f_zh, 32)
    return f_corner_rank, f_corner_suit, f_title_en, f_title_zh, f_sub

def draw_card_base():
    im = Image.new("RGBA", (W, H), (254, 252, 248, 255))
    draw = ImageDraw.Draw(im)

    # 典雅雙重香檳金與細邊框
    gold_outer = (198, 164, 118, 255)
    gold_inner = (228, 216, 196, 255)
    
    draw.rounded_rectangle([36, 36, W-36, H-36], radius=44, outline=gold_outer, width=4)
    draw.rounded_rectangle([48, 48, W-48, H-48], radius=34, outline=gold_inner, width=2)
    
    # 四個圓角裝飾
    for (cx, cy) in [(62, 62), (W-62, 62), (62, H-62), (W-62, H-62)]:
        draw.ellipse([cx-5, cy-5, cx+5, cy+5], fill=gold_outer)
        draw.ellipse([cx-9, cy-9, cx+9, cy+9], outline=gold_inner, width=1)
        
    return im

def draw_corner_indexes(im, rank_str, suit_char, suit_meta, fonts):
    f_rank, f_suit, _, _, _ = fonts
    draw = ImageDraw.Draw(im)
    col = suit_meta['color']
    sym = suit_meta['symbol']

    # 1. 左上角
    draw.text((72, 70), rank_str, fill=col, font=f_rank)
    draw.text((74, 160), sym, fill=col, font=f_suit)

    # 2. 右下角 (倒轉 180 度印染)
    # 計算文字寬度避免截斷
    bbox_r = draw.textbbox((0, 0), rank_str, font=f_rank)
    box_w = max(240, (bbox_r[2] - bbox_r[0]) + 80)
    corner_box = Image.new("RGBA", (box_w, 220), (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(corner_box)
    cdraw.text((20, 10), rank_str, fill=col, font=f_rank)
    cdraw.text((22, 100), sym, fill=col, font=f_suit)
    corner_rot = corner_box.rotate(180, expand=True)
    im.paste(corner_rot, (W - 72 - (box_w - 40), H - 70 - 200), corner_rot)

def draw_titles(im, rank_tup, suit_meta, fonts):
    _, _, f_title_en, f_title_zh, f_sub = fonts
    draw = ImageDraw.Draw(im)
    
    rank_char, rank_en, archetype_theme = rank_tup
    col = suit_meta['color']
    
    # 英文主標題 (例如 "Ten of Clubs")
    if rank_char == 'Joker':
        title_en = "The Divine Joker"
        title_zh = "神聖小丑 · 全知愚者"
    else:
        title_en = f"{rank_en} of {suit_meta['name']}"
        title_zh = f"{suit_meta['zh']} {rank_char} · {archetype_theme}"
        
    # 量測文字居中
    bbox_en = draw.textbbox((0, 0), title_en, font=f_title_en)
    w_en = bbox_en[2] - bbox_en[0]
    draw.text(((W - w_en) / 2, 1190), title_en, fill=(35, 40, 50, 255), font=f_title_en)
    
    # 繁體中文副標與牌義意象
    bbox_zh = draw.textbbox((0, 0), title_zh, font=f_title_zh)
    w_zh = bbox_zh[2] - bbox_zh[0]
    draw.text(((W - w_zh) / 2, 1270), title_zh, fill=col, font=f_title_zh)
    
    # 底部微光金線
    draw.line([W/2 - 160, 1340, W/2 + 160, 1340], fill=(210, 180, 130, 180), width=2)
    draw.ellipse([W/2 - 4, 1340 - 4, W/2 + 4, 1340 + 4], fill=(210, 180, 130, 255))

def generate_zentangle_motif(suit_key, rank_char, size=760):
    """
    生成高度精細的手繪風格禪繞曼陀羅花色圖騰
    具有彩色鉛筆/水彩斑斕質感、手繪墨水外線、神秘符號與牌義意象
    """
    suit_meta = SUITS[suit_key]
    colors = suit_meta['palette']
    
    seed = sum(ord(c) for c in (suit_key + rank_char)) * 17
    rng = random.Random(seed)
    
    # 1. 內部繪畫底板
    art = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    draw = ImageDraw.Draw(art)
    cx, cy = size / 2, size / 2

    # 1.1 背景彩繪玻璃放射分格
    wedges = 28
    r_outer = size * 0.72
    for i in range(wedges):
        a1 = i * (360 / wedges)
        a2 = (i + 1) * (360 / wedges)
        col = colors[(i + rng.randint(0, 3)) % len(colors)]
        draw.pieslice([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], a1, a2, fill=col)

    # 1.2 同心圓環與珠光珍珠邊
    rings = [size * 0.16, size * 0.28, size * 0.40, size * 0.50]
    for r in rings:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(35, 35, 40, 240), width=3)
        dots = int(r * 0.26)
        for s in range(dots):
            th = s * (2 * math.pi / dots)
            px = cx + r * math.cos(th)
            py = cy + r * math.sin(th)
            draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=(255, 255, 255, 255), outline=(30, 30, 30, 255), width=1)

    # 1.3 幾何墨水放射線與彩色螺旋圓點
    for deg in range(0, 360, 20):
        rad = math.radians(deg)
        x2 = cx + size * 0.49 * math.cos(rad)
        y2 = cy + size * 0.49 * math.sin(rad)
        draw.line([cx, cy, x2, y2], fill=(40, 40, 45, 180), width=2)
        for d in range(4):
            dist = size * (0.16 + d * 0.08)
            pdx = cx + dist * math.cos(rad + 0.08)
            pdy = cy + dist * math.sin(rad + 0.08)
            draw.ellipse([pdx - 5, pdy - 5, pdx + 5, pdy + 5],
                         fill=colors[(d + deg) % len(colors)],
                         outline=(30, 30, 30, 255), width=1)

    # 1.4 繪製該點數核心神聖圖騰
    draw_rank_archetype(draw, cx, cy, rank_char, suit_key, size, colors, rng)

    # 2. 製作花色遮罩
    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    
    if suit_key == 'H':
        pts = []
        for i in range(360):
            t = math.radians(i)
            x = 16 * (math.sin(t) ** 3)
            y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
            pts.append((cx + x * (size / 38), cy + y * (size / 38) - 20))
        mdraw.polygon(pts, fill=255)
        
    elif suit_key == 'D':
        wd, hd = size * 0.76, size * 0.98
        pts = [(cx, cy - hd/2), (cx + wd/2, cy), (cx, cy + hd/2), (cx - wd/2, cy)]
        mdraw.polygon(pts, fill=255)
        
    elif suit_key == 'S':
        pts = []
        for i in range(360):
            t = math.radians(i)
            x = 16 * (math.sin(t) ** 3)
            y = (13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
            pts.append((cx + x * (size / 39), cy + y * (size / 39) - 35))
        mdraw.polygon(pts, fill=255)
        stem = [
            (cx - 20, cy + size * 0.18),
            (cx - size * 0.24, cy + size * 0.45),
            (cx + size * 0.24, cy + size * 0.45),
            (cx + 20, cy + size * 0.18)
        ]
        mdraw.polygon(stem, fill=255)
        
    elif suit_key == 'C':
        r = size * 0.245
        mdraw.ellipse([cx - r, cy - r * 1.5 - r, cx + r, cy - r * 1.5 + r], fill=255)
        mdraw.ellipse([cx - r * 1.38 - r, cy - r * 0.15 - r, cx - r * 1.38 + r, cy - r * 0.15 + r], fill=255)
        mdraw.ellipse([cx + r * 1.38 - r, cy - r * 0.15 - r, cx + r * 1.38 + r, cy - r * 0.15 + r], fill=255)
        mdraw.ellipse([cx - r*0.9, cy - r*0.9, cx + r*0.9, cy + r*0.9], fill=255)
        stem = [
            (cx - 22, cy + r * 0.25),
            (cx - size * 0.23, cy + size * 0.45),
            (cx + size * 0.23, cy + size * 0.45),
            (cx + 22, cy + r * 0.25)
        ]
        mdraw.polygon(stem, fill=255)
        
    else:
        mdraw.ellipse([cx - size*0.43, cy - size*0.43, cx + size*0.43, cy + size*0.43], fill=255)

    # 3. 透過遮罩合成
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(art, (0, 0), mask)

    # 4. 勾勒黑色鋼筆手繪外輪廓
    edges = mask.filter(ImageFilter.FIND_EDGES)
    edge_layer = Image.new("RGBA", (size, size), (30, 30, 35, 255))
    canvas.paste(edge_layer, (0, 0), edges)
    
    return canvas

def draw_rank_archetype(draw, cx, cy, rank, suit, size, colors, rng):
    gold = (235, 185, 50, 255)
    ink = (30, 30, 35, 255)
    white = (255, 255, 255, 255)

    if rank == 'A':
        we = size * 0.32
        draw.chord([cx - we, cy - we*0.62, cx + we, cy + we*0.62], 0, 360, fill=white, outline=ink, width=4)
        draw.ellipse([cx - we*0.42, cy - we*0.42, cx + we*0.42, cy + we*0.42], fill=colors[0], outline=ink, width=3)
        draw.ellipse([cx - we*0.2, cy - we*0.2, cx + we*0.2, cy + we*0.2], fill=ink)
        draw.ellipse([cx + we*0.06, cy - we*0.09, cx + we*0.14, cy - we*0.01], fill=white)
        for a in range(-60, 241, 24):
            th = math.radians(a)
            draw.line([cx + (we*0.82)*math.cos(th), cy + (we*0.52)*math.sin(th),
                       cx + (we*1.22)*math.cos(th), cy + (we*0.78)*math.sin(th)], fill=ink, width=3)

    elif rank in ['K', 'Q', 'J']:
        rc = size * 0.24
        pts = [
            (cx - rc, cy + rc*0.55),
            (cx - rc, cy - rc*0.35),
            (cx - rc*0.5, cy - rc*0.05),
            (cx, cy - rc*0.72),
            (cx + rc*0.5, cy - rc*0.05),
            (cx + rc, cy - rc*0.35),
            (cx + rc, cy + rc*0.55)
        ]
        draw.polygon(pts, fill=gold, outline=ink, width=4)
        for p in [pts[1], pts[3], pts[5]]:
            draw.ellipse([p[0]-9, p[1]-9, p[0]+9, p[1]+9], fill=(225, 45, 55, 255), outline=ink, width=2)
            draw.ellipse([p[0]-3, p[1]-3, p[0]+3, p[1]+3], fill=white)
        for i in range(-4, 5):
            draw.ellipse([cx + i*20 - 6, cy + rc*0.35 - 6, cx + i*20 + 6, cy + rc*0.35 + 6], fill=white, outline=ink, width=2)

    elif rank == '10':
        for i in range(10):
            ang = i * (2 * math.pi / 10)
            rad = size * 0.23
            ox = cx + rad * math.cos(ang)
            oy = cy + rad * math.sin(ang)
            draw.line([cx, cy, ox, oy], fill=ink, width=3)
            draw.ellipse([ox - 20, oy - 20, ox + 20, oy + 20], fill=colors[i % len(colors)], outline=ink, width=2)
            draw.ellipse([ox - 8, oy - 8, ox + 8, oy + 8], fill=white)
        draw.ellipse([cx - 26, cy - 26, cx + 26, cy + 26], fill=gold, outline=ink, width=4)
        draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=(220, 40, 40, 255))

    elif rank == '8':
        draw.ellipse([cx - size*0.24, cy - size*0.13, cx, cy + size*0.13], fill=None, outline=ink, width=7)
        draw.ellipse([cx, cy - size*0.13, cx + size*0.24, cy + size*0.13], fill=None, outline=ink, width=7)
        draw.ellipse([cx - size*0.15, cy - size*0.06, cx - size*0.09, cy + size*0.06], fill=gold)
        draw.ellipse([cx + size*0.09, cy - size*0.06, cx + size*0.15, cy + size*0.06], fill=gold)

    elif rank == '7':
        for i in range(7):
            ang = i * (2 * math.pi / 7) - math.pi / 2
            ox = cx + (size * 0.23) * math.cos(ang)
            oy = cy + (size * 0.23) * math.sin(ang)
            draw.regular_polygon((ox, oy, 16), 5, rotation=18, fill=gold, outline=ink)
        draw.ellipse([cx - 28, cy - 28, cx + 28, cy + 28], fill=colors[0], outline=ink, width=4)
        draw.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=white)

    elif rank == '6':
        draw.regular_polygon((cx, cy, size*0.24), 3, rotation=0, fill=None, outline=ink, width=4)
        draw.regular_polygon((cx, cy, size*0.24), 3, rotation=180, fill=None, outline=ink, width=4)
        draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=gold, outline=ink, width=3)

    elif rank == '5':
        draw.regular_polygon((cx, cy, size*0.25), 5, rotation=0, fill=gold, outline=ink, width=4)
        draw.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=(225, 50, 50, 255), outline=ink, width=2)

    elif rank == '4':
        draw.rectangle([cx - size*0.18, cy - size*0.18, cx + size*0.18, cy + size*0.18], fill=white, outline=ink, width=4)
        draw.rectangle([cx - size*0.12, cy - size*0.12, cx + size*0.12, cy + size*0.12], fill=gold, outline=ink, width=3)
        draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=colors[0])

    elif rank == '3':
        draw.regular_polygon((cx, cy, size*0.24), 3, rotation=0, fill=gold, outline=ink, width=4)
        for i in range(3):
            ang = i * (2 * math.pi / 3) - math.pi/2
            px = cx + size*0.20*math.cos(ang)
            py = cy + size*0.20*math.sin(ang)
            draw.ellipse([px-12, py-12, px+12, py+12], fill=colors[i], outline=ink, width=3)

    elif rank == '2':
        draw.ellipse([cx - size*0.20, cy - size*0.11, cx, cy + size*0.11], fill=colors[0], outline=ink, width=4)
        draw.ellipse([cx, cy - size*0.11, cx + size*0.20, cy + size*0.11], fill=gold, outline=ink, width=4)
        draw.ellipse([cx - size*0.12, cy - size*0.04, cx - size*0.08, cy + size*0.04], fill=white)
        draw.ellipse([cx + size*0.08, cy - size*0.04, cx + size*0.12, cy + size*0.04], fill=ink)

    else:
        for i in range(9):
            ang = i * (2 * math.pi / 9)
            ox = cx + size * 0.20 * math.cos(ang)
            oy = cy + size * 0.20 * math.sin(ang)
            draw.ellipse([ox - 16, oy - 16, ox + 16, oy + 16], fill=gold, outline=ink, width=3)
        draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], fill=colors[0], outline=ink, width=3)

def create_card_image(card_id, suit_key, rank_tup, out_path):
    fonts = get_fonts()
    im = draw_card_base()
    suit_meta = SUITS[suit_key]
    rank_char, rank_en, theme = rank_tup

    # 1. 繪製牌角
    draw_corner_indexes(im, rank_char, suit_key, suit_meta, fonts)

    # 2. 繪製中央牌面圖案    # 2. 中央手繪神聖圖騰 (全牌面統一採用神聖幾何曼陀羅與靈性圖騰，不使用外部翻拍圖片)
    motif_size = 620
    motif = generate_zentangle_motif(suit_key, rank_char, size=motif_size)
    pos_x = int((W - motif_size) / 2)
    pos_y = 360
    im.paste(motif, (pos_x, pos_y), motif)

    # 3. 繪製底部文字
    draw_titles(im, rank_tup, suit_meta, fonts)

    # 4. 存檔 (PNG + GIF 相容)
    im_rgb = im.convert("RGB")
    im_rgb.save(out_path, "PNG", quality=95)
    
    gif_path = out_path.replace(".png", ".gif")
    im_rgb.save(gif_path, "GIF")

def main():
    out_dir = "/Users/alanlc/Documents/claudeai/100_Todo/projects/meetjoy-divination/images/cards"
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"開始批次生成 53 張 1080 規格神聖撲克命牌卡牌至 {out_dir}...")
    
    deck_map = []
    for i, r in enumerate(RANKS):
        deck_map.append((f"c{i+1}", 'H', r))
    for i, r in enumerate(RANKS):
        deck_map.append((f"c{i+14}", 'C', r))
    for i, r in enumerate(RANKS):
        deck_map.append((f"c{i+27}", 'D', r))
    for i, r in enumerate(RANKS):
        deck_map.append((f"c{i+40}", 'S', r))
    deck_map.append(('c0', 'JOKER', ('Joker', 'Joker', '宇宙原初 · 無限可能')))

    for cid, suit, rank_tup in deck_map:
        out_png = os.path.join(out_dir, f"{cid}.png")
        create_card_image(cid, suit, rank_tup, out_png)
        print(f"✓ 已生成 {cid} ({rank_tup[0]} of {suit}) -> {out_png}")

    print("全套 53 張神聖卡牌全部生成完成！")

if __name__ == "__main__":
    main()
