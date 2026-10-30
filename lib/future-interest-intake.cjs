'use strict';
// Pure validation/mapping only. Not a public endpoint or a database writer.
// Call only after a separate trusted adapter verifies the provider submission.
const FORM_NAME = 'vitalpath-future-service-interest';
const ALLOWED = new Set(['full_name','email','city_area','message','consent','bot-field','form-name']);
const FORBIDDEN = new Set(['selected_price','selected_package','deposit','diagnosis','medical_history','card_number','assigned_to','status','category']);
function fail(reason){const error=new Error(reason);error.code='INVALID_INTAKE';throw error;}
function clean(value,limit,field){
  if(typeof value!=='string') fail(field+' must be text');
  const trimmed=value.trim();
  if(!trimmed || trimmed.length>limit || /[\u0000-\u001f\u007f]/.test(trimmed)) fail(field+' is invalid');
  return trimmed;
}
function normalizeFutureInterestSubmission(input){
  if(!input || typeof input!=='object' || Array.isArray(input)) fail('missing verified submission');
  const {formName,providerSubmissionId,fields}=input;
  if(formName!==FORM_NAME) fail('unrecognized form');
  const id=clean(providerSubmissionId,128,'provider submission id');
  if(id.length<8 || !/^[a-zA-Z0-9_-]+$/.test(id)) fail('invalid provider submission id');
  if(!fields || typeof fields!=='object' || Array.isArray(fields)) fail('missing form fields');
  for(const key of Object.keys(fields)){
    if(FORBIDDEN.has(key) || !ALLOWED.has(key)) fail('unexpected field');
  }
  if(fields['form-name']!==undefined && fields['form-name']!==FORM_NAME) fail('form name mismatch');
  if(fields['bot-field']!==undefined && fields['bot-field']!=='') fail('spam field populated');
  if(!['on','true','yes','1'].includes(String(fields.consent).toLowerCase())) fail('consent required');
  const full_name=clean(fields.full_name,120,'full name');
  const email=clean(fields.email,254,'email').toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('invalid email');
  const area=clean(fields.city_area,120,'area');
  const notes=clean(fields.message,2000,'message');
  return Object.freeze({
    providerSubmissionId:id,
    consentConfirmed:true, // NOT durable evidence; store verified consent separately before ingestion
    inquiry:Object.freeze({category:'future_service_interest',status:'new',full_name,email,area,notes})
  });
}
module.exports={FORM_NAME,normalizeFutureInterestSubmission};
