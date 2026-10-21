// Run from repository root: node --test tests/vitalpath-vapi-events.test.js
// Offline tests: no Vapi or Supabase requests are made.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {handler}=require('../netlify/functions/vitalpath-vapi-events');
const saved={key:process.env.VITALPATH_SUPABASE_SERVER_KEY,token:process.env.VITALPATH_VAPI_BEARER_TOKEN,phone:process.env.VITALPATH_VAPI_PHONE_NUMBER_ID};
const reset=()=>{for(const [k,v] of Object.entries({VITALPATH_SUPABASE_SERVER_KEY:saved.key,VITALPATH_VAPI_BEARER_TOKEN:saved.token,VITALPATH_VAPI_PHONE_NUMBER_ID:saved.phone})) {if(v===undefined)delete process.env[k];else process.env[k]=v;}};
const payload=(phone='assigned-phone',type='end-of-call-report')=>JSON.stringify({message:{type,phoneNumber:{id:phone},call:{id:'call-12345678'}}});
const request=(body,headers={authorization:'Bearer mock-token'})=>handler({httpMethod:'POST',headers,body});
test('integration stays disabled without server secrets',async()=>{delete process.env.VITALPATH_SUPABASE_SERVER_KEY;delete process.env.VITALPATH_VAPI_BEARER_TOKEN;delete process.env.VITALPATH_VAPI_PHONE_NUMBER_ID;try{assert.equal((await request(payload())).statusCode,503);}finally{reset();}});
test('rejects unauthorized caller',async()=>{process.env.VITALPATH_SUPABASE_SERVER_KEY='mock-key';process.env.VITALPATH_VAPI_BEARER_TOKEN='mock-token';process.env.VITALPATH_VAPI_PHONE_NUMBER_ID='assigned-phone';try{assert.equal((await request(payload(),{authorization:'Bearer wrong'})).statusCode,401);}finally{reset();}});
test('rejects cross-company phone events before storage',async()=>{process.env.VITALPATH_SUPABASE_SERVER_KEY='mock-key';process.env.VITALPATH_VAPI_BEARER_TOKEN='mock-token';process.env.VITALPATH_VAPI_PHONE_NUMBER_ID='assigned-phone';try{assert.equal((await request(payload('other-company'))).statusCode,403);}finally{reset();}});
test('completed call stores minimal event and idempotent follow-up',async()=>{
 process.env.VITALPATH_SUPABASE_SERVER_KEY='mock-key';process.env.VITALPATH_VAPI_BEARER_TOKEN='mock-token';process.env.VITALPATH_VAPI_PHONE_NUMBER_ID='assigned-phone';
 const old=global.fetch;const writes=[];
 global.fetch=async(url,options)=>{writes.push({url:String(url),headers:options.headers,body:JSON.parse(options.body)});return {ok:true,json:async()=>[{id:7}]};};
 try{const r=await request(payload());assert.equal(r.statusCode,200);assert.equal(writes.length,2);assert.equal(writes[0].body.provider_call_id,'call-12345678');assert.equal(writes[0].body.event_type,'call_ended');assert.ok(!('transcript' in writes[0].body));assert.ok(!('recording' in writes[0].body));assert.equal(writes[1].body.event_id,7);assert.match(writes[1].headers.prefer,/ignore-duplicates/);}finally{global.fetch=old;reset();}
});
