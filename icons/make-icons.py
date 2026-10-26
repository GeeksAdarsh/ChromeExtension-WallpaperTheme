import struct
import zlib
from pathlib import Path

INK = (18, 20, 28)
CREAM = (243, 230, 196)
SOFT = (246, 243, 236)


def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def write_png(path, size, pixels):
    raw = b"".join(b"\x00" + pixels[y * size * 3:(y + 1) * size * 3] for y in range(size))
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    path.write_bytes(png)


def paint(size):
    buf = bytearray(INK * size * size)
    cx = cy = (size - 1) / 2

    def dot(x, y, radius, color):
        r2 = radius * radius
        for py in range(size):
            for px in range(size):
                if (px - x) ** 2 + (py - y) ** 2 <= r2:
                    i = (py * size + px) * 3
                    buf[i:i + 3] = bytes(color)

    def spark(x, y, arm, color):
        thickness = max(size * 0.035, 0.8)
        for py in range(size):
            for px in range(size):
                on_h = abs(py - y) <= thickness and abs(px - x) <= arm
                on_v = abs(px - x) <= thickness and abs(py - y) <= arm
                if on_h or on_v:
                    i = (py * size + px) * 3
                    buf[i:i + 3] = bytes(color)

    spark(cx, cy, size * 0.16, CREAM)
    dot(cx, cy, max(size * 0.045, 0.8), SOFT)
    for ox, oy, radius in (
        (-0.28, -0.22, 0.035),
        (0.30, -0.16, 0.028),
        (-0.18, 0.28, 0.03),
        (0.22, 0.26, 0.04),
        (0.02, -0.34, 0.022),
    ):
        dot(cx + ox * size, cy + oy * size, max(radius * size, 0.7), SOFT)
    return buf


root = Path(__file__).resolve().parent
for size in (16, 32, 48, 128):
    write_png(root / f"icon{size}.png", size, paint(size))
