import { ShieldAlert, Fingerprint, Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

export default function AnalyticsPage() {
  // Advanced simulated telemetry data for analytical depth
  const distributionData = [
    { ms: '0', count: 0 }, { ms: '5', count: 120 }, { ms: '10', count: 850 }, 
    { ms: '15', count: 2100 }, { ms: '20', count: 1600 }, { ms: '25', count: 900 },
    { ms: '30', count: 400 }, { ms: '40', count: 100 }, { ms: '50', count: 10 }
  ];

  const collisionSim = [
    { epoch: '1M', prob: 0.00000001 }, { epoch: '2M', prob: 0.00000005 },
    { epoch: '3M', prob: 0.00000015 }, { epoch: '4M', prob: 0.00000040 },
    { epoch: '5M', prob: 0.00000095 }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advanced Analytics</h1>
        <p className="text-slate-500 mt-1">Deep telemetry, percentile analysis, and attack simulation projections.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-indigo-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Salt Uniqueness Rate</CardTitle>
            <Fingerprint className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">99.999%</div>
            <p className="text-xs text-slate-500 mt-1">Hybrid CSPRNG + HMAC prevents all re-use.</p>
          </CardContent>
        </Card>

        <Card className="hover:border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Collision Probability</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900 flex items-end gap-1">
              1 <span className="text-sm text-slate-500 mb-1">in</span> 2<sup className="text-xs">256</sup>
            </div>
            <p className="text-xs text-slate-500 mt-1">Mathematically intractable threshold.</p>
          </CardContent>
        </Card>

        <Card className="hover:border-cyan-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Current Vector Load</CardTitle>
            <Network className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">0.02%</div>
            <p className="text-xs text-slate-500 mt-1">System is idling seamlessly.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latency Percentile Distribution (ms)</CardTitle>
            <CardDescription>Bell curve distribution of authentication verification speeds.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={distributionData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                 <XAxis dataKey="ms" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                 <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                 <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <ReferenceLine x="15" stroke="#db2777" strokeDasharray="3 3" label={{ position: 'top', value: 'p50', fill: '#db2777', fontSize: 12, fontWeight: 600 }} />
                 <ReferenceLine x="25" stroke="#7c3aed" strokeDasharray="3 3" label={{ position: 'top', value: 'p95', fill: '#7c3aed', fontSize: 12, fontWeight: 600 }} />
                 <ReferenceLine x="40" stroke="#dc2626" strokeDasharray="3 3" label={{ position: 'top', value: 'p99', fill: '#dc2626', fontSize: 12, fontWeight: 600 }} />
                 <Line type="basis" dataKey="count" stroke="#0ea5e9" strokeWidth={3} dot={false} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hash Matrix Collision Simulation</CardTitle>
            <CardDescription>Theoretical birthday attack probabilities over extreme volume.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={collisionSim}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                 <XAxis dataKey="epoch" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                 <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(v) => v.toExponential()} fontSize={12} />
                 <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Line type="monotone" dataKey="prob" stroke="#dc2626" strokeWidth={2} dot={{ r: 4, fill: '#dc2626' }} />
               </LineChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
