import { Activity, Thermometer, Wind, Droplets, ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardOverview() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-semibold text-zinc-950 mb-1">Prairie Overview</h1>
          <p className="text-zinc-500">Real-time metrics and alerts from the sanctuary zones.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <button className="px-4 py-2 border border-zinc-200 bg-white rounded-lg font-medium hover:bg-zinc-50 transition-colors">Export Report</button>
          <button className="px-4 py-2 bg-zinc-950 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm">Sync Devices</button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Herds Tracked', value: '14', unit: 'groups', trend: '+2', trendUp: true, icon: Activity },
          { label: 'Avg Range Temp', value: '72', unit: '°F', trend: '-1°', trendUp: false, icon: Thermometer },
          { label: 'Wind Current', value: '14', unit: 'mph', trend: '+3', trendUp: true, icon: Wind },
          { label: 'Water Sources', value: '98', unit: '% capacity', trend: 'Stable', trendUp: true, icon: Droplets },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-zinc-50 rounded-full opacity-50 transition-transform group-hover:scale-150 duration-700" />
            <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 relative z-10 group-hover:border-zinc-300 transition-colors">
              <stat.icon className="w-5 h-5 text-zinc-700" />
            </div>
            <p className="text-sm font-medium text-zinc-500 mb-1 relative z-10">{stat.label}</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <h3 className="text-3xl font-outfit font-semibold text-zinc-950">{stat.value}</h3>
              <span className="text-sm text-zinc-500 font-medium">{stat.unit}</span>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold relative z-10">
               <span className={cn("flex items-center gap-0.5", stat.trendUp ? "text-emerald-600" : "text-amber-600")}>
                 {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3 rotate-90" />}
                 {stat.trend}
               </span>
               <span className="text-zinc-400 font-normal">from yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Complex Chart placeholder & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm h-[400px] flex flex-col relative overflow-hidden group">
           <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-lg font-outfit font-semibold text-zinc-950">Movement Patterns</h3>
                <p className="text-sm text-zinc-500">Last 7 days of GPS collar telemetry</p>
              </div>
              <div className="flex gap-2 text-xs font-medium">
                <button className="px-3 py-1 bg-zinc-100 rounded-md text-zinc-900">7D</button>
                <button className="px-3 py-1 text-zinc-500 hover:bg-zinc-50 rounded-md">1M</button>
                <button className="px-3 py-1 text-zinc-500 hover:bg-zinc-50 rounded-md">YTD</button>
              </div>
           </div>
           
           {/* Stylized placeholder for a beautiful chart */}
           <div className="flex-1 w-full bg-zinc-50/50 rounded-xl border border-zinc-100 flex items-end justify-between px-6 pt-12 pb-6 relative z-10 group-hover:bg-zinc-50/80 transition-colors">
             {[40, 70, 45, 90, 65, 85, 50, 75, 60, 100, 80, 55].map((h, i) => (
                <div key={i} className="w-12 group/bar flex items-end h-full">
                  <div 
                    style={{ height: `${h}%` }} 
                    className="w-full bg-zinc-200 rounded-t-sm group-hover/bar:bg-zinc-900 transition-colors duration-300 relative"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                      {h}mi
                    </div>
                  </div>
                </div>
             ))}
           </div>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-outfit font-semibold text-zinc-950">Recent Alerts</h3>
            <button className="text-sm text-zinc-500 hover:text-zinc-900 font-medium">View All</button>
          </div>
          <div className="flex-1 space-y-4">
             {[
               { title: 'New foal spotted', time: '10m ago', type: 'info', zone: 'North Ridge' },
               { title: 'Border fence repair needed', time: '2h ago', type: 'warning', zone: 'East Boundary' },
               { title: 'Sponsor donation received', time: '4h ago', type: 'success', zone: 'Global' },
               { title: 'Water level low', time: '1d ago', type: 'critical', zone: 'South Basin' },
             ].map((alert, i) => (
               <div key={i} className="flex gap-4 items-start p-3 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-zinc-100">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 shrink-0 shadow-sm",
                    alert.type === 'info' ? "bg-blue-500" :
                    alert.type === 'warning' ? "bg-amber-500" :
                    alert.type === 'success' ? "bg-emerald-500" : "bg-red-500"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{alert.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-400">{alert.time}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-300" />
                      <span className="text-xs text-zinc-500 font-medium">{alert.zone}</span>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
