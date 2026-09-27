import {Routes} from '@angular/router';
import {authGuard} from './core/auth/auth.guard';
export const routes:Routes=[
  {path:'',loadComponent:()=>import('./pages/home/home.component').then(m=>m.HomeComponent)},
  {path:'about',loadComponent:()=>import('./pages/about/about.component').then(m=>m.AboutComponent)},
  {path:'education',loadComponent:()=>import('./pages/education/education.component').then(m=>m.EducationComponent)},
  {path:'portfolio',loadComponent:()=>import('./pages/portfolio/portfolio.component').then(m=>m.PortfolioComponent)},
  {path:'pm-faciliter',loadComponent:()=>import('./pages/pm-faciliter/pm-faciliter.component').then(m=>m.PMFaciliterComponent)},
  {path:'pm-faciliter/member',canActivate:[authGuard],loadComponent:()=>import('./pages/member/member.component').then(m=>m.MemberComponent)},
  {path:'media',loadComponent:()=>import('./pages/media/media.component').then(m=>m.MediaComponent)},
  {path:'events',loadComponent:()=>import('./pages/events/events.component').then(m=>m.EventsComponent)},
  {path:'resources',loadComponent:()=>import('./pages/resources/resources.component').then(m=>m.ResourcesComponent)},
  {path:'credentials',loadComponent:()=>import('./pages/credentials/credentials.component').then(m=>m.CredentialsComponent)},
  {path:'contact',loadComponent:()=>import('./pages/contact/contact.component').then(m=>m.ContactComponent)},
  {path:'login',loadComponent:()=>import('./pages/auth/auth.component').then(m=>m.AuthComponent)},
  {path:'**',loadComponent:()=>import('./pages/not-found/not-found.component').then(m=>m.NotFoundComponent)}
];
