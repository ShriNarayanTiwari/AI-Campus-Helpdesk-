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

test('two-turn fee structure flow parses compound BTech CSE + single room reply completely',()=>{
 const turn1=answer('What is the fee structure?');
 assert.match(turn1,/programme/i);
 assert.match(turn1,/room type/i);

 const ids=new Set<string>();
 const turn2=answer(
  'BTech CSE + single room',
  [
   {role:'user',content:'What is the fee structure?'},
   {role:'assistant',content:turn1},
  ],
  undefined,
  records,
  ids
 );

 // Proper formatted Indian currency and explicit billing periods, never "per unit"
 assert.doesNotMatch(turn2,/per unit/i);
 assert.match(turn2,/₹1,20,000\/year \(₹60,000\/semester\)/);
 assert.match(turn2,/\[Sample Demo Data — verify official GLA University Mathura fee circular\]/);

 // Structured separate bullets for Tuition, Hostel & Room Type, Optional Mess / Deposit
 assert.match(turn2,/- \*\*Tuition Fee \(B\.Tech CSE\):\*\*/);
 assert.match(turn2,/- \*\*Hostel & Room Type Fee \(Single Room\):\*\*/);
 assert.match(turn2,/- \*\*Optional Mess \/ Deposit:\*\*/);

 // Explicitly notes unlisted single room, shows available sample room options, directs to GLA Hostel Office / portal
 assert.match(turn2,/Single room fees are not listed in this demo knowledge base/i);
 assert.match(turn2,/Double Non-AC at ₹48,000\/year \(₹24,000\/semester\)/);
 assert.match(turn2,/Double AC at ₹72,000\/year \(₹36,000\/semester\)/);
 assert.match(turn2,/GLA University Mathura Hostel Office/i);
 assert.match(turn2,/₹30,000\/year \(₹15,000\/semester\)/);
 assert.match(turn2,/₹5,000/);

 // No raw URLs embedded inside the answer text (links stay strictly below the answer)
 assert.doesNotMatch(turn2,/https?:\/\//i);

 // Evidence IDs include tuition, rooms, and mess records
 assert.ok(ids.has('tuition-B.Tech'));
 assert.ok(ids.has('rooms'));
 assert.ok(ids.has('mess'));
});

test('multi-turn fee structure handles listed room total, unlisted programme, 3-turn merge, and topic switches',()=>{
 const turn1=answer('What is the fee structure?');

 // Listed programme + listed room computes first-year total
 const doubleAc=answer('BTech CSE + double AC',[
  {role:'user',content:'What is the fee structure?'},
  {role:'assistant',content:turn1},
 ]);
 assert.match(doubleAc,/₹72,000\/year \(₹36,000\/semester\)/);
 assert.match(doubleAc,/₹1,97,000/);
 assert.match(doubleAc,/₹2,27,000/);

 // Unlisted programme + unlisted room explicitly notes both
 const unlisted=answer('MBA + single room',[
  {role:'user',content:'What is the fee structure?'},
  {role:'assistant',content:turn1},
 ]);
 assert.match(unlisted,/MBA tuition fees are not listed in this demo knowledge base/i);
 assert.match(unlisted,/Single room fees are not listed in this demo knowledge base/i);

 // 3-turn progressive slot fill preserves programme across turns
 const turn2ProgramOnly=answer('BTech CSE',[
  {role:'user',content:'What is the fee structure?'},
  {role:'assistant',content:turn1},
 ]);
 const turn3Single=answer('What about single room?',[
  {role:'user',content:'What is the fee structure?'},
  {role:'assistant',content:turn1},
  {role:'user',content:'BTech CSE'},
  {role:'assistant',content:turn2ProgramOnly},
 ]);
 assert.match(turn3Single,/Tuition Fee \(B\.Tech CSE\)/);
 assert.match(turn3Single,/Single room fees are not listed in this demo knowledge base/i);

 // Explicit topic switch after fee clarifying question is not hijacked
 const switched=answer('Tell me about the library',[
  {role:'user',content:'What is the fee structure?'},
  {role:'assistant',content:turn1},
 ]);
 assert.match(switched,/Central Library/);
});

