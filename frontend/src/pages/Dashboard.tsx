import { useLocation } from 'react-router-dom';
import { ShieldCheck, Clock, Layers, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyThroughputData = [
  { time: '10:00', req: 120 }, { time: '10:05', req: 250 }, { time: '10:10', req: 500 }, 
  { time: '10:15', req: 400 }, { time: '10:20', req: 800 }, { time: '10:25', req: 425 }
];

const dummyHashTimeData = [
  { algo: 'SHA-256', time: 5 }, { algo: 'bcrypt', time: 85 }, 
  { algo: 'PBKDF2', time: 110 }, { algo: 'scrypt', time: 140 }, { algo: 'argon2id', time: 210 }
];

const dummyCrackResistance = [
  { algo: 'SHA-256', resistance: 10 }, { algo: 'bcrypt', resistance: 60 },
  { algo: 'PBKDF2', resistance: 75 }, { algo: 'scrypt', resistance: 90 },
  { algo: 'argon2id', resistance: 100 }
];

export default function Dashboard() {
  const location = useLocation();
  const data = location.state?.loginData || { userId: 'user_1', algorithm: 'argon2id', verifyTime: 12.34, hashTime: 45.67 };

  return (
    <div className="flex flex-col mt-6 gap-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Overview Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
            <CardTitle className="text-slate-500 font-medium text-sm">Avg Hash Time</CardTitle>
            <Layers className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="mt-4">
            <div className="text-3xl font-bold text-slate-900">{data.hashTime ? data.hashTime.toFixed(2) : '32.14'} ms</div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
            <CardTitle className="text-slate-500 font-medium text-sm">Avg Verification Time</CardTitle>
            <Clock className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="mt-4">
            <div className="text-3xl font-bold text-slate-900">{data.verifyTime.toFixed(2)} ms</div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
            <CardTitle className="text-slate-500 font-medium text-sm">Active Algorithm</CardTitle>
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="mt-4">
            <div className="text-3xl font-bold text-slate-900">{data.algorithm}</div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform">
          <CardHeader className="flex flex-row items-center justify-between mb-0 pb-0">
            <CardTitle className="text-slate-500 font-medium text-sm">Throughput (req/sec)</CardTitle>
            <Zap className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="mt-4">
            <div className="text-3xl font-bold text-slate-900">425</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hash Time vs Algorithm</CardTitle>
          </CardHeader>
          <CardContent className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyHashTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                <XAxis dataKey="algo" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="time" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Algorithm vs Crack Resistance</CardTitle>
          </CardHeader>
          <CardContent className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyCrackResistance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                <XAxis dataKey="algo" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="resistance" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Throughput over time</CardTitle>
          </CardHeader>
          <CardContent className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyThroughputData}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12}/>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="req" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorReq)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <Card className="p-0 overflow-hidden border-slate-200">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-700 text-sm">User ID</th>
                <th className="p-4 font-semibold text-slate-700 text-sm">Algorithm Used</th>
                <th className="p-4 font-semibold text-slate-700 text-sm">Hash Time (ms)</th>
                <th className="p-4 font-semibold text-slate-700 text-sm">Verification Time (ms)</th>
                <th className="p-4 font-semibold text-slate-700 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 text-slate-600 text-sm font-medium">user_1</td>
                <td className="p-4"><span className="text-indigo-600 font-medium">argon2id</span></td>
                <td className="p-4 text-slate-600">45.67</td>
                <td className="p-4 text-slate-600">12.34</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Success</span></td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors bg-slate-50/30">
                <td className="p-4 text-slate-600 text-sm font-medium">user_2</td>
                <td className="p-4"><span className="text-indigo-600 font-medium">scrypt</span></td>
                <td className="p-4 text-slate-600">85.42</td>
                <td className="p-4 text-slate-600">8.21</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Success</span></td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 text-slate-600 text-sm font-medium">user_3</td>
                <td className="p-4"><span className="text-indigo-600 font-medium">bcrypt</span></td>
                <td className="p-4 text-slate-600">62.18</td>
                <td className="p-4 text-slate-600">4.11</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Failed</span></td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
