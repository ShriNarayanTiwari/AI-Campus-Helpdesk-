import type { KnowledgeCategory, KnowledgeRecord } from '../types/campus.ts';
import { CLUBS_DIRECTORY, CAMPUS_EVENTS, DEMO_TIMETABLE } from './campusDirectory.ts';

export const fees = { tuition: { 'B.Tech': 120000, BCA: 80000, BBA: 76000 }, ac: 72000, standard: 48000, mess: 30000, deposit: 5000 };
export const money = (v: number) => '₹' + v.toLocaleString('en-IN');
export const total = (tuition: number, room: number, meals: boolean) => tuition + room + (meals ? fees.mess : 0) + (room ? fees.deposit : 0);
export const hours = { weekdays: '8 AM to 8 PM', Saturday: '9 AM to 6 PM', Sunday: '10 AM to 5 PM' };
export const exams = [
  {program:'B.Tech', semester:1, subject:'Engineering Mathematics', date:'2026-12-11'},
  {program:'B.Tech', semester:1, subject:'Digital Electronics', date:'2026-12-14'},
  {program:'BCA', semester:1, subject:'Programming Fundamentals', date:'2026-12-12'},
  {program:'BBA', semester:1, subject:'Business Communication', date:'2026-12-15'},
];
type Entry = [string, KnowledgeCategory, string, string, string];
const entries: Entry[] = [
 ['library','Library','Central Library','library library facilities books librarian','The Central Library has quiet desks, group-study rooms, printing and e-books. Bring your campus ID to borrow up to four books for 14 days.'],
 ...Object.entries(hours).map(([day,time]):Entry=>['hours-'+day,'Library',day+' library hours','library timings opening closing hours '+day,'The library is open '+time+' on '+day+'.']),
 ['hostel','Hostels & Mess','Hostel rooms','hostel accommodation residential hostel facilities laundry','Double AC and non-AC rooms include Wi-Fi, laundry access and a shared common room. Mess is a separate annual plan.'],
 ['rooms','Hostels & Mess','Room fees','hostel room fees compare double cheaper rent','Double non-AC costs '+money(fees.standard)+' per year and double AC costs '+money(fees.ac)+' per year. Both exclude mess. A refundable '+money(fees.deposit)+' deposit applies once.'],
 ['mess','Hostels & Mess','Mess plan','food mess dining meals include cheaper','Neither room includes mess. The optional mess plan costs '+money(fees.mess)+' per year for breakfast, lunch and dinner.'],
 ...Object.entries(fees.tuition).map(([p,v]):Entry=>['tuition-'+p,'Academics',p+' tuition',p+' tuition annual fee semester instalment',p+' tuition is '+money(v)+' per year, payable in two instalments of '+money(v/2)+'. Hostel and meals are optional extras.']),
 ['aid','Academics','Scholarships and refunds','scholarship refund payment','Students scoring 90% or higher in their qualifying exam can apply at the academic desk for a 10% tuition scholarship. Room deposits are refundable after clearance.'],
 ['services','Student Services','Student services','student services help desk','Student Services handles ID replacements, Wi-Fi faults, room maintenance and counselling appointments. Open Student Services to raise and track a ticket.'],
 ['wifi','Student Services','Wi-Fi support','wifi wi-fi internet network broken hostel','Reconnect to Cedarbrook Student Wi-Fi and sign in again. If it still fails, open Student Services and raise an IT & Wi-Fi ticket with your block and room.'],
 ['travel','Transport','Shuttle route','bus shuttle transport pass timings','The shuttle runs Main Gate → Market Square → Lake Stop every 30 minutes from 7 AM to 7 PM. A term pass costs ₹2,000 at the transport desk.'],
 ['map','Campus Facilities','Main Gate to Central Library','directions walk map main gate route library','Walk from Main Gate to Welcome Court, turn left at Science Hall and follow the courtyard path to the Central Library entrance.'],
 ['fac','Campus Facilities','Campus facilities','facilities campus sports labs medical','Facilities include the Central Library, computing labs, sports courts, residential halls and a health desk at Welcome Court.'],
 ['id-card','Student Services','Replacement ID card','lost id card replacement reissue identity','For a lost ID, raise a Student Welfare ticket with your programme and year. The Welcome Court desk issues a replacement in two working days for ₹100.'],
 ['repair','Student Services','Room repairs','maintenance broken tap plumbing light fan repair','For a room repair, choose Hostel & Mess in Student Services. Include your block, room and the faulty item; you can follow the status in the ticket tracker.'],
 ['care','Student Services','Counselling appointments','counselling counseling counsellor stress appointment','Request a private appointment at the wellbeing desk in Welcome Court, Monday to Friday, 10 AM to 4 PM.'],
 ['health','Campus Facilities','Health desk','medical clinic nurse health sick','The health desk is in Welcome Court. It offers first-aid assistance from 8 AM to 6 PM on teaching days.'],
 ['sports','Campus Facilities','Sports courts','sports basketball badminton courts gym','Book a one-hour court slot at the sports desk beside Science Hall. Badminton and basketball courts open from 6 AM to 8 PM.'],
 ['labs','Campus Facilities','Computing labs','engineering computer computing lab computers practical','Computing labs are on the ground floor of Science Hall. Bring your student ID; supervised open practice runs weekdays from 4 PM to 6 PM.'],
 ['laundry','Hostels & Mess','Laundry collection','laundry washing clothes hostel','Drop labelled clothes at the residential laundry counter on Tuesday or Friday, 7 AM to 9 AM. Collect them the following evening.'],
 ['print','Library','Printing','printing printer photocopy scan','Printing is available beside the library issue desk at ₹2 per black-and-white page. Bring your campus ID.'],
 ['study','Library','Group-study bookings','group study booking reserve rooms','Reserve a group-study room at the library desk for up to two hours. Bring the IDs of at least two group members.'],
 ['meal-hours','Hostels & Mess','Dining hours','breakfast lunch dinner mess timings','Breakfast runs 7:30–9 AM, lunch 12:30–2 PM and dinner 7:30–9 PM in the residential dining hall.'],
 ['department','Academics','Programmes and departments','courses programmes department admission','Cedarbrook offers B.Tech through Engineering, BCA through Computing and BBA through Business Studies.'],
 ['intern','Placements','Internship applications','internships apply cv application portfolio','Bring a one-page CV and a project sample to the Career Studio. Internship application reviews run Wednesdays at 3 PM.'],
 ['welcome','Campus Life','First-week checklist','orientation fresher induction checklist','Collect your ID at Welcome Court, activate student Wi-Fi, check your timetable in Academics and pick a club to visit.'],
 ['career','Placements','Career studio','placements internship careers workshops','The Career Studio runs Friday résumé clinics, mock interviews and internship workshops in Science Hall. Bring a draft résumé.'],
 ['clubs','Clubs & Societies','Clubs you can join','clubs societies join','You can join '+CLUBS_DIRECTORY.map(c=>c.name).join(', ')+'. Open Clubs, select a club and choose Register Interest.'],
 ...CLUBS_DIRECTORY.map((c):Entry=>[c.id,'Clubs & Societies',c.name,c.name,c.description+' '+c.demoSchedule+' '+c.demoVenueNote]),
 ...CAMPUS_EVENTS.map((e):Entry=>[e.id,'Campus Events',e.title,e.title+' event',e.title+' takes place on '+e.date+' at '+e.startTime+' in '+e.venue+'. RSVP in Events.']),
 ...DEMO_TIMETABLE.map((s,i):Entry=>['slot-'+i,'Academics',s.subject,s.day+' timetable '+s.subject,s.day+' '+s.time+' · '+s.subject+' · '+s.room+'.']),
];
export const records: KnowledgeRecord[] = entries.map(([id,category,title,tags,content])=>({id,category,title,content,description:content,keywords:tags.split(' '),tags:tags.split(' '),subcategory:category,sourceName:'Campus handbook',sourceUrl:'',sourceType:'demo',sourceLabel:'Prototype sample',verificationStatus:'Prototype sample',lastReviewedDate:'2026-11-24',lastChecked:'2026-11-24',isPrototypeSample:true}));
