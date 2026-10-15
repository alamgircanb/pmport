import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {CATEGORIES,TERMS,type GlossaryTerm} from './glossary';

/** Glossary: searchable A–Z list of project management, agile and business analysis terms. */
@Component({
  standalone:true,selector:'app-glossary-hub',imports:[FormsModule,RouterLink],
  template:`
  <section class="page glossary">
    <header class="page-header"><p class="eyebrow">Glossary</p><h1>Project management glossary</h1>
      <p class="lead">{{terms.length}} project management, agile, risk, cost and business analysis terms explained in plain English, each with a real-world example. Useful for PMP, CAPM, PMI-ACP and CBAP study, and for everyday project work.</p></header>
    <div class="tools">
      <label class="sr-only" for="q">Search the glossary</label>
      <input id="q" type="search" [(ngModel)]="q" placeholder="Search terms, e.g. float, CPI, backlog…" autocomplete="off">
      <select [(ngModel)]="cat" aria-label="Filter by topic"><option value="">All topics</option>@for(c of categories;track c){<option [value]="c">{{c}}</option>}</select>
    </div>
    <nav class="az" aria-label="Jump to letter">@for(l of letters;track l){<button type="button" [disabled]="!groups.has(l)" (click)="jump(l)">{{l}}</button>}</nav>
    <p class="count">{{filtered.length}} term{{filtered.length===1?'':'s'}}</p>
    @for(l of letters;track l){
      @if(groups.get(l);as items){
        <section class="letter" [id]="'letter-'+l"><h2>{{l}}</h2>
          <div class="list">@for(t of items;track t.slug){<a class="term" [routerLink]="'/pm-glossary/'+t.slug"><strong>{{t.term}}</strong><span class="cat">{{t.category}}</span><small>{{first(t)}}</small></a>}</div>
        </section>
      }
    }
    @if(!filtered.length){<p class="muted">No terms match. Try a shorter word.</p>}
  </section>`,
  styles:[`
    .tools{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem}
    .tools input{flex:1;min-width:220px}.tools input,.tools select{border:1px solid #315370;background:#071a30;color:#fff;border-radius:10px;padding:.8rem;font-size:1rem}
    .az{display:flex;flex-wrap:wrap;gap:.3rem;margin-bottom:1rem}
    .az button{width:2.2rem;height:2.2rem;border-radius:8px;border:1px solid var(--line);background:#082039;color:#d9eef7;font-weight:800;cursor:pointer}
    .az button:disabled{opacity:.3;cursor:default}
    .count{color:var(--muted);font-size:.9rem}
    .letter{scroll-margin-top:90px;margin-top:1.5rem}.letter h2{font-size:1.8rem!important;color:var(--accent);margin:0 0 .6rem!important}
    .list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:.6rem}
    .term{display:grid;gap:.2rem;padding:.85rem 1rem;border:1px solid var(--line);border-radius:12px;background:#0b2340;color:#eaf3fc;text-decoration:none}
    .term:hover,.term:focus-visible{border-color:var(--accent)}
    .term strong{font-size:1.02rem}.term small{color:#a9bfd2;line-height:1.45}
    .cat{font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--accent)}
  `]
})
export class GlossaryHubComponent{
  readonly terms=TERMS;readonly categories=CATEGORIES;
  readonly letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  q='';cat='';
  get filtered():GlossaryTerm[]{
    const q=this.q.trim().toLowerCase();
    return TERMS.filter(t=>(!this.cat||t.category===this.cat)&&(!q||t.term.toLowerCase().includes(q)||t.definition.toLowerCase().includes(q)));
  }
  get groups(){const m=new Map<string,GlossaryTerm[]>();for(const t of this.filtered){const l=t.term[0].toUpperCase();if(!m.has(l))m.set(l,[]);m.get(l)!.push(t);}return m;}
  first(t:GlossaryTerm){const s=t.definition.split(/(?<=\.)\s/)[0];return s.length>140?s.slice(0,137)+'…':s;}
  jump(l:string){document.getElementById('letter-'+l)?.scrollIntoView({behavior:'smooth'});}
}
