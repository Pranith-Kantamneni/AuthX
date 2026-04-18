import { Shield, Zap, Lock, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full max-w-6xl flex flex-col items-center mt-12 text-center">
      <div className="inline-block p-4 rounded-full bg-indigo-50 mb-6 border border-indigo-100">
        <Shield className="w-16 h-16 text-indigo-600" />
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        Next-Generation <br /> Adaptive Authentication
      </h1>
      <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
        Our platform dynamically switches between scrypt, argon2, bcrypt, and PBKDF2 based on password strength and server load. Secured with hybrid temporal salting.
      </p>
      
      <div className="flex gap-4 mb-20">
        <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200">
          Get Started
        </Link>
        <Link to="/metrics" className="px-8 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-all">
          View Metrics
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full text-left">
        {[
          { icon: <Lock className="text-blue-600 w-8 h-8 mb-4"/>, title: 'Hybrid Salting', desc: 'Combines a 16-byte random salt with an HMAC-SHA256 temporal salt.' },
          { icon: <Zap className="text-purple-600 w-8 h-8 mb-4"/>, title: 'Dynamic Algorithms', desc: 'Automatically escalates to Argon2id for weak passwords or shifts algorithms under high load.' },
          { icon: <Database className="text-green-600 w-8 h-8 mb-4"/>, title: 'Constant-time Compare', desc: 'Safeguarded against timing attacks during hash verification via crypto timing-safe functions.' }
        ].map((feature, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300 cursor-pointer hover:border-indigo-300 hover:shadow-md">
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2 text-slate-900">{feature.title}</h3>
            <p className="text-slate-500 leading-snug">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
