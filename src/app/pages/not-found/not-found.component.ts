import {Component,OnInit,inject} from '@angular/core';import {Meta,Title} from '@angular/platform-browser';import {RouterLink} from '@angular/router';import {trackEvent} from '../../core/analytics';
@Component({standalone:true,selector:'app-not-found',imports:[RouterLink],template:`<section class="page"><p class="eyebrow">404</p><h1>Page not found.</h1><p class="lead">The page may have moved or the address may be incomplete.</p><a class="button primary" routerLink="/">Return home</a></section>`}) export class NotFoundComponent implements OnInit{
  private meta=inject(Meta);private title=inject(Title);
  ngOnInit(){
    // Tell search engines not to index missing addresses (the server answers 200 for every app route, so this marks it as a 404).
    this.meta.updateTag({name:'robots',content:'noindex, follow'});this.title.setTitle('Page not found | PMPORT');
    // Lets GA4 show which broken addresses visitors land on (Reports › Engagement › Events › page_not_found).
    if(typeof location!=='undefined')trackEvent('page_not_found',{page_path:location.pathname.slice(0,100),referrer:(document.referrer||'(none)').slice(0,100)});
  }
}
