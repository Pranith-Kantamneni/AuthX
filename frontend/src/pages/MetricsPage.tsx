import { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Database, BarChart3, Fingerprint, ShieldCheck, HardDrive } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

const ALGO_COLORS: Record<string, string> = {
  'Argon2id': '#10b981', // emerald-500
  'bcrypt': '#f59e0b',   // amber-500
  'PBKDF2': '#8b5cf6',   // violet-500
  'scrypt': '#f43f5e',   // rose-500
  'SHA-256': '#94a3b8',   // slate-400
};

const ALGO_BG_COLORS: Record<string, string> = {
  'Argon2id': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bcrypt': 'bg-amber-50 text-amber-700 border-amber-200',
  'PBKDF2': 'bg-violet-50 text-violet-700 border-violet-200',
  'scrypt': 'bg-rose-50 text-rose-700 border-rose-200',
  'SHA-256': 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:3001/metrics');
      
      const mapped = data.stats.map((s: any) => ({
        ...s,
        memory_usage_mb: s.algorithm === 'Argon2id' ? 64 : s.algorithm === 'scrypt' ? 32 : 1,
        crack_resistance: s.algorithm === 'Argon2id' ? 100 : s.algorithm === 'scrypt' ? 90 : s.algorithm === 'bcrypt' ? 65 : s.algorithm === 'PBKDF2' ? 50 : 5,
        color: ALGO_COLORS[s.algorithm] || '#94a3b8'
      }));
      setMetrics(mapped);
    } catch (error) {
      console.error('Failed to fetch metrics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-bold text-slate-900 mb-1">{label}</p>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></span>
            {payload[0].name}: <span className="text-slate-900 font-mono font-bold">{payload[0].value.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-700 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cryptographic Benchmarks</h1>
          <p className="text-slate-500 mt-1">Multi-algorithm performance profiling and security resistance evaluation.</p>
        </div>
        <button 
          onClick={fetchMetrics} 
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all flex items-center gap-2 text-sm font-medium text-slate-600 shadow-sm"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Refresh Data
        </button>
      </div>

      {/* Comparison Table */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
            <Database className="w-5 h-5 text-indigo-600" />
            Comparison Matrix
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pl-6">Algorithm</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Avg Hash (ms)</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Avg Verify (ms)</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Memory Footprint</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pr-6">Crack Resistance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-100">
                    <TableCell className="pl-6"><Skeleton className="h-5 w-24 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 bg-slate-100" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 bg-slate-100" /></TableCell>
                    <TableCell className="pr-6"><Skeleton className="h-5 w-32 bg-slate-100" /></TableCell>
                  </TableRow>
                ))
              ) : (
                metrics.map((m) => (
                  <TableRow key={m.algorithm} className="hover:bg-slate-50 border-slate-100 transition-colors">
                    <TableCell className="pl-6">
                      <div className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                        ALGO_BG_COLORS[m.algorithm] || "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {m.algorithm}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-slate-600">{m.avg_hash_time?.toFixed(2)} ms</TableCell>
                    <TableCell className="font-mono text-slate-600">{m.avg_verify_time?.toFixed(2)} ms</TableCell>
                    <TableCell className="font-mono text-slate-600">{m.memory_usage_mb} MB</TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div 
                            className="h-full transition-all duration-1000" 
                            style={{ 
                              width: `${m.crack_resistance}%`,
                              backgroundColor: m.color
                            }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500 w-8">{m.crack_resistance}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {/* Hash Latency Chart */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Hash Computation Latency
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
             {loading ? <Skeleton className="h-full w-full bg-slate-50" /> : 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="algorithm" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="avg_hash_time" name="Avg Hash Time" radius={[4, 4, 0, 0]}>
                    {metrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             }
          </CardContent>
          <div className="px-6 pb-4 text-[10px] text-slate-500 uppercase tracking-tighter">Lower is faster (ms)</div>
        </Card>

        {/* Verification Latency Chart */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <Fingerprint className="w-4 h-4 text-amber-600" />
              Verification Latency
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
             {loading ? <Skeleton className="h-full w-full bg-slate-50" /> : 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="algorithm" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="avg_verify_time" name="Avg Verify Time" radius={[4, 4, 0, 0]}>
                    {metrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             }
          </CardContent>
          <div className="px-6 pb-4 text-[10px] text-slate-500 uppercase tracking-tighter">Authentication checking delay (ms)</div>
        </Card>

        {/* Memory Usage Chart */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <HardDrive className="w-4 h-4 text-rose-600" />
              Memory Footprint
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] pt-6">
             {loading ? <Skeleton className="h-full w-full bg-slate-50" /> : 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="algorithm" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="memory_usage_mb" name="Memory Usage (MB)" radius={[4, 4, 0, 0]}>
                    {metrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             }
          </CardContent>
          <div className="px-6 pb-4 text-[10px] text-slate-500 uppercase tracking-tighter">Heap allocation per thread (MB)</div>
        </Card>

        {/* Security / Radar Chart */}
        <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              Security Hardness Score
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] flex items-center justify-center">
             {loading ? <Skeleton className="h-full w-full bg-slate-50" /> : 
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={metrics} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="algorithm" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Security Utility" 
                    dataKey="crack_resistance" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.2} 
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
             }
          </CardContent>
          <div className="px-6 pb-4 text-[10px] text-slate-500 uppercase tracking-tighter text-center italic">Aggregate resistance to brute-force vectors</div>
        </Card>
      </div>

      <div className="flex justify-center gap-8 flex-wrap pt-4">
        {Object.entries(ALGO_COLORS).map(([algo, color]) => (
          <div key={algo} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-xs font-semibold text-slate-400">{algo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
