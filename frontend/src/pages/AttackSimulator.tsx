import { useState } from 'react';
import axios from 'axios';
import { Skull, ShieldAlert, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function AttackSimulator() {
  const [algo, setAlgo] = useState('scrypt');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulate = async () => {
    setLoading(true);
    setResults(null);
    try {
      const { data } = await axios.post('http://localhost:3001/simulate-attack', { algorithm: algo });
      setResults(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const humanizeTime = (sec: number) => {
    if (sec < 1) return 'Instantly (< 1s)';
    if (sec < 60) return `${Math.floor(sec)} Seconds`;
    if (sec < 3600) return `${Math.floor(sec/60)} Minutes`;
    if (sec < 86400) return `${Math.floor(sec/3600)} Hours`;
    if (sec < 31536000) return `${Math.floor(sec/86400)} Days`;
    const yrs = sec/31536000;
    if (yrs > 1000) return `${(yrs/1000).toFixed(1)}k Years (Intractable)`;
    return `${Math.floor(yrs)} Years`;
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Cryptographic Attack Simulator</h1>
        <p className="text-slate-500">Estimate computational crack times based on mathematical collision probability spaces.</p>
      </div>

      <Card className="border-red-100">
        <CardHeader><CardTitle className="text-red-600 text-xl flex items-center gap-2"><Skull className="w-5 h-5"/> Attacker Configuration</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="w-full md:w-1/2">
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Target Protected Algorithm</label>
              <select className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 outline-none" value={algo} onChange={e => setAlgo(e.target.value)}>
                <option value="argon2id">Argon2id</option>
                <option value="scrypt">Scrypt</option>
                <option value="bcrypt">Bcrypt</option>
                <option value="PBKDF2">PBKDF2</option>
                <option value="SHA-256">Raw SHA-256</option>
              </select>
            </div>
            <div>
              <Button onClick={simulate} disabled={loading} variant="destructive" className="h-11 px-8 rounded-lg">
                {loading ? 'Crunching Matrices...' : 'Execute Mathematical Simulation'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-700">
           <Card className="bg-white border-orange-100">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Attacker Hash Rate</CardTitle><Cpu className="w-4 h-4 text-orange-500 absolute right-6 top-6" /></CardHeader>
              <CardContent><div className="text-2xl font-bold text-slate-900">{results.attemptsPerSec.toLocaleString()}</div><p className="text-xs text-slate-500 mt-1">computations / sec</p></CardContent>
           </Card>
           <Card className="bg-white border-red-100">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-red-600 font-medium">Dictionary Attack (100M)</CardTitle><ShieldAlert className="w-4 h-4 text-red-500 absolute right-6 top-6" /></CardHeader>
              <CardContent><div className="text-2xl font-bold text-slate-900">{humanizeTime(results.dictCrackTimeSec)}</div><p className="text-xs text-red-600/70 mt-1">to exhaust common wordlists</p></CardContent>
           </Card>
           <Card className="bg-white border-indigo-100">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-indigo-600 font-medium">Full Brute-Force (8 char)</CardTitle><Skull className="w-4 h-4 text-indigo-500 absolute right-6 top-6" /></CardHeader>
              <CardContent><div className="text-2xl font-bold text-slate-900">{humanizeTime(results.bruteForceCrackTimeSec)}</div><p className="text-xs text-indigo-600/70 mt-1">to exhaust entire alphanumeric space</p></CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
