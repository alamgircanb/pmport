import {Component,HostListener,inject} from '@angular/core';
import {NavigationEnd,Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthService} from './core/auth/auth.service';
import {ABOUT_GROUP,NAV_GROUPS,NavGroup,navMatch} from './core/navigation';
import {SEO_PAGES,pageName} from './core/seo/seo-pages';
import {Title} from '@angular/platform-browser';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent{
 readonly auth=inject(AuthService); readonly year=new Date().getFullYear(); menuOpen=false; readonly groups=NAV_GROUPS; readonly aboutGroup=ABOUT_GROUP; open:Record<string,boolean>={}; url='/'; crumbs:{label:string;path?:string}[]=[]; private title=inject(Title);
 private readonly router=inject(Router);isMobile=typeof window!=='undefined'&&window.innerWidth<=920;private desktopPreference=true;private workspace=false;
 constructor(){try{this.desktopPreference=localStorage.getItem('pmport-sidebar-open')!=='false'}catch{}this.applyRoute(this.router.url);this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd)this.applyRoute(event.urlAfterRedirects)})}
 private applyRoute(url:string){this.url=url.split(/[?#]/)[0];this.buildCrumbs();this.workspace=true;this.menuOpen=this.isMobile?false:this.workspace?false:this.desktopPreference}
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
 @HostListener('document:keydown.escape') closeOnEscape(){if(this.menuOpen){this.menuOpen=false;if(!this.isMobile)this.savePreference()}}
}