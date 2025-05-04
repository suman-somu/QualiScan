def strip_json_markers(text: str) -> str:
    """
    Strips leading and trailing code block markers (e.g., ```json ... ```) from a string.
    """
    if text.startswith("```json"):
        text = text[len("```json"):].lstrip("\n")
    if text.endswith("```"):
        text = text[: -len("```")].rstrip("\n")
    return text

def parse_json_content(text: str):
    """
    Strips code block markers and parses the JSON content.
    """
    import json
    clean_text = strip_json_markers(text)
    return json.loads(clean_text)
