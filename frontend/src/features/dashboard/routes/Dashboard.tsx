import { useEffect, useState, useMemo } from "react"
import { 
  Download, 
  Upload, 
  Users, 
  NotebookPen,
  Clock, 
  MapPin,
  AlertTriangle, 
  User, 
  Calendar,
  StickyNote,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "@/lib/axios"
import { NewsComponent } from "@/components/NewsComponent"

interface ActivityItem {
  id: string
  activityType: string
  title: string
  description: string
  userId: string
  createdAt: string
}

interface ComplianceData {
  score: number
  details: {
    missing: number
    "expired/expiringsoon/pending": number
  }
}

function Dashboard() { 
  const [stats, setStats] = useState({
    activeTrainings: 0,
    pendingDocs: 0,
    openJobs: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [compliance, setCompliance] = useState<ComplianceData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true) 
  const [isComplianceLoading, setIsComplianceLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setIsComplianceLoading(true)
        setError(null)

        const [
            activitiesRes, 
            complianceRes, 
            trainingsRes, 
            pendingDocsRes, 
            openJobsRes
        ] = await Promise.all([
          axios.get('/recent-activities?page=1'),
          axios.get('/compliance-requirements/score'),
          axios.get('/trainings?page=1'),
          axios.get('/documents/pending'),
          axios.get('/documents/open-jobs')
        ])

        if (activitiesRes.data?.items) setActivities(activitiesRes.data.items.slice(0, 5))
        if (complianceRes.data) setCompliance(complianceRes.data)
        
        setStats({
            activeTrainings: trainingsRes.data.totalCount || 0,
            pendingDocs: pendingDocsRes.data.pending || 0,
            openJobs: openJobsRes.data.open || 0
        })

      } catch (err: any) {
        console.error("Error loading dashboard modules:", err)
        setError("Could not retrieve dashboard details.")
      } finally {
        setIsLoading(false)
        setIsComplianceLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const currentScore = compliance?.score ?? 0;

  const { greenBarWidth, amberBarWidth, redBarWidth } = useMemo(() => {
    if (!compliance) return { greenBarWidth: 0, amberBarWidth: 0, redBarWidth: 0 };

    const missingCount = compliance.details?.missing ?? 0;
    const issueCount = compliance.details?.["expired/expiringsoon/pending"] ?? 0;
    
    const remainingPercentage = 100 - currentScore;
    const totalDeficitCount = missingCount + issueCount;

    if (totalDeficitCount > 0) {
      return {
        greenBarWidth: currentScore,
        amberBarWidth: (issueCount / totalDeficitCount) * remainingPercentage,
        redBarWidth: (missingCount / totalDeficitCount) * remainingPercentage
      };
    }

    return {
      greenBarWidth: currentScore,
      amberBarWidth: 0,
      redBarWidth: remainingPercentage
    };
  }, [compliance, currentScore]);

  const getRelativeTime = (dateString: string) => {
    try {
      const now = new Date()
      const past = new Date(dateString)
      const msPerMinute = 60 * 1000
      const msPerHour = msPerMinute * 60
      const msPerDay = msPerHour * 24
      const msPerWeek = msPerDay * 7
      
      const elapsed = now.getTime() - past.getTime()
      if (elapsed < msPerMinute) return "Just now"
      if (elapsed < msPerHour) return `${Math.round(elapsed / msPerMinute)}m ago`
      if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)}h ago`
      if (elapsed < msPerWeek) {
        const days = Math.round(elapsed / msPerDay)
        return days === 1 ? "Yesterday" : `${days} days ago`
      }
      const weeks = Math.round(elapsed / msPerWeek)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    } catch { return "Recent" }
  }

  const getActivityStyles = (type: string) => {
    switch (type) {
      case "Login": return { icon: <User className="h-4 w-4" />, containerClass: "bg-slate-50 text-slate-600 border border-slate-200/50" }
      case "Document": return { icon: <Upload className="h-4 w-4" />, containerClass: "bg-blue-50 text-blue-600 border border-blue-100/50" }
      case "Training": return { icon: <NotebookPen className="h-4 w-4" />, containerClass: "bg-emerald-50 text-emerald-600 border border-emerald-100/50" }
      case "Compliance": return { icon: <AlertTriangle className="h-4 w-4" />, containerClass: "bg-amber-50 text-amber-600 border border-amber-100/50" }
      case "Notification": return { icon: <Bell className="h-4 w-4" />, containerClass: "bg-purple-50 text-purple-600 border border-purple-100/50" }
      default: return { icon: <StickyNote className="h-4 w-4" />, containerClass: "bg-gray-50 text-gray-600 border border-gray-200/50" }
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here's an overview of your account.</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-sm font-medium border-slate-200 shadow-sm hover:bg-slate-50 cursor-pointer">
          <Download className="h-4 w-4 text-slate-500" />
          Export Report
        </Button>
      </div>

      <div className="w-full bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-slate-300 text-xs font-medium uppercase tracking-wider">Welcome back, Darryl</span>
            <h2 className="text-2xl font-bold tracking-tight mt-1">
              Your overall compliance is{" "}
              <span className="text-amber-500">
                {isComplianceLoading ? "..." : `${currentScore}%`}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
             <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /><span>Status: Lined Up</span></div>
             <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /><span>MS Eurodam</span></div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1.5 w-full md:w-auto border-t border-slate-700/60 pt-4 md:pt-0 md:border-t-0 md:border-l md:border-slate-700/60 md:pl-6">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Compliance Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight">{isComplianceLoading ? "..." : currentScore}</span>
            <span className="text-slate-400 text-sm font-semibold">%</span>
          </div>
          <div className="w-full md:w-48 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 flex">
            <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${greenBarWidth}%` }} />
            <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${amberBarWidth}%` }} />
            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${redBarWidth}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trainings</span>
          <span className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{isLoading ? "..." : stats.activeTrainings}</span>
        </div>
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Documents</span>
          <span className="text-3xl font-bold tracking-tight text-red-500 mt-1">{isLoading ? "..." : stats.pendingDocs}</span>
        </div>
        <div className="bg-white border border-slate-200/60 p-5 rounded-xl shadow-sm flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Job Posts</span>
          <span className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{isLoading ? "..." : stats.openJobs}</span>
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
            <Button variant="link" className="text-xs text-slate-600 p-0 font-semibold h-auto cursor-pointer">View all</Button>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading && (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex gap-4 items-center">
                    <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                      <div className="h-2 bg-slate-50 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && !isLoading && (
              <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {!isLoading && !error && activities.map((activity) => {
              const styles = getActivityStyles(activity.activityType)
              return (
                <div key={activity.id} className="flex items-start gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${styles.containerClass}`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-900 truncate">{activity.title}</h5>
                    <p className="text-xs text-slate-500 mt-0.5 leading-normal">{activity.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium ml-2">
                    {getRelativeTime(activity.createdAt)}
                  </span>
                </div>
              )
            })}
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

      <NewsComponent />
    </>
  )
}

export default Dashboard