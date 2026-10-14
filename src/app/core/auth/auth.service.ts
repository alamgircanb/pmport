import {Injectable,signal} from '@angular/core';
import type {Session,SupabaseClient,User} from '@supabase/supabase-js';
import {environment} from '../../../environments/environment';
@Injectable({providedIn:'root'})
export class AuthService{
  /** The Supabase library is downloaded only when it is first needed, keeping it out of the first page load. */
  private client:SupabaseClient|null=null;
  private clientPromise:Promise<SupabaseClient|null>|null=null;
  private getClient():Promise<SupabaseClient|null>{
    if(!this.configured)return Promise.resolve(null);
    return this.clientPromise??=import('@supabase/supabase-js').then(m=>this.client=m.createClient(environment.supabaseUrl,environment.supabaseAnonKey));
  }
  readonly user=signal<User|null>(null);readonly ready=signal(false);get configured():boolean{return !!(environment.supabaseUrl&&environment.supabaseAnonKey)}
  readonly whenReady:Promise<void>=this.initialize().catch(()=>this.ready.set(true));
  private async initialize():Promise<void>{const client=await this.getClient();if(!client){this.ready.set(true);return}const {data}=await client.auth.getSession();this.applySession(data.session);client.auth.onAuthStateChange((_event,session)=>this.applySession(session));this.ready.set(true)}
  private applySession(session:Session|null):void{this.user.set(session?.user??null)}
  async signIn(email:string,password:string):Promise<string|null>{const client=await this.getClient();if(!client)return 'Authentication is not configured. Add your Supabase project values to src/environments/environment.ts.';const {error}=await client.auth.signInWithPassword({email,password});return error?.message??null}
  async signUp(email:string,password:string):Promise<string|null>{const client=await this.getClient();if(!client)return 'Authentication is not configured. Add your Supabase project values to src/environments/environment.ts.';const {error}=await client.auth.signUp({email,password});return error?.message??null}
  async signOut():Promise<void>{const client=await this.getClient();if(client)await client.auth.signOut();this.user.set(null)}
}
