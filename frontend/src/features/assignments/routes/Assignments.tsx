import { useState, useEffect } from 'react';
import axios from "@/lib/axios"
import { Download, Plus, Search, ChevronDown, Anchor, MapPin, MoreVertical, Calendar, ArrowRight } from 'lucide-react';
import { AssignmentCard } from '@/components/AssignmentCardComponent.tsx';
import { AssignmentTable } from '@/components/AssignmentTableComponent.tsx';

interface Assignment {
  id: string;
  status: string;
  signOnDate: string;
  warning: string;
  signOffDate: string;
  signOnPort: string;
  signOffPort: string;
  durationDays: number;
  vessel: {
    name: string;
    imoNumber: string;
    type: string;
  };
  position: {
    title: string;
  };
}

interface Stats {
  totalActive: number;
  totalUpcoming: number;
  totalHistory: number;
  all: number;
}

interface SeaTime {
  days: number;
  totalSeaDays?: number;
}

export default function Assignments() {
  const [active, setActive] = useState<Assignment[]>([]);
  const [upcoming, setUpcoming] = useState<Assignment[]>([]);
  const [history, setHistory] = useState<Assignment[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [seaTime, setSeaTime] = useState<SeaTime>({ days: 0, totalSeaDays: 0 });
  const safeTotalSeaDays = seaTime.totalSeaDays ?? 0;
  const safeTarget = seaTime.totalSeaDays ?? 0; 
  const progressPercentage = Math.min(100, (safeTotalSeaDays / safeTarget) * 100);

  const [stats, setStats] = useState<Stats>({
    totalActive: 0,
    totalUpcoming: 0,
    totalHistory: 0,
    all: 0
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [activeRes, upcomingRes, historyRes, seaTimeRes] = await Promise.all([
          axios.get('/assignments', { params: { status: 'CurrentlyOnboard' } }),
          axios.get('/assignments', { params: { status: 'Upcoming' } }),
          axios.get('/assignments', { params: { status: 'Completed' } }),
          axios.get('/assignments/sea-time') 
        ]);

        setActive(activeRes.data.items || activeRes.data || []);
        setUpcoming(upcomingRes.data.items || upcomingRes.data || []);
        setHistory(historyRes.data.items || historyRes.data || []);

        setSeaTime(seaTimeRes.data); 

        setStats({
          totalActive: activeRes.data.totalActive || 0,
          totalUpcoming: activeRes.data.totalUpcoming || 0,
          totalHistory: activeRes.data.totalHistory || 0,
          all: activeRes.data.all || 0,
        });
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const calculateProgress = (signOn: string, signOff: string) => {
    const start = new Date(signOn);
    const end = new Date(signOff);
    const today = new Date();

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const percentage = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

    return { elapsedDays, totalDays, percentage };
  };

  return (
    <div className="w-full space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Assignments</h1>
          <p className="text-sm text-slate-400 mt-1">Past, current, and upcoming deployments</p>
        </div>
        
        <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-md transition-colors shadow-sm cursor-pointer">
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </button>
          <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 h-10 bg-[#0B2545] hover:opacity-90 text-white text-sm font-semibold rounded-md transition-colors shadow-sm cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm min-h-[110px] sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col flex-grow gap-2 sm:gap-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                Career Stats
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Sea time across all assignments
              </h3>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0B2545] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-row items-baseline gap-1 shrink-0 self-start sm:self-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {seaTime.totalSeaDays}
            </span>
            <span className="text-sm font-bold text-slate-500">
              days
            </span>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">Active</span>
            <span className="text-4xl font-bold text-emerald-600 block mt-1">{stats.totalActive}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Currently onboard</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">Upcoming</span>
            <span className="text-4xl font-bold text-blue-600 block mt-1">{stats.totalUpcoming}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Within next 6 months</span>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">Completed</span>
            <span className="text-4xl font-bold text-slate-900 block mt-1">{stats.totalHistory}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Lifetime contracts</span>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        
        <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['Active 1', 'Upcoming 2', 'History 7', 'All 10'].map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 text-sm font-semibold transition-colors ${
                i === 0 ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search vessel or position"
              className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full lg:w-auto">
            <button className="flex items-center justify-between sm:justify-center gap-2 px-4 h-10 border border-slate-200 bg-white rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50">
              <span className="truncate">All Vessels</span>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
            <button className="flex items-center justify-between sm:justify-center gap-2 px-4 h-10 border border-slate-200 bg-white rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50">
              <span className="truncate">All Positions</span> 
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Currently Onboard</h2>
          {active.length > 0 ? (
            active.map((item) => (
              <AssignmentCard 
                key={item.id} 
                item={item} 
                variant="active" 
                calculateProgress={calculateProgress} 
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">No active assignments.</p>
          )}
        </div>
        
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Upcoming</h2>
          {upcoming.length > 0 ? (
            upcoming.map((item) => (
              <AssignmentCard 
                key={item.id} 
                item={item} 
                variant="upcoming" 
              />
            ))
          ) : (
            <p className="text-sm text-slate-500">No upcoming assignments.</p>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">History</h2>
        <div className="overflow-x-auto w-full">
            <AssignmentTable items={history} />
        </div>
      </div>
    </div>
  )
}