import {Component,HostListener,inject} from '@angular/core';
import {RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {AuthService} from './core/auth/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent{
 readonly auth=inject(AuthService); readonly year=new Date().getFullYear(); menuOpen=false; portfolioOpen=true;
 readonly navigation=[{label:'PM HandAid',path:'/pm-handaid'},{label:'PM JOBS Prep',path:'/pm-jobs-prep'},{label:'PM Tools',path:'/pm-tools'},{label:'PMFaciliter',path:'/pm-faciliter'},{label:'PM Media',path:'/media'},{label:'PM Events & Gallery',path:'/events'},{label:'PM Knowledge Lake',path:'/resources'}];
 readonly portfolio=[{label:'PM Profile',path:'/about'},{label:'All selected work',path:'/portfolio'},{label:'Course Work',path:'/portfolio/course-work'},{label:'Professional Work',path:'/portfolio/professional-work'},{label:'Education',path:'/education'},{label:'Credentials',path:'/credentials'}];
 toggleMenu(){this.menuOpen=!this.menuOpen} closeMenu(){this.menuOpen=false}
 @HostListener('document:keydown.escape') closeOnEscape(){this.closeMenu()}
}