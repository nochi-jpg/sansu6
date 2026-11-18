# UIサンプルを1ファイル化（フォント・画像をうめこむ）→ dist/ui-sample.html
import base64,os,sys
root=sys.argv[1] if len(sys.argv)>1 else '.'
b64=lambda p,m:'data:%s;base64,%s'%(m,base64.b64encode(open(p,'rb').read()).decode())
h=open(f'{root}/sample/ui-sample.html',encoding='utf-8').read()
for w in ['700','900']: h=h.replace(f'../fonts/zmg-{w}.woff2',b64(f'{root}/fonts/zmg-{w}.woff2','font/woff2'))
h=h.replace('../images/usatoro.webp',b64(f'{root}/images/usatoro.webp','image/webp'))
os.makedirs(f'{root}/dist',exist_ok=True);open(f'{root}/dist/ui-sample.html','w',encoding='utf-8').write(h)
print('%.0f KB'%(os.path.getsize(f'{root}/dist/ui-sample.html')/1e3))
