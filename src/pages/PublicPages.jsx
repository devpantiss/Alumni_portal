import { useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, Copy, GraduationCap, Mail, MapPin, Search, Users } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { Avatar } from '../components/common/UI';
import { alumni, states } from '../data/alumni';
import { batches } from '../data/batches';
import { events } from '../data/events';
import { jobs } from '../data/jobs';

const workshop = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85';
const stories = [
  { id: 'a-lifetime-network', category: 'Community', title: 'Your training is the beginning. Your network is for life.', image: events[0].image, intro: 'A shared beginning can open up a world of new connections.', paragraphs: ['A new role, a new city, or a new worksite can feel like starting over. Staying connected to your training community gives you a familiar place to begin.', 'The Pantiss Alumni Network brings batchmates and professionals across trades together. Find people who understand your work, reconnect with your campus, and share what you have learned along the way.', 'Start with your batch, introduce yourself to someone in your industry, or join an alumni event. A useful connection often starts with a simple conversation.'] },
  { id: 'your-next-career-step', category: 'Career guide', title: 'Make your next career step a confident one.', image: workshop, intro: 'Practical ways to put your experience and skills to work.', paragraphs: ['Keep a clear record of your practical skills, qualifications, and recent work. Explain the equipment you have worked with and the responsibilities you have held.', 'Explore opportunities by trade and location, and speak with alumni who know the industry. A conversation can help you understand a role before you apply.', 'Keep learning as your trade evolves. Ask experienced professionals which skills have made a difference in their careers, and look for opportunities to practise them.'] },
  { id: 'share-your-experience', category: 'Mentorship', title: 'Experience becomes more valuable when you share it.', image: events[1].image, intro: 'Help someone take the steps you once took yourself.', paragraphs: ['Think back to the questions you had on your first day at work. Your answers today could help a new graduate find their feet.', 'Mentorship can start small: discuss career paths, share interview preparation tips, or talk about working in a new city.', 'Sign in to discover the mentorship community. Whether you are looking for guidance or ready to offer it, your experience has a place here.'] },
];
const pageInfo = {
  '/campusfeed': ['News & Stories', 'The stories that keep us connected.', 'Ideas, experiences, and career guidance from the world of skilled work.'],
  '/events': ['Events', 'Good things happen together.', 'Reconnect with your batch, learn from industry, and make new memories.'],
  '/galleries': ['Galleries', 'A window into our community.', 'Explore the spaces and experiences that bring skilled professionals together.'],
  '/members': ['Yearbook', 'Different years. One shared beginning.', 'Find your graduating batch and take the next step towards reconnecting.'],
  '/search': ['Alumni Directory', 'Find your people.', 'Discover professionals across trades, campuses, and industries.'],
  '/map': ['Alumni Nearby', 'A connection, wherever you go.', 'Explore our community by state, then sign in to connect on the alumni map.'],
  '/jobs': ['Careers', 'Skills meet opportunity.', 'Explore roles that put your training and experience to work.'],
  '/about': ['About Us', 'Built by skill. Connected for life.', 'A shared place for the people building India’s industrial future.'],
  '/contact': ['Contact Us', 'Let’s stay connected.', 'Reach the alumni team for community enquiries and help finding your way.'],
  '/platform/invitation': ['Invite Batchmates', 'Bring your batch back together.', 'Share the network with the people who started this journey with you.'],
  '/addon/1534': ['Refer Friend', 'Good opportunities are worth sharing.', 'Introduce a friend to the Pantiss Alumni Network.'],
};

function ActionLink({ to, children }) { return <Link className="button primary" to={to}>{children}<ArrowUpRight size={17}/></Link>; }
function Empty({ children }) { return <div className="static-empty"><Search size={28}/><h2>No matches yet.</h2><p>{children}</p></div>; }
function Card({ image, category, title, description, to, cta = 'Explore' }) {
  return <article className="static-card">{image && <img src={image} alt="" loading="lazy"/>}<div className="static-card-body"><span className="static-kicker">{category}</span><h2>{title}</h2><p>{description}</p><Link className="text-link" to={to}>{cta}<ArrowUpRight size={17}/></Link></div></article>;
}
function SearchField({ value, onChange, placeholder }) { return <label className="static-search"><Search size={18}/><span className="sr-only">{placeholder}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} type="search"/></label>; }

