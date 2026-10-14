// A small spreadsheet formula engine for the Excel practice lab.
// Supports cell and range references (with $ and Sheet! prefixes), arithmetic, comparisons, & (join text)
// and the functions most used in project reporting. Relative references move when a formula is "filled down".

export type Scalar=number|string|boolean|XlError;
export interface XlError{error:string}
export type Value=Scalar|Scalar[][];
export interface Sheet{name:string;cells:Scalar[][]}  // cells[row][col], row 0 = Excel row 1
export interface EvalContext{sheets:Record<string,Sheet>;sheet:string;rowOffset:number}

const err=(e:string):XlError=>({error:e});
export const isErr=(v:unknown):v is XlError=>typeof v==='object'&&v!==null&&!Array.isArray(v)&&'error' in (v as object);

type Tok={t:'num'|'str'|'ref'|'id'|'op'|'('|')'|','|'bool';v:string};
type Node=
  {k:'num';v:number}|{k:'str';v:string}|{k:'bool';v:boolean}|
  {k:'ref';sheet?:string;col:number;row:number;absRow:boolean}|
  {k:'range';sheet?:string;c1:number;r1:number;a1:boolean;c2:number;r2:number;a2:boolean}|
  {k:'un';op:string;a:Node}|{k:'bin';op:string;a:Node;b:Node}|{k:'call';name:string;args:Node[]};

const REF=/^(?:([A-Za-z_][A-Za-z0-9_]*)!)?(\$?)([A-Za-z]{1,3})(\$?)(\d+)(?::(\$?)([A-Za-z]{1,3})(\$?)(\d+))?/;

