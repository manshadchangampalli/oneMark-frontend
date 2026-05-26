import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn as clsx } from '@/utils/cn';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/api/auth.api';
import { useStates, useDistricts } from '@/hooks/location.hooks';
import { ExamCategoryPicker } from '@/components/ui/ExamCategoryPicker';
import { useSignup, useLogin } from './hooks/auth.hooks';
import {
  Wordmark,
  I,
  Button,
  Field,
  TextInput,
  PasswordInput,
  Select,
  StrengthMeter,
  strengthOf,
  GRADES,
} from './components/AuthComponents';

// ---------- Auth Container ----------
function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-0 sm:p-8 bg-surface dark:bg-surface-dark">
      <div className="
        w-full sm:max-w-[440px] sm:rounded-2xl sm:border sm:border-line sm:dark:border-line-dark sm:shadow-lg
        bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark
        h-dvh sm:h-auto sm:min-h-[640px] flex flex-col overflow-hidden relative
      ">
        {children}
      </div>
    </div>
  );
}

// ---------- Top bar ----------
function TopBar({ onBack, title, step, total }: any) {
  return (
    <div className="px-3 pt-3 pb-3 flex items-center gap-2">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-ink/4 dark:hover:bg-ink-dark/6 text-ink dark:text-ink-dark"
      >
        <I.arrowLeft/>
      </button>
      <div className="flex-1 text-center">
        <div className="text-[12.5px] font-medium text-ink dark:text-ink-dark">{title}</div>
        {step && (
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-ink-muted dark:text-ink-muted-dark font-mono mt-0.5">
            Step <span className="tab-num">{step}</span> of <span className="tab-num">{total}</span>
          </div>
        )}
      </div>
      <div className="w-10"/>
    </div>
  );
}

// ---------- Step bar ----------
function StepBar({ step, total }: any) {
  return (
    <div className="px-6 pb-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={clsx(
            'flex-1 h-1 rounded-full transition-colors',
            i + 1 <= step ? 'bg-accent' : 'bg-line dark:bg-line-dark'
          )}/>
        ))}
      </div>
    </div>
  );
}

// ====================================================================
// SCREENS
// ====================================================================

function WelcomeView({ onLogin, onSignup }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 flex flex-col h-full"
    >
      <div className="flex-1 px-6 pt-6 flex flex-col min-h-0 overflow-hidden">
        <Wordmark size="lg" />
        <div className="mt-4 relative shrink-0">
          <div className="h-[150px] rounded-xl2 border border-line dark:border-line-dark bg-surface dark:bg-surface-dark overflow-hidden">
             <svg viewBox="0 0 320 240" className="w-full h-full">
              <defs>
                <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#D4541A"/>
                  <stop offset="1" stopColor="#E8580C"/>
                </linearGradient>
              </defs>
              <rect width="320" height="240" fill="transparent"/>
              {[60,120,180].map(y => (
                <line key={y} x1="40" y1={y} x2="280" y2={y} stroke="currentColor" className="text-line dark:text-line-dark" strokeWidth="1"/>
              ))}
              <path d="M40 200 Q 160 30 280 200" stroke="url(#arc)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {[
                [80,162],[120,118],[160,86],[200,118],[240,162]
              ].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="#D4541A"/>
              ))}
              <line x1="40" y1="200" x2="280" y2="200" stroke="currentColor" className="text-ink dark:text-ink-dark" strokeWidth="1.5"/>
              <line x1="40" y1="200" x2="40" y2="40" stroke="currentColor" className="text-ink dark:text-ink-dark" strokeWidth="1.5"/>
              <text x="48" y="55" className="font-mono" fontSize="10" fill="currentColor" opacity="0.55">v</text>
              <text x="265" y="220" className="font-mono" fontSize="10" fill="currentColor" opacity="0.55">x</text>
            </svg>
          </div>
          <div className="absolute -bottom-3 -right-3 px-3 py-2 rounded-xl2 bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark border border-ink dark:border-ink-dark text-[11px] font-mono">
            <span className="tab-num">+50 XP</span> daily
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-[22px] leading-[1.2] font-semibold tracking-tight text-ink dark:text-ink-dark">
            One question, every day.<br/>
            <span className="font-serif italic font-normal text-ink-muted dark:text-ink-muted-dark">A whole lot of progress.</span>
          </h1>
          <p className="mt-1.5 text-[13px] text-ink-muted dark:text-ink-muted-dark leading-relaxed max-w-[34ch]">
            Drill JEE, NEET, CUET and Boards with adaptive practice and explanations from real students.
          </p>
        </div>
      </div>
      <div className="px-6 pb-6 pt-4 space-y-3 border-t border-line dark:border-line-dark bg-paper dark:bg-paper-dark shrink-0">
        <Button variant="primary" iconRight={<I.arrowRight/>} onClick={onSignup}>
          Create account
        </Button>
        <Button variant="secondary" onClick={onLogin}>
          I already have an account
        </Button>
      </div>
    </motion.div>
  );
}

