import {Routes} from '@angular/router';
import {authGuard} from './core/auth/auth.guard';
const unsaved=(component:{dirty?:boolean})=>!component.dirty||confirm('You have unsaved changes. Leave this page? Save or download a copy first to keep them.');
export const routes:Routes=[
  {path:'',loadComponent:()=>import('./pages/home/home.component').then(m=>m.HomeComponent)},
  {path:'about-pmport',loadComponent:()=>import('./pages/about-pmport/about-pmport.component').then(m=>m.AboutPMPortComponent)},
  {path:'resources/future-project-management-canada',loadComponent:()=>import('./pages/article/article.component').then(m=>m.ArticleComponent)},
  {path:'resources/111-essential-pmp-mindsets',loadComponent:()=>import('./pages/pmp-mindsets-article/pmp-mindsets-article.component').then(m=>m.PmpMindsetsArticleComponent),title:'111 Essential PMP Mindsets | PMPORT'},
  {path:'pm-tools/diagram-studio',canDeactivate:[unsaved],loadComponent:()=>import('./pages/diagram/diagram.component').then(m=>m.DiagramComponent)},
  {path:'pm-tools/pert-cpm',canDeactivate:[unsaved],loadComponent:()=>import('./pages/pert/pert.component').then(m=>m.PertComponent)},
  {path:'portfolio/course-work',data:{area:'course'},loadComponent:()=>import('./pages/portfolio/portfolio.component').then(m=>m.PortfolioComponent)},
  {path:'portfolio/professional-work',data:{area:'professional'},loadComponent:()=>import('./pages/portfolio/portfolio.component').then(m=>m.PortfolioComponent)},
  {path:'about',loadComponent:()=>import('./pages/about/about.component').then(m=>m.AboutComponent)},
  {path:'education',loadComponent:()=>import('./pages/education/education.component').then(m=>m.EducationComponent)},
  {path:'portfolio',loadComponent:()=>import('./pages/portfolio/portfolio.component').then(m=>m.PortfolioComponent)},
  {path:'pm-tools',canDeactivate:[unsaved],loadComponent:()=>import('./pages/pm-tools/pm-tools.component').then(m=>m.PMToolsComponent)},
  {path:'pm-faciliter',loadComponent:()=>import('./pages/pm-faciliter/pm-faciliter.component').then(m=>m.PMFaciliterComponent)},
  {path:'pm-faciliter/member',canActivate:[authGuard],loadComponent:()=>import('./pages/member/member.component').then(m=>m.MemberComponent)},
  {path:'media',loadComponent:()=>import('./pages/media/media.component').then(m=>m.MediaComponent)},
  {path:'events',loadComponent:()=>import('./pages/events/events.component').then(m=>m.EventsComponent)},
  {path:'resources',loadComponent:()=>import('./pages/resources/resources.component').then(m=>m.ResourcesComponent)},
  {path:'credentials',loadComponent:()=>import('./pages/credentials/credentials.component').then(m=>m.CredentialsComponent)},
  {path:'contact',redirectTo:'about-pmport',pathMatch:'full'},
  {path:'login',loadComponent:()=>import('./pages/auth/auth.component').then(m=>m.AuthComponent)},
  {path:'**',loadComponent:()=>import('./pages/not-found/not-found.component').then(m=>m.NotFoundComponent)}
];
