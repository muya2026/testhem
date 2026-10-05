#!/usr/bin/env python3
"""
Build VERIFIED BM SHOP README artwork that matches the live site theme.

Design tokens are taken from the live stylesheet (css/app.min.css):
  background  hsl(215 45% 96%)   -> #f0f4f9  (page surface)
  card        #ffffff
  primary     199 89% 36%        (blue family, plus vivid #0b60ea / #247fff)
  accent      18 93% 58%         -> #f76c30  (orange family, plus #f97224 / #ff7a00)
  footer-bg   222 47% 11%        -> #0f1729  (slate-900 navy)
  border      213 28% 86%        -> #d6dee8
  brand gradient: linear-gradient(135deg, #247fff, #f97224 56%, #247fff)
  fonts: Sora (body), Space Grotesk (headings)
"""
from __future__ import annotations

import math
import os
import subprocess

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = "/tmp"

# --- brand tokens -----------------------------------------------------------
SURFACE = (240, 244, 249)
CARD = (255, 255, 255)
BLUE = (36, 127, 255)
BLUE_DEEP = (11, 96, 234)
NAVY = (21, 35, 101)
ORANGE = (249, 114, 36)
ORANGE_DEEP = (255, 122, 0)
INK = (13, 21, 32)
MUTED = (78, 90, 112)
BORDER = (214, 222, 232)
WHITE = (255, 255, 255)
FOOTER = (15, 23, 41)
FOOTER_SURFACE = (23, 35, 61)
WHATSAPP = (31, 168, 85)
TELEGRAM = (0, 136, 204)

HEAD_FONT = os.path.join(FONT_DIR, "sg.ttf")     # Space Grotesk (variable)
BODY_FONT = os.path.join(FONT_DIR, "sora.ttf")   # Sora (variable)


