import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Loading, Toast, Button } from './components/common/UI';
import CallModal from './components/communication/CallModal';
import PortalLayout from './components/layout/PortalLayout';
const Landing=lazy(()=>import('./pages/Landing'));
const PublicPages=lazy(()=>import('./pages/PublicPages'));
const Login=lazy(()=>import('./pages/Login'));
const Dashboard=lazy(()=>import('./pages/AlumniDashboard'));
const Directory=lazy(()=>import('./pages/Directory'));
const Profile=lazy(()=>import('./pages/Profile'));
const Messages=lazy(()=>import('./pages/Messages'));
const Jobs=lazy(()=>import('./pages/Jobs'));
const Events=lazy(()=>import('./pages/Events'));
const AdminDashboard=lazy(()=>import('./pages/AdminDashboard'));
const AdminConnect=lazy(()=>import('./pages/AdminConnect'));
const AlumniManagement=lazy(()=>import('./pages/AlumniManagement'));
const AdminCatalog=lazy(()=>import('./pages/AdminCatalog'));
const community=name=>lazy(()=>import('./pages/Community').then(m=>({default:m[name]})));
const Groups=community('Groups'),Announcements=community('Announcements'),Notifications=community('Notifications'),Calls=community('Calls'),Resources=community('Resources'),Settings=community('Settings');
function Protected({role,children}){const {role:actual}=useApp();return actual===role?children:<Navigate to={`/login/${role}`} replace/>}
function NotFound(){return <div className="not-found"><span className="eyebrow">A DIFFERENT PATH.</span><h1>This page isn’t in the network.</h1><p>Let’s get you back to familiar ground.</p><Link className="button primary" to="/">Back to home</Link></div>}
export default function App(){return <><Suspense fallback={<Loading/>}><Routes><Route path="/" element={<Landing/>}/>{['campusfeed','campusfeed/:id','events','events/:id','galleries','members','search','map','jobs','about','contact','platform/invitation','addon/1534'].map(path=><Route key={path} path={`/${path}`} element={<PublicPages key={path}/>}/>)}<Route path="/login" element={<Login/>}/><Route path="/login/:type" element={<Login key={useLocation().pathname}/>}/><Route path="/alumni" element={<Protected role="alumni"><PortalLayout/></Protected>}><Route index element={<Dashboard/>}/><Route path="profile" element={<Profile/>}/><Route path="profile/:id" element={<Profile/>}/><Route path="batch" element={<Directory key="batch" batch/>}/><Route path="directory" element={<Directory key="directory"/>}/><Route path="connect" element={<Directory key="connect" connect/>}/><Route path="messages" element={<Messages/>}/><Route path="calls" element={<Calls/>}/><Route path="jobs" element={<Jobs/>}/><Route path="jobs/:id" element={<Jobs/>}/><Route path="events" element={<Events/>}/><Route path="events/:id" element={<Events/>}/><Route path="groups" element={<Groups/>}/><Route path="groups/:id" element={<Groups/>}/><Route path="mentorship" element={<Directory key="mentor" mentor/>}/><Route path="announcements" element={<Announcements/>}/><Route path="resources" element={<Resources/>}/><Route path="settings" element={<Settings/>}/></Route><Route path="/admin" element={<Protected role="admin"><PortalLayout admin/></Protected>}><Route index element={<Navigate to="/admin/connect" replace/>}/><Route path="overview" element={<AdminDashboard/>}/><Route path="connect" element={<AdminConnect/>}/><Route path="alumni" element={<AlumniManagement/>}/><Route path="alumni/:id" element={<Profile/>}/><Route path="verification" element={<AlumniManagement verification/>}/>{['batches','programs','campuses','job-roles','companies'].map(kind=><Route key={kind} path={kind} element={<AdminCatalog key={kind} kind={kind}/>}/>)}<Route path="companies/:id" element={<AdminCatalog kind="companies"/>}/><Route path="jobs" element={<Jobs/>}/><Route path="jobs/:id" element={<Jobs/>}/><Route path="events" element={<Events/>}/><Route path="events/:id" element={<Events/>}/><Route path="announcements" element={<Announcements/>}/><Route path="groups" element={<Groups/>}/><Route path="groups/:id" element={<Groups/>}/><Route path="mentorship" element={<Directory mentor/>}/><Route path="messages" element={<Messages/>}/><Route path="reports" element={<AdminDashboard reports/>}/><Route path="notifications" element={<Notifications/>}/><Route path="settings" element={<Settings/>}/></Route><Route path="*" element={<NotFound/>}/></Routes></Suspense><CallModal/><Toast/></>}
