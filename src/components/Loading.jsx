import { Loader2 } from "lucide-react";
function Loading({text="Loading products..."}){return <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center" role="status" aria-live="polite"><Loader2 className="h-7 w-7 animate-spin text-neutral-700"/><span className="text-sm text-neutral-500">{text}</span></div>}
export default Loading;
