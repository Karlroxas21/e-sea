import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const NEWS_DATA = [
  {
    id: 1,
    category: "Industry",
    title: "Enhance Maritime Services with new digital tools",
    date: "Apr 25, 2026",
    readTime: "3 min read",
    color: "bg-blue",
  },
  {
    id: 2,
    category: "Updates",
    title: "STCW renewal process updates effective Q3",
    date: "Apr 20, 2026",
    readTime: "5 min read",
    color: "bg-purple",
  },
  {
    id: 3,
    category: "Training",
    title: "New simulator training program launches",
    date: "Apr 18, 2026",
    readTime: "2 min read",
    color: "bg-green",
  },
]

export function Appnews() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Latest News</h3>
      <div className="grid gap-4 md:grid-cols-3 cursor-pointer">
        {NEWS_DATA.map((news) => (
          <Card key={news.id} className="overflow-hidden border-slate-200/60 shadow-sm">
            <div className={`relative aspect-[3/1] w-full ${news.color} flex items-center justify-center`}>
              <span className="absolute top-3 left-3 bg-white/90 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-800 tracking-widest">
                {news.category}
              </span>
              <div className="opacity-20 scale-150">
              </div>
            </div>

            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold leading-tight text-slate-900">
                {news.title}
              </CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400 mt-1">
                {news.date} • {news.readTime}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}