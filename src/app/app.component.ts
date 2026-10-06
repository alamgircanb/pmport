import {Component,HostListener,inject} from '@angular/core';
import {NavigationEnd,Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthService} from './core/auth/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent{
 readonly auth=inject(AuthService); readonly year=new Date().getFullYear(); menuOpen=false; portfolioOpen=true;
 private readonly router=inject(Router);isMobile=typeof window!=='undefined'&&window.innerWidth<=920;private desktopPreference=true;private workspace=false;
 constructor(){try{this.desktopPreference=localStorage.getItem('pmport-sidebar-open')!=='false'}catch{}this.applyRoute(this.router.url);this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd)this.applyRoute(event.urlAfterRedirects)})}
 private applyRoute(url:string){const path=url.split(/[?#]/)[0];this.workspace=path==='/pm-handaid'||path==='/pm-tools'||path.startsWith('/pm-tools/');this.menuOpen=this.isMobile?false:this.workspace?false:this.desktopPreference}
 @HostListener('window:resize') onResize(){const mobile=window.innerWidth<=920;if(mobile!==this.isMobile){this.isMobile=mobile;this.menuOpen=mobile?false:this.workspace?false:this.desktopPreference}}
 private savePreference(){this.desktopPreference=this.menuOpen;try{localStorage.setItem('pmport-sidebar-open',String(this.menuOpen))}catch{}}
 readonly navigation=[{label:'PM HandAid',path:'/pm-handaid'},{label:'PM JOBS Prep',path:'/pm-jobs-prep'},{label:'PM Tools',path:'/pm-tools'},{label:'PM Faciliter',path:'/pm-faciliter'},{label:'PM Media',path:'/media'},{label:'PM Events & Gallery',path:'/events'},{label:'PM Knowledge Lake',path:'/resources'}];
 readonly portfolio=[{label:'PM Profile',path:'/about'},{label:'All selected work',path:'/portfolio'},{label:'Course Work',path:'/portfolio/course-work'},{label:'Professional Work',path:'/portfolio/professional-work'},{label:'Education',path:'/education'},{label:'Credentials',path:'/credentials'}];
 toggleMenu(){this.menuOpen=!this.menuOpen;if(!this.isMobile)this.savePreference()} closeMenu(){if(this.isMobile)this.menuOpen=false}
 @HostListener('document:keydown.escape') closeOnEscape(){if(this.menuOpen){this.menuOpen=false;if(!this.isMobile)this.savePreference()}}
}