import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 🌟 Sidebar Collapse/Expand & Dropdown State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [bottomDropdownOpen, setBottomDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // States for Dynamic Data from Backend
  const [stats, setStats] = useState({ total_workspaces: 0, active_tenants: 0, monthly_revenue: 0 });
  const [admins, setAdmins] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // State for Add Admin Form (Start Date, End Date & Multiple Documents Added)
  const [adminData, setAdminData] = useState({ name: '', username: '', workspace: '', password: '', startDate: '', endDate: '' });
  
  // 🌟 Multiple Documents State (Dynamic Array)
  const [adminDocuments, setAdminDocuments] = useState([null]);

  // 🌟 SuperAdmin Logo States
  const [superAdminLogo, setSuperAdminLogo] = useState('https://via.placeholder.com/40?text=QT');
  const [logoInputType, setLogoInputType] = useState('local');
  const [logoUrlInput, setLogoUrlInput] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchAdminsList();
    fetchSuperAdminLogo();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const fetchAdminsList = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/admins');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      }
    } catch (err) {
      console.error('Error fetching admins list:', err);
    }
  };

  const fetchSuperAdminLogo = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/superadmin/logo');
      if (res.ok) {
        const data = await res.json();
        if (data.logo_url) {
          setSuperAdminLogo(data.logo_url);
          localStorage.setItem('superadmin_global_logo', data.logo_url);
        }
      }
    } catch (err) {
      console.error('Error fetching superadmin logo:', err);
    }
  };

  const updateLogoInDatabase = async (newLogoUrl) => {
    try {
      const res = await fetch('http://localhost:5000/api/superadmin/logo', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        },
        body: JSON.stringify({ logo_url: newLogoUrl })
      });
      
      const result = await res.json();
      if (!res.ok) {
        console.error('Database Error:', result.message);
      } else {
        console.log('Success:', result.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // 🌟 Document Input Helpers (+ / - Buttons)
  const handleAddDocumentField = () => {
    setAdminDocuments([...adminDocuments, null]);
  };

  const handleRemoveDocumentField = (index) => {
    const updatedDocs = adminDocuments.filter((_, i) => i !== index);
    setAdminDocuments(updatedDocs.length ? updatedDocs : [null]);
  };

  const handleDocumentChange = (index, file) => {
    const updatedDocs = [...adminDocuments];
    updatedDocs[index] = file;
    setAdminDocuments(updatedDocs);
  };

  // 🌟 FormData மூலம் Multiple Documents சேர்த்து அனுப்புவது
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', adminData.name);
      formData.append('username', adminData.username);
      formData.append('workspace', adminData.workspace);
      formData.append('password', adminData.password);
      formData.append('start_date', adminData.startDate);
      formData.append('end_date', adminData.endDate);

      // Multiple Files append செய்தல்
      adminDocuments.forEach((doc) => {
        if (doc) {
          formData.append('documents', doc);
        }
      });

      const response = await fetch('http://localhost:5000/api/superadmin/add-admin', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert('Workspace Admin registered successfully with all documents!');
        setAdminData({ name: '', username: '', workspace: '', password: '', startDate: '', endDate: '' });
        setAdminDocuments([null]);
        fetchAdminsList();
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to add admin');
      }
    } catch (err) {
      console.error('Error adding admin:', err);
      alert('Server connection failed.');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/superadmin/admins/${adminId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchAdminsList();
        fetchDashboardData();
      } else {
        alert('Failed to delete admin');
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('logo', file);

      try {
        const res = await fetch('http://localhost:5000/api/superadmin/upload-logo', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSuperAdminLogo(data.logo_url);
          localStorage.setItem('superadmin_global_logo', data.logo_url);
          alert('SuperAdmin Logo uploaded and saved to DB successfully!');
        } else {
          alert(data.message || 'Failed to upload logo');
        }
      } catch (err) {
        console.error('Error uploading logo:', err);
        alert('Server connection failed.');
      }
    }
  };

  const handleUrlLogoSave = () => {
    if (logoUrlInput.trim()) {
      const url = logoUrlInput.trim();
      setSuperAdminLogo(url);
      localStorage.setItem('superadmin_global_logo', url);
      updateLogoInDatabase(url);
      alert('SuperAdmin URL Logo updated successfully!');
      setLogoUrlInput('');
    }
  };

  // Multi-document parser for Table view
  const parseDocuments = (docData) => {
    if (!docData) return [];
    if (Array.isArray(docData)) return docData;
    if (typeof docData === 'string') {
      try {
        const parsed = JSON.parse(docData);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return docData.split(',').map((d) => d.trim()).filter(Boolean);
      }
      return [docData];
    }
    return [];
  };

  return (
    <div className="superadmin-wrapper" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Calibri, sans-serif' }}>
      
      {/* 🌟 Mobile Responsive Global Style */}
      <style>{`
        @media (max-width: 768px) {
          .superadmin-sidebar {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            z-index: 9999 !important;
            transform: translateX(${isMobileMenuOpen ? '0%' : '-100%'}) !important;
            transition: transform 0.3s ease-in-out !important;
            width: 260px !important;
          }
          .mobile-top-bar {
            display: flex !important;
          }
          .main-content-wrapper {
            padding: 20px 14px !important;
          }
          .form-grid-two-col {
            grid-template-columns: 1fr !important;
          }
          .header-title-box {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .url-input-container {
            flex-direction: column !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-top-bar {
            display: none !important;
          }
          .mobile-backdrop {
            display: none !important;
          }
        }
      `}</style>

      {/* 🌟 Mobile Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 9998,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* 🌟 Professional White Theme Sidebar */}
      <div className="superadmin-sidebar" style={{ 
        width: isSidebarCollapsed ? '88px' : '280px', 
        backgroundColor: '#ffffff', 
        color: '#1e293b', 
        padding: '24px 0 20px 14px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        zIndex: 1000, 
        overflowY: 'hidden', 
        boxShadow: '4px 0 20px rgba(0,0,0,0.03)', 
        borderRight: '1px solid #e2e8f0', 
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        fontFamily: 'Calibri, sans-serif'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* Top Header & Brand Area */}
          <div style={{ marginBottom: '22px', paddingBottom: '16px', paddingRight: '14px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <img 
                  src={superAdminLogo} 
                  alt="SuperAdmin Logo" 
                  style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0, borderRadius: '8px' }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/38?text=SA'; }} 
                />
                <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: '17px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.3px' }}>
                    Super Admin
                  </h5>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                    Management Console
                  </span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              style={{ 
                background: '#f1f5f9', 
                border: '1px solid #cbd5e1', 
                borderRadius: '50px', 
                width: isSidebarCollapsed ? '40px' : '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                fontSize: '14px', 
                color: '#334155', 
                margin: isSidebarCollapsed ? '0 auto' : '0 4px 0 0', 
                transition: 'all 0.3s ease'
              }}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            >
              {isSidebarCollapsed ? '›' : '‹'}
            </button>
          </div>

          {/* Navigation Links */}
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            flexGrow: 1, 
            overflowY: 'auto', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}>
            <style>{`
              ul::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
              { id: 'add-admin', label: 'Add Admin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg> },
              { id: 'admin-details', label: 'Admin Details', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
              { id: 'branding', label: 'Platform Branding', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button 
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    title={isSidebarCollapsed ? tab.label : ''}
                    style={{
                      width: '100%',
                      textAlign: isSidebarCollapsed ? 'center' : 'left',
                      padding: isSidebarCollapsed ? '12px 0' : '11px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '14px',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#2563eb' : 'transparent',
                      color: isActive ? '#ffffff' : '#475569',
                      transition: 'all 0.25s ease',
                      fontFamily: 'Calibri, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      gap: '14px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                        e.currentTarget.style.color = '#0f172a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#475569';
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tab.icon}</span>
                    {!isSidebarCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Profile / Logout Card */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', paddingRight: '14px', position: 'relative', flexShrink: 0 }}>
          
          <div 
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 14px)',
              left: isSidebarCollapsed ? '0' : '0',
              width: isSidebarCollapsed ? '60px' : 'calc(100% - 14px)',
              borderRadius: '14px',
              padding: '6px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              zIndex: 100,
              color: '#1e293b',
              transform: bottomDropdownOpen ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.96)',
              opacity: bottomDropdownOpen ? 1 : 0,
              visibility: bottomDropdownOpen ? 'visible' : 'hidden',
              transition: 'all 0.25s ease',
              transformOrigin: 'bottom left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                width: isSidebarCollapsed ? '42px' : '100%', 
                textAlign: isSidebarCollapsed ? 'center' : 'left', 
                padding: isSidebarCollapsed ? '10px 0' : '10px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: 'transparent', 
                color: '#ef4444', 
                fontWeight: '600', 
                fontSize: '13.5px', 
                cursor: 'pointer', 
                fontFamily: 'Calibri, sans-serif', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', 
                gap: '10px', 
                transition: 'background 0.2s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#ffeeef'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Logout Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              {!isSidebarCollapsed && <span>Logout Account</span>}
            </button>
          </div>

          <div 
            onClick={() => setBottomDropdownOpen(!bottomDropdownOpen)}
            style={{ 
              padding: isSidebarCollapsed ? '10px 0' : '10px 12px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between', 
              cursor: 'pointer', 
              background: 'transparent', 
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title={isSidebarCollapsed ? "Super Admin" : ""}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', width: '100%' }}>
              <img 
                src={superAdminLogo} 
                alt="SuperAdmin Logo" 
                style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0, borderRadius: '6px' }} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/36?text=SA'; }} 
              />
              {!isSidebarCollapsed && (
                <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#0f172a', margin: 0, fontWeight: '700', fontSize: '13.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Calibri, sans-serif' }}>
                    Super Admin
                  </span>
                  <span style={{ color: '#10b981', fontSize: '11px', fontFamily: 'Calibri, sans-serif', marginTop: '1px' }}>● Online</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span style={{ 
                color: '#64748b', 
                fontSize: '10px', 
                fontWeight: 'bold', 
                transform: bottomDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.3s ease'
              }}>
                ▲
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ flex: 1, padding: '30px 40px', overflowY: 'auto', minWidth: 0 }}>
        
        {/* 🌟 Mobile Top Bar with Hamburger */}
        <div className="mobile-top-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '16px' }}>Super Admin</span>
          </div>
          <button onClick={() => navigate('/')} style={{ padding: '6px 12px', backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Home</button>
        </div>

        <div className="header-title-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '24px' }}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'add-admin' && 'Add Workspace Administrator'}
              {activeTab === 'admin-details' && 'Workspace Admin Directory'}
              {activeTab === 'branding' && 'Platform Branding & Global Logo'}
            </h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13.5px' }}>Welcome back, Super Admin! Manage your platform seamlessly.</p>
          </div>
          <button onClick={() => navigate('/')} style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Go to Home</button>
        </div>

        {/* 1. Dashboard View */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Total Workspaces Card */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ backgroundColor: '#fff', padding: '22px 30px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb', minWidth: '240px', width: '100%', maxWidth: '300px', boxSizing: 'border-box' }}>
                <span style={{ color: '#64748b', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Workspaces</span>
                <h3 style={{ fontWeight: '800', color: '#2563eb', margin: '6px 0 0 0', fontSize: '28px' }}>{stats.total_workspaces || 0}</h3>
              </div>
            </div>

            {/* Tenant Distribution Overview */}
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0', fontSize: '18px' }}>Tenant Distribution Overview</h4>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Real-time analysis of active company workspaces from database.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
                {activities.length === 0 ? (
                  <p style={{ color: '#64748b', padding: '20px' }}>No workspace data found in database.</p>
                ) : (
                  activities.map((act, index) => (
                    <div key={index} style={{ padding: '22px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'all 0.2s ease' }}
                         onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)'; }}
                         onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15.5px' }}>{act.workspace_name}</span>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>{act.status}</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                        <span style={{ color: '#64748b', fontSize: '12.5px' }}>Admin:</span>
                        <span style={{ fontWeight: '600', color: '#334155', fontSize: '13.5px' }}>{act.admin_name}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Add Admin View (Multiple Documents Upload with Dynamic + Button) */}
        {activeTab === 'add-admin' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <div style={{ width: '100%', maxWidth: '750px', backgroundColor: '#fff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', boxSizing: 'border-box' }}>
              <div style={{ marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: '19px' }}>Onboard New Admin</h4>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Provide workspace details, dates, document and credentials to assign a new workspace administrator.</p>
              </div>
              <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
                <div className="form-grid-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Admin Full Name</label>
                    <input type="text" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. Alex Turner" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Username</label>
                    <input type="text" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. alex_admin" value={adminData.username} onChange={(e) => setAdminData({...adminData, username: e.target.value})} />
                  </div>
                </div>

                <div className="form-grid-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Company Name</label>
                    <input type="text" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. Innovate Hub" value={adminData.workspace} onChange={(e) => setAdminData({...adminData, workspace: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Password</label>
                    <input type="password" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="••••••••" value={adminData.password} onChange={(e) => setAdminData({...adminData, password: e.target.value})} />
                  </div>
                </div>

                {/* Start Date & End Date */}
                <div className="form-grid-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Start Date</label>
                    <input type="date" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={adminData.startDate} onChange={(e) => setAdminData({...adminData, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>End Date (Optional)</label>
                    <input type="date" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={adminData.endDate} onChange={(e) => setAdminData({...adminData, endDate: e.target.value})} />
                  </div>
                </div>

                {/* 🌟 Dynamic Multiple Documents Section */}
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontWeight: '700', color: '#475569', fontSize: '13.5px' }}>
                      Upload Documents (Agreement / ID / Proofs)
                    </label>
                    <button 
                      type="button" 
                      onClick={handleAddDocumentField}
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        backgroundColor: '#eff6ff', 
                        color: '#2563eb', 
                        border: '1px solid #bfdbfe', 
                        borderRadius: '6px', 
                        fontWeight: '700', 
                        fontSize: '12.5px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    >
                      <span style={{ fontSize: '15px', fontWeight: 'bold' }}>+</span> Add Document
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {adminDocuments.map((_, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="file" 
                          onChange={(e) => handleDocumentChange(index, e.target.files[0])} 
                          style={{ 
                            flex: 1, 
                            padding: '9px 12px', 
                            background: '#f8fafc', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '8px', 
                            boxSizing: 'border-box', 
                            fontSize: '13px' 
                          }} 
                        />
                        {adminDocuments.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveDocumentField(index)}
                            style={{ 
                              padding: '8px 12px', 
                              backgroundColor: '#fee2e2', 
                              color: '#dc2626', 
                              border: '1px solid #fca5a5', 
                              borderRadius: '8px', 
                              cursor: 'pointer', 
                              fontWeight: '700', 
                              fontSize: '13px',
                              flexShrink: 0
                            }}
                            title="Remove this document"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <button type="submit" style={{ padding: '12px 25px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', width: '100%', maxWidth: '240px' }}>
                    Create Admin Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. Admin Details View (Displays Multiple Documents) */}
        {activeTab === 'admin-details' && (
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div>
                <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: '18px' }}>Workspace Admin Directory</h4>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Manage all registered workspace administrators and their documents.</p>
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '700' }}>Admin Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '700' }}>Company Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '700' }}>Start Date</th>
                    <th style={{ padding: '16px 20px', fontWeight: '700' }}>Documents</th>
                    <th style={{ padding: '16px 20px', fontWeight: '700' }}>Status</th>
                    <th style={{ padding: '16px 20px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No workspace admins found in database. Please add one.</td>
                    </tr>
                  ) : (
                    admins.map((adm, index) => {
                      const docsList = parseDocuments(adm.documents || adm.document_path || adm.document_paths);
                      return (
                        <tr key={adm.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                          
                          {/* Admin Name */}
                          <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                              {adm.name ? adm.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            {adm.name}
                          </td>

                          {/* Company Name */}
                          <td style={{ padding: '16px 20px', color: '#2563eb', fontWeight: '600' }}>
                            {adm.company_name || adm.workspace || '—'}
                          </td>
                          
                          {/* Start Date */}
                          <td style={{ padding: '16px 20px', color: '#475569', fontWeight: '500' }}>
                            {adm.start_date ? new Date(adm.start_date).toLocaleDateString('en-CA') : '—'}
                          </td>

                          {/* 🌟 Multiple Documents View Badges */}
                          <td style={{ padding: '16px 20px' }}>
                            {docsList.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {docsList.map((docPath, dIdx) => (
                                  <a 
                                    key={dIdx}
                                    href={`http://localhost:5000/uploads/${docPath}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '4px', 
                                      padding: '4px 8px', 
                                      backgroundColor: '#f0fdf4', 
                                      color: '#16a34a', 
                                      border: '1px solid #bbf7d0', 
                                      borderRadius: '6px', 
                                      textDecoration: 'none', 
                                      fontWeight: '600', 
                                      fontSize: '11.5px' 
                                    }}
                                  >
                                    <span>📄</span> Doc {docsList.length > 1 ? dIdx + 1 : ''}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>No File</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>
                              Active
                            </span>
                          </td>

                          {/* Action Button */}
                          <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleDeleteAdmin(adm.id)} 
                              style={{ 
                                padding: '6px 14px', 
                                backgroundColor: '#fff', 
                                color: '#ef4444', 
                                border: '1px solid #fca5a5', 
                                borderRadius: '6px', 
                                fontWeight: '600', 
                                cursor: 'pointer', 
                                fontSize: '12px', 
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
                            >
                              Remove
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Platform Branding & Global Logo Upload Tab */}
        {activeTab === 'branding' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <div style={{ width: '100%', maxWidth: '750px', backgroundColor: '#fff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', boxSizing: 'border-box' }}>
              <h4 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '8px', fontSize: '19px' }}>Global Platform Branding</h4>
              <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '13.5px' }}>Upload or link the main SuperAdmin logo. This logo will appear automatically at the top of all Workspace Admin dashboards.</p>

              <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                <p style={{ color: '#64748b', fontSize: '12.5px', fontWeight: '600', marginBottom: '10px' }}>Current Global Logo Preview:</p>
                <img src={superAdminLogo} alt="Global Logo Preview" style={{ width: '65px', height: '65px', objectFit: 'contain', background: '#fff', padding: '8px', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '8px', fontSize: '13.5px' }}>Logo Input Type</label>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '13.5px', fontWeight: '600', color: '#334155', flexWrap: 'wrap' }}>
                  <label style={{ cursor: 'pointer' }}><input type="radio" name="superLogoType" checked={logoInputType === 'local'} onChange={() => setLogoInputType('local')} style={{ marginRight: '6px' }} /> Local File Upload</label>
                  <label style={{ cursor: 'pointer' }}><input type="radio" name="superLogoType" checked={logoInputType === 'url'} onChange={() => setLogoInputType('url')} style={{ marginRight: '6px' }} /> Image URL</label>
                </div>

                {logoInputType === 'local' ? (
                  <div>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '13.5px' }} />
                  </div>
                ) : (
                  <div className="url-input-container" style={{ display: 'flex', gap: '10px' }}>
                    <input type="url" placeholder="Paste Image URL here..." value={logoUrlInput} onChange={(e) => setLogoUrlInput(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} />
                    <button onClick={handleUrlLogoSave} style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13.5px' }}>Save Logo URL</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}