from notebooks.models import Image, default_page_config


def sanitize_page_config(config, *, owner) -> dict:
    if not isinstance(config, dict):
        return default_page_config()

    embedded_images = config.get('embedded_images', [])
    if not isinstance(embedded_images, list):
        return default_page_config()

    image_ids = {
        str(item.get('image_id'))
        for item in embedded_images
        if isinstance(item, dict) and item.get('image_id')
    }
    owned_images = set(
        Image.objects.filter(id__in=image_ids, owner=owner).values_list('id', flat=True),
    )
    owned_image_ids = {str(image_id) for image_id in owned_images}

    sanitized_embedded = []
    for item in embedded_images:
        if not isinstance(item, dict):
            continue

        image_id = str(item.get('image_id', ''))
        if not image_id or image_id not in owned_image_ids:
            continue

        sanitized_embedded.append({
            'image_id': image_id,
            'x': float(item.get('x', 0)),
            'y': float(item.get('y', 0)),
            'width': float(item.get('width', 30)),
            'aspect_ratio': float(item.get('aspect_ratio', 1)),
        })

    return {'embedded_images': sanitized_embedded}


def resolve_page_config(page) -> dict:
    config = page.config if isinstance(page.config, dict) else default_page_config()
    embedded_images = config.get('embedded_images', [])
    if not isinstance(embedded_images, list):
        return default_page_config()

    image_ids = [
        item.get('image_id')
        for item in embedded_images
        if isinstance(item, dict) and item.get('image_id')
    ]
    images_by_id = {
        str(image.id): image
        for image in Image.objects.filter(
            id__in=image_ids,
            owner=page.notebook.owner,
        )
    }

    resolved_embedded = []
    for item in embedded_images:
        if not isinstance(item, dict):
            continue

        image = images_by_id.get(str(item.get('image_id')))
        if image is None:
            continue

        resolved_embedded.append({
            'image_id': str(image.id),
            'url': image.url,
            'file_name': image.file_name,
            'x': float(item.get('x', 0)),
            'y': float(item.get('y', 0)),
            'width': float(item.get('width', 30)),
            'aspect_ratio': float(item.get('aspect_ratio', 1)),
        })

    return {'embedded_images': resolved_embedded}
