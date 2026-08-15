import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"MediBook AI",description:"Secure AI-powered clinic appointment management"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
