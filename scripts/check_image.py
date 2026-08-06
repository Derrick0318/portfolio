from app import app
c=app.test_client()
resp=c.get('/')
print('home', resp.status_code)
text=resp.get_data(as_text=True)
print('park in html:', 'park_selayang' in text)
import re
m=re.search(r'src=["\']([^"']*park_selayang[^"']*)', text)
if m:
    url=m.group(1)
    print('img url', url)
    r=c.get(url)
    print('img get', r.status_code, getattr(r, 'content_type', None), len(r.get_data()) if r.status_code==200 else r.get_data()[:100])
else:
    print('no img tag found')
