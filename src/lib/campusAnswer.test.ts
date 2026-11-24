import test from 'node:test';
import assert from 'node:assert/strict';
import {answer} from './campusAnswer';
import {fees,total,money,records} from '../data/cedar';

test('Sunday follow-up uses the requested field and can be shortened',()=>{
 const a=answer('Tell me about the libary');
 const b=answer('What about Sunday?',[{role:'assistant',content:a}]);
 assert.match(b,/10 AM to 5 PM/);
 assert.ok(answer('Say it in one line',[{role:'assistant',content:b}]).length<b.length);
});
test('Hinglish fees and totals agree with the calculator',()=>{
 assert.match(answer('hostel ki fees kitni hai?'),/48,000/);
 assert.ok(answer('Total B.Tech double AC with mess').includes(money(total(fees.tuition['B.Tech'],fees.ac,true))));
 assert.match(answer('Does the cheaper one include mess?'),/Neither.*30,000/);
});
test('exam dates respect the programme, semester and clock',()=>{
 assert.match(answer('What is my next exam?'),/programme and semester/);
 assert.match(answer('BCA semester 1',[{role:'user',content:'next exam'}],'2026-12-01'),/2026-12-12/);
 assert.match(answer('next exam B.Tech semester 1',[],'2027-01-01'),/no upcoming/i);
});
test('library directions, unsupported questions and explicit topic switches',()=>{
 assert.match(answer('Directions from main gate to library'),/Welcome Court.*Science Hall/);
 assert.match(answer('What is the unicorn policy?'),/don’t have/);
 assert.match(answer('Tell me about student services',[{role:'assistant',content:answer('What clubs can I join?')}]),/ID replacements/);
});
test('evidence refers to an active handbook record',()=>{
 const ids=new Set<string>();
 answer('Library Sunday hours',[],undefined,records,ids);
 assert.deepEqual([...ids],['hours-Sunday']);
 assert.equal(new Set(records.map(r=>r.id)).size,records.length);
});