export default function PublicPages() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const base = id ? pathname.slice(0, pathname.lastIndexOf('/')) : pathname;
  const [params] = useSearchParams();
  const internship = base === '/jobs' && params.get('tab') === 'e_internships';
  const info = pageInfo[base] || pageInfo[pathname];
  const title = internship ? ['Internship', 'Your first step into industry.', 'Build practical experience and discover the world of skilled work.'] : info;
  const detail = id && (base === '/events' ? events.find(item => String(item.id) === id) : base === '/campusfeed' ? stories.find(item => item.id === id) : null);
  return <PublicLayout><main id="main-content" className="static-main" tabIndex={-1}>
    <section className="static-hero"><div className="static-breadcrumb"><Link to="/">Home</Link><span>/</span>{id ? <Link to={base}>{title?.[0]}</Link> : <span>{title?.[0]}</span>}{id && <><span>/</span><span>{detail ? 'Details' : 'Not found'}</span></>}</div><div className="static-hero-grid"><div><div className="eyebrow"><span/>{title?.[0]}</div><h1>{id ? (detail?.name || detail?.title || 'This page has moved.') : title?.[1]}</h1><p>{id ? (detail?.description || detail?.intro || 'Explore the latest from the community below.') : title?.[2]}</p></div><div className="static-hero-mark" aria-hidden="true"><GraduationCap/><span>ONE COMMUNITY.<br/>A LIFETIME NETWORK.</span></div></div></section>
    <section className="static-content">
      {id ? <Detail base={base} item={detail}/> : <PageContent path={pathname} internship={internship}/>}
    </section>
    <section className="static-cta"><div><span className="static-kicker">Your next chapter</span><h2>You’ll always be part of Pantiss.</h2><p>Sign in to connect, exchange ideas, and grow with your community.</p></div><ActionLink to="/login/alumni">Join the network</ActionLink></section>
  </main></PublicLayout>;
}
function Detail({ base, item }) {
  if (!item) return <div className="static-empty"><h2>We couldn’t find that page.</h2><ActionLink to={base}>Browse all</ActionLink></div>;
  return <article className="static-detail"><img className="static-detail-image" src={item.image} alt={base === '/events' ? 'Illustrative event setting' : ''}/><div className="static-reading"><span className="static-kicker">{item.category}</span>{base === '/events' ? <><h2>{item.title}</h2><p>{item.description}</p><div className="static-facts"><span><CalendarDays size={18}/>{item.fullDate} · {item.time}</span><span><MapPin size={18}/>{item.location}</span></div><p className="static-note">Preview event from the demo network.</p><ActionLink to={`/login/alumni?next=events/${item.id}`}>Sign in to register</ActionLink></> : <>{item.paragraphs.map(text => <p key={text}>{text}</p>)}<ActionLink to="/login/alumni?next=mentorship">Explore the community</ActionLink></>}</div></article>;
}
function PageContent({ path, internship }) {
  if (path === '/campusfeed') return <div className="static-grid">{stories.map(story => <Card key={story.id} {...story} description={story.intro} to={`/campusfeed/${story.id}`} cta="Read story"/>)}</div>;
  if (path === '/events') return <><p className="static-note">Demo network · Event previews</p><div className="static-grid">{events.map(event => <Card key={event.id} image={event.image} category={`${event.fullDate} · ${event.category}`} title={event.name} description={event.description} to={`/events/${event.id}`} cta="View event"/>)}</div></>;
  if (path === '/galleries') return <Galleries/>;
  if (path === '/members') return <><div className="static-section-heading"><h2>Find your year.</h2><p>Reconnect through the alumni portal.</p></div><div className="static-grid yearbook-grid">{batches.map(batch => <Link className="yearbook-card" key={batch.id} to={`/search?batch=${batch.year}`}><GraduationCap size={28}/><strong>{batch.year}</strong><span>Explore the batch <ArrowUpRight size={18}/></span></Link>)}</div></>;
  if (path === '/search' || path === '/map') return <PublicDirectory nearby={path === '/map'}/>;
  if (path === '/jobs') return <PublicJobs internship={internship}/>;
  if (path === '/platform/invitation' || path === '/addon/1534') return <Invitation friend={path === '/addon/1534'}/>;
  if (path === '/contact') return <div className="static-split"><div className="static-reading"><span className="static-kicker">We’re here to help</span><h2>Start a conversation.</h2><p>For alumni network enquiries, getting connected with your campus, or sharing a community story, get in touch with the Pantiss team.</p><a className="static-contact" href="mailto:alumni@pantiss.com"><Mail size={22}/><span>Email the alumni team<strong>alumni@pantiss.com</strong></span><ArrowUpRight size={20}/></a><div className="static-contact"><MapPin size={22}/><span>Our community’s home<strong>Bhubaneswar, Odisha, India</strong></span></div></div><div className="static-panel"><Users size={32}/><h2>Looking for a batchmate?</h2><p>Explore the alumni directory, or sign in to send a message through your network.</p><ActionLink to="/search">Explore the directory</ActionLink></div></div>;
  return <div className="static-split"><img className="static-about-image" src={workshop} alt="Industrial workshop where practical skills come to life"/><div className="static-reading"><span className="static-kicker">The Pantiss Alumni Network</span><h2>Your journey doesn’t end at the training center.</h2><p>It grows with the right people around you. Pantiss brings skilled professionals together across batches, campuses, and industries.</p><p>From your first job to your next career move, this is a place to reconnect with your peers, share your experience, and discover opportunities that value your skills.</p><div className="static-values">{[[Users, 'Stay connected', 'Find familiar faces and build new connections.'], [BriefcaseBusiness, 'Move forward', 'Explore careers and keep your skills growing.'], [GraduationCap, 'Give back', 'Share what you know with the next generation.']].map(([Icon, heading, text]) => <div key={heading}><Icon size={23}/><div><h3>{heading}</h3><p>{text}</p></div></div>)}</div><ActionLink to="/login/alumni">Find your community</ActionLink></div></div>;
}
function PublicDirectory({ nearby }) {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') || '';
  const state = params.get('state') || '';
  const batch = params.get('batch') || '';
  const update = (key, value) => { const next = new URLSearchParams(params); value ? next.set(key, value) : next.delete(key); setParams(next, { replace: true, preventScrollReset: true }); };
  const people = alumni.filter(person => (!state || person.state === state) && (!batch || person.batch === batch) && `${person.name} ${person.role} ${person.company} ${person.city}`.toLowerCase().includes(search.toLowerCase()));
  return <>{nearby && <div className="static-panel nearby-panel"><MapPin size={32}/><div><h2>Explore by location.</h2><p>Choose a state to preview the community. Sign in for the interactive alumni map and connection tools.</p></div><ActionLink to="/login/alumni?next=connect">Open alumni map</ActionLink></div>}<div className="static-filters"><SearchField value={search} onChange={value => update('q', value)} placeholder="Search name, trade, company or city"/><label><span>State</span><select value={state} onChange={event => update('state', event.target.value)}><option value="">All states</option>{states.map(value => <option key={value}>{value}</option>)}</select></label><label><span>Batch</span><select value={batch} onChange={event => update('batch', event.target.value)}><option value="">All batches</option>{batches.map(value => <option key={value.year}>{value.year}</option>)}</select></label></div><p className="static-note" role="status">{people.length} professionals · Fictional demo profiles</p>{people.length ? <div className="static-grid directory-preview">{people.map(person => <article className="static-person" key={person.id}><Avatar person={person}/><h2>{person.name}</h2><p>{person.role}</p><strong>{person.company}</strong><span><MapPin size={14}/>{person.city}, {person.state}</span><small>Batch of {person.batch} · {person.campus}</small><Link className="text-link" to={`/login/alumni?next=profile/${person.id}`}>Sign in to connect<ArrowUpRight size={16}/></Link></article>)}</div> : <Empty>Try another name, state, or batch.</Empty>}</>;
}
function PublicJobs({ internship }) {
  const [query, setQuery] = useState('');
  const list = jobs.filter(job => (!internship || job.type === 'Internship') && `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="static-tabs"><Link aria-current={!internship ? 'page' : undefined} to="/jobs">Jobs</Link><Link aria-current={internship ? 'page' : undefined} to="/jobs?tab=e_internships">Internship</Link></div><SearchField value={query} onChange={setQuery} placeholder="Search roles, companies or locations"/><p className="static-note" role="status">{list.length} {internship ? 'internships' : 'opportunities'} · Demo listings</p>{list.length ? <div className="static-grid">{list.map(job => <Card key={job.id} category={`${job.company} · ${job.type}`} title={job.title} description={`${job.location} · ${job.experience} · ${job.salary} / month`} to={`/login/alumni?next=jobs/${job.id}`} cta="View opportunity"/>)}</div> : <div className="static-empty"><BriefcaseBusiness size={32}/><h2>{internship ? 'Your next beginning is on its way.' : 'No matching opportunities.'}</h2><p>{internship ? 'There are no internships listed at the moment. Explore the available jobs, including apprenticeships, or check back later.' : 'Try another role, company, or location.'}</p>{internship && <ActionLink to="/jobs">Explore jobs</ActionLink>}</div>}</>;
}
function Invitation({ friend }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const url = `${window.location.origin}/`;
  async function copy() { try { await navigator.clipboard.writeText(`Join me on the Pantiss Alumni Network: ${url}`); setCopied(true); setError(false); } catch { setError(true); } }
  return <div className="static-split"><div className="static-reading"><span className="static-kicker">Better together</span><h2>{friend ? 'Make the introduction.' : 'One invitation. A familiar face.'}</h2><p>{friend ? 'Know someone from the Pantiss community? Share the network and help them discover connections, events, and career opportunities.' : 'Send your batchmates a link to the network so they can reconnect with their campus and fellow graduates.'}</p><ol className="static-steps"><li>Copy the invitation link.</li><li>Share it personally with your {friend ? 'friend' : 'batchmates'}.</li><li>Sign in and start reconnecting.</li></ol></div><div className="static-panel"><Users size={34}/><h2>A place for your people.</h2><p>Copy the link below and share it in your own message.</p><label className="invite-url">Invitation link<input aria-label="Invitation link" value={url} readOnly onFocus={event => event.target.select()}/></label><button className="button primary" onClick={copy}>{copied ? <Check size={18}/> : <Copy size={18}/>}{copied ? 'Invitation copied' : 'Copy invitation'}</button><p role="status">{error ? 'Select and copy the link above to share it.' : copied ? 'Ready to paste into your message.' : 'You choose who to share it with.'}</p></div></div>;
}
function Galleries() {
  const [category, setCategory] = useState('All');
  const photos = [{ title: 'Spaces to reconnect', category: 'Community', image: events[0].image }, { title: 'Ideas in good company', category: 'Community', image: events[1].image }, { title: 'Learning by doing', category: 'Skills', image: events[2].image }, { title: 'Built on practical skills', category: 'Skills', image: workshop }];
  return <><div className="static-tabs" aria-label="Filter gallery">{['All', 'Community', 'Skills'].map(value => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div><p className="static-note">An illustrative collection of community and training imagery.</p><div className="static-gallery">{photos.filter(photo => category === 'All' || photo.category === category).map(photo => <figure key={photo.title}><img src={photo.image} alt={photo.title} loading="lazy"/><figcaption><span className="static-kicker">{photo.category}</span><h2>{photo.title}</h2></figcaption></figure>)}</div></>;
}
