import {Component} from '@angular/core';
interface Credential{shortName:string;issuer:string;title:string;url:string;action:string}
@Component({standalone:true,selector:'app-credentials',template:`<section class="page"><header class="page-header"><p class="eyebrow">Verified credentials</p><h1>Professional practice</h1><p class="lead">Each credential below links to the original public verification record.</p></header><div class="grid two">@for(credential of credentials;track credential.shortName){<a class="credential card" [href]="credential.url" target="_blank" rel="noreferrer"><span class="eyebrow">{{credential.issuer}}</span><strong>{{credential.shortName}}</strong><h2>{{credential.title}}</h2><span class="verify">{{credential.action}} ↗</span></a>}</div><div class="actions"><a class="button secondary" href="https://www.credly.com/users/alamgircanb/badges" target="_blank" rel="noreferrer">View all Credly badges ↗</a></div></section>`,styles:[`.credential{display:block;text-decoration:none;transition:transform .2s,border-color .2s}.credential:hover,.credential:focus-visible{transform:translateY(-4px);border-color:var(--accent)}.credential strong{display:block;color:var(--accent);font-family:Manrope,Inter,sans-serif;font-size:clamp(2.4rem,5vw,4.3rem);letter-spacing:-.05em}.credential h2{font-size:1.15rem;margin:.4rem 0 1.4rem;color:#dce8f4}.verify{color:var(--accent);font-weight:700}`]})
export class CredentialsComponent{
  // Public verification links restored from the original deployed portfolio.
  readonly credentials:Credential[]=[
    {shortName:'PMP®',issuer:'Project Management Institute',title:'Project Management Professional',url:'https://www.credly.com/badges/d80ef58d-6eac-46b5-8d22-b0a255c9ee16/linked_in_profile',action:'Verify credential'},
    {shortName:'CSM®',issuer:'Scrum Alliance',title:'Certified ScrumMaster',url:'https://app.badgecert.com/public/badges/tvtrllat',action:'Verify credential'},
    {shortName:'ITILv5',issuer:'PeopleCert',title:'IT Service Management Foundation',url:'https://www.peoplecert.org/public-profile?ed=XCHu3ZqUTNJoAkbRtfdXH4jNnyT4aRSR',action:'View credential'},
    {shortName:'MBA',issuer:'World Education Services',title:'Master of Business Administration · WES verified',url:'https://badges.wes.org/Evidence?i=8d95a5d1-7f78-40d0-a8d0-93cfa5f00854&type=ca',action:'Verify credential'}
  ];
}
