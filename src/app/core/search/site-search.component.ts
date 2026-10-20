import {AfterViewInit,Component,ElementRef,EventEmitter,HostListener,Output,ViewChild,inject} from '@angular/core';
import {Router} from '@angular/router';
import {SEO_PAGES,pageName} from '../seo/seo-pages';
import {trackEvent} from '../analytics';

/** One searchable page: a site page from seo-pages.json or a glossary term. */
interface Entry{title:string;text:string;path:string;kind:string;hay:string}

/** Section name shown beside each result, from the first part of the address. */
const KIND:Record<string,string>={'':'Home','resources':'Article','pm-glossary':'Glossary','pm-calculators':'Calculator','pm-faciliter':'Exam prep','pm-tools':'Tools','pm-datalab':'DataLab','pm-playground':'Practice','portfolio':'Portfolio','media':'Videos','pm-learninglink':'Learn','pm-jobs-prep':'Career','events':'Career','pm-handaid':'Tools','about':'About','about-pmport':'About','education':'About','credentials':'About','start-here':'Start here'};
const norm=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');

/**
 * Site search (header button or "/" key). Searches every public page title and description, and all
 * glossary terms. Runs in the browser; the glossary list is loaded only when search is first opened.
 */
@Component({selector:'app-site-search',standalone:true,template:`
<div class="search-scrim" (click)="close()"></div>
<div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-label">
  <label id="site-search-label" class="sr-only" for="site-search-input">Search PMPORT</label>
  <div class="search-field"><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <input #box id="site-search-input" type="search" autocomplete="off" spellcheck="false" placeholder="Search exams, tools, articles, glossary…" [value]="query" (input)="onInput(box.value)" (keydown)="onKey($event)" role="combobox" aria-autocomplete="list" aria-controls="site-search-results" [attr.aria-expanded]="results.length>0" [attr.aria-activedescendant]="results.length?'search-result-'+active:null">
    <button type="button" class="search-close" (click)="close()" aria-label="Close search">Esc</button></div>
  @if(query.trim().length>=2){
    @if(results.length){<ul id="site-search-results" class="search-results" role="listbox">@for(r of results;track r.path;let i=$index){<li [id]="'search-result-'+i" role="option" [attr.aria-selected]="i===active" [class.active]="i===active" (mouseenter)="active=i" (click)="go(r)"><span class="result-kind">{{r.kind}}</span><span class="result-title">{{r.title}}</span><span class="result-text">{{r.text}}</span></li>}</ul>}
    @else{<p class="search-empty">No results for “{{query.trim()}}”. Try a shorter word, e.g. “risk” or “EVM”.</p>}
  }@else{<div class="search-hints"><p>Popular:</p>@for(h of hints;track h){<button type="button" (click)="onInput(h);box.focus()">{{h}}</button>}</div>}
</div>`,styles:[`
:host{position:fixed;inset:0;z-index:60;display:block}
.search-scrim{position:absolute;inset:0;background:rgba(2,10,20,.72)}
.search-dialog{position:relative;width:min(680px,calc(100% - 2rem));margin:12vh auto 0;background:#081d34;border:1px solid #1b4267;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.5);overflow:hidden}
.search-field{display:flex;align-items:center;gap:.7rem;padding:.4rem .6rem .4rem 1rem;border-bottom:1px solid #1b4267;color:#8faac7}
.search-field input{flex:1;min-height:52px;border:0;background:transparent;color:#fff;font:inherit;font-size:1.05rem;outline:none}
.search-field input::-webkit-search-cancel-button{display:none}
.search-close{min-height:36px;padding:0 .6rem;border:1px solid #2a4b6b;border-radius:8px;background:transparent;color:#8faac7;font:inherit;font-size:.75rem;cursor:pointer}
.search-results{list-style:none;margin:0;padding:.4rem;max-height:min(60vh,520px);overflow-y:auto}
.search-results li{display:grid;grid-template-columns:auto 1fr;gap:.15rem .7rem;padding:.7rem .8rem;border-radius:10px;cursor:pointer}
.search-results li.active{background:#0d2947}
.result-kind{grid-row:span 2;align-self:start;margin-top:.15rem;padding:.15rem .45rem;border-radius:99px;background:#102f50;color:#9fd8e6;font-size:.7rem;font-weight:700;white-space:nowrap}
.result-title{color:#fff;font-weight:600}
.result-text{color:#8ea6bf;font-size:.85rem;line-height:1.45;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.search-empty,.search-hints{margin:0;padding:1.1rem 1.2rem;color:#8ea6bf;font-size:.9rem}
.search-hints{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem}.search-hints p{margin:0 .3rem 0 0}
.search-hints button{min-height:36px;padding:0 .75rem;border:1px solid #2a4b6b;border-radius:99px;background:#071a30;color:#c5d4e5;font:inherit;font-size:.82rem;cursor:pointer}
.search-hints button:hover{border-color:#49cce1;color:#fff}
@media(max-width:600px){.search-dialog{margin-top:1rem}}
`]})
export class SiteSearchComponent implements AfterViewInit{
  @Output() readonly closed=new EventEmitter<void>();
  @ViewChild('box') private box?:ElementRef<HTMLInputElement>;
  private readonly router=inject(Router);
  readonly hints=['PMP exam simulator','Earned value','Risk register','WBS','Agile','Charter template'];
  query='';results:Entry[]=[];active=0;
  private entries:Entry[]=Object.entries(SEO_PAGES).filter(([,p])=>!p.noindex).map(([path,p])=>{
    const title=path?pageName(path):'PMPORT home';const kind=KIND[path.split('/')[0]]??'Page';
    return {title,text:p.description,path:'/'+path,kind,hay:norm(`${title} ${p.description}`)};
  });
  private previous:Element|null=typeof document!=='undefined'?document.activeElement:null;

