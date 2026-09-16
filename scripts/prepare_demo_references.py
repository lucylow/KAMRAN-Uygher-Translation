from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

source_dir = Path('/home/ubuntu/screenshots')
out_dir = Path('/home/ubuntu/kamran/media/references')
out_dir.mkdir(parents=True, exist_ok=True)

sources = {
    'onboarding': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-22-36_2166.webp',
    'home': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-22-46_6667.webp',
    'settings': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-23-25_3793.webp',
    'translate': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-23-36_8753.webp',
    'ocr': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-26-53_2118.webp',
    'history': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-27-24_3105.webp',
    'learn': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-27-47_2054.webp',
    'lesson': source_dir / '8081-ijm4wvk6fk06mft_2026-08-27_17-27-56_4424.webp',
}

W, H = 1280, 720
for name, source in sources.items():
    with Image.open(source).convert('RGB') as image:
        # Keep the complete capture visible and use a neutral cobalt/slate presentation field.
        fitted = ImageOps.contain(image, (520, 660))
        canvas = Image.new('RGB', (W, H), '#F4F7FB')
        x = (W - fitted.width) // 2
        y = (H - fitted.height) // 2
        canvas.paste(fitted, (x, y))
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle((x - 8, y - 8, x + fitted.width + 8, y + fitted.height + 8), radius=28, outline='#D7E0ED', width=4)
        canvas.save(out_dir / f'{name}-16x9.png')
        print(out_dir / f'{name}-16x9.png')
