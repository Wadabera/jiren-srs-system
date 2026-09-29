import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Book, Shield, Zap, Mail, Phone, MapPin, ChevronRight,
  Users, Award, Menu, X, Clock, BarChart3, MessageSquare, CalendarCheck,
  FileUp, ArrowUp, Play,
} from 'lucide-react';
import HeroBackdrop from '../components/HeroBackdrop';
import ScrollReveal from '../components/ScrollReveal';
import CountUp from '../components/CountUp';
import './Landing.css';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#features', label: 'Features' },
  { href: '#contact', label: 'Contact' },
];

const STATS = [
  { value: 2000, suffix: '+', label: 'Students Enrolled' },
  { value: 80, suffix: '+', label: 'Expert Teachers' },
  { value: 4, suffix: '', label: 'Academic Grades', prefix: '9' },
  { value: 100, suffix: '%', label: 'Digital Ready' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Data',
    body: 'Every student and teacher record is protected with hashed passwords, role-based access control, and encrypted transport.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    body: 'Grades, attendance, and announcements update instantly across every role, so nobody works from stale information.',
  },
  {
    icon: Book,
    title: 'Resource Center',
    body: 'Teachers upload learning materials once and every student in that grade can reach them, from any device.',
  },
  {
    icon: Users,
    title: 'Unified Messaging',
    body: 'A direct channel between students, teachers, and the administration, with the whole history kept per conversation.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    body: 'Assessment columns per subject with automatic totals, so students and teachers see performance at a glance.',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Registry',
    body: 'Mark a class present, absent, or late in one pass, then watch the percentages roll up automatically.',
  },
];

const ROLES = [
  {
    role: 'Director',
    icon: Award,
    points: ['Manage users, subjects, and timetables', 'Publish announcements school-wide', 'Full oversight of every record'],
  },
  {
    role: 'Teacher',
    icon: Book,
    points: ['Class roster with contact details', 'Build mark sheets and enter scores', 'Take attendance and share resources'],
  },
  {
    role: 'Student',
    icon: GraduationCap,
    points: ['Results with per-column breakdown', 'Own attendance and timetable', 'Download class resources'],
  },
];

