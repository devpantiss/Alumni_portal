import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import App from './App';
import './styles.css';
class ErrorBoundary extends React.Component {state={error:false};static getDerivedStateFromError(){return {error:true}}render(){return this.state.error?<div className="not-found"><h1>Let’s get you reconnected.</h1><p>Something unexpected interrupted the workspace.</p><button className="button primary" onClick={()=>window.location.assign('/')}>Return home</button></div>:this.props.children}}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><BrowserRouter><AppProvider><App/></AppProvider></BrowserRouter></ErrorBoundary></React.StrictMode>);
