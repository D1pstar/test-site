from slowapi import Limiter
from slowapi.util import get_remote_address

# Keyed by client IP. Behind a reverse proxy, run uvicorn with
# --proxy-headers --forwarded-allow-ips=<proxy ip> so this sees the real client.
limiter = Limiter(key_func=get_remote_address)
