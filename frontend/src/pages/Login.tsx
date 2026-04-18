import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/login', { username, password });
      navigate('/dashboard', { state: { loginData: res.data } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center pt-24">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900">Access Platform</CardTitle>
          <CardDescription>Authenticate to access telemetry and systems.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 border border-red-100 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4"/> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Username</label>
              <Input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500">Password</label>
              </div>
              <Input 
                type="password"
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="mt-4 w-full" disabled={loading}>
               {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-slate-500">
          No account? <Link to="/register" className="ml-1 text-indigo-600 hover:underline">Create one</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
