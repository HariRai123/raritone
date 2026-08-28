import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
function ErrorMessage({message="Unable to load products.",onRetry}){return <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><AlertCircle className="h-7 w-7 text-red-600"/><strong className="mt-3 text-sm text-red-800">{message}</strong>{onRetry&&<Button variant="outline" className="mt-4 border-red-200 bg-white" onClick={onRetry}><RefreshCw/> Try Again</Button>}</div>}
export default ErrorMessage;
