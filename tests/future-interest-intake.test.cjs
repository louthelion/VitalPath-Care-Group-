const test=require('node:test');
const assert=require('node:assert/strict');
const {normalizeFutureInterestSubmission:normalize}=require('../lib/future-interest-intake.cjs');
const base=()=>({formName:'vitalpath-future-service-interest',providerSubmissionId:'test_submission_001',fields:{'form-name':'vitalpath-future-service-interest','bot-field':'',full_name:'Synthetic Tester',email:'TEST@example.invalid',city_area:'Orlando',message:'General future interest only',consent:'on'}});
test('maps nonclinical synthetic inquiry without caller-controlled status',()=>{
 const v=normalize(base());
 assert.deepEqual(v.inquiry,{category:'future_service_interest',status:'new',full_name:'Synthetic Tester',email:'test@example.invalid',area:'Orlando',notes:'General future interest only'});
 assert.equal(v.providerSubmissionId,'test_submission_001');
});
test('rejects missing consent',()=>{const x=base();delete x.fields.consent;assert.throws(()=>normalize(x));});
test('rejects populated honeypot',()=>{const x=base();x.fields['bot-field']='robot';assert.throws(()=>normalize(x));});
test('rejects wrong form',()=>{const x=base();x.formName='vitalpath-request-services';assert.throws(()=>normalize(x));});
test('rejects mismatched hidden form-name',()=>{const x=base();x.fields['form-name']='wrong';assert.throws(()=>normalize(x));});
test('rejects client-provided category or assignment',()=>{for(const key of ['category','status','assigned_to','selected_price','diagnosis']){const x=base();x.fields[key]='x';assert.throws(()=>normalize(x));}});
test('rejects missing or invalid provider ID',()=>{for(const id of ['', 'a','bad id']){const x=base();x.providerSubmissionId=id;assert.throws(()=>normalize(x));}});
test('rejects oversized message',()=>{const x=base();x.fields.message='x'.repeat(2001);assert.throws(()=>normalize(x));});
test('rejects invalid email',()=>{const x=base();x.fields.email='not-an-email';assert.throws(()=>normalize(x));});
test('rejects unknown fields and arrays',()=>{const x=base();x.fields.payment='100';assert.throws(()=>normalize(x));const y=base();y.fields.full_name=['Alice'];assert.throws(()=>normalize(y));});