function tokenize(src:string):Tok[]{
  const out:Tok[]=[];let i=0;
  while(i<src.length){
    const c=src[i];
    if(/\s/.test(c)){i++;continue;}
    if(c==='"'){let j=i+1,s='';while(j<src.length){if(src[j]==='"'){if(src[j+1]==='"'){s+='"';j+=2;continue;}break;}s+=src[j++];}
      if(j>=src.length)throw new Error('A text value is missing its closing quote (").');out.push({t:'str',v:s});i=j+1;continue;}
    const num=/^(\d+\.?\d*|\.\d+)(%?)/.exec(src.slice(i));
    if(num&&!/^[A-Za-z]/.test(src.slice(i))){out.push({t:'num',v:String(Number(num[1])/(num[2]?100:1))});i+=num[0].length;continue;}
    const ref=REF.exec(src.slice(i));
    if(ref&&!/^[A-Za-z0-9_(]/.test(src.slice(i+ref[0].length))){out.push({t:'ref',v:ref[0]});i+=ref[0].length;continue;}
    const id=/^[A-Za-z_][A-Za-z0-9_.]*/.exec(src.slice(i));
    if(id){const u=id[0].toUpperCase();out.push(u==='TRUE'||u==='FALSE'?{t:'bool',v:u}:{t:'id',v:u});i+=id[0].length;continue;}
    const two=src.slice(i,i+2);
    if(two==='<='||two==='>='||two==='<>'){out.push({t:'op',v:two});i+=2;continue;}
    if('+-*/^&=<>'.includes(c)){out.push({t:'op',v:c});i++;continue;}
    if(c==='('||c===')'||c===','){out.push({t:c,v:c});i++;continue;}
    if(c===';'){out.push({t:',',v:','});i++;continue;}
    throw new Error(`Unexpected character "${c}".`);
  }
  return out;
}

const colNum=(s:string)=>s.toUpperCase().split('').reduce((n,ch)=>n*26+ch.charCodeAt(0)-64,0)-1;
export const colName=(n:number)=>{let s='';n++;while(n>0){const m=(n-1)%26;s=String.fromCharCode(65+m)+s;n=Math.floor((n-1)/26);}return s;};

function parse(src:string):Node{
  const toks=tokenize(src);let p=0;
  const peek=()=>toks[p];const next=()=>toks[p++];
  const prec:Record<string,number>={'=':1,'<>':1,'<':1,'>':1,'<=':1,'>=':1,'&':2,'+':3,'-':3,'*':4,'/':4,'^':5};
  function primary():Node{
    const t=next();
    if(!t)throw new Error('The formula ends too early.');
    if(t.t==='num')return {k:'num',v:Number(t.v)};
    if(t.t==='str')return {k:'str',v:t.v};
    if(t.t==='bool')return {k:'bool',v:t.v==='TRUE'};
    if(t.t==='op'&&(t.v==='-'||t.v==='+'))return {k:'un',op:t.v,a:expr(6)};
    if(t.t==='('){const e=expr(0);if(next()?.t!==')')throw new Error('A bracket ")" is missing.');return e;}
    if(t.t==='ref'){
      const m=REF.exec(t.v)!;const sheet=m[1];
      if(m[7])return {k:'range',sheet,c1:colNum(m[3]),r1:+m[5]-1,a1:!!m[4],c2:colNum(m[7]),r2:+m[9]-1,a2:!!m[8]};
      return {k:'ref',sheet,col:colNum(m[3]),row:+m[5]-1,absRow:!!m[4]};
    }
    if(t.t==='id'){
      if(peek()?.t!=='(')throw new Error(`"${t.v}" is not a function or cell reference.`);
      next();const args:Node[]=[];
      if(peek()?.t!==')'){for(;;){args.push(expr(0));const s=next();if(s?.t===')')break;if(s?.t!==',')throw new Error(`Expected "," or ")" in ${t.v}().`);}}
      else next();
      return {k:'call',name:t.v.replace(/^_XLFN\./,''),args};
    }
    throw new Error(`Unexpected "${t.v}".`);
  }
  function expr(min:number):Node{
    let left=primary();
    for(;;){
      const t=peek();if(!t||t.t!=='op')break;
      const pr=prec[t.v];if(pr===undefined||pr<min)break;
      next();const right=expr(t.v==='^'?pr:pr+1);left={k:'bin',op:t.v,a:left,b:right};
    }
    return left;
  }
  const n=expr(0);
  if(p<toks.length)throw new Error(`Unexpected "${toks[p].v}".`);
  return n;
}

function cellAt(ctx:EvalContext,sheet:string|undefined,row:number,col:number):Scalar{
  const s=ctx.sheets[(sheet??ctx.sheet)]??Object.values(ctx.sheets).find(x=>x.name.toLowerCase()===(sheet??'').toLowerCase());
  if(!s)return err('#REF!');
  if(row<0||col<0)return err('#REF!');
  const v=s.cells[row]?.[col];
  return v===undefined||v===null?'':v;
}

const toNum=(v:Scalar):number|XlError=>{
  if(isErr(v))return v;if(typeof v==='number')return v;if(typeof v==='boolean')return v?1:0;
  if(v==='')return 0;const n=Number(v);return isNaN(n)?err('#VALUE!'):n;
};
const toStr=(v:Scalar):string=>isErr(v)?v.error:typeof v==='boolean'?(v?'TRUE':'FALSE'):String(v);
const flat=(v:Value):Scalar[]=>Array.isArray(v)?v.flat():[v];
const scalar=(v:Value):Scalar=>Array.isArray(v)?(v.length===1&&v[0].length===1?v[0][0]:err('#VALUE!')):v;
const truthy=(v:Scalar):boolean|XlError=>{if(isErr(v))return v;if(typeof v==='boolean')return v;if(typeof v==='number')return v!==0;if(v==='')return false;const u=v.toUpperCase();if(u==='TRUE')return true;if(u==='FALSE')return false;return err('#VALUE!');};

function compare(a:Scalar,b:Scalar):number{
  const ta=typeof a,tb=typeof b;
  if(ta==='number'&&tb==='number')return (a as number)-(b as number);
  if(ta==='string'&&tb==='string')return (a as string).toLowerCase().localeCompare((b as string).toLowerCase());
  const rank=(x:Scalar)=>typeof x==='number'?0:typeof x==='string'?1:2;
  if(a===''&&tb==='number')return 0-(b as number);
  if(b===''&&ta==='number')return (a as number);
  return rank(a)-rank(b);
}

/** Excel-style criteria such as "In Progress", ">100", "<>Done", "P*". */
function matches(v:Scalar,crit:Scalar):boolean{
  if(isErr(v))return false;
  let op='=',rhs:Scalar=crit;
  if(typeof crit==='string'){const m=/^(<=|>=|<>|=|<|>)(.*)$/.exec(crit);if(m){op=m[1];rhs=m[2];}
    if(typeof rhs==='string'&&rhs!==''&&!isNaN(Number(rhs)))rhs=Number(rhs);}
  if(typeof rhs==='string'&&(op==='='||op==='<>')){
    const re=new RegExp('^'+rhs.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','i');
    const hit=typeof v==='string'?re.test(v):false;return op==='='?hit:!hit;
  }
  if(typeof rhs==='number'&&typeof v!=='number')return op==='<>';
  const c=compare(v,rhs);
  return op==='='?c===0:op==='<>'?c!==0:op==='<'?c<0:op==='>'?c>0:op==='<='?c<=0:c>=0;
}

function evaluate(n:Node,ctx:EvalContext):Value{
  switch(n.k){
    case 'num':return n.v;
    case 'str':return n.v;
    case 'bool':return n.v;
    case 'ref':return cellAt(ctx,n.sheet,n.row+(n.absRow?0:ctx.rowOffset),n.col);
    case 'range':{
      const r1=n.r1+(n.a1?0:ctx.rowOffset),r2=n.r2+(n.a2?0:ctx.rowOffset);const out:Scalar[][]=[];
      for(let r=Math.min(r1,r2);r<=Math.max(r1,r2);r++){const row:Scalar[]=[];for(let c=Math.min(n.c1,n.c2);c<=Math.max(n.c1,n.c2);c++)row.push(cellAt(ctx,n.sheet,r,c));out.push(row);}
      return out;
    }
    case 'un':{const v=toNum(scalar(evaluate(n.a,ctx)));return isErr(v)?v:n.op==='-'?-v:v;}
    case 'bin':{
      const a=scalar(evaluate(n.a,ctx)),b=scalar(evaluate(n.b,ctx));
      if(n.op==='&'){if(isErr(a))return a;if(isErr(b))return b;return toStr(a)+toStr(b);}
      if(['=','<>','<','>','<=','>='].includes(n.op)){if(isErr(a))return a;if(isErr(b))return b;const c=compare(a,b);
        return n.op==='='?c===0:n.op==='<>'?c!==0:n.op==='<'?c<0:n.op==='>'?c>0:n.op==='<='?c<=0:c>=0;}
      const x=toNum(a),y=toNum(b);if(isErr(x))return x;if(isErr(y))return y;
      switch(n.op){case '+':return x+y;case '-':return x-y;case '*':return x*y;case '/':return y===0?err('#DIV/0!'):x/y;case '^':return Math.pow(x,y);}
      return err('#VALUE!');
    }
    case 'call':return call(n.name,n.args,ctx);
  }
}

const nums=(vals:Value[]):number[]|XlError=>{const out:number[]=[];for(const v of vals){for(const s of flat(v)){if(isErr(s))return s;if(typeof s==='number')out.push(s);}}return out;};

function call(name:string,args:Node[],ctx:EvalContext):Value{
  const ev=(i:number)=>evaluate(args[i],ctx);
  const evs=(i:number)=>scalar(ev(i));
  const need=(min:number,max=min)=>{if(args.length<min||args.length>max)throw new Error(`${name}() needs ${min===max?min:`${min} to ${max}`} argument${max===1?'':'s'}.`);};
  switch(name){
    case 'SUM':{const n=nums(args.map((_,i)=>ev(i)));return isErr(n)?n:n.reduce((a,b)=>a+b,0);}
    case 'AVERAGE':{const n=nums(args.map((_,i)=>ev(i)));return isErr(n)?n:n.length?n.reduce((a,b)=>a+b,0)/n.length:err('#DIV/0!');}
    case 'MIN':{const n=nums(args.map((_,i)=>ev(i)));return isErr(n)?n:n.length?Math.min(...n):0;}
    case 'MAX':{const n=nums(args.map((_,i)=>ev(i)));return isErr(n)?n:n.length?Math.max(...n):0;}
    case 'COUNT':return args.map((_,i)=>flat(ev(i))).flat().filter(v=>typeof v==='number').length;
    case 'COUNTA':return args.map((_,i)=>flat(ev(i))).flat().filter(v=>v!=='').length;
    case 'COUNTBLANK':return args.map((_,i)=>flat(ev(i))).flat().filter(v=>v==='').length;
    case 'ABS':{need(1);const v=toNum(evs(0));return isErr(v)?v:Math.abs(v);}
    case 'ROUND':case 'ROUNDUP':case 'ROUNDDOWN':{need(1,2);const v=toNum(evs(0)),d=args[1]?toNum(evs(1)):0;if(isErr(v))return v;if(isErr(d))return d;
      const f=Math.pow(10,d),x=v*f;const r=name==='ROUND'?Math.sign(x)*Math.round(Math.abs(x)+1e-9):name==='ROUNDUP'?Math.sign(x)*Math.ceil(Math.abs(x)-1e-9):Math.sign(x)*Math.floor(Math.abs(x)+1e-9);return r/f;}
    case 'IF':{need(2,3);const c=truthy(evs(0));if(isErr(c))return c;return c?evs(1):args[2]?evs(2):false;}
    case 'IFERROR':{need(2);const v=evs(0);return isErr(v)?evs(1):v;}
    case 'AND':case 'OR':{const vals=args.map((_,i)=>flat(ev(i))).flat();let res=name==='AND';for(const v of vals){const t=truthy(v);if(isErr(t))return t;res=name==='AND'?res&&t:res||t;}return res;}
    case 'NOT':{need(1);const t=truthy(evs(0));return isErr(t)?t:!t;}
    case 'IFS':{if(args.length%2)throw new Error('IFS() needs pairs of condition and value.');for(let i=0;i<args.length;i+=2){const t=truthy(evs(i));if(isErr(t))return t;if(t)return evs(i+1);}return err('#N/A');}
    case 'LEN':{need(1);return toStr(evs(0)).length;}
    case 'UPPER':{need(1);return toStr(evs(0)).toUpperCase();}
    case 'LOWER':{need(1);return toStr(evs(0)).toLowerCase();}
    case 'LEFT':case 'RIGHT':{need(1,2);const s=toStr(evs(0));const k=args[1]?toNum(evs(1)):1;if(isErr(k))return k;return name==='LEFT'?s.slice(0,k):s.slice(Math.max(0,s.length-k));}
    case 'CONCAT':case 'CONCATENATE':return args.map((_,i)=>flat(ev(i)).map(toStr).join('')).join('');
    case 'COUNTIF':case 'COUNTIFS':case 'SUMIF':case 'SUMIFS':case 'AVERAGEIF':case 'AVERAGEIFS':{
      let sumRange:Scalar[]|null=null;const pairs:[Scalar[],Scalar][]=[];
      if(name==='COUNTIF'){need(2);pairs.push([flat(ev(0)),evs(1)]);}
      else if(name==='SUMIF'||name==='AVERAGEIF'){need(2,3);pairs.push([flat(ev(0)),evs(1)]);sumRange=args[2]?flat(ev(2)):flat(ev(0));}
      else if(name==='COUNTIFS'){if(args.length%2)throw new Error('COUNTIFS() needs pairs of range and criteria.');for(let i=0;i<args.length;i+=2)pairs.push([flat(ev(i)),evs(i+1)]);}
      else{if(args.length<3||args.length%2===0)throw new Error(`${name}() needs a sum range, then pairs of range and criteria.`);sumRange=flat(ev(0));for(let i=1;i<args.length;i+=2)pairs.push([flat(ev(i)),evs(i+1)]);}
      const len=pairs[0][0].length;if(pairs.some(p=>p[0].length!==len)||(sumRange&&sumRange.length!==len))return err('#VALUE!');
      const hits:number[]=[];for(let i=0;i<len;i++)if(pairs.every(([r,c])=>matches(r[i],c)))hits.push(i);
      if(name.startsWith('COUNT'))return hits.length;
      const vals=hits.map(i=>sumRange![i]).filter(v=>typeof v==='number') as number[];
      if(name.startsWith('SUM'))return vals.reduce((a,b)=>a+b,0);
      return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:err('#DIV/0!');
    }
    case 'SUMPRODUCT':{const arrs=args.map((_,i)=>flat(ev(i)));const len=arrs[0]?.length??0;if(arrs.some(a=>a.length!==len))return err('#VALUE!');
      let s=0;for(let i=0;i<len;i++){let p=1;for(const a of arrs){const v=a[i];if(isErr(v))return v;p*=typeof v==='number'?v:typeof v==='boolean'?(v?1:0):0;}s+=p;}return s;}
    case 'INDEX':{need(2,3);const r=ev(0);const grid=Array.isArray(r)?r:[[r]];const ri=toNum(evs(1)),ci=args[2]?toNum(evs(2)):1;if(isErr(ri))return ri;if(isErr(ci))return ci;
      if(grid.length===1&&!args[2])return grid[0][ri-1]??err('#REF!');
      return grid[ri-1]?.[(ci||1)-1]??err('#REF!');}
    case 'MATCH':{need(2,3);const look=evs(0),list=flat(ev(1));const mode=args[2]?toNum(evs(2)):1;if(isErr(mode))return mode;
      if(mode===0){const i=list.findIndex(v=>!isErr(v)&&compare(v,look)===0);return i<0?err('#N/A'):i+1;}
      let best=-1;for(let i=0;i<list.length;i++){const c=compare(list[i],look);if(mode===1?c<=0:c>=0)best=i;else break;}return best<0?err('#N/A'):best+1;}
    case 'VLOOKUP':case 'HLOOKUP':{need(3,4);const look=evs(0);const t=ev(1);const grid=Array.isArray(t)?t:[[t]];const idx=toNum(evs(2));if(isErr(idx))return idx;
      const exact=args[3]?!truthy(evs(3)):false;
      const keys=name==='VLOOKUP'?grid.map(r=>r[0]):grid[0];
      let at=-1;if(exact)at=keys.findIndex(k=>compare(k,look)===0);else{for(let i=0;i<keys.length;i++){if(compare(keys[i],look)<=0)at=i;else break;}}
      if(at<0)return err('#N/A');
      const v=name==='VLOOKUP'?grid[at][idx-1]:grid[idx-1]?.[at];return v===undefined?err('#REF!'):v;}
    case 'XLOOKUP':{need(3,4);const look=evs(0);const keys=flat(ev(1)),vals=flat(ev(2));const i=keys.findIndex(k=>compare(k,look)===0);
      return i<0?(args[3]?evs(3):err('#N/A')):vals[i]??err('#REF!');}
    case 'MEDIAN':{const n=nums(args.map((_,i)=>ev(i)));if(isErr(n))return n;if(!n.length)return err('#NUM!');const s=[...n].sort((a,b)=>a-b);const m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;}
    case 'PI':return Math.PI;
  }
  throw new Error(`The function ${name}() is not available in this practice sheet.`);
}

export interface FormulaResult{value?:Scalar;error?:string}

/** Evaluates "=formula" on a sheet. rowOffset moves relative row references (used to test filling a formula down). */
export function runFormula(formula:string,ctx:EvalContext):FormulaResult{
  const src=formula.trim();
  if(!src.startsWith('='))return {error:'A formula must start with "=".'};
  try{const v=scalar(evaluate(parse(src.slice(1)),ctx));return {value:v};}
  catch(e){return {error:(e as Error).message};}
}

export function formatValue(v:Scalar|undefined):string{
  if(v===undefined)return '';
  if(isErr(v))return v.error;
  if(typeof v==='boolean')return v?'TRUE':'FALSE';
  if(typeof v==='number')return Number.isInteger(v)?v.toLocaleString('en-CA'):(Math.round(v*10000)/10000).toLocaleString('en-CA',{maximumFractionDigits:4});
  return v;
}

export function sameValue(a:Scalar|undefined,b:Scalar|undefined):boolean{
  if(a===undefined||b===undefined)return false;
  if(isErr(a)||isErr(b))return isErr(a)&&isErr(b)&&a.error===b.error;
  if(typeof a==='number'&&typeof b==='number')return Math.abs(a-b)<=Math.max(0.005,Math.abs(b)*1e-9);
  if(typeof a==='string'&&typeof b==='string')return a.trim()===b.trim();
  return a===b;
}

/** True when the formula refers to at least one cell, so it is not just a typed-in answer. */
export function usesReferences(formula:string):boolean{
  try{return tokenize(formula.trim().replace(/^=/,'')).some(t=>t.t==='ref');}catch{return false;}
}
