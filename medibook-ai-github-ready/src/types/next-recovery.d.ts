declare module "next" { export interface Metadata { title?: string; description?: string } export interface NextConfig { output?: "standalone"|"export"; turbopack?: { root?: string } } }
declare module "next/link" { import type {AnchorHTMLAttributes,ReactNode} from "react"; export default function Link(props:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string;children?:ReactNode}):ReactNode }
declare module "next/navigation" { export function redirect(path:string):never; export function usePathname():string }
declare module "next/headers" { interface CookieJar {get(name:string):{value:string}|undefined;set(name:string,value:string,options?:Record<string,unknown>):void;delete(name:string):void} export function cookies():Promise<CookieJar>; export function headers():Promise<Headers> }
declare module "next/server" { export class NextRequest extends Request {} }
