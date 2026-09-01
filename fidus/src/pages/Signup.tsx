import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Shield, Briefcase, Wrench, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Client' | 'Artisan'>('Client');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole === 'Artisan' || urlRole === 'Client') {
      setRole(urlRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup({ fullName, email, password, role });
      navigate('/login');
    } catch {
      // Error toast is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-slate text-primary font-body flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-trust-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <Shield className="h-10 w-10 text-trust-blue group-hover:scale-110 transition-transform" />
          <span className="font-heading text-3xl font-bold tracking-tight text-white">Fidus</span>
        </Link>
        <h2 className="text-center font-heading text-2xl font-bold text-white mb-2">
          Create your account
        </h2>
        <p className="text-center text-sm text-slate-400">
          Join Fidus to connect, work, and build trust
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-surface border border-border py-8 px-4 shadow-[0_0_30px_rgba(59,130,246,0.1)] sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                I want to join Fidus as a...
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('Client')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    role === 'Client'
                      ? 'border-trust-blue bg-trust-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'border-border bg-deep-slate hover:border-slate-500'
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mb-2 ${role === 'Client' ? 'text-trust-blue' : 'text-slate-400'}`} />
                  <span className={`font-heading font-bold ${role === 'Client' ? 'text-white' : 'text-slate-300'}`}>Client</span>
                  <span className="text-xs text-slate-400 mt-1">I need services</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('Artisan')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    role === 'Artisan'
                      ? 'border-trust-blue bg-trust-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'border-border bg-deep-slate hover:border-slate-500'
                  }`}
                >
                  <Wrench className={`h-8 w-8 mb-2 ${role === 'Artisan' ? 'text-trust-blue' : 'text-slate-400'}`} />
                  <span className={`font-heading font-bold ${role === 'Artisan' ? 'text-white' : 'text-slate-300'}`}>Artisan</span>
                  <span className="text-xs text-slate-400 mt-1">I offer services</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Input
                label="Full Name"
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                icon={<User className="h-5 w-5" />}
                required
              />

              <Input
                label="Email address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5" />}
                required
              />

              <Input
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-trust-blue hover:text-blue-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
