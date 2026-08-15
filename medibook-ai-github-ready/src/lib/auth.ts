import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { addAudit, readStore, updateStore } from "./store";
import type { RoleName, User } from "./types";

const cookieName="medibook_session";
const secret=()=>new TextEncoder().encode(process.env.SESSION_SECRET||"development-only-secret-change-before-production-32");
const rate=new Map<string,{count:number;until:number}>();
export async function login(email:string,password:string,remember=false){
  const ip=(await headers()).get("x-forwarded-for")?.split(",")[0]||"local";
  const key=`${ip}:${email.toLowerCase()}`, now=Date.now(), hit=rate.get(key);
  if(hit&&hit.count>=5&&hit.until>now)return {ok:false,error:"Too many failed attempts. Try again shortly."};
  const data=await readStore();
  const user=data.users.find(u=>u.email===email.toLowerCase()&&u.active);
  const valid=Boolean(user&&await compare(password,user.passwordHash));
  if(!valid){
    rate.set(key,{count:(hit?.count||0)+1,until:now+15*60_000});
    await updateStore(d=>addAudit(d,{action:"LOGIN_FAILED",resource:"Session",result:"FAILURE",metadata:{emailDomain:email.split("@")[1]||"unknown"}}));
    return {ok:false,error:"Invalid email or password."};
  }
  if(!user)return {ok:false,error:"Invalid email or password."};
  rate.delete(key);
  const tokenId=randomBytes(20).toString("hex"), maxAge=remember?30*86400:8*3600;
  const token=await new SignJWT({sub:user.id,role:user.role,jti:createHash("sha256").update(tokenId).digest("hex")}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime(`${maxAge}s`).sign(secret());
  (await cookies()).set(cookieName,token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge});
  await updateStore(d=>addAudit(d,{userId:user.id,role:user.role,action:"LOGIN_SUCCESS",resource:"Session",result:"SUCCESS"}));
  return {ok:true};
}
export async function getUser():Promise<User|null>{const token=(await cookies()).get(cookieName)?.value;if(!token)return null;try{const {payload}=await jwtVerify(token,secret());const data=await readStore();return data.users.find(u=>u.id===payload.sub&&u.active)||null}catch{return null}}
export async function requireUser(roles?:RoleName[]):Promise<User>{const user=await getUser();if(!user){redirect("/login");throw new Error("Redirecting")}if(roles&&!roles.includes(user.role)){redirect("/overview?error=unauthorized");throw new Error("Redirecting")}return user;}
export async function logout(){const user=await getUser();if(user)await updateStore(d=>addAudit(d,{userId:user.id,role:user.role,action:"LOGOUT",resource:"Session",result:"SUCCESS"}));(await cookies()).delete(cookieName);}
