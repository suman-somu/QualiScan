def strip_json_markers(text: str) -> str:
    """
    Strips leading and trailing code block markers (e.g., ```json ... ```) from a string.
    """
    if text.startswith("```json"):
        text = text[len("```json"):].lstrip("\n")
    if text.endswith("```"):
        text = text[: -len("```")].rstrip("\n")
    return text

def parse_json_content(text):
    """
    Strips code block markers and parses the JSON content.
    If text is already a dict or list (JSON object), returns it as is.
    """
    import json
    import logging

    logger = logging.getLogger(__name__)

    if text is None or not isinstance(text, str):
        return text

    sanitized_text = strip_json_markers(text)
    try:
        return json.loads(sanitized_text)
    except json.JSONDecodeError as e:
        logger.error(f"Error parsing JSON: {e}")
        return []
