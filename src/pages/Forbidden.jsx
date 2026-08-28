
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
function Forbidden() { return <main className="min-h-[calc(100vh-4rem)] bg-neutral-50 px-4 py-16"><Card className="mx-auto max-w-lg rounded-3xl text-center shadow-lg"><CardContent className="p-10"><ShieldAlert className="mx-auto h-12 w-12 text-neutral-700" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">ACCESS DENIED</p><h1 className="mt-3 text-3xl font-semibold">You don't have permission.</h1><p className="mt-3 text-sm leading-6 text-neutral-500">This area is restricted to authorized Raritone users.</p><Button className="mt-7" onClick={() => { window.location.href = "/"; }}>Return Home</Button></CardContent></Card></main>; }
export default Forbidden;
