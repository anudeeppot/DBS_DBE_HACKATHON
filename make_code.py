import os

def w(path, code):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as out:
        out.write(code.strip() + '\n')
    print('OK:', path)
