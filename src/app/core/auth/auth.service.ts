import {Injectable,signal} from '@angular/core';
import {createClient,Session,SupabaseClient,User} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment';
@Injectable({providedIn:'root'})
export class AuthService{
  private readonly client:SupabaseClient|null=environment.supabaseUrl&&environment.supabaseAnonKey?createClient(environment.supabaseUrl,environment.supabaseAnonKey):null;
  readonly user=signal<User|null>(null);readonly ready=signal(false);get configured():boolean{return !!this.client}
  constructor(){void this.initialize()}
  private async initialize():Promise<void>{if(!this.client){this.ready.set(true);return}const {data}=await this.client.auth.getSession();this.applySession(data.session);this.client.auth.onAuthStateChange((_event,session)=>this.applySession(session));this.ready.set(true)}
  private applySession(session:Session|null):void{this.user.set(session?.user??null)}
  async signIn(email:string,password:string):Promise<string|null>{if(!this.client)return 'Authentication is not configured. Add your Supabase project values to src/environments/environment.ts.';const {error}=await this.client.auth.signInWithPassword({email,password});return error?.message??null}
  async signUp(email:string,password:string):Promise<string|null>{if(!this.client)return 'Authentication is not configured. Add your Supabase project values to src/environments/environment.ts.';const {error}=await this.client.auth.signUp({email,password});return error?.message??null}
  async signOut():Promise<void>{if(this.client)await this.client.auth.signOut();this.user.set(null)}
}
