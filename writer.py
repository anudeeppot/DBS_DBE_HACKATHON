import os, sys, base64
p, b = sys.argv[1], sys.argv[2]
os.makedirs(os.path.dirname(p), exist_ok=True)
open(p, 'wb').write(base64.b64decode(b))
print('Wrote:', p)
