// Layout maths for the PM Artifacts Lab preview canvas (pure functions, no Angular).
export type Row=Record<string,string>;
const blank=(v:string|undefined)=>!v||!v.trim()||/^[—–-]+$/.test(v.trim());
const n=(v:string|undefined)=>{const x=Number(String(v??'').replace(/[$,\s]/g,''));return isFinite(x)?x:0;};

/* ---------- WBS tree ---------- */
export interface WbsNode{code:string;name:string;owner:string;effort:number;total:number;depth:number;x:number;y:number;leaf:boolean;virtual?:boolean}
export interface WbsLayout{nodes:WbsNode[];edges:{x1:number;y1:number;x2:number;y2:number;ym:number}[];width:number;height:number;warnings:string[];boxW:number;boxH:number}
export function wbsLayout(rows:Row[],projectName:string):WbsLayout{
  const boxW=190,boxH=78,gapX=22,gapY=60,pad=20;const warnings:string[]=[];
  const items=rows.map((r,i)=>({code:(r['code']||'').trim()||`#${i+1}`,name:(r['deliverable']||'').trim()||'Untitled',parent:(r['parent']||'').trim(),owner:(r['owner']||'').trim(),effort:n(r['effort'])}));
  const byCode=new Map<string,typeof items[number]>();
  for(const it of items){if(byCode.has(it.code))warnings.push(`WBS code ${it.code} is used more than once.`);else byCode.set(it.code,it);}
  const kids=new Map<string,string[]>();const roots:string[]=[];
  for(const it of byCode.values()){
    if(blank(it.parent)||!byCode.has(it.parent)||it.parent===it.code){
      if(!blank(it.parent)&&!byCode.has(it.parent))warnings.push(`Parent ${it.parent} of ${it.code} does not exist, so ${it.code} is shown at the top level.`);
      roots.push(it.code);
    }else{if(!kids.has(it.parent))kids.set(it.parent,[]);kids.get(it.parent)!.push(it.code);}
  }
  const ROOT='__root__';const virtual=roots.length!==1;
  if(virtual)kids.set(ROOT,roots);
  const nodes:WbsNode[]=[];const edges:WbsLayout['edges']=[];let nextX=0;const seen=new Set<string>();
  const place=(code:string,depth:number):WbsNode=>{
    seen.add(code);
    const it=code===ROOT?{code:'',name:projectName||'Project',owner:'',effort:0}:byCode.get(code)!;
    const children=(kids.get(code)??[]).filter(c=>!seen.has(c)).map(c=>place(c,depth+1));
    const leaf=!children.length;
    const x=leaf?pad+(nextX++)*(boxW+gapX):(children[0].x+children[children.length-1].x)/2;
    const total=leaf?it.effort:children.reduce((s,c)=>s+c.total,0);
    if(!leaf&&code!==ROOT&&it.effort&&Math.abs(it.effort-total)>1e-9)warnings.push(`${it.code} has ${it.effort} hours entered, but its children add up to ${total} hours. Under the 100% rule, a parent equals the sum of its children.`);
    const node:WbsNode={code:it.code,name:it.name,owner:it.owner,effort:it.effort,total,depth,x,y:pad+depth*(boxH+gapY),leaf,virtual:code===ROOT};
    for(const c of children)edges.push({x1:x+boxW/2,y1:node.y+boxH,x2:c.x+boxW/2,y2:c.y,ym:node.y+boxH+gapY/2});
    nodes.push(node);return node;
  };
  if(virtual)place(ROOT,0);else if(roots.length)place(roots[0],0);
  // Codes never reached (e.g. parent loops) are listed as warnings.
  for(const c of byCode.keys())if(!seen.has(c))warnings.push(`${c} is part of a parent loop and is not shown.`);
  const maxDepth=Math.max(0,...nodes.map(x=>x.depth));
  return {nodes,edges,width:Math.max(pad*2+nextX*(boxW+gapX)-gapX,400),height:pad*2+(maxDepth+1)*(boxH+gapY)-gapY,warnings,boxW,boxH};
}

