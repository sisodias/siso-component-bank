#!/usr/bin/env python3
# Partition the 7,949 corpus into scout lanes and render contact sheets so an agent
# can scan ~30 previews per image instead of opening 800 files.
import json, os, sys
from collections import Counter, defaultdict
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__))
R=os.path.join(HERE,'..','..','21st'); H=os.path.join(R,'harvest')
cls=json.load(open(os.path.join(R,'classification.json')))
c2t=cls['componentToTags']
tags=lambda i: [t if isinstance(t,str) else t.get('tag') for t in (c2t.get(i) or [])]
LANDING={'hero','footer','pricing-section','testimonials','cta','marquee','clients','announcement','features','faq','team','comparison','globe','cursor','background','border','text','image','gallery','video','carousel','scroll-area','link','upload-download','map','hook'}
LANES=[  # priority order; first match wins
 ('charts',        {'data-visualization','stat','number','progress'}, r'chart|graph|sparkline|heatmap|heat-map|funnel|donut|gauge|metric|kpi|stats?-|earning|revenue|balance|streak'),
 ('dashboard',     {'dashboard','sidebar','table','grid'}, r'dashboard|sidebar|monitor|admin|panel|workspace|table|kanban|board'),
 ('cards',         {'card','profile'}, r'card|profile|tracker|reward|portfolio|invite|referral'),
 ('feedback',      {'notification','toast','alert','empty-state','spinner','tooltip'}, r'notif|toast|alert|loader|loading|spinner|skeleton|empty|status|update'),
 ('ai-chat',       {'ai-chat','search','textarea'}, r'\bai\b|chat|prompt|assistant|agent|orb|voice|thinking|stream|message|conversation|input'),
 ('calendar-flow', {'calendar','date-picker','onboarding','steps','timeline'}, r'calendar|date|booking|event|schedule|onboard|step|wizard|tour|timeline|stepper'),
 ('auth-forms',    {'sign-in','sign-up','form','modal','input','select','checkbox','radio-group','slider'}, r'sign|login|auth|register|dialog|modal|form|otp|password'),
 ('nav',           {'navigation-menu','menu','dropdown','popover','tabs','dock','pagination','accordion','file-tree'}, r'nav|menu|dropdown|popover|tabs?\b|breadcrumb|command|palette|spotlight|dock|tree'),
 ('atoms',         {'badge','avatar','toggle','icon','list','chip','button'}, r'badge|avatar|toggle|switch|icon|button|list|leaderboard|achievement|rank|point'),
]
rows=[];lane_of={}
for d in sorted(os.listdir(H)):
    p=os.path.join(H,d,'meta.json')
    if not os.path.exists(p) or not os.path.exists(os.path.join(H,d,'preview.webp')): continue
    m=json.load(open(p)); t=set(tags(d)); text=f"{d} {m.get('name','')} {m.get('description','')}".lower()
    import re
    lane=None
    for name,ts,rx in LANES:
        if t&ts or re.search(rx,text): lane=name;break
    if lane is None:
        lane='skip' if (t and t<=LANDING) else 'longtail'
    lane_of[d]=lane
    rows.append({'id':d,'lane':lane,'url':m.get('url'),'name':m.get('name'),'desc':(m.get('description') or '')[:160],'tags':sorted(t),'usage':m.get('usage_count') or 0,'author':m.get('author')})
cnt=Counter(r['lane'] for r in rows); print(dict(cnt), 'total',len(rows))
picked={json.loads(l)['harvest_id'] for l in open(os.path.join(HERE,'..','picks.jsonl'))}
FONT=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',13)
COLS,ROWS_,W,Hh=6,5,300,200
for lane in cnt:
    if lane=='skip': continue
    items=[r for r in rows if r['lane']==lane and r['id'] not in picked]
    items.sort(key=lambda r:-r['usage'])
    per=COLS*ROWS_; sheets=[]
    for s in range(0,len(items),per):
        chunk=items[s:s+per]; img=Image.new('RGB',(COLS*W,ROWS_*(Hh+18)),(20,20,22)); dr=ImageDraw.Draw(img)
        for k,r in enumerate(chunk):
            x=(k%COLS)*W; y=(k//COLS)*(Hh+18)
            try:
                im=Image.open(os.path.join(H,r['id'],'preview.webp')).convert('RGB'); im.thumbnail((W-6,Hh-4)); img.paste(im,(x+3+(W-6-im.width)//2,y+2))
            except Exception: pass
            r['sheet']=len(sheets)+1; r['cell']=k+1
            dr.text((x+4,y+Hh+1),f"{r['sheet']}.{k+1}  {r['id'][:38]}",fill=(230,230,235),font=FONT)
        name=f"{lane}-{len(sheets)+1:02d}.jpg"; img.save(os.path.join(HERE,'sheets',name),quality=80); sheets.append(name)
    with open(os.path.join(HERE,f'lane-{lane}.jsonl'),'w') as f:
        for r in items: f.write(json.dumps(r)+'\n')
    print(lane,len(items),'items',len(sheets),'sheets')
json.dump({r['id']:r['lane'] for r in rows},open(os.path.join(HERE,'lane-of.json'),'w'))
