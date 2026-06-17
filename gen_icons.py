#!/usr/bin/env python3
"""Generate PRKH app icons (192x192 and 512x512) as PNG files."""
import struct, zlib, math, os

def write_png(path, width, height, pixels):
    """pixels: list of rows, each row a list of (R,G,B) tuples."""
    def chunk(name, data):
        crc = zlib.crc32(name + data) & 0xffffffff
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', crc)

    raw = b''
    for row in pixels:
        raw += b'\x00'  # filter none
        for r, g, b in row:
            raw += bytes([r, g, b])

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    idat = zlib.compress(raw, 9)

    data = (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', ihdr)
            + chunk(b'IDAT', idat)
            + chunk(b'IEND', b''))
    with open(path, 'wb') as f:
        f.write(data)
    print(f'Written {path} ({len(data)} bytes)')


def lerp(a, b, t):
    return a + (b - a) * t


def make_icon(size):
    """Draw a PRKH icon: dark bg, orange gradient circle, white bold P text."""
    cx, cy = size / 2, size / 2
    r_outer = size * 0.44
    r_inner = size * 0.36

    # Colors
    BG     = (13,  13,  15)    # --bg
    ORANGE = (255, 107, 53)    # --orange
    ORANGE2= (255, 160, 90)    # lighter
    WHITE  = (255, 255, 255)

    pixels = []
    for y in range(size):
        row = []
        for x in range(size):
            fx, fy = x + 0.5, y + 0.5
            dx, dy = fx - cx, fy - cy
            dist = math.sqrt(dx * dx + dy * dy)

            # Rounded square background (slightly rounded corners)
            corner_r = size * 0.22
            in_bg = True

            # Draw rounded rect check
            rx = abs(dx) - (size / 2 - corner_r)
            ry = abs(dy) - (size / 2 - corner_r)
            if rx > 0 and ry > 0:
                if math.sqrt(rx*rx + ry*ry) > corner_r:
                    in_bg = False

            if not in_bg:
                row.append(BG)
                continue

            # Circle glow / ring
            aa = 1.5  # anti-alias width
            if dist <= r_outer + aa:
                # Inside outer: gradient fill
                t = max(0, min(1, (dist / r_outer)))
                # orange gradient from center outward
                gr = int(lerp(ORANGE2[0], ORANGE[0], t))
                gg = int(lerp(ORANGE2[1], ORANGE[1], t))
                gb = int(lerp(ORANGE2[2], ORANGE[2], t))

                if dist > r_outer - aa:
                    # outer edge fade
                    alpha = (r_outer + aa - dist) / (2 * aa)
                    gr = int(lerp(BG[0], gr, alpha))
                    gg = int(lerp(BG[1], gg, alpha))
                    gb = int(lerp(BG[2], gb, alpha))

                row.append((gr, gg, gb))
            else:
                row.append(BG)

        pixels.append(row)

    # Draw "PRKH" text using a simple pixel font
    # We'll use a minimal 5x7 bitmap font for each letter
    # Scale factor
    scale = max(1, size // 64)

    def draw_rect(px, py, pw, ph, color):
        for dy in range(ph):
            for dx in range(pw):
                nx, ny = px + dx, py + dy
                if 0 <= nx < size and 0 <= ny < size:
                    pixels[ny][nx] = color

    def blend(base, col, alpha):
        return (
            int(base[0] * (1-alpha) + col[0] * alpha),
            int(base[1] * (1-alpha) + col[1] * alpha),
            int(base[2] * (1-alpha) + col[2] * alpha),
        )

    # Simple pixel letters (5 wide x 7 tall bitmaps)
    GLYPHS = {
        'P': [
            "11110",
            "10001",
            "10001",
            "11110",
            "10000",
            "10000",
            "10000",
        ],
        'R': [
            "11110",
            "10001",
            "10001",
            "11110",
            "10100",
            "10010",
            "10001",
        ],
        'K': [
            "10001",
            "10010",
            "10100",
            "11000",
            "10100",
            "10010",
            "10001",
        ],
        'H': [
            "10001",
            "10001",
            "10001",
            "11111",
            "10001",
            "10001",
            "10001",
        ],
    }

    text = 'PRKH'
    glyph_w = 5
    glyph_h = 7
    gap = scale  # gap between letters

    total_w = (glyph_w * scale + gap) * len(text) - gap
    total_h = glyph_h * scale

    start_x = (size - total_w) // 2
    start_y = (size - total_h) // 2

    for i, ch in enumerate(text):
        glyph = GLYPHS[ch]
        ox = start_x + i * (glyph_w * scale + gap)
        oy = start_y
        for gy, row_str in enumerate(glyph):
            for gx, bit in enumerate(row_str):
                if bit == '1':
                    draw_rect(ox + gx * scale, oy + gy * scale, scale, scale, WHITE)

    return pixels


# Output directory
out_dir = os.path.dirname(os.path.abspath(__file__))

for sz in [192, 512]:
    pix = make_icon(sz)
    write_png(os.path.join(out_dir, f'icon-{sz}.png'), sz, sz, pix)

print('Icons generated!')
