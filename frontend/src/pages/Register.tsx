import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, label: 'Weak', algo: 'argon2id (Heavy)' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (password.length === 0) setStrength({ score: 0, label: 'None', algo: '-' });
    else if (score >= 4 && password.length >= 12) setStrength({ score: 4, label: 'Strong', algo: 'argon2id (Standard)' });
    else if (score >= 2 && password.length >= 8) setStrength({ score: 2, label: 'Medium', algo: 'scrypt' });
    else setStrength({ score: 1, label: 'Weak', algo: 'argon2id (Heavy Deterrent)' });
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3001/register', { username, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center pt-10">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900">Create an account</CardTitle>
          <CardDescription>Enter your details to onboard onto the secure hashing platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4"/> {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Username</label>
              <Input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="system_admin"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Password</label>
              <Input 
                type="password"
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              {password.length > 0 && (
                <div className="pt-2 animate-in fade-in duration-300">
                  <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-100">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className={`h-full flex-1 transition-colors ${s <= strength.score ? (strength.score >= 4 ? 'bg-emerald-500' : strength.score >= 2 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-slate-500">Strength: <span className="font-semibold text-slate-700">{strength.label}</span></span>
                    <span className="text-slate-500">Engine: <span className="text-indigo-600 font-mono font-medium">{strength.algo}</span></span>
                  </div>
                </div>
              )}
            </div>
            
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning Salt...</> : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
