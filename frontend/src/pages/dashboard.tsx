import { Appnews } from "@/components/app-news"
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

function Dashboard() { 
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's an overview of your account.</p>
        </div>
        <Button variant="outline" className="gap-2 bg-white text-sm font-medium border-slate-200 shadow-sm hover:bg-slate-50 cursor-pointer">
          <Download className="h-4 w-4 text-slate-500" />
          Export Report
        </Button>
      </div>

      <div className="w-full bg-uts-dark text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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

      {/* Bottom Main Content Logs Split */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Recent Activity</h3>
            <Button variant="link" className="text-xs text-slate-600 p-0 font-semibold h-auto cursor-pointer">View all</Button>
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

        <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm flex flex-col w-full">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Upcoming</h3>
          </div>
          
          <div className="flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 flex items-center justify-center border border-blue-100/40">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Sign-on: MS Eurodam</h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">Manila, PH</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 shrink-0 ml-4">Jan 05, 2026</span>
            </div>

            <div className="p-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl shrink-0 flex items-center justify-center border border-amber-100/40">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">Crisis Management training</h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">Demo Training Center</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 shrink-0 ml-4">Dec 18</span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors rounded-b-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl shrink-0 flex items-center justify-center border border-slate-200/60">
                  <NotebookPen className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">STCW Assessment</h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">Online</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 shrink-0 ml-4">Dec 22</span>
            </div>
          </div>
        </div>
      </div>

      <Appnews />
    </>
  )
}

export default Dashboard