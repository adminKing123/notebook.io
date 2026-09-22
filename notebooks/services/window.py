def calculate_page_window(*, center_page: int, total_pages: int, window_size: int) -> tuple[int, int]:
    if total_pages <= 0:
        return 0, 0

    clamped_center = min(max(center_page, 1), total_pages)
    half_window = window_size // 2
    start_page = max(1, clamped_center - half_window)
    end_page = min(total_pages, start_page + window_size - 1)
    start_page = max(1, end_page - window_size + 1)
    return start_page, end_page
