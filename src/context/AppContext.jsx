import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { alumni as initialAlumni } from '../data/alumni';
import { events as initialEvents } from '../data/events';
import { conversations } from '../data/messages';
const AppContext=createContext(null);
function read(key,fallback){try{return JSON.parse(localStorage.getItem(`pantiss:${key}`))??fallback}catch{return fallback}}
export function useLocalState(key, initial){const [value,setValue]=useState(()=>read(key,initial));useEffect(()=>{localStorage.setItem(`pantiss:${key}`,JSON.stringify(value))},[key,value]);return [value,setValue]}
export function AppProvider({children}){
 const [role,setRole]=useState(()=>localStorage.getItem('authRole'));
 const [theme,setTheme]=useLocalState('theme','light');
 const [people,setPeople]=useLocalState('alumni',initialAlumni);
 const [events,setEvents]=useLocalState('events',initialEvents);
 const [connections,setConnections]=useLocalState('connections',[]);
 const [saved,setSaved]=useLocalState('saved',[]);
 const [applications,setApplications]=useLocalState('applications',[]);
 const [registrations,setRegistrations]=useLocalState('registrations',[]);
 const [joined,setJoined]=useLocalState('groups',[]);
 const [requests,setRequests]=useLocalState('mentorship',[]);
 const [chats,setChats]=useLocalState('chats',conversations);
 const [readNotifications,setReadNotifications]=useLocalState('read-notifications',[]);
 const [call,setCall]=useState(null);const [toast,setToast]=useState(null);
 const notify=useCallback((message)=>setToast({message,id:Date.now()}),[]);
 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3600);return()=>clearTimeout(t)}},[toast]);
 useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
 const login=(next)=>{localStorage.setItem('authRole',next);setRole(next)};
 const logout=()=>{localStorage.removeItem('authRole');setRole(null)};
 const toggle=(setter,id)=>setter(prev=>prev.includes(id)?prev.filter(v=>v!==id):[...prev,id]);
 const connect=(id)=>{toggle(setConnections,id);notify(connections.includes(id)?'Connection request withdrawn':'Connection request sent')};
 const startCall=(person,video=false)=>setCall({person,video});
 return <AppContext.Provider value={{role,login,logout,theme,setTheme,people,setPeople,events,setEvents,connections,connect,saved,setSaved,applications,setApplications,registrations,setRegistrations,joined,setJoined,requests,setRequests,chats,setChats,readNotifications,setReadNotifications,call,setCall,startCall,toast,notify,toggle}}>{children}</AppContext.Provider>
}
export const useApp=()=>useContext(AppContext);
