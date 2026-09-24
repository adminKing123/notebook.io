from notebooks.constants import MAX_CONTENT_LINES, MAX_LINE_LENGTH


def sanitize_page_content(value) -> str:
    if isinstance(value, list):
        lines = value
    elif isinstance(value, str):
        lines = value.replace('\r\n', '\n').replace('\r', '\n').split('\n')
    else:
        lines = []

    sanitized = [str(line or '')[:MAX_LINE_LENGTH] for line in lines[:MAX_CONTENT_LINES]]
    return '\n'.join(sanitized)
