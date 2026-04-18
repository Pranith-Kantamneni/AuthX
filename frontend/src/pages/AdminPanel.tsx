import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Unlock, Download, Users, AlertOctagon } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/users');
      setUsers(data.users);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleLock = async (userId: string, isLocked: boolean) => {
    const action = isLocked ? 'unlock' : 'lock';
    await axios.put(`http://localhost:3001/users/${action}/${userId}`);
    fetchUsers();
  };

  const exportCSV = () => {
    const header = "User ID,Username,Algorithm,Created At,Failed Attempts\n";
    const csv = users.map(u => `${u.user_id},${u.username},${u.algorithm},${u.created_at},${u.failed_attempts}`).join("\n");
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_export_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Administrators Platform</h1>
          <p className="text-slate-500">View registered users, track failed login anomalies, and execute account locks manually.</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
          <Download className="w-4 h-4"/> CSV Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Registered Directory
          </CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UUID</TableHead>
              <TableHead>System Username</TableHead>
              <TableHead>Active Encryption</TableHead>
              <TableHead>Failure Anomalies</TableHead>
              <TableHead className="text-right">Access Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isLocked = u.failed_attempts >= 10;
              return (
                <TableRow key={u.user_id} className={isLocked ? "bg-red-50" : ""}>
                  <TableCell className="font-mono text-xs text-slate-400">{u.user_id}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{u.username}</TableCell>
                  <TableCell><span className="px-2 py-1 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono">{u.algorithm}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {isLocked && <AlertOctagon className="w-3 h-3 text-red-600 mr-1"/>}
                      <span className={isLocked ? 'text-red-700 font-bold' : 'text-slate-500'}>{u.failed_attempts}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant={isLocked ? "outline" : "destructive"} 
                      onClick={() => toggleLock(u.user_id, isLocked)}
                      className={isLocked ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" : ""}
                    >
                      {isLocked ? <><Unlock className="w-3.5 h-3.5 mr-1"/> Allow</> : <><Lock className="w-3.5 h-3.5 mr-1"/> Revoke</>}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
