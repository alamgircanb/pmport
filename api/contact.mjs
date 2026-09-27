// Vercel serverless function: validates a message and forwards it through Resend.
export default async function handler(request,response){
  if(request.method!=='POST')return response.status(405).json({message:'Method not allowed.'});
  const {name,email,subject,message,company}=request.body||{};
  // Honeypot: bots often fill this invisible field. Return success without sending.
  if(company)return response.status(200).json({ok:true});
  if(!name||!email||!subject||!message)return response.status(400).json({message:'Please complete every field.'});
  if(!/^\S+@\S+\.\S+$/.test(email))return response.status(400).json({message:'Enter a valid email address.'});
  const apiKey=process.env.RESEND_API_KEY;
  const to=process.env.CONTACT_TO_EMAIL||'alamgircanb@gmail.com';
  const from=process.env.CONTACT_FROM_EMAIL||'Portfolio <onboarding@resend.dev>';
  if(!apiKey)return response.status(503).json({message:'Contact delivery is not configured yet.'});
  const clean=value=>String(value).replace(/[<>]/g,'').slice(0,5000);
  const result=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:clean(email),subject:`Portfolio: ${clean(subject).slice(0,150)}`,text:`From: ${clean(name)} <${clean(email)}>\n\n${clean(message)}`})});
  if(!result.ok)return response.status(502).json({message:'Email provider rejected the message.'});
  return response.status(200).json({ok:true});
}