def font(path: str, size: int, weight: str = "Regular") -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(path, size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(size, stops, angle_deg=135.0):
    """Linear gradient across the box, matching CSS linear-gradient angles closely enough."""
    w, h = size
    img = Image.new("RGB", (w, h))
    px = img.load()
    rad = math.radians(angle_deg)
    dx, dy = math.cos(rad), math.sin(rad)
    # project each pixel onto the gradient axis
    corners = [0, w * dx, h * dy, w * dx + h * dy]
    lo, hi = min(corners), max(corners)
    span = (hi - lo) or 1
    segments = sorted(stops, key=lambda s: s[0])
    for y in range(h):
        for x in range(w):
            t = ((x * dx + y * dy) - lo) / span
            px[x, y] = sample_stops(segments, t)
    return img


def sample_stops(segments, t):
    t = max(0.0, min(1.0, t))
    for i in range(len(segments) - 1):
        p0, c0 = segments[i]
        p1, c1 = segments[i + 1]
        if p0 <= t <= p1:
            local = 0.0 if p1 == p0 else (t - p0) / (p1 - p0)
            return lerp(c0, c1, local)
    return segments[-1][1]


def glow(layer, center, radius, color, alpha=46):
    """Soft radial glow, like .site-body:before/:after blurred orbs."""
    x, y = center
    g = Image.new("RGBA", (radius * 2, radius * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    steps = 26
    for i in range(steps, 0, -1):
        r = radius * i / steps
        a = int(alpha * (1 - i / steps) ** 1.6)
        d.ellipse([radius - r, radius - r, radius + r, radius + r], fill=color + (a,))
    g = g.filter(ImageFilter.GaussianBlur(radius * 0.18))
    layer.alpha_composite(g, (x - radius, y - radius))


def gradient_text(img, text, xy, fnt, stops, angle=135.0, anchor="la"):
    """Render text filled with the brand gradient (like the logo's gradient border)."""
    tmp = Image.new("L", img.size, 0)
    ImageDraw.Draw(tmp).text(xy, text, font=fnt, fill=255, anchor=anchor)
    bbox = tmp.getbbox()
    if not bbox:
        return
    pad = 4
    box = (bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad)
    grad = gradient((box[2] - box[0], box[3] - box[1]), stops, angle)
    img.paste(grad, (box[0], box[1]), tmp.crop(box))


def pill(img, center_xy, text, fnt, fg, bg, pad_x=22, pad_y=11, border=None, dot=None):
    d = ImageDraw.Draw(img)
    tw = d.textlength(text, font=fnt)
    x, y = center_xy
    w = tw + pad_x * 2 + (18 if dot else 0)
    h = pad_y * 2 + 26
    box = [x - w / 2, y - h / 2, x + w / 2, y + h / 2]
    d.rounded_rectangle(box, radius=h / 2, fill=bg, outline=border or bg, width=2)
    tx = x - w / 2 + pad_x
    if dot:
        cy = y
        d.ellipse([tx, cy - 5, tx + 10, cy + 10], fill=dot)
        tx += 18
    d.text((tx, y), text, font=fnt, fill=fg, anchor="lm")
    return w


def new_page(w, h):
    img = Image.new("RGBA", (w, h), SURFACE + (255,))
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    # ambient glows echoing .site-body before/after orbs
    glow(layer, (int(w * 0.93), int(-h * 0.25)), 380, BLUE, 52)
    glow(layer, (int(w * 0.05), int(h * 1.25)), 420, ORANGE, 46)
    return img, layer


def hairline(img):
    """Top 3px gradient border, like .hero-logo-wrap's gradient edge."""
    w = img.width
    bar = gradient((w, 3), [(0.0, BLUE), (0.56, ORANGE), (1.0, BLUE)], 0)
    img.paste(bar, (0, 0))


# ---------------------------------------------------------------------------
def build_hero(path="hero-banner.png", w=1280, h=430):
    img, layer = new_page(w, h)
    img.alpha_composite(layer)
    hairline(img)
    d = ImageDraw.Draw(img)

    eyebrow = font(BODY_FONT, 21, "SemiBold")
    wordmark = font(HEAD_FONT, 88, "Bold")
    tagline = font(BODY_FONT, 25, "Medium")
    chip = font(BODY_FONT, 18, "SemiBold")

    d.text((w / 2, 74), "VERIFIED BM  •  WHATSAPP API  •  PREMIUM ACCOUNTS",
           font=eyebrow, fill=MUTED, anchor="ma")

    gradient_text(img, "VERIFIED BM SHOP", (w / 2, 132), wordmark,
                  [(0.0, BLUE_DEEP), (0.56, ORANGE), (1.0, BLUE)], 135, anchor="ma")

    d.text((w / 2, 256), "Verified Business Managers · WhatsApp Business API · Premium Ad Accounts",
           font=tagline, fill=MUTED, anchor="ma")

    chips = [("24/7 Support", BLUE_DEEP), ("1–4h Delivery", ORANGE_DEEP),
             ("3-Day Replacement", WHATSAPP), ("Global Clients", TELEGRAM)]
    gap = 16
    widths = [d.textlength(t, font=chip) + 44 for t, _ in chips]
    total = sum(widths) + gap * (len(chips) - 1)
    x = (w - total) / 2
    for (text, dotcol), cw in zip(chips, widths):
        pill(img, (x + cw / 2, 336), text, chip, INK, WHITE, dot=dotcol)
        x += cw + gap

    img.convert("RGB").save(os.path.join(OUT, path), optimize=True)
    print("wrote", path)


def build_divider(path="divider.png", w=1280, h=16):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bar = gradient((w - 8, h - 8), [(0.0, BLUE), (0.5, ORANGE), (1.0, BLUE)], 0)
    mask = Image.new("L", bar.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, bar.width - 1, bar.height - 1],
                                           radius=bar.height // 2, fill=255)
    img.paste(bar, (4, 4), mask)
    img.save(os.path.join(OUT, path), optimize=True)
    print("wrote", path)


def build_footer_cta(path="footer-cta.png", w=1280, h=300):
    img = Image.new("RGBA", (w, h), FOOTER + (255,))
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow(layer, (int(w * 0.88), int(h * 0.05)), 320, BLUE, 120)
    glow(layer, (int(w * 0.10), int(h * 1.15)), 340, ORANGE, 95)
    img.alpha_composite(layer)
    hairline(img)
    d = ImageDraw.Draw(img)

    eyebrow = font(BODY_FONT, 20, "SemiBold")
    head = font(HEAD_FONT, 46, "Bold")
    sub = font(BODY_FONT, 22, "Regular")
    chip = font(BODY_FONT, 19, "SemiBold")

    d.text((w / 2, 58), "FIND YOUR SETUP", font=eyebrow, fill=(150, 178, 255), anchor="ma")
    d.text((w / 2, 100), "Ready to Find the Right Business Manager?", font=head,
           fill=WHITE, anchor="ma")
    d.text((w / 2, 168), "Compare options, review the details, and choose the setup that fits your workflow.",
           font=sub, fill=(178, 191, 216), anchor="ma")

    labels = [("verifiedbm.shop", WHITE, (36, 127, 255)), ("WhatsApp", WHITE, WHATSAPP),
              ("Telegram", WHITE, TELEGRAM)]
    gap = 14
    widths = [d.textlength(t, font=chip) + 44 for t, _, _ in labels]
    total = sum(widths) + gap * (len(labels) - 1)
    x = (w - total) / 2
    for (text, fg, bg), cw in zip(labels, widths):
        pill(img, (x + cw / 2, 236), text, chip, fg, bg)
        x += cw + gap

    img.convert("RGB").save(os.path.join(OUT, path), optimize=True)
    print("wrote", path)


def build_social(path="social-preview.png", w=1280, h=640):
    img, layer = new_page(w, h)
    img.alpha_composite(layer)
    hairline(img)
    d = ImageDraw.Draw(img)

    eyebrow = font(BODY_FONT, 26, "SemiBold")
    wordmark = font(HEAD_FONT, 92, "Bold")
    sub = font(BODY_FONT, 30, "Medium")
    chip = font(BODY_FONT, 21, "SemiBold")

    d.text((w / 2, 182), "VERIFIED BM  •  WHATSAPP API  •  PREMIUM ACCOUNTS",
           font=eyebrow, fill=MUTED, anchor="ma")
    gradient_text(img, "VERIFIED BM SHOP", (w / 2, 248), wordmark,
                  [(0.0, BLUE_DEEP), (0.56, ORANGE), (1.0, BLUE)], 135, anchor="ma")
    d.text((w / 2, 400), "Verified Business Managers · WhatsApp Business API", font=sub,
           fill=MUTED, anchor="ma")

    chips = [("24/7 Support", BLUE_DEEP), ("1–4h Delivery", ORANGE_DEEP),
             ("3-Day Replacement", WHATSAPP)]
    gap = 16
    widths = [d.textlength(t, font=chip) + 44 for t, _ in chips]
    total = sum(widths) + gap * (len(chips) - 1)
    x = (w - total) / 2
    for (text, dotcol), cw in zip(chips, widths):
        pill(img, (x + cw / 2, 486), text, chip, INK, WHITE, dot=dotcol)
        x += cw + gap

    img.convert("RGB").save(os.path.join(OUT, path), optimize=True)
    print("wrote", path)


if __name__ == "__main__":
    build_hero()
    build_divider()
    build_footer_cta()
    build_social()
