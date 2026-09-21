import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, X, Mail, Linkedin, Instagram } from 'lucide-react';
import { Logo, Modal } from '../common/UI';
import ThemeToggle from '../common/ThemeToggle';
import '../../landing.css';
import '../../public.css';

export const publicNavigation = [
  { label: 'News & Stories', to: '/campusfeed' },
  { label: 'Events', links: [['Events', '/events'], ['Galleries', '/galleries']] },
  { label: 'Batchmates', links: [['Yearbook', '/members'], ['Invite Batchmates', '/platform/invitation']] },
  { label: 'Find Alumni', links: [['Alumni Directory', '/search'], ['Alumni Nearby', '/map']] },
  { label: 'Careers', links: [['Jobs', '/jobs'], ['Internship', '/jobs?tab=e_internships']] },
  { label: 'About', links: [['About Us', '/about'], ['Contact Us', '/contact']] },
  { label: 'Refer Friend', to: '/addon/1534' },
];

export default function PublicLayout({ children }) {
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [policy, setPolicy] = useState(null);
  const location = useLocation();
  const header = useRef(null);
  const menuButton = useRef(null);
  useEffect(() => {
    setMenu(false);
    setDropdown(null);
  }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.hash]);
  useEffect(() => {
    const close = event => { if (!header.current?.contains(event.target)) setDropdown(null); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  function onEscape(event) {
    if (event.key !== 'Escape') return;
    if (dropdown) header.current?.querySelector(`[data-nav="${dropdown}"]`)?.focus();
    else { setMenu(false); menuButton.current?.focus(); }
    setDropdown(null);
  }
  return <div className="landing public-site">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="announcement-strip"><span>A community built on skill. A future built together.</span><Link to="/login/alumni">Find your people <ArrowUpRight size={13}/></Link></div>
    <div className="ind-ticker" aria-hidden="true"><div className="ind-ticker-track">{Array.from({ length: 2 }, (_, repeat) => ['HEMM OPERATORS', 'ELECTRICAL TECHNICIANS', 'WELDERS', 'RIGGERS', 'MINING ENGINEERS', 'CRANE OPERATORS', 'FITTERS', 'ITI ALUMNI'].map(trade => <span className="ind-ticker-item" key={`${repeat}-${trade}`}><span className="ind-ticker-dot"/>{trade}</span>))}</div></div>
    <header className="public-header" ref={header} onKeyDown={onEscape}>
      <Logo/>
      <nav id="public-navigation" aria-label="Main navigation" className={menu ? 'open' : ''}>
        {publicNavigation.map(item => item.to ? <NavLink key={item.label} to={item.to}>{item.label}</NavLink> :
          <div className="public-nav-group" key={item.label} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setDropdown(null); }}>
            <button data-nav={item.label} className={item.links.some(([, to]) => to.split('?')[0] === location.pathname) ? 'active' : ''} aria-expanded={dropdown === item.label} aria-controls={`nav-${item.label.replaceAll(' ', '-')}`} onClick={() => setDropdown(dropdown === item.label ? null : item.label)}>{item.label}<ChevronDown size={13}/></button>
            <div className="public-nav-dropdown" id={`nav-${item.label.replaceAll(' ', '-')}`} hidden={dropdown !== item.label}>
              {item.links.map(([label, to]) => <Link key={to} to={to} onClick={() => { setDropdown(null); setMenu(false); }}>{label}<ArrowUpRight size={14}/></Link>)}
            </div>
          </div>)}
        <Link className="public-mobile-login" to="/login">Log in <ArrowUpRight size={15}/></Link>
      </nav>
      <div className="public-header-actions"><ThemeToggle/><Link className="login-link" to="/login">Log in <ArrowUpRight size={15}/></Link><button ref={menuButton} className="icon-button public-menu-button" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} aria-controls="public-navigation" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></div>
    </header>
    {children}
      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="public-footer">
        <div className="footer-top">
          <div>
            <Logo/>
            <p>Building careers. Connecting people.<br/>Strengthening India's skilled workforce.</p>
            <div className="social-links">
              <a aria-label="Contact Pantiss" href="mailto:alumni@pantiss.com"><Mail size={18}/></a>
              <button aria-label="LinkedIn community information" onClick={() => setPolicy('Social community')}><Linkedin size={18}/></button>
              <button aria-label="Instagram community information" onClick={() => setPolicy('Social community')}><Instagram size={18}/></button>
            </div>
          </div>
          <div>
            <h4>The network</h4>
            <Link to="/about">About us</Link>
            <Link to="/campusfeed">News &amp; stories</Link>
            <Link to="/search">Alumni directory</Link>
          </div>
          <div>
            <h4>Move forward</h4>
            <Link to="/jobs">Career opportunities</Link>
            <Link to="/login/alumni?next=mentorship">Find a mentor</Link>
            <Link to="/events">Events &amp; reunions</Link>
          </div>
          <div>
            <h4>Let's connect</h4>
            <a href="mailto:alumni@pantiss.com">alumni@pantiss.com <ArrowUpRight size={13}/></a>
            <span>Bhubaneswar, Odisha, India</span><Link to="/contact">Contact us</Link><Link to="/addon/1534">Refer a friend</Link>
            <Link to="/login/admin">Administrator login <ArrowUpRight size={13}/></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Pantiss Skill Universe. All rights reserved.</span>
          <span>
            <button onClick={() => setPolicy('Privacy policy')}>Privacy policy</button>
            <button onClick={() => setPolicy('Terms of use')}>Terms of use</button>
            <span>Made for the people who build.</span>
          </span>
        </div>
      </footer>

      {policy && (
        <Modal title={policy} onClose={() => setPolicy(null)}>
          <div className="modal-body">
            <p>This is a frontend demonstration of the Pantiss Alumni Network. All professional profiles and geographic locations are fictional. Demo activity is stored only in this browser.</p>
            <p>No real messages, calls, applications, or registrations are sent. Please use the demo credentials and avoid entering sensitive personal information.</p>
            <p>Contact: <a href="mailto:alumni@pantiss.com">alumni@pantiss.com</a></p>
          </div>
        </Modal>
      )}  </div>;
}
