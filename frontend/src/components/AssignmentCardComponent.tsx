import { Anchor, MapPin, MoreVertical, Calendar, ArrowRight } from 'lucide-react';

interface AssignmentCardProps {
  item: any;
  variant: 'active' | 'upcoming';
  calculateProgress?: (signOn: string, signOff: string) => { elapsedDays: number, totalDays: number, percentage: number };
}

export function AssignmentCard({ item, variant, calculateProgress }: AssignmentCardProps) {
  const isWarning = item.warning === 'Action Needed';
  
  const styles = {
    active: {
      border: 'border-l-emerald-500',
      badgeBg: 'bg-emerald-50 border-emerald-200',
      badgeText: 'text-emerald-700',
      badgeDot: 'bg-emerald-500',
      badgeLabel: item.status,
    },
    upcoming: {
      border: isWarning ? 'border-l-red-500' : 'border-l-blue-500',
      badgeBg: isWarning ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200',
      badgeText: isWarning ? 'text-red-700' : 'text-blue-700',
      badgeDot: isWarning ? 'bg-red-500' : 'bg-blue-500',
      badgeLabel: item.warning || item.status,
    }
  };

  const currentStyle = styles[variant];

  const progress = variant === 'active' && calculateProgress 
    ? calculateProgress(item.signOnDate, item.signOffDate) 
    : null;

  return (
    <div className={`bg-white border-l-4 ${currentStyle.border} border-y border-r border-slate-200 rounded-lg p-4 sm:p-5 flex flex-col gap-4 shadow-sm mb-4 transition-all`}>
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-2 border-b border-dashed border-slate-100 lg:border-none lg:pb-0">
        
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
          <div className="bg-[#0B2545] shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shadow-sm">
            <Anchor className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mb-0.5 sm:mb-1" title={`${item.vessel.name} • IMO ${item.vessel.imoNumber} • ${item.vessel.type}`}>
              {item.vessel.name} <span className="text-slate-300 mx-1">•</span> IMO {item.vessel.imoNumber} <span className="text-slate-300 mx-1 hidden sm:inline">•</span> <span className="block sm:inline sm:text-slate-500 text-[10px] sm:text-xs text-slate-400">{item.vessel.type}</span>
            </p>
            
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate mb-1.5" title={item.position.title}>
              {item.position.title}
            </h3>
            
            <div className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0 text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" /> 
                <span className="font-medium">{item.signOnDate} — {item.signOffDate}</span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 text-slate-600">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> 
                <span className="truncate font-medium">{item.signOnPort} → {item.signOffPort}</span>
              </div>
            </div>
          </div>
        </div>

        {variant === 'active' && progress ? (
          <div className="flex items-center gap-4 lg:gap-6 shrink-0 lg:ml-4 w-full lg:w-auto">
            <div className="w-[1px] h-10 bg-slate-200 hidden lg:block shrink-0" />
            <div className="w-full lg:w-[264px] bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-lg border border-slate-100 lg:border-none">
              <div className="flex justify-between items-end text-xs mb-1.5">
                <span className="font-bold text-slate-900">
                  Day {progress.elapsedDays} <span className="font-normal text-slate-500 text-[11px]">of {progress.totalDays}</span>
                </span>
                <span className="font-bold text-slate-700">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progress.percentage}%` }} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 lg:gap-6 shrink-0 lg:ml-4 w-full lg:w-auto">
            <div className="w-[1px] h-10 bg-slate-200 hidden lg:block shrink-0" />
            
            <div className="w-full lg:w-[264px] flex items-center justify-between bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-lg border border-slate-100 lg:border-none">
              <div className="flex flex-col items-center flex-1 lg:flex-none lg:w-24 min-w-0">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sign-On</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate w-full text-center" title={item.signOnPort}>{item.signOnPort}</span>
                <span className="text-[11px] text-slate-500 mt-0.5">{item.signOnDate}</span>
              </div>
              
              <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 mx-1" />
              
              <div className="flex flex-col items-center flex-1 lg:flex-none lg:w-24 min-w-0">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sign-Off</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate w-full text-center" title={item.signOffPort}>{item.signOffPort}</span>
                <span className="text-[11px] text-slate-500 mt-0.5">{item.signOffDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-1">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-xs font-bold rounded-md shadow-sm ${currentStyle.badgeBg} ${currentStyle.badgeText}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${currentStyle.badgeDot}`}></div>
          {currentStyle.badgeLabel}
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 border border-transparent active:border-slate-200">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      
    </div>
  );
}