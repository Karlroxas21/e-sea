import { MoreVertical } from 'lucide-react';

interface AssignmentTableProps {
  items: any[]; 
}

export function AssignmentTable({ items }: AssignmentTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">No assignment history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Vessel</th>
            <th className="px-6 py-4">Position</th>
            <th className="px-6 py-4">Sign-on</th>
            <th className="px-6 py-4">Sign-off</th>
            <th className="px-6 py-4">Duration</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-900">{item.vessel.name}</div>
                <div className="text-xs text-slate-400">IMO {item.vessel.imoNumber}</div>
              </td>
              <td className="px-6 py-4 text-slate-600">{item.position.title}</td>
              <td className="px-6 py-4 text-slate-600">{item.signOnPort} — {item.signOnDate}</td>
              <td className="px-6 py-4 text-slate-600">{item.signOffPort} — {item.signOffDate}</td>
              <td className="px-6 py-4 text-slate-600">{item.durationDays} days</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical className="h-5 w-5 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}