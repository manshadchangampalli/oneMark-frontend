import React from 'react';
import { cn as clsx } from '@/utils/cn';

export const STATES_DISTRICTS: Record<string, string[]> = {
  'Maharashtra':    ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur'],
  'Delhi':          ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'],
  'Karnataka':      ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  'Tamil Nadu':     ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli'],
  'Kerala':         ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'],
  'West Bengal':    ['Kolkata', 'Howrah', 'Darjeeling', 'Hooghly', 'North 24 Parganas', 'South 24 Parganas'],
  'Gujarat':        ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
  'Rajasthan':      ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  'Uttar Pradesh':  ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Ghaziabad', 'Noida', 'Allahabad'],
  'Telangana':      ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore'],
  'Punjab':         ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
  'Haryana':        ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Bihar':          ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Odisha':         ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
};
export const STATES = Object.keys(STATES_DISTRICTS);

export const GRADES = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Repeater / Drop year', 'Undergraduate'];
export const TARGET_EXAMS = [
  { id: 'jee',    label: 'JEE',          sub: 'Main + Advanced' },
  { id: 'neet',   label: 'NEET',         sub: 'Medical entrance' },
  { id: 'cuet',   label: 'CUET',         sub: 'Central universities' },
  { id: 'boards', label: 'Boards',       sub: 'CBSE / ICSE / State' },
  { id: 'gate',   label: 'GATE',         sub: 'Engineering PG' },
  { id: 'cat',    label: 'CAT',          sub: 'Management' },
  { id: 'olymp',  label: 'Olympiads',    sub: 'KVPY · NTSE · IMO' },
  { id: 'other',  label: 'Something else', sub: 'I’ll figure it out' },
];

export const I = {
  arrowLeft: (p: any)  => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
  arrowRight: (p: any) => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  check: (p: any)      => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>,
  eye: (p: any)        => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: (p: any)     => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.88 4.24A10.7 10.7 0 0 1 12 4c7 0 10 8 10 8a17.7 17.7 0 0 1-3.16 4.19"/><path d="M6.61 6.61A17.7 17.7 0 0 0 2 12s3 8 10 8a10.7 10.7 0 0 0 5.39-1.39"/><path d="m2 2 20 20"/><path d="M14.12 14.12A3 3 0 0 1 9.88 9.88"/></svg>,
  mail: (p: any)       => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>,
  lock: (p: any)       => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>,
  user: (p: any)       => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  school: (p: any)     => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m4 6 8-4 8 4-8 4z"/><path d="M4 10v6l8 4 8-4v-6"/><path d="M12 10v10"/></svg>,
  pin: (p: any)        => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  chevronDown: (p: any)=> <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6"/></svg>,
  google: (p: any)     => <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" {...p}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.17v2.84A11 11 0 0 0 12 23Z" fill="#34A853"/><path d="M5.85 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.17a11 11 0 0 0 0 9.86l3.68-2.84Z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.17 7.07L5.85 9.9C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335"/></svg>,
};

export function Wordmark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const s = size === 'lg' ? 32 : 24;
  return (
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="oneMark" style={{ height: s }} className="w-auto object-contain" />
    </div>
  );
}

export function Field({ label, hint, error, optional, children }: any) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] font-medium text-ink dark:text-ink-dark">
          {label}
          {optional && <span className="ml-1.5 text-[11px] font-normal text-ink-muted dark:text-ink-muted-dark">optional</span>}
        </span>
        {hint && <span className="text-[11px] text-ink-muted dark:text-ink-muted-dark font-mono">{hint}</span>}
      </div>
      {children}
      {error && (
        <div className="mt-1.5 text-[12px] text-bad font-medium">{error}</div>
      )}
    </label>
  );
}

export function TextInput({ icon, type = 'text', value, onChange, placeholder, autoComplete, error, rightSlot, onBlur }: any) {
  return (
    <div className={clsx(
      'flex items-center gap-2.5 h-12 px-3.5 rounded-xl2 border bg-surface dark:bg-surface-dark transition-colors',
      error
        ? 'border-bad/60'
        : 'border-line dark:border-line-dark focus-within:border-ink/40 dark:focus-within:border-ink-dark/40'
    )}>
      {icon && <span className="text-ink-muted dark:text-ink-muted-dark shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="flex-1 min-w-0 bg-transparent outline-none text-[15px] text-ink dark:text-ink-dark placeholder:text-ink-muted/70 dark:placeholder:text-ink-muted-dark/70"
      />
      {rightSlot}
    </div>
  );
}

export function PasswordInput({ value, onChange, placeholder = '••••••••', autoComplete }: any) {
  const [show, setShow] = React.useState(false);
  return (
    <TextInput
      icon={<I.lock />}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="shrink-0 w-8 h-8 -mr-1 flex items-center justify-center rounded-md text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <I.eyeOff size={16}/> : <I.eye size={16}/>}
        </button>
      }
    />
  );
}

