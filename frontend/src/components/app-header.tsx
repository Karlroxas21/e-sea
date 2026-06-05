import { Search, Bell, MessageSquare, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-slate-300 px-6 ">
        <div className="flex w-full items-center justify-between gap-4">
            <div className="relative w-full max-w-sm search-bg rounded-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search across portal..."
                    className="w-full pl-9 h-9 bg-slate-50/50 border-slate-300"
                />
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 relative">
                    <MessageSquare className="h-[18px] w-[18px]" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 relative">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100">
                    <HelpCircle className="h-[18px] w-[18px]" />
                </Button>
            </div>
        </div>
    </header>
  )
}