const STEPS = [
  { icon: FileUp, title: 'Director sets up', body: 'Create accounts, register subjects, and lay out the weekly timetable.' },
  { icon: Clock, title: 'Teachers run the term', body: 'Mark attendance, enter scores against the assessment schema, upload resources.' },
  { icon: MessageSquare, title: 'Everyone stays connected', body: 'Announcements and direct messages reach the right people immediately.' },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showVideoHint, setShowVideoHint] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="landing-wrapper">
      {/* ---------------- Navigation ---------------- */}
      <nav className={`landing-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <Link to="/" className="landing-logo">
          <span className="landing-logo-mark"><GraduationCap size={26} /></span>
          <span className="landing-logo-text">
            <strong>JIREN HIGH</strong>
            <small>Jimma &middot; Est. SRS</small>
          </span>
        </Link>

        <div className="landing-nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); go(l.href); }}>
              {l.label}
            </a>
          ))}
          <Link to="/login" className="btn-enter">
            System Login <ChevronRight size={18} />
          </Link>
        </div>

        <button
          className="landing-menu-btn"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="landing-mobile-menu">
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => { e.preventDefault(); go(l.href); }}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {l.label}
            </a>
          ))}
          <Link to="/login" className="btn-enter" onClick={() => setMenuOpen(false)}>
            System Login <ChevronRight size={18} />
          </Link>
        </div>
      )}

      {/* ---------------- Hero ---------------- */}
      <header className="hero-section">
        <HeroBackdrop />

        <div className="hero-content">
          <span className="hero-badge">
            <span className="hero-badge-dot" /> Excellence in Education
          </span>

          <h1>
            <span className="hero-line">Jiren Secondary</span>
            <span className="hero-line hero-line-accent">High School</span>
          </h1>

          <p>
            A complete digital management system for student registration, attendance,
            assessment, and school communication. Built for directors, teachers, and
            students at Jiren &mdash; Jimma.
          </p>

          <div className="hero-btns">
            <Link to="/login" className="btn btn-secondary btn-lg">
              <Play size={18} /> Access Portal
            </Link>
            <a
              href="#features"
              onClick={(e) => { e.preventDefault(); go('#features'); }}
              className="btn btn-ghost btn-lg"
            >
              Explore Features
            </a>
          </div>

          <div className="hero-meta">
            <span><Shield size={15} /> Role-based access</span>
            <span><Zap size={15} /> Live from MongoDB</span>
            <span><Users size={15} /> 3 user roles</span>
          </div>
        </div>

        {/* Live preview card */}
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-top">
              <span className="hero-card-pill">Live Preview</span>
              <span className="hero-card-dots"><i /><i /><i /></span>
            </div>

            <div className="hero-card-body">
              <div className="hero-metric">
                <div className="hero-metric-icon"><Users size={22} /></div>
                <div>
                  <strong><CountUp value={113} /></strong>
                  <small>Students registered</small>
                </div>
              </div>
              <div className="hero-metric">
                <div className="hero-metric-icon"><Book size={22} /></div>
                <div>
                  <strong><CountUp value={12} /></strong>
                  <small>Teaching staff</small>
                </div>
              </div>
              <div className="hero-metric">
                <div className="hero-metric-icon"><BarChart3 size={22} /></div>
                <div>
                  <strong><CountUp value={4676} /></strong>
                  <small>Attendance records</small>
                </div>
              </div>
            </div>

            <div className="hero-card-bar">
              <span style={{ width: '78%' }} />
            </div>
            <div className="hero-card-caption">Sample data &mdash; full academic year</div>
          </div>
        </div>

        <button className="hero-scroll-hint" onClick={() => go('#about')} aria-label="Scroll to about">
          <span />
        </button>
      </header>

      {/* ---------------- Stats ---------------- */}
      <section className="stats-section">
        {STATS.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 90} className="stat-item">
            <h2><CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} /></h2>
            <p>{s.label}</p>
          </ScrollReveal>
        ))}
      </section>

      {/* ---------------- About ---------------- */}
      <section id="about" className="about-section">
        <ScrollReveal className="about-text">
          <span className="eyebrow">About the School</span>
          <h2>Built on a long record of academic excellence</h2>
          <p>
            Jiren Secondary High School sits in the heart of Jimma, Oromia. We hold
            to a holistic education that pairs traditional values with the tools
            modern students actually use.
          </p>
          <p>
            The Student Registration System is our commitment to transparency and
            efficiency. Instead of paper registers that go missing, every record lives
            in one place, and every role sees exactly what it needs.
          </p>

          <ul className="about-points">
            <li><Shield size={18} /> Accounts are created by the director, never self-service</li>
            <li><Zap size={18} /> Attendance, marks, and timetables update live</li>
            <li><MessageSquare size={18} /> Direct messaging across all three roles</li>
          </ul>
        </ScrollReveal>

        <ScrollReveal className="about-visual" delay={140}>
          <div className="about-card-stack">
            {ROLES.map((r, i) => (
              <div className="about-role-card" key={r.role} style={{ '--i': i }}>
                <div className="about-role-head">
                  <r.icon size={22} />
                  <strong>{r.role}</strong>
                </div>
                <ul>
                  {r.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="features-section">
        <ScrollReveal className="section-header">
          <span className="eyebrow">Capabilities</span>
          <h2>Modern school management</h2>
          <p>One integrated system covering the whole academic journey.</p>
        </ScrollReveal>

        <div className="features-grid-landing">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 80} className="feature-card-landing">
              <span className="feature-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="feature-icon-wrap"><f.icon size={26} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="flow-section">
        <ScrollReveal className="section-header">
          <span className="eyebrow">Workflow</span>
          <h2>Three steps to a full term</h2>
        </ScrollReveal>

        <div className="flow-grid">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 110} className="flow-card">
              <div className="flow-num">{i + 1}</div>
              <s.icon size={30} />
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} className="flow-cta">
          <Link to="/login" className="btn btn-primary btn-lg">
            Open the System Login <ChevronRight size={18} />
          </Link>
        </ScrollReveal>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="contact-section">
        <div className="contact-grid">
          <ScrollReveal className="contact-info-landing">
            <span className="eyebrow">Contact</span>
            <h2>Get in touch</h2>
            <p className="contact-lead">
              Questions about enrolment, the portal, or a demo walkthrough? The front
              office is the fastest route.
            </p>

            <div className="info-item">
              <span className="info-icon"><MapPin size={22} /></span>
              <div>
                <small>Location</small>
                <p>Jiren, Jimma, Oromia Region, Ethiopia</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><Phone size={22} /></span>
              <div>
                <small>Phone</small>
                <p>+251 47 111 0000</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><Mail size={22} /></span>
              <div>
                <small>Email</small>
                <p>info@jirenhigh.edu.et</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={130} className="map-container">
            <iframe
              title="Map of Jimma, Ethiopia"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15848.4556487802!2d36.8286!3d7.6732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17ad0234a9466333%3A0x63359d95f850e9f8!2sJimma%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1714650000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="landing-logo-mark"><GraduationCap size={24} /></span>
            <div>
              <strong>Jiren Secondary High School</strong>
              <small>Student Registration System</small>
            </div>
          </div>

          <div className="footer-links">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); go(l.href); }}>
                {l.label}
              </a>
            ))}
            <Link to="/login">System Login</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Jiren Secondary High School. All rights reserved.</p>
          <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ArrowUp size={16} /> Top
          </button>
        </div>
      </footer>
    </div>
  );
}
