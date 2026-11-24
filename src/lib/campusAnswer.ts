import { records, exams, fees, money, total } from '../data/cedar.ts';
import type { ChatMessage } from '../types/campus.ts';

export function answer(question:string, history:Pick<ChatMessage,'role'|'content'>[]=[], day=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}), catalog=records, used=new Set<string>()) {
  const q=question.toLowerCase().replace(/wi[ -]fi/g,'wifi').replace(/lib(?:ary|rery)/g,'library').replace(/hostle/g,'hostel').replace(/b[. ]?tech/g,'b.tech');
  const last=history.filter(m=>m.role==='assistant').at(-1)?.content || '';
  const previous=history.filter(m=>m.role==='user').at(-1)?.content.toLowerCase() || '';
  const fact=(id:string)=>{const record=catalog.find(r=>r.id===id);if(record)used.add(id);return record?.content || 'That detail is missing from the campus handbook.';};
  if (/one line|shorter|short version|briefly repeat/.test(q)) return last.match(/The library is open (.+?) on (Sunday|Saturday|weekdays)/i)?.slice(1).reverse().join(': ') || last.split(/(?<=\.)\s|\n/)[0] || 'Which campus topic should I summarise?';
  if (/^(hi|hey|hello|namaste)\b|what can you do/.test(q)) return 'Hi! I can help you find a room, compare fees, check library hours, join a club or track a campus ticket. What do you need?';
  if (/my (marks|attendance|grades)|nonexistent|doesn.t exist|non-existent|unicorn|teleport|made.up/.test(q)) return 'I don’t have that information in the campus handbook.';
  const program=(Object.keys(fees.tuition) as (keyof typeof fees.tuition)[]).find(p=>q.includes(p.toLowerCase()));
  if (program && /total|budget|altogether/.test(q)) {
    const room=/non[ -]?ac/.test(q)?fees.standard:/\bac\b/.test(q)?fees.ac:0;
    if(!room && /hostel|room/.test(q)) return 'Which room type, double AC or double non-AC?';
    const meals=/mess|meals/.test(q)&&!/without (mess|meals)/.test(q);
    return 'Your first-year total is '+money(total(fees.tuition[program],room,meals))+', including '+money(fees.tuition[program])+' tuition'+(room?', '+money(room)+' for the room and a '+money(fees.deposit)+' refundable deposit':'')+(meals?', plus '+money(fees.mess)+' for meals':'')+'.';
  }
  if (/exam|semester|sem\b|b\.tech|bca|bba/.test(q) && (/next exam|exam schedule|when.*exam/.test(q)||/exam/.test(previous)||/programme and semester/.test(last))) {
    const scope=q+' '+previous;
    const program=Object.keys({ 'b.tech':1,bca:1,bba:1 }).find(p=>scope.includes(p));
    const sem=scope.match(/sem(?:ester)?\s*([1-8])|([1-8])(?:st|nd|rd|th)\s*sem/);
    if(!program||!sem) return 'Which programme and semester should I check?';
    const e=exams.filter(e=>e.program.toLowerCase()===program && e.semester===Number(sem[1]||sem[2]) && e.date>=day).sort((a,b)=>a.date.localeCompare(b.date))[0];
    return e ? 'Your next listed exam is '+e.subject+' on '+e.date+'.' : 'There are no upcoming exams listed for that programme and semester.';
  }
  if (/policy|rule/.test(q) && !/refund|borrow|payment/.test(q)) return 'I don’t have that policy in the campus handbook.';
  if (/print|photocopy/.test(q)) return fact('print');
  if (/group.study|study room/.test(q)) return fact('study');
  if (/laundry|washing clothes/.test(q)) return fact('laundry');
  if (/breakfast|dinner|lunch|mess.*(?:timing|hours|open)/.test(q)) return fact('meal-hours');
  if (/wifi|internet/.test(q)) return fact('wifi');
  if (/route|directions|how do i get/.test(q) && /main gate/.test(q) && !/library/.test(q)) return 'Which destination do you mean? I have the walking route from Main Gate to Central Library.';
  if (/main gate|direction.*library/.test(q)) return fact('map');
  if (/club|societ|meet|join/.test(q)){
    const specific=catalog.find(r=>r.category==='Clubs & Societies'&&r.id!=='clubs'&&q.includes(r.title.toLowerCase()));
    if(specific)return specific.content+' Select Register Interest on its club card to join.';
  }
  if (/student services/.test(q)) return fact('services');
  if (/clubs? (can|are)|what clubs|join a club/.test(q)) return fact('clubs');
  if (/mess|meals/.test(q) && !/breakfast|lunch|dinner/.test(q)) return fact('mess');
  if (/hostel|double|room/.test(q) && /fee|kitn|cost|price|cheaper|compare/.test(q) || /cheaper/.test(q)&&/double/i.test(last)) return fact('rooms');
  if (/fee|tuition|instalment/.test(q)||/which programme or room type/i.test(last)) {
    const p=['B.Tech','BCA','BBA'].find(p=>q.includes(p.toLowerCase()));
    if(p) return fact('tuition-'+p);
    if (/fee|tuition/.test(q)) return 'Which programme or room type would you like the fee for?';
  }
  if ((/library/.test(q)||/library/i.test(last)&&/sunday|saturday|weekday|timing|weekend|hours|it close/.test(q)) && /sunday|saturday|weekday|timing|weekend|hours|open|clos/.test(q)) {
    const days=/sunday/.test(q)?['Sunday']:/saturday/.test(q)?['Saturday']:/weekend/.test(q)?['Saturday','Sunday']:/weekday/.test(q)?['weekdays']:['weekdays','Saturday','Sunday'];
    return days.map(d=>fact('hours-'+d)).join(' ');
  }
  if (/^.*\blibrary\b/.test(q) && /tell me|about|borrow|books|facilities/.test(q)) return fact('library');
  if (/events?/.test(q) && /upcoming|what|next/.test(q)) return catalog.filter(r=>r.category==='Campus Events' && (r.content.match(/\d{4}-\d\d-\d\d/)?.[0]||'')>=day).slice(0,3).map(r=>r.content).join('\n') || 'No upcoming events are listed.';
  if (/hostel|residential hall/.test(q) && /about|facilit|options/.test(q)) return fact('hostel');
  if (/timetable|class schedule/.test(q)) {const slots=catalog.filter(r=>r.id.startsWith('slot-')); const day=q.match(/monday|tuesday|wednesday|thursday|friday/i)?.[0];return (day?slots.filter(r=>r.content.toLowerCase().startsWith(day)):slots).map(r=>r.content).join('\n') || 'No classes are listed for that day.';}
  const words=q.match(/[a-z0-9]+/g)?.filter(w=>w.length>2&&!['the','tell','what','about','can','with','and','does','you','how','are','that','for','its','have'].includes(w))||[];
  const ranked=catalog.map(r=>({r,score:words.reduce((n,w)=>n+(r.title.toLowerCase().split(/\W+/).includes(w)?3:r.keywords.includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score);
  return ranked[0]?.score ? fact(ranked[0].r.id) : 'I don’t have that detail in the campus handbook. I can help with facilities, fees, classes, clubs, events or student services.';
}