export function Select({ icon, value, onChange, placeholder, options, disabled }: any) {
  return (
    <div className={clsx(
      'flex items-center gap-2.5 h-12 px-3.5 rounded-xl2 border bg-surface dark:bg-surface-dark transition-colors relative',
      'border-line dark:border-line-dark focus-within:border-ink/40 dark:focus-within:border-ink-dark/40',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      {icon && <span className="text-ink-muted dark:text-ink-muted-dark shrink-0">{icon}</span>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          'flex-1 min-w-0 bg-transparent outline-none text-[15px] appearance-none pr-6',
          value ? 'text-ink dark:text-ink-dark' : 'text-ink-muted/80 dark:text-ink-muted-dark/80'
        )}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o: any) => (
          <option key={typeof o === 'string' ? o : o.id || o.value} value={typeof o === 'string' ? o : o.id || o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3.5 text-ink-muted dark:text-ink-muted-dark pointer-events-none">
        <I.chevronDown size={14}/>
      </span>
    </div>
  );
}

export function Button({ children, variant='primary', size='lg', icon, iconRight, className='', disabled, onClick, type='button', loading }: any) {
  const sizes: any = {
    md: 'h-11 px-4 text-[14px]',
    lg: 'h-12 px-5 text-[15px]',
  };
  const variants: any = {
    primary:   'bg-accent text-white hover:bg-[#BF4715] disabled:bg-[#E0B19E] disabled:text-white/85 disabled:cursor-not-allowed',
    secondary: 'bg-transparent border border-ink/85 text-ink hover:bg-ink/[0.04] dark:border-ink-dark/70 dark:text-ink-dark dark:hover:bg-ink-dark/[0.06]',
    ghost:     'bg-transparent text-ink hover:bg-ink/[0.04] dark:text-ink-dark dark:hover:bg-ink-dark/[0.06]',
    google:    'bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-paper dark:hover:bg-paper-dark',
  };
  return (
    <button
      type={type} disabled={disabled || loading} onClick={onClick}
      className={clsx(
        'w-full inline-flex items-center justify-center gap-2 rounded-xl2 font-medium select-none ghost-press transition-colors',
        sizes[size], variants[variant], className,
      )}
    >
      {loading
        ? <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent animate-spin"/>
        : (icon && <span>{icon}</span>)}
      <span>{children}</span>
      {!loading && iconRight && <span>{iconRight}</span>}
    </button>
  );
}

export function strengthOf(pw: string) {
  if (!pw) return { score: 0, label: 'Empty', tone: 'muted' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map: any = [
    { label: 'Too short',  tone: 'bad'  },
    { label: 'Weak',       tone: 'bad'  },
    { label: 'Okay',       tone: 'warn' },
    { label: 'Good',       tone: 'good' },
    { label: 'Strong',     tone: 'good' },
    { label: 'Excellent',  tone: 'good' },
  ];
  return { score: s, ...map[Math.min(s, 5)] };
}

export function StrengthMeter({ pw }: { pw: string }) {
  const { score, label, tone } = strengthOf(pw);
  const pct = (score / 5) * 100;
  return (
    <div className="mt-2">
      <div className="h-1 rounded-full bg-paper dark:bg-paper-dark overflow-hidden border border-line dark:border-line-dark">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: tone === 'good' ? '#3D7A4E' : tone === 'warn' ? '#C8941E' : tone === 'bad' ? '#A8341C' : '#EAE5DA',
          }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[10.5px]">
        <span className={clsx(
          tone === 'good' && 'text-good',
          tone === 'warn' && 'text-warn',
          tone === 'bad' && 'text-bad',
          tone === 'muted' && 'text-ink-muted dark:text-ink-muted-dark'
        )}>{label}</span>
        <span className="text-ink-muted dark:text-ink-muted-dark">8+ chars · 1 number · 1 symbol</span>
      </div>
    </div>
  );
}
