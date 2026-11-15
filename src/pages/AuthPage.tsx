import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, user } = useAuth();
  
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const initialMode = location.pathname === '/signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-green-500' };
    return { score, label: 'Excellent', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validations = {
    name: name.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    password: password.length >= 8,
    confirmPassword: password === confirmPassword && confirmPassword.length > 0,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!validations.name || !validations.email || !validations.password || !validations.confirmPassword) {
        setError('Please fill in all fields correctly');
        return;
      }
      if (!agreedToTerms) {
        setError('Please agree to the terms and conditions');
        return;
      }
    } else {
      if (!validations.email || !validations.password) {
        setError('Please enter your email and password');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const result = mode === 'login' 
        ? await login(email, password, rememberMe)
        : await signup(name, email, password, rememberMe);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setError(null);
    setSuccess(false);
    navigate(newMode === 'signup' ? '/signup' : '/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Logo size="lg" />
          </motion.div>
          <motion.h1
            className="mt-8 text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {mode === 'login' ? 'Welcome back to your movie universe' : 'Start your cinematic journey'}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-white/60 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {mode === 'login'
              ? 'Pick up where you left off. Your watchlist, history, and favorites are waiting.'
              : 'Join millions of movie lovers. Track what you watch, build your watchlist, and discover your next favorite.'}
          </motion.p>
          <motion.div className="mt-8 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {[
              { icon: Sparkles, text: 'Personalized recommendations' },
              { icon: Check, text: 'Save your watchlist across devices' },
              { icon: Check, text: 'Track your watch history' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <item.icon size={14} strokeWidth={2.5} className="text-primary" />
                </div>
                <span className="text-white/70 text-sm">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="md" />
          </div>

          <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl mb-8">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`relative flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  mode === m ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
              >
                {mode === m && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark rounded-xl"
                    layoutId="auth-mode-bg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Create Account'}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                >
                  <Check size={36} strokeWidth={3} className="text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
                </h2>
                <p className="text-white/60">Redirecting you to your dashboard...</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {mode === 'login' ? 'Sign in to MoviePopcorn' : 'Create your account'}
                </h2>
                <p className="text-white/50 mb-8 text-sm">
                  {mode === 'login' ? 'Enter your credentials to access your account' : 'Fill in your details to get started'}
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X size={12} strokeWidth={3} className="text-red-400" />
                      </div>
                      <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div className="mb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Full Name</label>
                      <div className={`relative rounded-xl transition-all ${
                        focusedField === 'name' ? 'ring-2 ring-primary/50' : ''
                      } ${name && !validations.name ? 'ring-2 ring-red-500/50' : ''}`}>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <UserIcon size={18} className={focusedField === 'name' ? 'text-primary' : 'text-white/40'} />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="John Doe"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.06]"
                          autoComplete="name"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Email Address</label>
                  <div className={`relative rounded-xl transition-all ${
                    focusedField === 'email' ? 'ring-2 ring-primary/50' : ''
                  } ${email && !validations.email ? 'ring-2 ring-red-500/50' : ''}`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail size={18} className={focusedField === 'email' ? 'text-primary' : 'text-white/40'} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.06]"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Password</label>
                  <div className={`relative rounded-xl transition-all ${
                    focusedField === 'password' ? 'ring-2 ring-primary/50' : ''
                  } ${password && !validations.password ? 'ring-2 ring-red-500/50' : ''}`}>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock size={18} className={focusedField === 'password' ? 'text-primary' : 'text-white/40'} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.06]"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {mode === 'signup' && password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-white/40">{passwordStrength.label}</p>
                    </div>
                  )}
                </div>

                {mode === 'signup' && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Confirm Password</label>
                    <div className={`relative rounded-xl transition-all ${
                      focusedField === 'confirm' ? 'ring-2 ring-primary/50' : ''
                    } ${confirmPassword && !validations.confirmPassword ? 'ring-2 ring-red-500/50' : ''}`}>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Lock size={18} className={focusedField === 'confirm' ? 'text-primary' : 'text-white/40'} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/30 focus:outline-none focus:bg-white/[0.06]"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <button type="button" onClick={() => setRememberMe(!rememberMe)} className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      rememberMe ? 'bg-primary border-primary' : 'border-white/30'
                    }`}>
                      {rememberMe && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                    Remember me
                  </button>
                  {mode === 'login' && (
                    <span className="text-sm text-white/40">Forgot password? (coming soon)</span>
                  )}
                </div>

                {mode === 'signup' && (
                  <button type="button" onClick={() => setAgreedToTerms(!agreedToTerms)} className="flex items-start gap-2 mb-6 text-sm text-white/60">
                    <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                      agreedToTerms ? 'bg-primary border-primary' : 'border-white/30'
                    }`}>
                      {agreedToTerms && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Terms</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>
                    </span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
