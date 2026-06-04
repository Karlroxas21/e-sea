import { SidebarProvider, SidebarInset as MainContent } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { 
  Download, 
  Upload, 
  Users, 
  Check, 
  X,
  NotebookPen,
  Clock, 
  MapPin,
  AlertTriangle, 
  User, 
  Calendar,
  StickyNote 
} from "lucide-react"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <AppSidebar />
      <MainContent className="flex flex-col h-full overflow-y-auto bg-uts-main">
        <AppHeader />
        
        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's an overview of your account.</p>
            </div>
            <Button variant="outline" className="gap-2 bg-white text-sm font-medium border-slate-200 shadow-sm hover:bg-slate-50">
              <Download className="h-4 w-4 text-slate-500" />
              Export Report
            </Button>
          </div>

          <div className="w-full bg-[#0B2545] text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-slate-300 text-xs font-medium uppercase tracking-wider">Welcome back, Darryl</span>
                <h2 className="text-2xl font-bold tracking-tight mt-1">Your overall compliance is <span className="text-gold">31%</span></h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Status: Lined Up</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>MS Eurodam - Able Seaman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Next assignment: Jan 05, 2026</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5 min-w-[200px] w-full md:w-auto border-l border-slate-700/60 pl-0 md:pl-6">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Compliance Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight">31</span>
                <span className="text-slate-400 text-sm font-semibold">%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1 flex">
                <div className="h-full bg-green-500 w-[31%]" />
                <div className="h-full bg-amber-500 w-[11%]" />
                <div className="h-full bg-red-500 w-[58%]" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trainings</span>
              <span className="text-3xl font-bold tracking-tight text-slate-900 mt-1">3</span>
              <span className="text-xs text-slate-500 mt-2">2 in progress, 1 awaiting start</span>
            </div>
            
            <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Documents</span>
              <span className="text-3xl font-bold tracking-tight text-red-500 mt-1">5</span>
              <span className="text-xs text-slate-500 mt-2">Upload required to proceed</span>
            </div>

            <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Job Posts</span>
              <span className="text-3xl font-bold tracking-tight text-slate-900 mt-1">12</span>
              <span className="text-xs text-slate-500 mt-2">Matching your profile</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase">Suggested Actions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-[#0B2545] rounded-lg flex items-center justify-center text-white">
                    <Upload className="h-5 w-5 icon-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Upload Certificates</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Improve your compliance score</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors text-lg font-medium pr-1">›</span>
              </div>

              <div className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-[#0B2545] rounded-lg flex items-center justify-center text-white">
                    <Users className="h-5 w-5 icon-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Active Trainings</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Get back on track to certified</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors text-lg font-medium pr-1">›</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Recent Activity</h3>
                <Button variant="link" className="text-xs text-slate-600 p-0 font-semibold h-auto">View all</Button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">Advanced Fire Fighting certificate verified</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Document approved by compliance officer</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">2h ago</span>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">Passport scan uploaded</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Awaiting verification</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">Yesterday</span>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">Basic Safety Training expiring soon</h5>
                    <p className="text-xs text-slate-500 mt-0.5">Renewal due May 08, 2026</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">2 days ago</span>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="h-8 w-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                    <X className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">NBI Clearance expired</h5>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Action required: submit renewal request</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">5 days ago</span>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray shrink-0">
                    <StickyNote className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">Course request: Crisis Management refresher</h5>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Request submitted to training department</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">1 week ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Upcoming</h3>
              
              <div className="flex flex-col gap-3">
                <div className="border border-slate-100 rounded-lg p-3 flex gap-3 items-start bg-slate-50/40">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-md shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-xs font-bold text-slate-900">Sign-on: MS Eurodam</h6>
                    <p className="text-[11px] text-slate-500 mt-0.5">Manila, PH</p>
                    <span className="text-[10px] font-medium text-slate-400 block mt-1">Jan 05, 2026</span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-lg p-3 flex gap-3 items-start bg-slate-50/40">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-md shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-xs font-bold text-slate-900">Crisis Management training</h6>
                    <p className="text-[11px] text-slate-500 mt-0.5">Demo Training Center</p>
                    <span className="text-[10px] font-medium text-slate-400 block mt-1">Dec 18</span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-lg p-3 flex gap-3 items-start bg-slate-50/40">
                  <div className="p-2 bg-slate-100 text-slate-600 rounded-md shrink-0">
                    <NotebookPen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h6 className="text-xs font-bold text-slate-900">STCW Assessment</h6>
                    <p className="text-[11px] text-slate-500 mt-0.5">Online</p>
                    <span className="text-[10px] font-medium text-slate-400 block mt-1">Dec 22</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </MainContent> 
    </SidebarProvider>
  )
}

export default App