from __future__ import annotations

import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "media" / "mobile-mockup-sources"
WORK = ROOT / "media" / "mobile-mockup-build"
OUT = ROOT / "media" / "kamran-mobile-mockup-demo.mp4"

WIDTH, HEIGHT, FPS = 1280, 720, 30
SCENES = [
    ("00-onboarding.webp", "WELCOME", "A bilingual starting point", "Uyghur ↔ Chinese translation, one tap away"),
    ("01-home.webp", "HOME", "Your translation workspace", "Shortcuts for text, voice, camera, and offline use"),
    ("02-translate.webp", "TEXT TRANSLATION", "Type it. Translate it. Keep the context.", "AI result, pronunciation, copy, favorite, and share"),
    ("03-voice.webp", "VOICE TRANSLATION", "Speak naturally", "Voice input designed for hands-free conversations"),
    ("04-ocr.webp", "OCR CAMERA", "Read the world around you", "Scan printed Uyghur text with a focused camera workflow"),
    ("05-history.webp", "LOCAL PHRASEBOOK", "Keep useful translations close", "Search recent translations and revisit saved phrases"),
    ("06-learn.webp", "LEARN", "Turn translation into progress", "Bilingual vocabulary practice with visible daily progress"),
    ("07-settings.webp", "PERSONALIZE", "Made for the way you work", "RTL layout, speech speed, accessibility, and offline preferences"),
]


def font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def gradient_bg():
    image = Image.new("RGB", (WIDTH, HEIGHT))
    pixels = image.load()
    for y in range(HEIGHT):
        t = y / (HEIGHT - 1)
        r = int(8 + 12 * t)
        g = int(22 + 24 * t)
        b = int(48 + 42 * t)
        for x in range(WIDTH):
            glow = max(0, 1 - (((x - 920) / 700) ** 2 + ((y - 190) / 520) ** 2))
            pixels[x, y] = (min(30, int(r + 8 * glow)), min(58, int(g + 14 * glow)), min(100, int(b + 28 * glow)))
    return image


def fit_phone(source: Image.Image, scale: float) -> Image.Image:
    # The clean browser capture contains the phone at this stable rectangle.
    phone = source.crop((304, 84, 589, 685)).convert("RGBA")
    target_h = int(675 * scale)
    target_w = int(phone.width * target_h / phone.height)
    return phone.resize((target_w, target_h), Image.Resampling.LANCZOS)


def make_frame(source_path: Path, label: str, title: str, subtitle: str, scale: float, frame_index: int) -> Image.Image:
    canvas = gradient_bg().convert("RGBA")
    draw = ImageDraw.Draw(canvas)
    # Brand lockup and scene label.
    draw.text((72, 58), "KAMRAN", font=font(34, True), fill=(244, 248, 255, 255))
    draw.text((74, 104), "Uyghur–Chinese translation", font=font(17), fill=(157, 183, 218, 255))
    draw.rounded_rectangle((72, 162, 300, 202), radius=20, fill=(37, 99, 235, 230))
    draw.text((93, 173), label, font=font(16, True), fill=(255, 255, 255, 255))
    draw.text((72, 548), title, font=font(28, True), fill=(245, 248, 255, 255))
    draw.text((72, 592), subtitle, font=font(16), fill=(176, 196, 224, 255))
    draw.text((72, 664), "Authentic mobile mockup preview", font=font(13), fill=(110, 143, 188, 255))

    with Image.open(source_path) as source_image:
        phone = fit_phone(source_image, scale)
    x = (WIDTH - phone.width) // 2 + 130
    y = (HEIGHT - phone.height) // 2
    # Soft shadow behind the phone.
    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_box = Image.new("RGBA", phone.size, (0, 0, 0, 100))
    shadow_box = shadow_box.filter(ImageFilter.GaussianBlur(24))
    shadow.alpha_composite(shadow_box, (x + 12, y + 18))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(phone, (x, y))

    # A small progress marker makes the screenshot sequence feel intentional.
    draw = ImageDraw.Draw(canvas)
    n = SCENES.index(next(s for s in SCENES if s[0] == source_path.name)) + 1
    draw.text((1130, 650), f"0{n} / 07", font=font(14, True), fill=(142, 174, 216, 255))
    return canvas.convert("RGB")


def run(cmd: list[str]):
    subprocess.run(cmd, cwd=ROOT, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    scene_files = []
    for idx, (name, label, title, subtitle) in enumerate(SCENES, start=1):
        source = SRC / name
        still = WORK / f"scene-{idx:02d}.png"
        make_frame(source, label, title, subtitle, 1.0, 0).save(still, optimize=True)
        segment = WORK / f"scene-{idx:02d}.mp4"
        run([
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-loop", "1", "-i", str(still), "-t", "5.5",
            "-vf", f"scale={WIDTH}:{HEIGHT},format=yuv420p",
            "-r", str(FPS), "-c:v", "libx264", "-movflags", "+faststart", str(segment),
        ])
        scene_files.append(segment)

    concat = WORK / "concat.txt"
    concat.write_text("\n".join(f"file '{p.as_posix()}'" for p in scene_files) + "\n", encoding="utf-8")
    run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(concat),
        "-c", "copy", "-movflags", "+faststart", str(OUT),
    ])
    print(OUT)


if __name__ == "__main__":
    main()
