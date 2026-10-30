// Source-level safety checks for the draft future-interest page.
// Run: node --test tests/future-interest-safety.test.cjs
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','request-services.html'),'utf8');
test('page clearly identifies itself as future interest',()=>{
  assert.match(html,/<h1>Future Service Interest<\/h1>/i);
  assert.match(html,/not (?:currently )?(?:taking|accepting).*?(?:bookings|deposits)/i);
});
test('future-interest Netlify form has consent and spam defense',()=>{
  assert.match(html, /action="\/confirmation"/i);
  assert.match(html,/<form\b[^>]*name="vitalpath-future-service-interest"[^>]*method="POST"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"/i);
  assert.match(html,/name="form-name" value="vitalpath-future-service-interest"/);
  assert.match(html,/name="bot-field"/);
  assert.match(html,/name="consent"[^>]*required/);
});
test('form does not request payments, bookings or clinical records',()=>{
  const form=html.match(/<form\b[^>]*name="vitalpath-future-service-interest"[\s\S]*?<\/form>/i)?.[0];
  assert.ok(form,'future-interest form exists');
  assert.doesNotMatch(form,/name="(?:selected_price|selected_package|deposit|diagnosis|medical_history|card_number)"/i);
  assert.match(form,/Do not send medical details/i);
});