function LoginView({ onBack, onSignup, onSuccess }: any) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<any>({});
  const setAuth = useAuthStore(s => s.setAuth);
  const loginMutation = useLogin();

  const submit = async (e: any) => {
    e.preventDefault();
    setErr({});
    if (!email || !pw) { setErr({ general: 'Please fill in all fields' }); return; }
    loginMutation.mutate({ email, password: pw }, {
      onSuccess: async (tokens) => {
        const user = await authApi.getMe(tokens.accessToken);
        setAuth(user, tokens.accessToken);
        toast.success('Logged in successfully!');
        onSuccess();
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || 'Login failed';
        setErr({ general: msg });
        toast.error(msg);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col h-full"
    >
      <TopBar onBack={onBack} title="Sign in" />
      <form onSubmit={submit} className="flex-1 flex flex-col px-6 pt-2">
        <div className="mb-7">
          <h1 className="text-[24px] font-semibold tracking-tight text-ink dark:text-ink-dark">Welcome back.</h1>
          <p className="mt-1 text-[13.5px] text-ink-muted dark:text-ink-muted-dark">Pick up where you left off — your streak is waiting.</p>
        </div>
        <div className="space-y-4">
          <Field label="Email" error={err.email || (err.general && !pw && !email ? err.general : null)}>
            <TextInput icon={<I.mail/>} type="email" value={email} onChange={(e:any) => setEmail(e.target.value)} placeholder="you@onemark.in" />
          </Field>
          <Field label="Password" error={err.pw}>
            <PasswordInput value={pw} onChange={(e:any) => setPw(e.target.value)} />
          </Field>
          {err.general && <p className="text-bad text-[12px] font-medium">{err.general}</p>}
        </div>
        <div className="flex-1" />
        <div className="space-y-3 pb-12 pt-6">
          <Button variant="primary" type="submit" loading={loginMutation.isPending}>Sign in</Button>
          <Button variant="google" icon={<I.google/>}>Continue with Google</Button>
          <p className="text-center text-[13px] text-ink-muted dark:text-ink-muted-dark mt-3">
            New here? <button type="button" onClick={onSignup} className="font-medium text-ink dark:text-ink-dark">Create an account</button>
          </p>
        </div>
      </form>
    </motion.div>
  );
}

function SignupView({ onBack, onSuccess }: any) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: '', password: '', name: '',
    stateId: '', district: '',
    school: '', grade: '', targetExam: '',
  });
  const [err, setErr] = useState<any>({});
  const { data: states = [] } = useStates();
  const { data: districts = [] } = useDistricts(data.stateId);
  const setAuth = useAuthStore(s => s.setAuth);
  const signupMutation = useSignup();
  const TOTAL = 4;

  const set = (k: string, v: string) => setData(d => ({ ...d, [k]: v }));

  const next = async () => {
    const e: any = {};
    if (step === 1) {
      if (!data.email) e.email = 'Email is required';
      if (!data.password || strengthOf(data.password).score < 2) e.password = 'Password is too weak';
    }
    if (step === 2 && !data.name.trim()) e.name = 'Name is required';
    if (step === 3 && (!data.stateId || !data.district)) e.location = 'Location is required';
    if (step === 4 && !data.targetExam) e.targetExam = 'Please select your target exam';

    if (Object.keys(e).length) { setErr(e); return; }
    setErr({});

    if (step < TOTAL) {
      setStep(step + 1);
    } else {
      const selectedState = states.find(s => s.id === data.stateId);
      signupMutation.mutate({ ...data, state: selectedState?.name ?? '' }, {
        onSuccess: async (tokens) => {
          const user = await authApi.getMe(tokens.accessToken);
          setAuth(user, tokens.accessToken);
          toast.success('Welcome to oneMark!');
          onSuccess();
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || 'Signup failed';
          setErr({ general: msg });
          toast.error(msg);
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col h-full"
    >
      <TopBar onBack={() => step > 1 ? setStep(step - 1) : onBack()} title="Create account" step={step} total={TOTAL} />
      <StepBar step={step} total={TOTAL} />
      <div className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto no-scrollbar">
        {step === 1 && (
          <div className="view-in">
            <h1 className="text-[22px] font-semibold tracking-tight">Let's start with your <span className="font-serif italic font-normal">login.</span></h1>
            <div className="mt-6 space-y-4">
              <Field label="Email" error={err.email}><TextInput icon={<I.mail/>} value={data.email} onChange={(e:any) => set('email', e.target.value)} /></Field>
              <Field label="Password" error={err.password}><PasswordInput value={data.password} onChange={(e:any) => set('password', e.target.value)} /><StrengthMeter pw={data.password}/></Field>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="view-in">
            <h1 className="text-[22px] font-semibold tracking-tight">What should we <span className="font-serif italic font-normal">call you?</span></h1>
            <div className="mt-6 space-y-4">
              <Field label="Full name" error={err.name}><TextInput icon={<I.user/>} value={data.name} onChange={(e:any) => set('name', e.target.value)} /></Field>
              {data.name && (
                <div className="rounded-xl2 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold uppercase">{data.name[0]}</div>
                  <div><div className="text-[14px] font-medium">{data.name}</div><div className="text-[11px] text-ink-muted">Profile preview</div></div>
                </div>
              )}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="view-in">
            <h1 className="text-[22px] font-semibold tracking-tight">Where are you <span className="font-serif italic font-normal">based?</span></h1>
            <div className="mt-6 space-y-4">
              <Field label="State"><Select icon={<I.pin/>} value={data.stateId} onChange={(e:any) => { set('stateId', e.target.value); set('district', ''); }} options={states.map(s => s.name)} optionValues={states.map(s => s.id)} placeholder="Select state" /></Field>
              <Field label="District" error={err.location}><Select icon={<I.pin/>} value={data.district} onChange={(e:any) => set('district', e.target.value)} options={districts.map(d => d.name)} placeholder="Select district" disabled={!data.stateId} /></Field>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="view-in">
            <h1 className="text-[22px] font-semibold tracking-tight">Tell us about your <span className="font-serif italic font-normal">studies.</span></h1>
            <div className="mt-6 space-y-4">
              <Field label="School or institute" optional><TextInput icon={<I.school/>} value={data.school} onChange={(e:any) => set('school', e.target.value)} /></Field>
              <Field label="Current grade" optional><Select value={data.grade} onChange={(e:any) => set('grade', e.target.value)} options={GRADES} placeholder="Select grade" /></Field>
              <Field label="Target exam" error={err.targetExam}>
                <ExamCategoryPicker
                  value={data.targetExam}
                  onChange={(code) => set('targetExam', code)}
                />
              </Field>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 pb-12 pt-4 border-t border-line dark:border-line-dark">
        <Button variant="primary" onClick={next} loading={signupMutation.isPending}>{step === TOTAL ? 'Complete' : 'Continue'}</Button>
        {err.general && <p className="text-bad text-[12px] text-center mt-2">{err.general}</p>}
      </div>
    </motion.div>
  );
}


export default function AuthScreen() {
  const [view, setView] = useState('welcome');
  const navigate = useNavigate();

  const handleSuccess = () => navigate(ROUTES.HOME, { replace: true });

  return (
    <AuthContainer>
      <AnimatePresence mode="wait">
        {view === 'welcome' && <WelcomeView key="w" onLogin={() => setView('login')} onSignup={() => setView('signup')} />}
        {view === 'login' && <LoginView key="l" onBack={() => setView('welcome')} onSignup={() => setView('signup')} onSuccess={handleSuccess} />}
        {view === 'signup' && <SignupView key="s" onBack={() => setView('welcome')} onLogin={() => setView('login')} onSuccess={handleSuccess} />}
      </AnimatePresence>
    </AuthContainer>
  );
}
