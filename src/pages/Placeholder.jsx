import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
function Placeholder({ title = "Coming Soon" }) { return <main className="min-h-[calc(100vh-4rem)] bg-neutral-50 px-4 py-16"><Card className="mx-auto max-w-xl rounded-3xl text-center"><CardContent className="p-10"><Construction className="mx-auto h-10 w-10 text-neutral-500" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">RARITONE</p><h1 className="mt-3 text-3xl font-semibold">{title}</h1><p className="mt-3 text-sm text-neutral-500">This section is being prepared for the next release.</p><Button variant="outline" className="mt-7" onClick={() => { window.location.href = "/"; }}><ArrowLeft /> Back to Store</Button></CardContent></Card></main>; }
export default Placeholder;
