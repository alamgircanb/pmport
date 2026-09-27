import {HttpClient} from '@angular/common/http';import {Injectable,inject} from '@angular/core';import {Observable} from 'rxjs';
@Injectable({providedIn:'root'}) export class ContentService{private readonly http=inject(HttpClient);load<T>(file:string):Observable<T>{return this.http.get<T>(`data/${file}`)}}
