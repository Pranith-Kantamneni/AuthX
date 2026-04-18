import { useState } from 'react';
import axios from 'axios';
import { Play, Cpu, Server, Clock, Activity, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function LiveSimulation() {
  const [algo, setAlgo] = useState('argon2id');
  const [count, setCount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runBenchmark = async () => {
    setLoading(true);
    setResults(null);
    try {
      const { data } = await axios.post('http://localhost:3001/benchmark', { algorithm: algo, count });
      setResults(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Live Authentication Simulation</h1>
        <p className="text-slate-500">Trigger computational hashing bursts sequentially on the backend server to profile load resilience.</p>
      </div>

      <Card className="border-indigo-100 shadow-sm">
        <CardHeader><CardTitle className="text-indigo-600 text-xl flex items-center gap-2"><Zap className="w-5 h-5"/> Benchmark Parameters</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="w-full md:w-1/3">
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Algorithm Engine</label>
              <select className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={algo} onChange={e => setAlgo(e.target.value)}>
                <option value="argon2id">Argon2id (High Memory Hardness)</option>
                <option value="scrypt">Scrypt (Resistant to ASIC)</option>
                <option value="bcrypt">Bcrypt (Legacy Standard)</option>
                <option value="PBKDF2">PBKDF2-HMAC-SHA256 (NIST Approved)</option>
                <option value="SHA-256">Raw SHA-256 (Insecure Baseline)</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Concurrency Load (Simulated Users)</label>
              <select className="w-full bg-white text-slate-900 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={count} onChange={e => setCount(e.target.value)}>
                <option value="10">10 (Standard Test)</option>
                <option value="50">50 (Moderate Load)</option>
                <option value="100">100 (Stress Test)</option>
                <option value="500">500 (Extreme Burn - Warning)</option>
              </select>
            </div>
            <div>
              <Button onClick={runBenchmark} disabled={loading} className="gap-2 h-11 px-8 rounded-lg shadow-sm">
                {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {loading ? 'Executing on Server...' : 'Trigger Simulation'}
              </Button>
            </div>
          </div>
          {loading && (
             <div className="mt-6">
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden rounded-full">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 w-full origin-left animate-pulse"></div>
                </div>
                <p className="text-xs text-indigo-600 mt-2 flex animate-pulse font-medium">Computing continuous hash matrices...</p>
             </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
           <Card className="border-t-4 border-t-cyan-500 bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500 font-medium">Throughput</CardTitle><Server className="w-4 h-4 text-cyan-600 absolute right-6 top-6" /></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{results.throughputReqSec.toFixed(2)}</div><p className="text-xs text-slate-500 mt-1">requests / sec</p></CardContent></Card>
           <Card className="border-t-4 border-t-indigo-500 bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500 font-medium">Avg Compute Time</CardTitle><Clock className="w-4 h-4 text-indigo-600 absolute right-6 top-6" /></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{results.avg.toFixed(2)}</div><p className="text-xs text-slate-500 mt-1">ms / operation</p></CardContent></Card>
           <Card className="border-t-4 border-t-purple-500 bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500 font-medium">p95 Latency</CardTitle><Activity className="w-4 h-4 text-purple-600 absolute right-6 top-6" /></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{results.p95.toFixed(2)}</div><p className="text-xs text-slate-500 mt-1">95th percentile delay</p></CardContent></Card>
           <Card className="border-t-4 border-t-pink-500 bg-white shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500 font-medium">Allocated RAM Burst</CardTitle><Cpu className="w-4 h-4 text-pink-600 absolute right-6 top-6" /></CardHeader><CardContent><div className="text-3xl font-bold text-slate-900">{results.memoryUsageMb.toFixed(2)}</div><p className="text-xs text-slate-500 mt-1">MB of heap memory injected</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
