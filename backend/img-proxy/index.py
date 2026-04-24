import urllib.request
import base64
import os

ALLOWED_HOSTS = ["upload.wikimedia.org", "cdn.poehali.dev"]

def handler(event: dict, context) -> dict:
    """Прокси для загрузки изображений с поддержкой CORS"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    params = event.get("queryStringParameters") or {}
    url = params.get("url", "")

    if not url:
        return {"statusCode": 400, "headers": cors, "body": "missing url"}

    from urllib.parse import urlparse
    host = urlparse(url).hostname or ""
    if not any(host == h or host.endswith("." + h) for h in ALLOWED_HOSTS):
        return {"statusCode": 403, "headers": cors, "body": "forbidden host"}

    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = resp.read()
        content_type = resp.headers.get("Content-Type", "image/jpeg")

    encoded = base64.b64encode(data).decode()
    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": content_type, "Cache-Control": "public, max-age=86400"},
        "body": encoded,
        "isBase64Encoded": True,
    }
