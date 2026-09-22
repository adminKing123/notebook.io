import io
from dataclasses import dataclass

from PIL import Image, UnidentifiedImageError

from config.config import CDNSettings


@dataclass(frozen=True)
class NormalizedImage:
    data: bytes
    content_type: str
    extension: str
    width: int
    height: int


FORMAT_CONFIG = {
    'WEBP': {
        'content_type': 'image/webp',
        'extension': 'webp',
        'save_kwargs': {'quality': 85, 'method': 6},
    },
    'JPEG': {
        'content_type': 'image/jpeg',
        'extension': 'jpg',
        'save_kwargs': {'quality': 85, 'optimize': True},
    },
    'PNG': {
        'content_type': 'image/png',
        'extension': 'png',
        'save_kwargs': {'optimize': True},
    },
}


class ImageConversionError(Exception):
    pass


def normalize_image(content: bytes, settings: CDNSettings) -> NormalizedImage:
    image_format = settings.image_format
    format_config = FORMAT_CONFIG.get(image_format)

    if format_config is None:
        raise ImageConversionError(f'Unsupported image format: {image_format}')

    try:
        with Image.open(io.BytesIO(content)) as image:
            image = _prepare_image(image, image_format)
            image = _resize_image(image, settings.image_max_width)
            output = io.BytesIO()
            save_kwargs = {
                **format_config['save_kwargs'],
                'format': image_format,
            }

            if image_format == 'WEBP':
                save_kwargs['quality'] = settings.image_quality
            elif image_format == 'JPEG':
                save_kwargs['quality'] = settings.image_quality

            image.save(output, **save_kwargs)

            return NormalizedImage(
                data=output.getvalue(),
                content_type=format_config['content_type'],
                extension=format_config['extension'],
                width=image.width,
                height=image.height,
            )
    except UnidentifiedImageError as error:
        raise ImageConversionError('Unsupported or invalid image file.') from error


def _prepare_image(image: Image.Image, image_format: str) -> Image.Image:
    if image_format in {'JPEG', 'WEBP'} and image.mode not in {'RGB', 'L'}:
        background = Image.new('RGB', image.size, (255, 255, 255))
        rgba = image.convert('RGBA')
        background.paste(rgba, mask=rgba.split()[-1])
        return background

    if image_format == 'JPEG' and image.mode != 'RGB':
        return image.convert('RGB')

    return image


def _resize_image(image: Image.Image, max_width: int) -> Image.Image:
    if image.width <= max_width:
        return image

    ratio = max_width / float(image.width)
    resized_height = max(1, round(image.height * ratio))
    return image.resize((max_width, resized_height), Image.Resampling.LANCZOS)
