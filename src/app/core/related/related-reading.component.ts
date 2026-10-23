import {Component,ElementRef,Input,OnDestroy,afterNextRender,inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SEO_PAGES,pageName} from '../seo/seo-pages';
import {trackEvent} from '../analytics';

interface Next{articles:string[];tool:{label:string;text:string;path:string}}

const PMP_TOOL={label:'Take a free PMP mock exam',text:'Timed questions with an explanation for every answer.',path:'/pm-faciliter/pmp-exam-simulator'};
const TEMPLATES={label:'Use the free PM templates',text:'Charter, WBS, RAID log, status report and more.',path:'/pm-tools'};
/**
 * What to read and try after each article. Keys and article entries are page paths from seo-pages.json.
 * A new article only needs a line here to get its own "Keep reading" block.
 */
const NEXT:Record<string,Next>={
  'resources/future-project-management-canada':{articles:['resources/ai-super-coworker-project-manager-business-analyst','resources/21-causes-of-project-failure','resources/how-project-managers-can-use-chatgpt'],tool:TEMPLATES},
  'resources/111-essential-pmp-mindsets':{articles:['resources/pmp-study-guide-8-week-plan','resources/best-free-pmp-practice-exams','resources/21-causes-of-project-failure'],tool:PMP_TOOL},
  'resources/claude-for-project-management-business-analysis':{articles:['resources/how-project-managers-can-use-chatgpt','resources/ai-super-coworker-project-manager-business-analyst','resources/future-project-management-canada'],tool:TEMPLATES},
  'resources/ai-super-coworker-project-manager-business-analyst':{articles:['resources/claude-for-project-management-business-analysis','resources/how-project-managers-can-use-chatgpt','resources/future-project-management-canada'],tool:TEMPLATES},
  'resources/21-causes-of-project-failure':{articles:['resources/nine-women-one-month-brooks-law','resources/future-project-management-canada','resources/111-essential-pmp-mindsets'],tool:{label:'Try the project simulations',text:'Change the settings and watch a project succeed or slip, week by week.',path:'/pm-playground'}},
  'resources/pmp-study-guide-8-week-plan':{articles:['resources/best-free-pmp-practice-exams','resources/111-essential-pmp-mindsets','resources/21-causes-of-project-failure'],tool:PMP_TOOL},
  'resources/how-project-managers-can-use-chatgpt':{articles:['resources/claude-for-project-management-business-analysis','resources/ai-super-coworker-project-manager-business-analyst','resources/21-causes-of-project-failure'],tool:TEMPLATES},
  'resources/best-free-pmp-practice-exams':{articles:['resources/pmp-study-guide-8-week-plan','resources/111-essential-pmp-mindsets','resources/21-causes-of-project-failure'],tool:PMP_TOOL},
  'resources/nine-women-one-month-brooks-law':{articles:['resources/21-causes-of-project-failure','resources/future-project-management-canada','resources/ai-super-coworker-project-manager-business-analyst'],tool:{label:'Run the Monte Carlo schedule simulator',text:'See how likely your finish date really is.',path:'/pm-calculators/monte-carlo-schedule-simulator'}},
};

/** "Keep reading" block shown under every article: author, three related articles and one tool to try. */
@Component({selector:'app-related-reading',standalone:true,imports:[RouterLink],template:`
@if(next){<aside class="related" aria-labelledby="related-title">
  <div class="author"><img src="my_profile_pic.webp" alt="" width="56" height="56" loading="lazy"><p><strong>Written by Md Alamgir Hossain, PMP</strong>Project and program management professional in Regina, Saskatchewan. <a routerLink="/about">About the author</a></p></div>
  <h2 id="related-title">Keep reading</h2>
  <div class="related-grid">@for(a of cards;track a.path){<a class="related-card" [routerLink]="'/'+a.path" (click)="track(a.path)">@if(a.image){<img [src]="a.image" alt="" width="1600" height="900" loading="lazy" decoding="async">}<span>{{a.title}}</span></a>}</div>
  <a class="try" [routerLink]="next.tool.path" (click)="track(next.tool.path)"><span class="try-label">Put it into practice</span><strong>{{next.tool.label}} →</strong><span>{{next.tool.text}}</span></a>
</aside>}`,styles:[`
.related{max-width:1180px;margin:0 auto;padding:0 clamp(1.25rem,6vw,5rem) 4rem}
.author{display:flex;gap:1rem;align-items:center;padding:1.25rem 0;border-top:1px solid #1b4267;border-bottom:1px solid #1b4267;margin-bottom:2.5rem}
.author img{width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none}
.author p{margin:0;color:#9db1c7;line-height:1.55;font-size:.95rem}.author strong{display:block;color:#fff}.author a{color:#8fe8f5}
h2{font-size:clamp(1.6rem,3vw,2.2rem);letter-spacing:-.03em;margin:0 0 1.2rem}
.related-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
.related-card{display:flex;flex-direction:column;gap:.75rem;padding:.75rem .75rem 1rem;border:1px solid #1b4267;border-radius:16px;background:#0b2340;color:#fff;text-decoration:none;font-weight:700;line-height:1.35}
.related-card:hover,.related-card:focus-visible{border-color:#49cce1}
.related-card img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:10px}
.related-card span{padding:0 .25rem}
.try{display:grid;gap:.25rem;margin-top:1rem;padding:1.25rem 1.5rem;border-radius:16px;background:linear-gradient(135deg,#0e3a5c,#0b2340);border:1px solid #2a5a80;color:#c5d4e5;text-decoration:none}
.try:hover,.try:focus-visible{border-color:#49cce1}.try strong{color:#fff;font-size:1.1rem}
.try-label{color:#49cce1;text-transform:uppercase;letter-spacing:.12em;font-size:.75rem;font-weight:800}
@media(max-width:850px){.related-grid{grid-template-columns:1fr}.related-card{flex-direction:row;align-items:center}.related-card img{width:120px;flex:none}}
`]})
export class RelatedReadingComponent implements OnDestroy{
  next?:Next;cards:{path:string;title:string;image?:string}[]=[];private current='';
  /** Articles already counted as read to the end during this visit to the page. */
  private finished=new Set<string>();private observer?:IntersectionObserver;
  constructor(){
    const host=inject(ElementRef<HTMLElement>);
    // "Keep reading" sits after the last section, so seeing it means the reader reached the end of the article.
    afterNextRender(()=>{if(typeof IntersectionObserver==='undefined')return;
      this.observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting)||!this.next||!this.current||this.finished.has(this.current)||window.scrollY<400)return;
        this.finished.add(this.current);trackEvent('article_complete',{article:this.current})});
      this.observer.observe(host.nativeElement)});
  }
  ngOnDestroy(){this.observer?.disconnect()}
  /** Page path of the article being read, without the leading slash. */
  @Input({required:true}) set path(value:string){
    if(value!==this.current)this.finished.delete(value);this.current=value;this.next=NEXT[value];
    this.cards=(this.next?.articles??[]).filter(p=>SEO_PAGES[p]).map(p=>({path:p,title:pageName(p),image:SEO_PAGES[p]?.hero}));
  }
  track(target:string){trackEvent('related_click',{from:this.current,to:target})}
}
