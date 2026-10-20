/**
 * Sends a Google Analytics 4 event (the gtag snippet is in src/index.html).
 * Safe to call anywhere: it does nothing if analytics is blocked or not loaded yet.
 * In GA4, mark the events you care about as Key events (Admin › Events).
 */
export function trackEvent(name:string,params:Record<string,string|number>={}):void{
  try{const gtag=(window as unknown as {gtag?:(...args:unknown[])=>void}).gtag;gtag?.('event',name,params)}catch{}
}