/* ---------- Gantt ---------- */
const day=86400000;
const parseDate=(s:string|undefined)=>{if(!s)return null;const d=Date.parse(s+'T00:00:00');return isNaN(d)?null:d;};
export interface GanttBar{name:string;owner:string;x:number;w:number;y:number;progress:number;start:string;end:string}
export interface GanttLayout{bars:GanttBar[];ticks:{x:number;label:string}[];today:number|null;width:number;height:number;labelW:number;rowH:number;deps:{x1:number;y1:number;x2:number;y2:number}[];skipped:number}
export function ganttLayout(rows:Row[],nameKey='task',startKey='start',endKey='end',progressKey='progress',depKey='dependsOn',ownerKey='owner'):GanttLayout{
  const labelW=230,rowH=34,chartW=760,top=34;
  const valid=rows.map(r=>({r,s:parseDate(r[startKey]),e:parseDate(r[endKey])??parseDate(r[startKey])})).filter(v=>v.s!==null) as {r:Row;s:number;e:number}[];
  const skipped=rows.length-valid.length;
  if(!valid.length)return {bars:[],ticks:[],today:null,width:labelW+chartW,height:80,labelW,rowH,deps:[],skipped};
  const min=Math.min(...valid.map(v=>v.s)),max=Math.max(...valid.map(v=>Math.max(v.e,v.s)))+day;
  const span=Math.max(max-min,day);const sx=(t:number)=>labelW+(t-min)/span*chartW;
  const bars=valid.map((v,i)=>({name:v.r[nameKey]||'Untitled task',owner:v.r[ownerKey]||'',x:sx(v.s),w:Math.max(4,sx(Math.max(v.e,v.s)+day)-sx(v.s)),y:top+i*rowH,progress:Math.min(100,Math.max(0,n(v.r[progressKey]))),start:v.r[startKey],end:v.r[endKey]||v.r[startKey]}));
  const days=span/day;const monthly=days>120;const step=days<=21?day:7*day;
  const ticks:{x:number;label:string}[]=[];
  if(monthly){
    const d=new Date(min);let t=new Date(d.getFullYear(),d.getMonth()+(d.getDate()===1?0:1),1);
    while(t.getTime()<=max){ticks.push({x:sx(t.getTime()),label:t.toLocaleDateString('en-CA',{month:'short',year:'2-digit'})});t=new Date(t.getFullYear(),t.getMonth()+1,1);}
  }else{for(let t=min;t<=max;t+=step)ticks.push({x:sx(t),label:new Date(t).toLocaleDateString('en-CA',{month:'short',day:'numeric'})});}
  const now=Date.now();const today=now>=min&&now<=max?sx(now):null;
  const byName=new Map(bars.map(b=>[b.name.trim().toLowerCase(),b]));
  const deps:GanttLayout['deps']=[];
  valid.forEach((v,i)=>{for(const dname of String(v.r[depKey]??'').split(/[,;]/)){const p=byName.get(dname.trim().toLowerCase());if(p&&p!==bars[i])deps.push({x1:p.x+p.w,y1:p.y+rowH/2-4,x2:bars[i].x,y2:bars[i].y+rowH/2-4});}});
  return {bars,ticks,today,width:labelW+chartW+20,height:top+bars.length*rowH+10,labelW,rowH,deps,skipped};
}

/* ---------- Milestones ---------- */
export interface MilestonePoint{name:string;x:number;date:string;status:string;color:string;above:boolean;owner:string}
export function statusColor(s:string){const v=(s||'').toLowerCase();
  if(/(done|complete|achieved|approved|closed|on track|green|accepted)/.test(v))return '#1f7a46';
  if(/(risk|attention|amber|delay|watch|monitor|pending|in progress|deferred)/.test(v))return '#c27c0e';
  if(/(late|missed|off track|red|blocked|critical|rejected|overdue)/.test(v))return '#b42318';
  return '#2563eb';}
