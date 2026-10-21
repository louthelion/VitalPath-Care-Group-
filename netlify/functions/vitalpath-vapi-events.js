// VitalPath Vapi event receiver. Production is DISABLED until three Netlify
// environment variables are configured; no secret belongs in GitHub.
// Configure Vapi's saved phone-number/assistant Server URL with a Bearer
// credential and subscribe ONLY to status-update and end-of-call-report.
// This is a separate public Netlify site, not the SSO-protected dashboard.
const {timingSafeEqual}=require('node:crypto');
const URL='https://gluvpnusvgfkfcwutdbk.supabase.co';
const reply=(statusCode,body)=>({statusCode,headers:{'content-type':'application/json','cache-control':'no-store'},body:JSON.stringify(body)});
const equal=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);};
const post=async(path,body,key)=>{
 const r=await fetch(URL+'/rest/v1/'+path,{method:'POST',headers:{apikey:key,authorization:'Bearer '+key,'content-type':'application/json',prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body),signal:AbortSignal.timeout(7000)});
 if(!r.ok)throw Error('database_write_failed');
 return r.json();
};
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return reply(405,{error:'method_not_allowed'});
 const key=process.env.VITALPATH_SUPABASE_SERVER_KEY;
 const token=process.env.VITALPATH_VAPI_BEARER_TOKEN;
 const phoneId=process.env.VITALPATH_VAPI_PHONE_NUMBER_ID;
 if(!key||!token||!phoneId)return reply(503,{error:'integration_not_configured'});
 const auth=event.headers?.authorization||event.headers?.Authorization||'';
 if(!equal(auth,'Bearer '+token))return reply(401,{error:'unauthorized'});
 if(Buffer.byteLength(event.body||'','utf8')>65536)return reply(413,{error:'payload_too_large'});
 let data;
 try{data=JSON.parse(event.body||'');}catch{return reply(400,{error:'invalid_json'});}
 const m=data?.message;
 if(!m||typeof m!=='object')return reply(400,{error:'invalid_message'});
 // Restrict event processing to the assigned Vapi phone-number resource.
 const incomingPhoneId=m.phoneNumber?.id||m.call?.phoneNumberId;
 if(incomingPhoneId!==phoneId)return reply(403,{error:'wrong_phone_number'});
 const callId=m.call?.id;
 if(typeof callId!=='string'||! /^[a-zA-Z0-9-]{8,100}$/.test(callId))return reply(400,{error:'invalid_call_id'});
 let kind;
 if(m.type==='status-update'&&m.status==='in-progress')kind='call_started';
 else if(m.type==='status-update'&&m.status==='ended')kind='call_ended';
 else if(m.type==='end-of-call-report')kind='call_ended';
 else return reply(202,{accepted:false,reason:'unsupported_event'});
 // A stable idempotency key avoids duplicate records on Vapi retries.
 const eventId=callId+':'+kind;
 const occurred=new Date().toISOString(); // server receipt, not provider timestamp
 try{
  const rows=await post('vp_call_events?on_conflict=provider,provider_event_id',{
   provider:'vapi',provider_call_id:callId,event_type:kind,
   provider_event_id:eventId,occurred_at:occurred,company_slug:'vitalpath_care_group'
  },key);
  if(!Array.isArray(rows)||rows.length!==1||!Number.isInteger(rows[0].id))throw Error('event_not_recorded');
  // Every completed call becomes a minimal, unassigned review task.
  // No recording, transcript, caller phone, or health information is stored.
  if(kind==='call_ended')await post('vp_call_followups?on_conflict=event_id',{event_id:rows[0].id,task_status:'pending'},key);
  return reply(200,{accepted:true});
 }catch{return reply(503,{error:'event_storage_unavailable'});}
};
