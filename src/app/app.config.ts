import {ApplicationConfig} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {TitleStrategy,provideRouter,withInMemoryScrolling} from '@angular/router';
import {SeoTitleStrategy} from './core/seo/seo-title.strategy';
import {routes} from './app.routes';
export const appConfig:ApplicationConfig={providers:[provideHttpClient(),provideRouter(routes,withInMemoryScrolling({scrollPositionRestoration:'top',anchorScrolling:'enabled'})),{provide:TitleStrategy,useClass:SeoTitleStrategy}]};
