import {Component} from '@angular/core';import {RouterLink} from '@angular/router';
@Component({standalone:true,selector:'app-home',imports:[RouterLink],template:`<section class="page hero">
<div><p class="eyebrow">Project leadership · Business systems · Data</p>
<h1>Making complex work<br><span>clear and useful.</span></h1>
<p class="lead">I’m Md Alamgir Hossain, a project management and business information systems professional in Regina, Saskatchewan. 
I connect strategy, people and technology to deliver measurable outcomes.</p>
<div class="actions"><a class="button primary" routerLink="/portfolio">Explore selected work</a>
<a class="button secondary" routerLink="/contact">Start a conversation</a></div></div>
<img src="my_profile_pic.png" alt="Md Alamgir Hossain" class="portrait"></section>
<section class="page strip"><article><strong>15+ years</strong><span>Leadership experience</span></article>
<article><strong>3 programs</strong><span>BBA · MBA · BIS</span></article><article><strong>PMP® · CSM®</strong>
<span>Professional practice</span>
</article></section>`,
            styles:[`.hero{min-height:78vh;display:grid;grid-template-columns:1.35fr .65fr;
            align-items:center;gap:4rem}.hero h1 span{color:var(--accent)}.portrait{width:100%;aspect-ratio:4/5;
            object-fit:cover;border-radius:32px;border:1px solid var(--line);box-shadow:25px 25px 0 #0c2947}.strip{padding-top:1rem;
            padding-bottom:4rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.strip article{border-top:1px solid 
            var(--line);padding-top:1.2rem;display:grid;gap:.35rem}.strip strong{font-size:1.4rem}.strip span{color:var(--muted)}@media(max-width:850px)
            {.hero{grid-template-columns:1fr;min-height:auto}.portrait{max-width:420px}.strip{grid-template-columns:1fr}}`]})
  export class HomeComponent{}
