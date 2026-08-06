import os
files=[]
for root,dirs,filenames in os.walk('.'):
    for f in filenames:
        path=os.path.join(root,f)
        try:
            sz=os.path.getsize(path)
        except OSError:
            continue
        files.append((sz,path))
files.sort(reverse=True)
print('Top 40 largest files:')
for sz,path in files[:40]:
    print(f"{path} {sz/1024/1024:.2f} MB")
