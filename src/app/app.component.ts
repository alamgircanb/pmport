import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],templateUrl:'./app.component.html',styleUrl:'./app.component.css'})
export class AppComponent {
  readonly auth=inject(AuthService); readonly year=new Date().getFullYear(); menuOpen=false;
  readonly navigation=[
    {label:'Home',path:'/'},{label:'About',path:'/about'},{label:'Education',path:'/education'},
    {label:'Portfolio',path:'/portfolio'},{label:'PM Tools',path:'/pm-tools'},{label:'PMFaciliter',path:'/pm-faciliter'},
    {label:'Media',path:'/media'},{label:'Events & Gallery',path:'/events'},
    {label:'Books & Articles',path:'/resources'},{label:'Credentials',path:'/credentials'},
    {label:'Contact',path:'/contact'}
  ];
  toggleMenu():void{this.menuOpen=!this.menuOpen} closeMenu():void{this.menuOpen=false}
  @HostListener('document:keydown.escape') closeOnEscape():void{this.closeMenu()}
}
