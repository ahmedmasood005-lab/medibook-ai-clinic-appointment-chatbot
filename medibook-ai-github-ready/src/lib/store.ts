import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { hashSync } from "bcryptjs";
import type { Appointment, Audit, DataStore, Department, Doctor, Patient, RoleName } from "./types";

const dataFile = path.join(process.cwd(), "data", "medibook.json");
let queue = Promise.resolve();
const names = ["Ali Khan","Ayesha Malik","Usman Raza","Sara Ahmed","Hamza Iqbal","Hina Zahra","Omar Farooq","Maham Noor","Bilal Tariq","Sana Fatima","Zain Abbas","Mehwish Ali"];
const departmentSeed: Array<[string,string,number]> = [
  ["General Medicine","Primary care and general health consultations",30],["Cardiology","Heart and cardiovascular care",30],
  ["Dermatology","Skin, hair and nail consultations",25],["Pediatrics","Child and adolescent healthcare",30],
  ["Gynecology","Women’s health appointments",30],["Orthopedics","Bone, joint and mobility care",40],
  ["ENT","Ear, nose and throat consultations",25],["Dental Care","Preventive and restorative dental care",40],
];
const specialties = ["Internal Medicine","Interventional Cardiology","Clinical Dermatology","Child Health","Obstetrics","Sports Orthopedics","Otolaryngology","Restorative Dentistry","Family Medicine","Cardiac Electrophysiology","Pediatric Dermatology","Neonatology"];

function seed(): DataStore {
  const departments: Department[] = departmentSeed.map(([name,description,duration],i)=>({id:`dep-${i+1}`,name,description,duration,active:true}));
  const doctors: Doctor[] = specialties.map((specialization,i)=>({id:`doc-${i+1}`,name:`Dr. ${names[(i+3)%names.length]}`,title:i%3===0?"Consultant":"Specialist",departmentId:departments[i%8].id,specialization,gender:i%2?"Female":"Male",fee:2500+(i%5)*500,duration:departments[i%8].duration,active:i!==11,hours:{days:[1,2,3,4,5,6],start:"09:00",end:"17:00"},break:{start:"13:00",end:"14:00"}}));
  const patients: Patient[] = Array.from({length:60},(_,i)=>({id:`pat-${i+1}`,name:`${names[i%names.length]} ${Math.floor(i/12)+1}`,email:`patient${i+1}@demo.medibook.pk`,phone:`+92 300 ${String(1000000+i).padStart(7,"0")}`,gender:i%2?"Female":"Male",createdAt:new Date(Date.now()-i*86400000).toISOString()}));
  const statuses: Appointment["status"][]=["Confirmed","Pending","Completed","Cancelled","No Show","Checked In","In Consultation"];
  const appointments: Appointment[] = Array.from({length:220},(_,i)=>{ const doctor=doctors[i%doctors.length]; const start=new Date(); start.setUTCDate(start.getUTCDate()-30+(i%75)); start.setUTCHours(4+((i%8)),0,0,0); const end=new Date(start.getTime()+doctor.duration*60000); return {id:`apt-${i+1}`,reference:`APT-${String(1001+i).padStart(4,"0")}`,patientId:patients[i%patients.length].id,doctorId:doctor.id,departmentId:doctor.departmentId,startsAt:start.toISOString(),endsAt:end.toISOString(),timezone:"Asia/Karachi",type:i%3===0?"Follow-up":"In-person",reason:i%4===0?"Routine appointment":undefined,status:statuses[i%statuses.length],fee:doctor.fee,idempotencyKey:`seed-${i+1}`,createdAt:new Date(start.getTime()-604800000).toISOString()}; });
  const users: DataStore["users"] = ([
    ["Administrator","Ahmed Masood","admin@medibook.demo"],["Receptionist","Sara Reception","reception@medibook.demo"],["Doctor","Dr. Bilal Ahmed","doctor@medibook.demo"],["Viewer","Clinic Viewer","viewer@medibook.demo"],
  ] as Array<[RoleName,string,string]>).map(([role,name,email],i)=>({id:`usr-${i+1}`,name,email,role,passwordHash:hashSync("Demo@123",10),active:true}));
  const audits: Audit[] = Array.from({length:30},(_,i)=>({id:`aud-${i+1}`,at:new Date(Date.now()-i*3600000).toISOString(),userId:users[i%4].id,role:users[i%4].role,action:["LOGIN_SUCCESS","APPOINTMENT_CREATED","PATIENT_REGISTERED","AI_TOOL_EXECUTED"][i%4],resource:i%4?"Appointment":"Session",resourceId:i%4?appointments[i].id:undefined,result:"SUCCESS",metadata:{demo:true}}));
  return {users,departments,doctors,patients,appointments,audits,conversations:[{id:"conv-1",userId:"usr-1",title:"Cardiology availability",messages:[{id:"msg-1",role:"user",content:"Show available cardiologists for tomorrow.",at:new Date().toISOString()},{id:"msg-2",role:"assistant",content:"I found cardiology availability. Select a doctor to check exact slots.",tool:"search_doctors",success:true,at:new Date().toISOString()}]}],settings:{clinicName:"MediBook AI Clinic",timezone:"Asia/Karachi",openingTime:"09:00",closingTime:"17:00",duration:30,buffer:10,cancellationPolicy:"Please cancel at least 12 hours before the appointment.",notifications:true,aiEnabled:true,theme:"Light"}};
}

export async function readStore(): Promise<DataStore> { try { return JSON.parse(await fs.readFile(dataFile,"utf8")) as DataStore; } catch { const data=seed(); await fs.mkdir(path.dirname(dataFile),{recursive:true}); await fs.writeFile(dataFile,JSON.stringify(data,null,2)); return data; } }
export async function updateStore<T>(fn:(data:DataStore)=>T|Promise<T>):Promise<T>{ let result!:T; queue=queue.then(async()=>{const data=await readStore(); result=await fn(data); await fs.writeFile(dataFile,JSON.stringify(data,null,2));}); await queue; return result; }
export function addAudit(data:DataStore, entry:Omit<Audit,"id"|"at">){data.audits.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),...entry});}