  constructor(){
    import('../../pages/glossary/glossary').then(({TERMS})=>{
      const known=new Set(this.entries.map(e=>e.path));
      for(const t of TERMS){const path=`/pm-glossary/${t.slug}`;if(!known.has(path))this.entries.push({title:t.term,text:t.definition,path,kind:'Glossary',hay:norm(`${t.term} ${t.definition} ${t.category}`)})}
      if(this.query)this.onInput(this.query);
    }).catch(()=>{});
  }
  ngAfterViewInit(){setTimeout(()=>this.box?.nativeElement.focus())}

  onInput(value:string){
    this.query=value;this.active=0;
    const q=norm(value.trim());if(q.length<2){this.results=[];return}
    const words=q.split(/\s+/).filter(Boolean);
    this.results=this.entries.map(e=>{
      if(!words.every(w=>e.hay.includes(w)))return null;
      const t=norm(e.title);let score=0;
      if(t===q)score+=100;else if(t.startsWith(q))score+=60;else if(t.includes(q))score+=40;
      for(const w of words)if(t.includes(w))score+=10;
      if(e.kind!=='Glossary')score+=3;
      return {e,score};
    }).filter((x):x is {e:Entry;score:number}=>!!x).sort((a,b)=>b.score-a.score||a.e.title.localeCompare(b.e.title)).slice(0,12).map(x=>x.e);
  }
  onKey(e:KeyboardEvent){
    if(e.key==='ArrowDown'&&this.results.length){e.preventDefault();this.active=(this.active+1)%this.results.length}
    else if(e.key==='ArrowUp'&&this.results.length){e.preventDefault();this.active=(this.active-1+this.results.length)%this.results.length}
    else if(e.key==='Enter'&&this.results[this.active]){e.preventDefault();this.go(this.results[this.active])}
  }
  go(r:Entry){trackEvent('search',{search_term:this.query.trim()});this.router.navigateByUrl(r.path);this.close()}
  @HostListener('document:keydown.escape') close(){this.closed.emit();(this.previous as HTMLElement|null)?.focus?.()}
}
