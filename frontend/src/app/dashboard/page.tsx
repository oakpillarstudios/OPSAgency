'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { 
  User as UserIcon, Layout, Heart, History, Clock, FileText, 
  MapPin, CheckCircle, Mail, Phone, Calendar, ArrowRight, 
  ShieldCheck, MessageSquare, Bell, Download, Settings, 
  Send, ExternalLink, Briefcase, FileSignature, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, loading, completeProfile, logout } = useAuth();
  
  const [profileData, setProfileData] = useState<any>({
    savedServices: [],
    savedTemplates: [],
    activities: [],
    quotes: [],
    consultations: []
  });
  const [profileLoading, setProfileLoading] = useState(true);

  // Profile Form States
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [company, setCompany] = useState('');
  const [businessType, setBusinessType] = useState('Service Business');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active section tab
  const [activeTab, setActiveTab] = useState<'welcome' | 'favorites' | 'inquiries' | 'status' | 'messages' | 'notifications' | 'downloads' | 'settings'>('welcome');

  // Support Message form
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'team', text: 'Welcome to your OakPillar Workspace! Your dedicated onboarding coordinator is reviewing your details. Let us know if you have any questions.', time: 'Just Now' }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading]);

  useEffect(() => {
    const loadFullProfile = async () => {
      if (!user) return;
      try {
        setProfileLoading(true);
        const res = await apiRequest<{ user: any }>('/auth/profile');
        setProfileData(res.user);
        
        // Populate form defaults
        setPhone(res.user.phone || '');
        setWhatsApp(res.user.whatsApp || '');
        setCompany(res.user.company || '');
        setBusinessType(res.user.businessType || 'Service Business');
        setIndustry(res.user.industry || '');
        setCity(res.user.city || '');
        setCountry(res.user.country || '');
        setWebsite(res.user.website || '');
      } catch (err) {
        console.error('Failed to load profile details:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    loadFullProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 space-y-8 animate-pulse">
        <div className="skeleton-box h-8 w-1/4 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="skeleton-box h-64 w-full rounded-2xl" />
          <div className="lg:col-span-3 skeleton-box h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErr('');
    setSuccessMsg('');
    try {
      await completeProfile({
        phone,
        whatsApp,
        company,
        businessType,
        industry,
        city,
        country,
        website
      });
      setSuccessMsg('Your profile profile has been saved successfully!');
      
      const res = await apiRequest<{ user: any }>('/auth/profile');
      setProfileData(res.user);
    } catch (e: any) {
      setErr(e.message || 'Failed to update profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  const removeBookmark = async (type: 'service' | 'template', id: string) => {
    try {
      if (type === 'service') {
        await apiRequest(`/services/save/${id}`, { method: 'DELETE' });
      } else {
        await apiRequest(`/templates/save/${id}`, { method: 'DELETE' });
      }
      const res = await apiRequest<{ user: any }>('/auth/profile');
      setProfileData(res.user);
    } catch (err) {
      console.error('Remove bookmark failed:', err);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: Date.now().toString(), sender: 'client', text: messageText, time: 'Just Now' }
    ]);
    setMessageText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-navy-slate/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> OakPillar Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-navy tracking-tight">Client Hub</h1>
          <p className="text-sm text-navy-slate">Manage, request custom proposals, and track your active developments.</p>
        </div>
        <button 
          onClick={logout}
          className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition-all self-start md:self-center shadow-sm"
        >
          Secure Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Summary Card */}
          <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold shadow-sm bg-navy-dark">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gold text-white flex items-center justify-center font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-navy">{user.name}</h3>
              <span className="text-xs text-navy-slate/70 block">{user.email}</span>
            </div>
            <div className="pt-3 w-full border-t border-navy-slate/5 grid grid-cols-2 gap-2 text-[10px] text-navy-slate font-bold uppercase tracking-wider">
              <div className="text-center">
                <span className="block text-navy text-sm font-black">{user.leadScore}</span>
                Priority Rating
              </div>
              <div className="text-center border-l border-navy-slate/10">
                <span className="block text-navy text-sm font-black">
                  {profileData.quotes.length + profileData.consultations.length}
                </span>
                Active Items
              </div>
            </div>
          </div>

          {/* Workspace Sections Menu */}
          <div className="flex flex-col gap-1">
            {[
              { id: 'welcome', name: 'Dashboard Home', icon: <Layout className="w-4 h-4" /> },
              { id: 'favorites', name: 'Saved & Bookmarks', icon: <Heart className="w-4 h-4" /> },
              { id: 'inquiries', name: 'Quotes & Bookings', icon: <FileText className="w-4 h-4" /> },
              { id: 'status', name: 'Project Status', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'messages', name: 'Support Messages', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'downloads', name: 'Client Downloads', icon: <Download className="w-4 h-4" /> },
              { id: 'settings', name: 'Profile Settings', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left w-full ${
                  activeTab === tab.id 
                    ? 'bg-gold text-white shadow-sm' 
                    : 'text-navy-slate hover:bg-navy-dark hover:text-navy'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Tab Viewports */}
        <div className="lg:col-span-3 min-w-0">
          
          {/* Tab 1: Welcome Dashboard */}
          {activeTab === 'welcome' && (
            <div className="space-y-6 animate-fade-in">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy/95 to-gold/90 p-8 text-white shadow-md">
                <div className="relative z-10 space-y-2">
                  <h2 className="text-2xl font-black">Welcome to your client portal workspace, {user.name.split(' ')[0]}!</h2>
                  <p className="text-sm text-navy-dark/95 max-w-lg leading-relaxed">
                    View active pricing requests, edit corporate profiles, access premium template specs, and contact developers directly.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150">
                  <ShieldCheck className="w-64 h-64" />
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Summary Widget */}
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gold" /> Onboarding Specs
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span className="text-navy-slate">Company:</span>
                      <span className="font-semibold text-navy">{profileData.company || 'Not Specified'}</span>
                    </div>
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span className="text-navy-slate">Business Mode:</span>
                      <span className="font-semibold text-navy">{profileData.businessType || 'Service Business'}</span>
                    </div>
                    <div className="flex justify-between border-b border-navy-slate/5 pb-2">
                      <span className="text-navy-slate">Industry Category:</span>
                      <span className="font-semibold text-navy">{profileData.industry || 'Not Specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-slate">Target City:</span>
                      <span className="font-semibold text-navy">{profileData.city || 'Not Specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Project Status Snippet */}
                <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gold" /> Current Project Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-navy">Quote Discovery Phase</span>
                      <span className="text-gold font-bold">Pending Review</span>
                    </div>
                    <div className="w-full bg-navy-dark h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gold h-full w-[25%]" />
                    </div>
                    <p className="text-[11px] text-navy-slate leading-relaxed">
                      Your proposal specifications are queued for technical review. The next step is a discovery meeting invitation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Latest Activities feed widget */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <History className="w-4 h-4 text-gold" /> Recent Workspace Log
                </h3>
                {profileData.activities.length === 0 ? (
                  <p className="text-xs text-navy-slate">No recent activities found.</p>
                ) : (
                  <div className="space-y-3.5">
                    {profileData.activities.slice(0, 3).map((act: any) => (
                      <div key={act.id} className="flex gap-3 text-xs items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                        <div className="flex-1 space-y-0.5">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-gold">{act.action}</span>
                          <p className="text-navy/90">{act.details}</p>
                          <span className="text-[9px] text-navy-slate/50 block">{new Date(act.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-6 animate-fade-in">
              {/* Services Card */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gold fill-gold" /> Favorite Service Packages
                </h3>
                {profileData.savedServices.length === 0 ? (
                  <div className="p-8 text-center text-xs text-navy-slate space-y-2.5">
                    <p>You have not bookmarked any services yet.</p>
                    <button 
                      onClick={() => router.push('/services')}
                      className="px-3.5 py-1.5 rounded-lg bg-navy hover:bg-navy-dark text-white font-bold transition-all"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.savedServices.map((item: any) => (
                      <div key={item.id} className="p-4 rounded-xl border border-navy-slate/10 bg-navy-dark flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-navy block">{item.service.title}</span>
                          <span className="text-[10px] text-navy-slate block mt-1">Starts at ${item.service.priceFrom} | Delivery: {item.service.timeline}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-slate/5">
                          <button
                            onClick={() => router.push(`/services/${item.service.slug}`)}
                            className="text-xs font-bold text-gold hover:text-gold-hover transition-colors inline-flex items-center gap-1"
                          >
                            Details <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeBookmark('service', item.service.id)}
                            className="text-[10px] text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Templates Card */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Layout className="w-4 h-4 text-gold" /> Bookmarked Website Templates
                </h3>
                {profileData.savedTemplates.length === 0 ? (
                  <div className="p-8 text-center text-xs text-navy-slate space-y-2.5">
                    <p>You have not bookmarked any website templates yet.</p>
                    <button 
                      onClick={() => router.push('/templates')}
                      className="px-3.5 py-1.5 rounded-lg bg-navy hover:bg-navy-dark text-white font-bold transition-all"
                    >
                      Browse Templates
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.savedTemplates.map((item: any) => (
                      <div key={item.id} className="p-4 rounded-xl border border-navy-slate/10 bg-navy-dark flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-navy block">{item.template.name}</span>
                          <span className="text-[10px] text-navy-slate block mt-1">{item.template.industry} | Speed score: {item.template.perfScore}%</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-slate/5">
                          <button
                            onClick={() => router.push(`/templates/${item.template.slug}`)}
                            className="text-xs font-bold text-gold hover:text-gold-hover transition-colors inline-flex items-center gap-1"
                          >
                            Preview <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeBookmark('template', item.template.id)}
                            className="text-[10px] text-red-500 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Quotes & Bookings */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-fade-in">
              {/* Quote Inquiries */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-gold" /> Proposal Quote Requests
                </h3>
                {profileData.quotes.length === 0 ? (
                  <p className="text-xs text-navy-slate p-4 text-center">No quote proposal queries recorded.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-navy-slate/10 text-navy-slate font-bold uppercase tracking-wider text-[9px]">
                          <th className="py-2.5">Service Requested</th>
                          <th className="py-2.5">Budget</th>
                          <th className="py-2.5">Timeline</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-slate/5">
                        {profileData.quotes.map((q: any) => (
                          <tr key={q.id} className="hover:bg-navy-dark/40 transition-colors">
                            <td className="py-3 font-semibold text-navy">{q.serviceName}</td>
                            <td className="py-3 text-gold font-bold">${q.budget}</td>
                            <td className="py-3 text-navy-slate">{q.timeline}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                q.status === 'NEW' ? 'bg-gold/15 text-gold' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {q.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Consultation Bookings */}
              <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" /> Consultation Bookings
                </h3>
                {profileData.consultations.length === 0 ? (
                  <p className="text-xs text-navy-slate p-4 text-center">No consultation meetings scheduled.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-navy-slate/10 text-navy-slate font-bold uppercase tracking-wider text-[9px]">
                          <th className="py-2.5">Meeting Type</th>
                          <th className="py-2.5">Date / Time</th>
                          <th className="py-2.5">Preferred Method</th>
                          <th className="py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-slate/5">
                        {profileData.consultations.map((c: any) => (
                          <tr key={c.id} className="hover:bg-navy-dark/40 transition-colors">
                            <td className="py-3 font-semibold text-navy">Bespoke Strategy Session</td>
                            <td className="py-3 text-navy-slate">
                              {new Date(c.preferredDate).toLocaleDateString()} at {c.preferredTime} ({c.timezone})
                            </td>
                            <td className="py-3 font-semibold text-gold">{c.contactMethod}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded bg-gold/15 text-gold text-[9px] font-extrabold uppercase">
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Project Status timeline */}
          {activeTab === 'status' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-navy border-b border-navy-slate/5 pb-3">Active Workspace Developments</h2>
              
              {/* Stepper tracker */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold text-navy-slate pt-4">
                <div className="space-y-2">
                  <div className="w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center mx-auto text-xs">✓</div>
                  <span className="block text-navy">1. Discovery</span>
                </div>
                <div className="space-y-2">
                  <div className="w-6 h-6 rounded-full bg-gold text-white flex items-center justify-center mx-auto text-xs">2</div>
                  <span className="block text-navy">2. Proposal</span>
                </div>
                <div className="space-y-2">
                  <div className="w-6 h-6 rounded-full bg-navy-dark border border-navy-slate/20 text-navy-slate flex items-center justify-center mx-auto text-xs">3</div>
                  <span>3. Production</span>
                </div>
                <div className="space-y-2">
                  <div className="w-6 h-6 rounded-full bg-navy-dark border border-navy-slate/20 text-navy-slate flex items-center justify-center mx-auto text-xs">4</div>
                  <span>4. QA Testing</span>
                </div>
                <div className="space-y-2">
                  <div className="w-6 h-6 rounded-full bg-navy-dark border border-navy-slate/20 text-navy-slate flex items-center justify-center mx-auto text-xs">5</div>
                  <span>5. Delivery</span>
                </div>
              </div>

              {/* Status Details */}
              <div className="p-5 rounded-xl border border-gold/15 bg-gold/5 mt-6 space-y-2 text-xs">
                <span className="font-bold text-gold uppercase tracking-wider text-[9px] block">Current Stage Details</span>
                <h4 className="font-bold text-navy text-sm">Specification Review</h4>
                <p className="text-navy-slate leading-relaxed">
                  Our architecture team is verifying the database models, API structures, and style guidelines submitted in your quote request. A coordinator will email you at <strong>{user.email}</strong> to schedule a validation call.
                </p>
              </div>
            </div>
          )}

          {/* Tab 5: Messages */}
          {activeTab === 'messages' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white shadow-sm overflow-hidden flex flex-col h-[500px] animate-fade-in">
              {/* Chat Header */}
              <div className="p-4 bg-navy text-white flex items-center gap-3 border-b border-navy-slate/10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold">OakPillar Project Specialist</h3>
                  <span className="text-[10px] text-navy-dark/80">Support Active</span>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-navy-dark bg-opacity-30">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[80%] rounded-xl p-3 text-xs ${
                      msg.sender === 'team' 
                        ? 'bg-white text-navy self-start border border-navy-slate/10' 
                        : 'bg-gold text-white self-end ml-auto'
                    }`}
                  >
                    <span className="font-medium">{msg.text}</span>
                    <span className={`text-[8px] mt-1 text-right block ${
                      msg.sender === 'team' ? 'text-navy-slate/60' : 'text-white/80'
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-navy-slate/10 bg-white flex gap-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message to our coordinator..."
                  className="flex-1 px-3 py-2 border border-navy-slate/20 rounded-xl bg-navy-dark text-xs text-navy focus:outline-none focus:border-gold"
                />
                <button 
                  type="submit" 
                  className="p-2 rounded-xl bg-gold hover:bg-gold-hover text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 6: Notifications */}
          {activeTab === 'notifications' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-navy border-b border-navy-slate/5 pb-2">Workspace Notifications</h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-navy-slate/10 bg-navy-dark flex items-start gap-3">
                  <Bell className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-navy block">Client Portal Initialized</span>
                    <p className="text-navy-slate">Your private database log and CRM priorities have successfully mounted.</p>
                    <span className="text-[9px] text-navy-slate/40 block mt-1">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Downloads */}
          {activeTab === 'downloads' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-navy border-b border-navy-slate/5 pb-2">Premium Project Documentation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Client Onboarding Form.pdf', size: '1.2 MB' },
                  { name: 'OakPillar Brand Guidelines.pdf', size: '4.8 MB' },
                  { name: 'Scope of Work Document.xlsx', size: '340 KB' }
                ].map((file, i) => (
                  <div key={i} className="p-4 rounded-xl border border-navy-slate/10 bg-navy-dark flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-navy block">{file.name}</span>
                      <span className="text-[10px] text-navy-slate block mt-0.5">{file.size}</span>
                    </div>
                    <button 
                      className="p-2 rounded-xl bg-white hover:bg-gold hover:text-white border border-navy-slate/10 text-gold transition-all"
                      onClick={() => alert(`Initiating download for ${file.name}`)}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 8: Profile Settings */}
          {activeTab === 'settings' && (
            <div className="rounded-2xl border border-navy-slate/10 bg-white p-6 shadow-sm space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-navy border-b border-navy-slate/5 pb-3">Corporate Profile Specs</h2>
              
              {err && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
                  {err}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block text-xs font-bold text-navy-slate mb-1.5">Phone Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="e.g. +91 77380 49380"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-slate mb-1.5">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={whatsApp} 
                    onChange={(e) => setWhatsApp(e.target.value)} 
                    placeholder="Same as phone"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-slate mb-1.5">Company Name</label>
                  <input 
                    type="text" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)} 
                    placeholder="e.g. OakPillar Studios"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-slate mb-1.5">Business Category *</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy focus:outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="Service Business">Service Business</option>
                    <option value="E-commerce">E-commerce Retail</option>
                    <option value="Custom Platform">Bespoke Software / Startup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-slate mb-1.5">Target Industry</label>
                  <input 
                    type="text" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)} 
                    placeholder="e.g. Digital Agency"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-slate mb-1.5">City / Location</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="e.g. Mumbai, MH"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-navy-slate/20 bg-navy-dark text-navy focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="md:col-span-2 pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm transform active:scale-95 disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving Specs...' : 'Save Profile Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
