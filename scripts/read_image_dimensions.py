from pathlib import Path
from PIL import Image

paths = [
    Path('/home/ubuntu/screenshots/8081-ijm4wvk6fk06mft_2026-08-27_17-22-36_2166.webp'),
    Path('/home/ubuntu/screenshots/8081-ijm4wvk6fk06mft_2026-08-27_17-22-46_6667.webp'),
    Path('/home/ubuntu/screenshots/8081-ijm4wvk6fk06mft_2026-08-27_17-23-25_3793.webp'),
    Path('/home/ubuntu/screenshots/8081-ijm4wvk6fk06mft_2026-08-27_17-23-36_8753.webp'),
]
for path in paths:
    with Image.open(path) as image:
        print(f'{path.name}: {image.width}x{image.height}')
