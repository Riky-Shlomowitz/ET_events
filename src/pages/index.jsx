import Layout from "./Layout.jsx";

import EventPlanning from "./EventPlanning";

import AdminLogin from "./AdminLogin";

import AdminDashboard from "./AdminDashboard";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    EventPlanning: EventPlanning,
    
    AdminLogin: AdminLogin,
    
    AdminDashboard: AdminDashboard,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<EventPlanning />} />
                
                
                <Route path="/EventPlanning" element={<EventPlanning />} />
                
                <Route path="/AdminLogin" element={<AdminLogin />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}