import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, Shield } from 'lucide-react';
import { signInWithPassword, signUpWithPassword } from '../db';

type AuthProps = {
  onSuccess: (session: any) => void;
};

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [conference, setConference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password;

      if (!cleanEmail || !cleanPassword) {
        throw new Error('Informe e-mail e senha.');
      }

      const session =
        mode === 'login'
          ? await signInWithPassword(cleanEmail, cleanPassword)
          : await signUpWithPassword({
              email: cleanEmail,
              password: cleanPassword,
              fullName: fullName.trim() || undefined,
              conference: conference.trim() || undefined,
            });

      if (!session) {
        setInfo('Conta criada. Se seu projeto exigir confirmação de e-mail, verifique sua caixa de entrada e faça login em seguida.');
        setMode('login');
        return;
      }

      onSuccess(session);
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao autenticar.');
      // Mensagens comuns do Supabase para login/senha inválidos
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setError('E-mail ou senha inválidos.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e confirme para conseguir entrar.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Shield size={26} />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight">SSVP Brasil</h1>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Acesso Seguro</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold border border-rose-100">{error}</div>}
            {info && <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm font-semibold border border-emerald-100">{info}</div>}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {loading ? 'Aguarde...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;

