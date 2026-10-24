import {Component,HostListener,afterNextRender,inject} from '@angular/core';
import {NavigationEnd,Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthService} from './core/auth/auth.service';
import {ABOUT_GROUP,NAV_GROUPS,NavGroup,navMatch} from './core/navigation';
import {SEO_PAGES,pageName} from './core/seo/seo-pages';
import {Title} from '@angular/platform-browser';
import {SiteSearchComponent} from './core/search/site-search.component';
import {RelatedReadingComponent} from './core/related/related-reading.component';
import {startInteractionTracking} from './core/analytics';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,SiteSearchComponent,RelatedReadingComponent],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent{
 readonly auth=inject(AuthService); readonly year=new Date().getFullYear(); menuOpen=false; readonly groups=NAV_GROUPS; readonly aboutGroup=ABOUT_GROUP; open:Record<string,boolean>={}; url='/'; crumbs:{label:string;path?:string}[]=[]; private title=inject(Title); topOpen:string|null=null; private hoverOpened:string|null=null; searchOpen=false; relatedPath:string|null=null;
 private readonly router=inject(Router);isMobile=typeof window!=='undefined'&&window.innerWidth<=920;private desktopPreference=true;private workspace=false;
 constructor(){afterNextRender(()=>startInteractionTracking());try{this.desktopPreference=localStorage.getItem('pmport-sidebar-open')!=='false'}catch{}this.applyRoute(this.router.url);this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd)this.applyRoute(event.urlAfterRedirects)})}
 private applyRoute(url:string){this.url=url.split(/[?#]/)[0];this.topOpen=null;this.searchOpen=false;const key=this.url.slice(1);this.relatedPath=SEO_PAGES[key]?.type==='article'?key:null;this.buildCrumbs();this.workspace=true;this.menuOpen=this.isMobile?false:this.workspace?false:this.desktopPreference}
 @HostListener('window:resize') onResize(){const mobile=window.innerWidth<=920;if(mobile!==this.isMobile){this.isMobile=mobile;this.menuOpen=mobile?false:this.workspace?false:this.desktopPreference}}
 private savePreference(){this.desktopPreference=this.menuOpen;try{localStorage.setItem('pmport-sidebar-open',String(this.menuOpen))}catch{}}

 toggle(id:string){this.open[id]=!this.open[id]}
 inGroup(g:NavGroup){return navMatch(this.url)?.group===g}
 /** "You are here" trail: Home › group › section › page. */
 private buildCrumbs(){
  const m=navMatch(this.url);
  if(this.url==='/'||!m){this.crumbs=[];return;}
  const c:{label:string;path?:string}[]=[{label:'Home',path:'/'}];
  if(m.group)c.push({label:m.group.label});
  const deeper=m.url!==m.link.path;
  c.push({label:m.link.label,path:deeper?m.link.path:undefined});
  if(deeper){const key=m.url.slice(1);const item={label:SEO_PAGES[key]?pageName(key):''};c.push(item);
   if(!item.label)setTimeout(()=>{item.label=this.title.getTitle().replace(/ \| PMPORT$/,'').split(/ [|:–-] /)[0];},0);}
  this.crumbs=c;
 }
 skipToMain(e:Event){e.preventDefault();const main=document.getElementById('main-content');main?.focus();main?.scrollIntoView()}
 toggleMenu(){this.menuOpen=!this.menuOpen;if(!this.isMobile)this.savePreference()} closeMenu(){if(this.isMobile)this.menuOpen=false}
 @HostListener('document:keydown.escape') closeOnEscape(){this.topOpen=null;if(this.menuOpen){this.menuOpen=false;if(!this.isMobile)this.savePreference()}}
 /** Desktop top menu: a group opens on mouse hover or on click/tap/Enter, and closes on a click elsewhere. */
 toggleTop(id:string){if(this.hoverOpened===id){this.hoverOpened=null;this.topOpen=id;return;}this.topOpen=this.topOpen===id?null:id}
 hoverTop(id:string,e:PointerEvent){if(e.pointerType==='mouse'){this.topOpen=id;this.hoverOpened=id}}
 leaveTop(id:string,e:PointerEvent){if(e.pointerType==='mouse'&&this.topOpen===id){this.topOpen=null;this.hoverOpened=null}}
 @HostListener('document:click',['$event']) closeTopOutside(e:MouseEvent){const t=e.target as HTMLElement|null;if(this.topOpen&&!t?.closest('.topnav-item'))this.topOpen=null}
 openSearch(){this.topOpen=null;this.searchOpen=true}
 /** Press "/" anywhere (outside a text field) to open search. */
 @HostListener('document:keydown',['$event']) slashToSearch(e:KeyboardEvent){if(e.key!=='/'||e.ctrlKey||e.metaKey||e.altKey||this.searchOpen)return;const t=e.target as HTMLElement|null;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;e.preventDefault();this.openSearch()}
}