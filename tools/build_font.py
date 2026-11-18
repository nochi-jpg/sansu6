# 使う文字だけ Zen Maru Gothic（@fontsource/zen-maru-gothic、OFL）から切り出す
# 使い方: python3 tools/build_font.py <fontsourceのfilesフォルダ> <リポジトリ>
import sys,glob,string
from fontTools import subset
src_dir,root=sys.argv[1],sys.argv[2]
text=set(string.printable)|set('　・〜？！、。「」（）＝─×÷／□°')
files=glob.glob(f'{root}/*.html')+glob.glob(f'{root}/sample/*.html')+glob.glob(f'{root}/js/*.js')+glob.glob(f'{root}/units/*.js')
for f in files: text|=set(open(f,encoding='utf-8').read())
text=''.join(sorted(c for c in text if ord(c)>=32))
for w in ['700','900']:
  o=subset.Options();o.flavor='woff2';o.layout_features=['*'];o.name_IDs=['*']
  f=subset.load_font(f'{src_dir}/zen-maru-gothic-japanese-{w}-normal.woff2',o)
  s=subset.Subsetter(o);s.populate(text=text);s.subset(f)
  subset.save_font(f,f'{root}/fonts/zmg-{w}.woff2',o)
print(len(text),'chars')