export function milestoneLayout(rows:Row[]){
  const w=880,pad=60;
  const pts=rows.map(r=>({r,d:parseDate(r['f2'])??parseDate(r['f1'])})).filter(p=>p.d!==null) as {r:Row;d:number}[];
  pts.sort((a,b)=>a.d-b.d);
  if(!pts.length)return {points:[] as MilestonePoint[],width:w,skipped:rows.length};
  const min=pts[0].d,max=pts[pts.length-1].d,span=Math.max(max-min,day);
  const points=pts.map((p,i)=>({name:p.r['f0']||'Milestone',x:pts.length===1?w/2:pad+(p.d-min)/span*(w-2*pad),date:new Date(p.d).toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'}),status:p.r['f4']||'Planned',color:statusColor(p.r['f4']||''),above:i%2===0,owner:p.r['f3']||''}));
  return {points,width:w,skipped:rows.length-pts.length};
}

/* ---------- Stakeholder grid ---------- */
export function stakeholderGrid(rows:Row[]){
  const lvl=(v:string)=>{const s=(v||'').toLowerCase();return s.startsWith('h')?2:s.startsWith('m')?1:0;};
  const cells:string[][][]=[[[],[],[]],[[],[],[]],[[],[],[]]];// [influence][interest]
  for(const r of rows)cells[lvl(r['influence'])][lvl(r['interest'])].push(r['name']||'Unnamed');
  return cells;
}

/* ---------- Budget / EVM / benefits charts ---------- */
export function budgetBars(rows:Row[]){
  const items=rows.map(r=>({name:r['f0']||'Category',planned:n(r['f1']),actual:n(r['f2']),forecast:n(r['f3'])}));
  const max=Math.max(1,...items.flatMap(i=>[i.planned,i.actual,i.forecast]));
  const tot=items.reduce((s,i)=>({planned:s.planned+i.planned,actual:s.actual+i.actual,forecast:s.forecast+i.forecast}),{planned:0,actual:0,forecast:0});
  return {items,max,tot};
}
export function evmSeries(rows:Row[]){
  let pv=0,ev=0,ac=0;const pts=rows.map(r=>{pv+=n(r['pv']);ev+=n(r['ev']);ac+=n(r['ac']);return {label:r['period']||'',pv,ev,ac};});
  const max=Math.max(1,...pts.flatMap(p=>[p.pv,p.ev,p.ac]));
  const W=760,H=260,L=70,T=20;const x=(i:number)=>L+(pts.length<2?W/2:i/(pts.length-1)*W);const y=(v:number)=>T+H-(v/max)*H;
  const line=(k:'pv'|'ev'|'ac')=>pts.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(' ');
  const last=pts[pts.length-1]??{pv:0,ev:0,ac:0};
  return {pts:pts.map((p,i)=>({...p,x:x(i),ypv:y(p.pv),yev:y(p.ev),yac:y(p.ac)})),paths:{pv:line('pv'),ev:line('ev'),ac:line('ac')},max,W,H,L,T,
    cpi:last.ac?last.ev/last.ac:NaN,spi:last.pv?last.ev/last.pv:NaN,grid:[0,.25,.5,.75,1].map(f=>({y:y(max*f),v:max*f}))};
}
export function benefitProgress(rows:Row[]){
  return rows.map(r=>{const b=n(r['f2']),t=n(r['f3']),hasCur=!blank(r['f4']),c=n(r['f4']);
    const pct=hasCur&&t!==b?Math.max(0,Math.min(1.2,(c-b)/(t-b))):0;
    return {name:r['f0']||'Benefit',kpi:r['f1']||'',baseline:r['f2']||'',target:r['f3']||'',current:hasCur?r['f4']:'not measured yet',pct,owner:r['f5']||'',review:r['f6']||''};});
}

/* ---------- RACI ---------- */
export function raciMatrix(rows:Row[]){
  const roles:{key:string;letter:string}[]=[{key:'responsible',letter:'R'},{key:'accountable',letter:'A'},{key:'consulted',letter:'C'},{key:'informed',letter:'I'}];
  const split=(v:string)=>(v||'').split(/\s*(?:,|;|\/|&|\band\b)\s*/i).map(s=>s.trim()).filter(s=>s&&!blank(s));
  const people:string[]=[];
  for(const r of rows)for(const ro of roles)for(const p of split(r[ro.key]))if(!people.includes(p))people.push(p);
  const grid=rows.map(r=>({activity:r['activity']||'Activity',cells:people.map(p=>roles.filter(ro=>split(r[ro.key]).includes(p)).map(ro=>ro.letter).join('')),
    accountable:split(r['accountable']).length}));
  return {people,grid};
}

/* ---------- Boards ---------- */
export function groupBy(rows:Row[],key:string,order:string[]=[]){
  const m=new Map<string,Row[]>();for(const o of order)m.set(o,[]);
  for(const r of rows){const k=(r[key]||'').trim()||'No status';if(!m.has(k))m.set(k,[]);m.get(k)!.push(r);}
  return [...m.entries()].map(([name,items])=>({name,items}));
}
