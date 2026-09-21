import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Users, BriefcaseBusiness, MapPin, Handshake, ShieldCheck, Network, Menu, X, Linkedin, Mail, Instagram, HardHat, Wrench, Zap, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo, Avatar, Badge, Modal } from '../components/common/UI';
import ThemeToggle from '../components/common/ThemeToggle';
import '../landing.css';
import { alumni } from '../data/alumni';
import { jobs } from '../data/jobs';
import { events } from '../data/events';

const hero = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2200&q=90';

/* ── Ticker items ── */
const TICKER = ['HEMM OPERATORS','ELECTRICAL TECHNICIANS','WELDERS','RIGGERS','INSTRUMENTATION','MINING ENGINEERS','CRANE OPERATORS','FITTERS','BOILERMAKERS','ITI ALUMNI'];

export default function Landing() {
  const [menu, setMenu] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [state, setState] = useState('Odisha');

  return (
    <div className="landing">
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* ── Announcement strip ── */}
      <div className="announcement-strip">
        <span>⚙ A community built on skill. A future built together.</span>
        <Link to="/login/alumni">Find your people <ArrowUpRight size={13}/></Link>
      </div>

      {/* ── Ticker / marquee ── */}
      <div className="ind-ticker" aria-hidden="true">
        <div className="ind-ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="ind-ticker-item">
              <span className="ind-ticker-dot"/>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Header ── */}
      <header className="public-header">
        <Logo/>
        <nav id="public-navigation" aria-label="Main navigation" className={menu ? 'open' : ''}>
          <a href="#community" onClick={() => setMenu(false)}>Our community</a>
          <a href="#opportunities" onClick={() => setMenu(false)}>Opportunities</a>
          <a href="#stories" onClick={() => setMenu(false)}>Alumni stories</a>
          <a href="#events" onClick={() => setMenu(false)}>Events</a>
        </nav>
        <div className="public-header-actions">
          <ThemeToggle/>
          <Link className="login-link" to="/login">Log in <ArrowUpRight size={15}/></Link>
          <Link className="button primary" to="/login/alumni">Join the network <ArrowRight size={16}/></Link>
          <button className="icon-button mobile-only" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="public-navigation" onClick={() => setMenu(!menu)}>
            {menu ? <X/> : <Menu/>}
          </button>
        </div>
      </header>

      <main id="main-content">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="hero">
          {/* Right: Industrial image */}
          <div className="hero-visual">
            <img src={hero} alt="Industrial professional at work in a manufacturing workshop" fetchPriority="high"/>
            <div className="hero-photo-caption">
              <span className="live-dot"/> LIVE · Built by skill. Connected for life.
            </div>
          </div>

          {/* Left: Content */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Industrial status badge */}
            <div className="ind-status-row">
              <span className="ind-status-badge">
                <span className="live-dot"/> NETWORK ACTIVE
              </span>
              <span className="ind-status-divider"/>
              <span className="ind-status-text">18 STATES · 35+ TRADES</span>
            </div>

            <div className="hero-eyebrow">
              <span/>THE PANTISS ALUMNI NETWORK
            </div>

            <h1>
              Built by<br/>
              skill.<br/>
              <span>For life.</span>
            </h1>

            <p>Reconnect with your batch. Find your next opportunity. Grow with a community that understands your journey from the shop floor up.</p>

            <div className="hero-actions">
              <Link to="/login/alumni" className="button primary large">
                Join the network <ArrowUpRight size={19}/>
              </Link>
              <Link to="/login/alumni" className="hero-login">
                Already an alumnus?{' '}
                <span>Log in <ArrowRight size={16}/></span>
              </Link>
            </div>

            <div className="hero-social">
              <div className="avatar-stack">
                {alumni.slice(0, 4).map(a => <Avatar key={a.id} person={a} size="sm"/>)}
              </div>
              <div>
                <strong>10,000+ professionals. One community.</strong>
                <span>Your next connection could change everything.</span>
              </div>
            </div>

            {/* Industrial spec row */}
            <div className="ind-spec-row">
              {[
                [HardHat, 'TRAINED', 'Pantiss Certified'],
                [Wrench,  'SKILLED', '35+ Trades'],
                [Truck,   'PLACED',  'Pan-India'],
                [Zap,     'GROWING', 'Every Day'],
              ].map(([Icon, label, sub]) => (
                <div className="ind-spec-item" key={label}>
                  <Icon size={14} color="var(--ind-orange)"/>
                  <span>{label}</span>
                  <small>{sub}</small>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Location tag */}
          <div className="hero-location">
            <span className="live-dot"/>SKILLED HANDS. LIMITLESS POSSIBILITIES.
            <div><MapPin size={13}/> Empowering India's industrial workforce</div>
          </div>

          <div className="hero-side-label">ONE SKILL. ONE COMMUNITY. A LIFETIME NETWORK.</div>
        </section>

        {/* ═══════════════ STATS BAND ═══════════════ */}
        <section className="stats-band">
          {[
            ['10,000+', 'Skilled alumni',       'Across trades. Across generations.'],
            ['18+',     'States connected',     'A network without boundaries.'],
            ['35+',     'Professional trades',  'Real skills. Real-world expertise.'],
            ['50+',     'Industry partners',    'Opening doors to what\'s next.'],
          ].map(([value, label, note]) => (
            <div key={label}>
              <strong>{value}</strong>
              <h3>{label}</h3>
              <p>{note}</p>
            </div>
          ))}
        </section>

        {/* ═══════════════ PARTNER BAND ═══════════════ */}
        <section className="partner-band">
          <span>OUR ALUMNI ARE BUILDING THE FUTURE AT</span>
          <div>
            <b className="tata-logo">TATA <strong>STEEL</strong></b>
            <b className="vedanta-logo">vedanta</b>
            <b className="jsw-logo">JSW <small>STEEL</small></b>
            <b className="lt-logo">LARSEN &amp; TOUBRO</b>
            <b className="adani-logo">adani</b>
            <b className="hindalco-logo">HINDALCO</b>
          </div>
        </section>

        {/* ═══════════════ COMMUNITY ═══════════════ */}
        <section id="community" className="public-section community-section">
          <div className="section-intro">
            <div>
              <div className="eyebrow"><span/>MORE THAN AN ALUMNI NETWORK</div>
              <h2>Your journey doesn't end<br/>at the training center.</h2>
            </div>
            <p>
              It grows with the right people around you.<br/>
              A community that knows where you started<br/>
              and helps you get where you want to go.
            </p>
          </div>
          <div className="benefit-grid">
            {[
              [Users,           'Familiar faces. New connections.', 'Find your batchmates, reconnect with your training center, and make new connections across industries.', 'Find your community',  'connect'],
              [BriefcaseBusiness,'Your next opportunity is here.',   'Discover roles that value your skills, get referrals from fellow alumni, and take the next step in your career.', 'Explore opportunities', 'jobs'],
              [Handshake,       'Experience worth sharing.',        'Learn from people who've walked your path. Find a mentor, share your knowledge, or give someone a head start.', 'Meet the mentors',     'mentorship'],
              [MapPin,          'A network, wherever you go.',      'From your hometown to your next worksite. Find Pantiss professionals near you and feel at home, anywhere.', 'Explore the network',  'directory'],
            ].map(([Icon, title, text, cta, next], i) => (
              <Link to={`/login/alumni?next=${next}`} className="benefit-card" key={title}>
                <span className="benefit-icon"><Icon size={25}/></span>
                <span className="benefit-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="text-link">{cta}<ArrowUpRight size={17}/></span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════ INDIA MAP ═══════════════ */}
        <section className="india-section">
          <div className="india-copy">
            <div className="eyebrow"><span/>ROOTED IN SKILL. CONNECTED ACROSS INDIA.</div>
            <h2>Different worksites.<br/>One shared beginning.</h2>
            <p>From the mines of Odisha to the manufacturing hubs of Gujarat, our alumni are moving industries forward.</p>
            <div className="state-chips">
              {['Odisha','Jharkhand','Chhattisgarh','West Bengal','Gujarat','Maharashtra','Karnataka','Tamil Nadu','Rajasthan'].map(s => (
                <button key={s} aria-pressed={s === state} className={s === state ? 'selected' : ''} onClick={() => setState(s)}>{s}</button>
              ))}
            </div>
            <div className="state-summary" aria-live="polite">
              <span className="live-dot"/>
              <strong>{state}</strong>
              <span>{alumni.filter(a => a.state === state).length} featured professionals</span>
            </div>
            <Link className="button dark" to="/login/alumni?next=directory">Find alumni near you <ArrowUpRight size={17}/></Link>
          </div>
          <div className="india-art">
            <IndiaGraphic/>
            <div className="map-floating-card">
              <span className="network-icon"><Network size={24}/></span>
              <div>
                <strong>A connection in every direction.</strong>
                <p>18 states. Thousands of possibilities.</p>
              </div>
            </div>
            <span className="map-caption">ILLUSTRATIVE ALUMNI DISTRIBUTION</span>
          </div>
        </section>

        {/* ═══════════════ OPPORTUNITIES ═══════════════ */}
        <section id="opportunities" className="public-section opportunities-section">
          <div className="section-intro">
            <div>
              <div className="eyebrow"><span/>SKILLS MEET OPPORTUNITY</div>
              <h2>A new chapter<br/>in your career.</h2>
            </div>
            <Link to="/login/alumni?next=jobs" className="text-link">Explore all opportunities <ArrowUpRight size={18}/></Link>
          </div>
          <div className="public-job-grid">
            {jobs.slice(0, 3).map(job => (
              <Link to={`/login/alumni?next=jobs/${job.id}`} className="public-job-card" key={job.id}>
                <div className="job-card-top">
                  <span className={`company-logo ${job.color}`}>{job.letter}</span>
                  <Badge color={job.tag === 'Featured' ? 'orange' : 'green'}>{job.tag}</Badge>
                </div>
                <p className="company-name">{job.company}</p>
                <h3>{job.title}</h3>
                <p className="job-location"><MapPin size={14}/>{job.location}</p>
                <div className="job-tags">
                  <span>{job.type}</span>
                  <span>{job.experience}</span>
                </div>
                <div className="public-job-bottom">
                  <strong>{job.salary}<small> / month</small></strong>
                  <span className="arrow-circle"><ArrowUpRight size={19}/></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="opportunity-note">
            <ShieldCheck size={17}/> Opportunities from trusted industry partners, curated for Pantiss alumni.
          </div>
        </section>

        {/* ═══════════════ STORIES ═══════════════ */}
        <section id="stories" className="public-section stories-section">
          <div className="section-intro">
            <div>
              <div className="eyebrow"><span/>REAL PEOPLE. REAL PROGRESS.</div>
              <h2>Started here.<br/>Going places.</h2>
            </div>
            <span className="muted">Every skill has a story.<br/>These are a few of ours.</span>
          </div>
          <div className="stories-grid">
            <article className="feature-story">
              <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1100&q=85" alt="Skilled technician working on an industrial electrical installation" loading="lazy"/>
              <div className="story-overlay">
                <Badge>THE PANTISS JOURNEY</Badge>
                <blockquote>"I came here to learn a trade.<br/>I left with a future."</blockquote>
                <div>
                  <strong>Rahul Das</strong>
                  <span>HEMM Operator, Tata Steel · Batch of 2021</span>
                </div>
              </div>
            </article>
            <article className="quote-story">
              <span className="quote-mark">"</span>
              <blockquote>The training gave me confidence. The community keeps me growing. There's always someone who's been where you are.</blockquote>
              <div className="story-person">
                <Avatar person={alumni[1]}/>
                <div>
                  <strong>Priya Das</strong>
                  <span>Electrical Technician, Vedanta</span>
                  <small>Batch of 2021 · Jharsuguda Campus</small>
                </div>
              </div>
              <div className="story-footer">
                <span className="live-dot"/>FROM LEARNING TO LEADING
              </div>
            </article>
          </div>
        </section>

        {/* ═══════════════ EVENTS ═══════════════ */}
        <section id="events" className="public-section events-section">
          <div className="section-intro">
            <div>
              <div className="eyebrow"><span/>LET'S MAKE NEW MEMORIES</div>
              <h2>Good things<br/>happen together.</h2>
            </div>
            <Link className="text-link" to="/login/alumni?next=events">View all events <ArrowUpRight size={18}/></Link>
          </div>
          <div className="public-events">
            {events.map(e => (
              <Link to={`/login/alumni?next=events/${e.id}`} className="public-event" key={e.id}>
                <div className="event-date">
                  <strong>{e.date}</strong>
                  <span>{e.month} 2026</span>
                </div>
                <div>
                  <Badge>{e.category}</Badge>
                  <h3>{e.name}</h3>
                  <p><MapPin size={14}/>{e.location}</p>
                </div>
                <ArrowUpRight size={21}/>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════ JOIN CTA ═══════════════ */}
        <section className="join-banner">
          <div className="join-pattern"/>
          <div>
            <div className="eyebrow">YOUR NEXT CHAPTER STARTS WITH A CONNECTION</div>
            <h2>You'll always be<br/>part of Pantiss.</h2>
            <p>Your skills opened the first door. Your network opens the next.</p>
          </div>
          <div>
            <Link className="button white large" to="/login/alumni">
              Find your place in the network <ArrowUpRight size={20}/>
            </Link>
            <span>One skill. One community. A lifetime network.</span>
          </div>
        </section>
      </main>

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
            <a href="#community">Our community</a>
            <a href="#stories">Alumni stories</a>
            <Link to="/login/alumni?next=directory">Alumni directory</Link>
          </div>
          <div>
            <h4>Move forward</h4>
            <a href="#opportunities">Career opportunities</a>
            <Link to="/login/alumni?next=mentorship">Find a mentor</Link>
            <a href="#events">Events &amp; reunions</a>
          </div>
          <div>
            <h4>Let's connect</h4>
            <a href="mailto:alumni@pantiss.com">alumni@pantiss.com <ArrowUpRight size={13}/></a>
            <span>Bhubaneswar, Odisha, India</span>
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
      )}
    </div>
  );
}

function IndiaGraphic() {
  return (
    <svg viewBox="0 0 540 530" aria-label="Illustrative map of the alumni network across India" role="img">
      <defs>
        <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="currentColor"/>
        </pattern>
      </defs>
      <path
        d="M175 32 196 49 225 42 240 61 255 60 263 88 249 115 269 141 314 165 345 169 366 191 404 167 452 152 489 137 474 165 437 185 416 210 395 212 377 239 359 230 343 214 323 229 306 260 296 295 275 319 270 348 250 378 243 416 224 451 216 472 198 459 186 421 173 393 155 360 145 321 129 290 126 264 103 261 78 248 63 225 77 207 109 208 117 187 133 168 144 151 152 128 143 103 154 75 149 52Z"
        fill="url(#dots)"
      />
      <g stroke="currentColor" strokeOpacity=".17" fill="none">
        <path d="M181 182 280 256 219 359 137 266 181 182 324 239 280 256 235 178"/>
        <path d="M137 266 219 359 238 404 280 256"/>
      </g>
      {[[181,182],[280,256],[137,266],[219,359],[238,404],[324,239],[235,178],[296,235],[269,285]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i===1?25:15} fill="var(--ind-orange)" opacity=".06"/>
          <circle cx={x} cy={y} r={i===1?7:4} fill="var(--ind-orange)"/>
          <circle cx={x} cy={y} r={i===1?12:8} stroke="var(--ind-orange)" strokeOpacity=".35" fill="none"/>
        </g>
      ))}
      <text x="300" y="268" fill="var(--ind-ink)" fontSize="13" fontWeight="700" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="1">ODISHA</text>
      <text x="70" y="285" fill="var(--ind-muted)" fontSize="9" fontFamily="'Share Tech Mono', monospace">Maharashtra</text>
      <text x="168" y="385" fill="var(--ind-muted)" fontSize="9" fontFamily="'Share Tech Mono', monospace">Karnataka</text>
    </svg>
  );
}
