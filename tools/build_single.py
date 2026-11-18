# 1ファイル版（dist/sansu6.html）をつくる。フォント・画像・効果音・JS を ぜんぶ うめこむ
# 使い方: python3 tools/build_single.py .
import base64,os,re,sys
root=sys.argv[1] if len(sys.argv)>1 else '.'
b64=lambda p,m:'data:%s;base64,%s'%(m,base64.b64encode(open(p,'rb').read()).decode())
html=open(f'{root}/index.html',encoding='utf-8').read()
css=open(f'{root}/style.css',encoding='utf-8').read()
for w in ['700','900']:css=css.replace(f'url("fonts/zmg-{w}.woff2")','url("%s")'%b64(f'{root}/fonts/zmg-{w}.woff2','font/woff2'))
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+css+'\n</style>')
html=html.replace('src="images/usatoro.webp"','src="%s"'%b64(f'{root}/images/usatoro.webp','image/webp'))
html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>\n'+open(f'{root}/{m.group(1)}',encoding='utf-8').read().replace('</script','<\\/script')+'\n</script>',html)
os.makedirs(f'{root}/dist',exist_ok=True)
open(f'{root}/dist/sansu6.html','w',encoding='utf-8').write(html)
print('%.2f MB'%(os.path.getsize(f'{root}/dist/sansu6.html')/1e6))
