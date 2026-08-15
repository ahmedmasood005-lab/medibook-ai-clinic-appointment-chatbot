export type RoleName = "Administrator" | "Receptionist" | "Doctor" | "Viewer";
export type Status = "Pending" | "Confirmed" | "Checked In" | "In Consultation" | "Completed" | "Cancelled" | "No Show";
export interface User { id:string; name:string; email:string; passwordHash:string; role:RoleName; active:boolean }
export interface Department { id:string; name:string; description:string; active:boolean; duration:number }
export interface Doctor { id:string; name:string; title:string; departmentId:string; specialization:string; gender:"Male"|"Female"; fee:number; duration:number; active:boolean; hours:{days:number[];start:string;end:string}; break:{start:string;end:string} }
export interface Patient { id:string; name:string; email:string; phone:string; gender?:string; createdAt:string }
export interface Appointment { id:string; reference:string; patientId:string; doctorId:string; departmentId:string; startsAt:string; endsAt:string; timezone:string; type:string; reason?:string; status:Status; fee:number; idempotencyKey:string; createdAt:string }
export interface Audit { id:string; at:string; userId?:string; role?:RoleName; action:string; resource:string; resourceId?:string; result:"SUCCESS"|"FAILURE"; metadata?:Record<string,string|number|boolean> }
export interface Conversation { id:string; userId:string; title:string; messages:{id:string;role:"user"|"assistant";content:string;tool?:string;success?:boolean;at:string}[] }
export interface DataStore { users:User[]; departments:Department[]; doctors:Doctor[]; patients:Patient[]; appointments:Appointment[]; audits:Audit[]; conversations:Conversation[]; settings:Record<string,string|number|boolean> }
