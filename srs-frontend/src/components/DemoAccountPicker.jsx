import { useState } from 'react';
import { GraduationCap, Briefcase, ShieldCheck, Eye, EyeOff, Check } from 'lucide-react';
import './DemoAccountPicker.css';

const DEMO_PASSWORD = 'Demo@1234';

// These accounts are created by srs-backend/scripts/seed.js. Keep in sync with it.
export const DEMO_ACCOUNTS = {
  director: { username: 'director', fullname: 'Dr. Alemayehu Girma', role: 'Director' },
  teacher: { username: 'teacher1', fullname: 'Abebe Negash', role: 'Teacher' },
  student: { username: 'selamtadesse1000', fullname: 'Selam Tadesse', role: 'Student' },
};

const ROLES = [
  { key: 'director', icon: ShieldCheck, blurb: 'Full access: manage users, subjects, timetable, announcements' },
  { key: 'teacher', icon: Briefcase, blurb: 'Class roster, mark sheets, attendance, resources' },
  { key: 'student', icon: GraduationCap, blurb: 'Results, attendance, timetable, announcements' },
];

export default function DemoAccountPicker({ onPick, disabled = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState('');

  const copy = async (username, label) => {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(label);
      setTimeout(() => setCopied(''), 1600);
    } catch (e) {
      // Clipboard can be blocked; not critical for the demo.
    }
  };

  return (
    <div className="demo-picker">
      <div className="demo-picker-head">
        <h3>Demo Accounts</h3>
        <span className="demo-badge">SAMPLE DATA</span>
      </div>

      <p className="demo-picker-sub">
        Pick a role to fill the form, then sign in. All demo accounts share one password.
      </p>

      <div className="demo-role-list">
        {ROLES.map(({ key, icon: Icon, blurb }) => {
          const account = DEMO_ACCOUNTS[key];
          return (
            <button
              type="button"
              key={key}
              className="demo-role"
              onClick={() => onPick(account.username)}
              disabled={disabled}
              title={blurb}
            >
              <span className="demo-role-icon"><Icon size={20} /></span>
              <span className="demo-role-text">
                <strong>{account.role}</strong>
                <small>{account.fullname}</small>
              </span>
              <code className="demo-role-user">{account.username}</code>
            </button>
          );
        })}
      </div>

      <div className="demo-password-row">
        <span className="demo-password-label">Password</span>
        <code className="demo-password-value">{showPassword ? DEMO_PASSWORD : '\u2022'.repeat(8)}</code>
        <button
          type="button"
          className="demo-icon-btn"
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button
          type="button"
          className="demo-icon-btn"
          onClick={() => copy(DEMO_PASSWORD, 'pw')}
          aria-label="Copy password"
          title="Copy password"
        >
          {copied === 'pw' ? <Check size={16} /> : <span className="demo-copy-text">Copy</span>}
        </button>
      </div>

      <p className="demo-picker-note">
        Self-registration is closed. In production a director creates every account from
        Admin &rarr; Add User.
      </p>
    </div>
  );
}
