import {Injectable,inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Meta,Title} from '@angular/platform-browser';
import {RouterStateSnapshot,TitleStrategy} from '@angular/router';
import {DEFAULT_IMAGE,SEO_PAGES,SITE_NAME,SITE_URL,SeoPage,breadcrumbData} from './seo-pages';

/** Sets the page title, description, canonical link, social-sharing tags and article data on every navigation. */
@Injectable({providedIn:'root'})
export class SeoTitleStrategy extends TitleStrategy{
  private readonly title=inject(Title);
  private readonly meta=inject(Meta);
  private readonly doc=inject(DOCUMENT);

  override updateTitle(snapshot:RouterStateSnapshot):void{
    const path=snapshot.url.split(/[?#]/)[0].replace(/^\/+|\/+$/g,'');
    // Pages that set their own search details (e.g. glossary terms) call apply() themselves.
    let route=snapshot.root;while(route.firstChild)route=route.firstChild;
    if(route.data['seoCustom'])return;
    const page:SeoPage=SEO_PAGES[path]??{title:this.buildTitle(snapshot)??`${SITE_NAME} | Project Management, Learning & Practice`,description:SEO_PAGES[''].description,noindex:true};
    this.apply(path,page);
    this.setJsonLd('seo-term',null);
    this.setBreadcrumbs(SEO_PAGES[path]?path:'');
  }

  /** Sets title, description, robots, social tags, canonical link and article data for a page. */
  apply(path:string,page:SeoPage,crumbs?:{name:string;url:string}[]):void{
    const url=`${SITE_URL}/${path}`;
    const image=`${SITE_URL}/${page.image??DEFAULT_IMAGE}`;
    this.title.setTitle(page.title);
    const tags:[string,string,string][]=[
      ['name','description',page.description],
      ['name','robots',page.noindex?'noindex, follow':'index, follow'],
      ['property','og:site_name',SITE_NAME],
      ['property','og:type',page.type??'website'],
      ['property','og:title',page.title],
      ['property','og:description',page.description],
      ['property','og:url',url],
      ['property','og:image',image],
      ['property','og:image:width','1200'],
      ['property','og:image:height','630'],
      ['property','og:locale','en_CA'],
      ['name','twitter:card','summary_large_image'],
      ['name','twitter:title',page.title],
      ['name','twitter:description',page.description],
      ['name','twitter:image',image]
    ];
    for(const [attr,key,content] of tags)this.meta.updateTag({[attr]:key,content},`${attr}="${key}"`);
    this.setCanonical(url);
    this.setArticleData(page,url,image);
    if(crumbs)this.setJsonLd('seo-breadcrumb',{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:c.url}))});
  }

  /** Adds or replaces a schema.org JSON-LD block in the page head (removed when data is null). */
  setJsonLd(id:string,data:object|null){
    this.doc.getElementById(id)?.remove();
    if(!data)return;
    const script=this.doc.createElement('script');
    script.type='application/ld+json';script.id=id;script.text=JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  /** Adds schema.org breadcrumb data (Home › section › page) so search results can show the page's place in the site. */
  private setBreadcrumbs(path:string){
    this.doc.getElementById('seo-breadcrumb')?.remove();
    const data=breadcrumbData(path);
    if(!data)return;
    const script=this.doc.createElement('script');
    script.type='application/ld+json';script.id='seo-breadcrumb';
    script.text=JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  private setCanonical(url:string){
    let link=this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if(!link){link=this.doc.createElement('link');link.rel='canonical';this.doc.head.appendChild(link);}
    link.href=url;
  }

  /** Adds schema.org Article data for article pages so search engines can show them as articles. */
  private setArticleData(page:SeoPage,url:string,image:string){
    this.doc.getElementById('seo-article')?.remove();
    if(page.type!=='article')return;
    const script=this.doc.createElement('script');
    script.type='application/ld+json';script.id='seo-article';
    script.text=JSON.stringify({
      '@context':'https://schema.org','@type':'Article',
      headline:page.title.replace(/ \| PMPORT$/,''),description:page.description,image,url,mainEntityOfPage:url,
      datePublished:page.published,dateModified:page.published,inLanguage:'en-CA',author:{'@type':'Person',name:'Md Alamgir Hossain',url:`${SITE_URL}/about`},
      publisher:{'@type':'Organization',name:SITE_NAME,url:SITE_URL,logo:{'@type':'ImageObject',url:`${SITE_URL}/pmporticon.jpg`}}
    });
    this.doc.head.appendChild(script);
  }
}
