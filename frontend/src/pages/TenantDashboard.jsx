import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function TenantDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [tenantInfo, setTenantInfo] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [showLogoModal, setShowLogoModal] = useState(false);

  // States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottomDropdownOpen, setBottomDropdownOpen] = useState(false);
  // const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [companyName, setCompanyName] = useState('');
  const [appLogo, setAppLogo] = useState('https://via.placeholder.com/40?text=T');
  const [logoInputType, setLogoInputType] = useState('local');
  const [logoUrlInput, setLogoUrlInput] = useState('');

  // Attendees States
  const [attendeesView, setAttendeesView] = useState('list');
  const [attendees, setAttendees] = useState([]);
  const [isAttEditing, setIsAttEditing] = useState(false);
  const [editAttId, setEditAttId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [attendeeMenuOpen, setAttendeeMenuOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState('All');

  const [attId, setAttId] = useState('');
  const [attName, setAttName] = useState('');
  const [attTenantName, setAttTenantName] = useState('');
  const [attWorkspace, setAttWorkspace] = useState('');
  const [attPhone, setAttPhone] = useState('');
  const [attAddress, setAttAddress] = useState('');
  const [attRole, setAttRole] = useState('');
  const [attJoinDate, setAttJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [attEndDate, setAttEndDate] = useState('');
  const [attendeesPage, setAttendeesPage] = useState(1);
  const perPage = 5;

  // 🍔 Tenant Food & Cart / Receipt States
  const [tenantFoods, setTenantFoods] = useState([]);
  const [cart, setCart] = useState([]);

  // 📄 Tenant Invoice & Monthly Orders States
  const [tenantOrders, setTenantOrders] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Database Notices State for Tenant
  const [dbNotices, setDbNotices] = useState([]);
  const [noticeTypeFilter, setNoticeTypeFilter] = useState('all');
  const [noticeMonthFilter, setNoticeMonthFilter] = useState('all');
  const [noticeDropdownOpen, setNoticeDropdownOpen] = useState(false);

  // ⚠️ Complaints & Support States
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');
  const [complaintsList, setComplaintsList] = useState([]);

  // 📅 Meeting Room Booking States
  const [workspaceMeetingRooms, setWorkspaceMeetingRooms] = useState([]);
  const [selectedMeetingRoom, setSelectedMeetingRoom] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingPurpose, setMeetingPurpose] = useState('');
  const [bookedMeetingsList, setBookedMeetingsList] = useState([]);
  const [meetingPage, setMeetingPage] = useState(1);

  // Chart Animation State Trigger
  const [animationKey, setAnimationKey] = useState(0);

  // 🌟 சரிசெய்யப்பட்ட useEffect (Duplicate நீக்கப்பட்டது)
  useEffect(() => {
    const storedTenant = localStorage.getItem('tenant_info');
    if (storedTenant) {
      try {
        const parsed = JSON.parse(storedTenant);
        setTenantInfo(parsed);
        
        const uniqueCompanyKey = `tenant_company_${parsed.username || parsed.name}`;
        const savedComp = localStorage.getItem(uniqueCompanyKey) || parsed.name || 'Tenant Portal';
        setCompanyName(savedComp);
        setAttTenantName(savedComp);
        setAttWorkspace(parsed.workspace || 'N/A');

        // 🌟 டேட்டாபேஸில் இருந்து லோகோவை நேராக எடுப்பது
        const fetchTenantLogoFromDB = async () => {
          if (!parsed.id) return;
          try {
            const res = await fetch(`http://localhost:5000/api/tenant/logo?tenant_id=${parsed.id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.logo_url) {
                setAppLogo(data.logo_url);
              } else if (parsed.logo) {
                setAppLogo(parsed.logo);
              }
            }
          } catch (err) {
            console.error("Error fetching tenant logo:", err);
          }
        };
        fetchTenantLogoFromDB();

      } catch (err) {
        console.error("Error parsing tenant info:", err);
      }
    }
  }, []);

  useEffect(() => {
    const currentTenantName = companyName || tenantInfo?.name;
    if (!currentTenantName) return;

    const fetchAllData = async () => {
      try {
        const [attRes, foodRes, ordRes, profRes, noticeRes, compRes, meetRes] = await Promise.all([
          fetch(`http://localhost:5000/api/attendees?tenant_name=${encodeURIComponent(currentTenantName)}`),
          fetch(`http://localhost:5000/api/tenant/foods?tenant_name=${encodeURIComponent(currentTenantName)}`),
          fetch(`http://localhost:5000/api/admin/tenant-orders?tenant_name=${encodeURIComponent(currentTenantName)}`),
          fetch(`http://localhost:5000/api/tenant/profile?tenant_name=${encodeURIComponent(currentTenantName)}`),
          fetch(`http://localhost:5000/api/notices?tenant_name=${encodeURIComponent(currentTenantName)}`),
          fetch(`http://localhost:5000/api/tenant/complaints?tenant_name=${encodeURIComponent(currentTenantName)}`),
          fetch(`http://localhost:5000/api/meeting-bookings?tenant_name=${encodeURIComponent(currentTenantName)}`)
        ]);

        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendees(attData.attendees);
        }
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          setTenantFoods(foodData.foods);
        }
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setTenantOrders(ordData.orders);
        }
        if (profRes.ok) {
          const profData = await profRes.json();
          if (profData.profile) {
            setTenantInfo(prev => ({ ...prev, ...profData.profile }));
            
            const wsName = profData.profile.workspace;
            if (wsName) {
              const wsRes = await fetch('http://localhost:5000/api/workspaces');
              if (wsRes.ok) {
                const wsData = await wsRes.json();
                const matchedWs = (wsData.workspaces || []).find(
                  w => w.name.trim().toLowerCase() === wsName.trim().toLowerCase()
                );
                if (matchedWs && matchedWs.meetings) {
                  const rawMeetings = matchedWs.meetings.split(',').map(m => m.trim()).filter(Boolean);
                  const cleanMeetingNames = rawMeetings.map(m => m.replace(/\s*\(\d+\)\s*/g, '').trim());
                  setWorkspaceMeetingRooms(cleanMeetingNames);
                }
              }
            }
          }
        }
        if (noticeRes.ok) {
          const noticeData = await noticeRes.json();
          setDbNotices(noticeData.notices || []);
        }
        if (compRes.ok) {
          const compData = await compRes.json();
          setComplaintsList(compData.complaints || []);
        }
        if (meetRes.ok) {
          const meetData = await meetRes.json();
          setBookedMeetingsList(meetData.bookings || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAllData();
  }, [companyName, activeTab]);

  useEffect(() => {
    const currentTenantName = companyName || tenantInfo?.name;
    if (!currentTenantName || activeTab !== 'invoice') return;

    const fetchInvoices = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/sent-invoices?tenant_name=${encodeURIComponent(currentTenantName)}`);
        if (res.ok) {
          const data = await res.json();
          const tenantOnlyInvoices = (data.invoices || []).filter(
            inv => inv.tenant_name?.toLowerCase() === currentTenantName.toLowerCase()
          );

          const uniqueMap = new Map();
          tenantOnlyInvoices.forEach(inv => {
            if (!uniqueMap.has(inv.billing_month)) {
              uniqueMap.set(inv.billing_month, inv);
            }
          });

          const formattedInvoices = Array.from(uniqueMap.values());
          setInvoicesList(formattedInvoices);
          if (formattedInvoices.length > 0 && !selectedInvoice) {
            setSelectedInvoice(formattedInvoices[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };
    fetchInvoices();
  }, [activeTab, companyName, tenantInfo]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (tabId === 'overview') {
      setAnimationKey(prev => prev + 1);
    }
    if (tabId === 'attendees') {
      setAttendeesView('list');
    }
  };

  const handleAddToCart = (food) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === food.id);
      if (existing) {
        return prevCart.map(item => item.id === food.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        return [...prevCart, { ...food, qty: 1 }];
      }
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // 🌟 டபுள் கிளிக் மற்றும் இரட்டைப் பதிவு ஆவதைத் தடுக்க
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formattedItemsString = cart.map(item => `${item.food_name} (₹${item.price} x ${item.qty} = ₹${item.price * item.qty})`).join(', ');

    const orderPayload = {
      tenant_name: companyName || tenantInfo?.name,
      items: formattedItemsString,
      total_amount: cart.reduce((total, item) => total + (parseFloat(item.price) * item.qty), 0).toFixed(2)
    };

    try {
      const res = await fetch('http://localhost:5000/api/tenant/orders', {
        method: 'POST',
        headers: { 'Type': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        alert(`Order placed successfully! Total Bill: ₹${orderPayload.total_amount}`);
        setCart([]);
        const ordRes = await fetch(`http://localhost:5000/api/admin/tenant-orders?tenant_name=${encodeURIComponent(companyName || tenantInfo?.name)}`);
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setTenantOrders(ordData.orders);
        }
      } else {
        alert('Failed to place order.');
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      // ஆர்டர் முடிந்ததும் மீண்டும் பட்டனைச் செயல்பட வைக்கிறோம்
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // 🌟 1. லோக்கல் ஃபைல் மூலம் லோகோவை அப்லோட் செய்து டேட்டாபேஸில் சேமிக்க
  const handleTenantLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAppLogo(base64String);
        
        const tenantInfoObj = JSON.parse(localStorage.getItem('tenant_info') || '{}');
        const tenantId = tenantInfoObj.id;

        if (!tenantId) {
          alert('Tenant ID not found!');
          return;
        }

        try {
          const res = await fetch('http://localhost:5000/api/tenant/logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenant_id: tenantId,
              logo_url: base64String
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            alert('Local Logo uploaded and saved to DB successfully! 🖼️');
          } else {
            alert(data.message || 'Failed to save logo');
          }
        } catch (err) {
          console.error('Error saving tenant logo:', err);
          alert('Server connection failed.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 🌟 2. URL மூலம் லோகோவை டேட்டாபேஸில் சேமிக்க
  const handleTenantUrlLogoSave = async () => {
    if (logoUrlInput.trim()) {
      const url = logoUrlInput.trim();
      setAppLogo(url);
      
      const tenantInfoObj = JSON.parse(localStorage.getItem('tenant_info') || '{}');
      const tenantId = tenantInfoObj.id;

      if (!tenantId) {
        alert('Tenant ID not found!');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/tenant/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant_id: tenantId,
            logo_url: url
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('Logo URL updated and saved to DB successfully! 🖼️');
        } else {
          alert(data.message || 'Failed to save logo to database.');
        }
      } catch (err) {
        console.error('Error saving tenant logo URL to DB:', err);
        alert('Server connection failed.');
      }
    }
  };

  const handleCompanyNameChange = (name) => {
    setCompanyName(name);
    if (tenantInfo) {
      const uniqueCompanyKey = `tenant_company_${tenantInfo.username || tenantInfo.name}`;
      localStorage.setItem(uniqueCompanyKey, name);
      setAttTenantName(name);
    }
  };

  const handleOpenAddAtt = () => {
    setIsAttEditing(false);
    setEditAttId(null);
    setAttId('');
    setAttName('');
    setAttTenantName(companyName || tenantInfo?.name || '');
    setAttWorkspace(tenantInfo?.workspace || 'N/A');
    setAttPhone('');
    setAttAddress('');
    setAttRole('');
    setAttJoinDate(new Date().toISOString().split('T')[0]);
    setAttEndDate('');
    setAttendeesView('form');
  };

  const handleOpenEditAtt = (att) => {
    setIsAttEditing(true);
    setEditAttId(att.id);
    setAttId(att.att_id);
    setAttName(att.name);
    setAttTenantName(att.tenant_name || companyName);
    setAttWorkspace(att.workspace || tenantInfo?.workspace || 'N/A');
    setAttPhone(att.phone);
    setAttAddress(att.address);
    setAttRole(att.role);
    setAttJoinDate(att.join_date);
    setAttEndDate(att.end_date);
    setAttendeesView('form');
  };

  const handleDeleteAtt = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendee?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/attendees/${id}`, { method: 'DELETE' });
        if (res.ok) { 
          setAttendees(prev => prev.filter(item => item.id !== id));
          setSelectedAttendee(null);
        }
      } catch (err) {
        console.error("Error deleting attendee:", err);
      }
    }
  };

  const handleSaveOrUpdateAtt = async (e) => {
    e.preventDefault();
    const attData = {
      attId,
      name: attName,
      tenantName: attTenantName,
      workspace: attWorkspace,
      phone: attPhone,
      address: attAddress,
      role: attRole,
      joinDate: attJoinDate,
      endDate: attEndDate || 'Active'
    };

    const url = isAttEditing ? `http://localhost:5000/api/attendees/${editAttId}` : 'http://localhost:5000/api/attendees';
    const method = isAttEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Type': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(attData)
      });

      if (res.ok) {
        alert(isAttEditing ? 'Attendee Updated Successfully!' : 'Attendee Saved Successfully!');
        setAttendeesView('list');
        const currentTenantName = companyName || tenantInfo?.name;
        const attRes = await fetch(`http://localhost:5000/api/attendees?tenant_name=${encodeURIComponent(currentTenantName)}`);
        if (attRes.ok) {
          const data = await attRes.json();
          setAttendees(data.attendees);
        }
      } else {
        alert('Failed to save attendee.');
      }
    } catch (err) {
      console.error("Error saving attendee:", err);
    }
  };

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    if (!complaintSubject || !complaintMessage.trim()) return;

    const currentTenantName = companyName || tenantInfo?.name;
    if (!currentTenantName) {
      alert('Tenant session error. Please login again.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/tenant/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_name: currentTenantName,
          subject: complaintSubject,
          message: complaintMessage
        })
      });

      if (res.ok) {
        alert('Support ticket / complaint raised successfully! Administrator will review it soon. ⚠️');
        setComplaintSubject('');
        setComplaintMessage('');

        const compRes = await fetch(`http://localhost:5000/api/tenant/complaints?tenant_name=${encodeURIComponent(currentTenantName)}`);
        if (compRes.ok) {
          const compData = await compRes.json();
          setComplaintsList(compData.complaints || []);
        }
      } else {
        alert('Failed to raise complaint.');
      }
    } catch (err) {
      console.error("Complaint error:", err);
    }
  };
  const handleMarkTenantMeetingCompleted = async (bookingId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/tenant/meeting-bookings/${bookingId}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      alert('Meeting successfully marked as completed! 🎉');
      // மீட்டிங் லிஸ்ட்டை மீண்டும் ஃபெட்ச் செய்து அப்டேட் செய்யவும்
      fetchTenantMeetings(); 
    } else {
      alert('Failed to update meeting status.');
    }
  } catch (err) {
    console.error("Error updating meeting status:", err);
  }
};

  const handleBookMeetingRoom = async (e) => {
    e.preventDefault();
    if (!selectedMeetingRoom || !meetingDate || !meetingTime || !meetingPurpose.trim()) {
      alert('Please fill all meeting room booking details!');
      return;
    }

    const currentTenantName = companyName || tenantInfo?.name;
    if (!currentTenantName) {
      alert('Tenant session error. Please login again.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/tenant/meeting-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_name: currentTenantName,
          room_name: selectedMeetingRoom,
          booking_date: meetingDate,
          time_slot: meetingTime,
          purpose: meetingPurpose
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Meeting room (${selectedMeetingRoom}) successfully booked for ${meetingDate} at ${meetingTime}! 📅`);
        setSelectedMeetingRoom('');
        setMeetingTime('');
        setMeetingPurpose('');

        const meetRes = await fetch(`http://localhost:5000/api/meeting-bookings?tenant_name=${encodeURIComponent(currentTenantName)}`);
        if (meetRes.ok) {
          const meetData = await meetRes.json();
          setBookedMeetingsList(meetData.bookings || []);
        }
      } else {
        alert(data.message || 'Failed to book meeting room.');
      }
    } catch (err) {
      console.error("Meeting room booking error:", err);
      alert('Network error while booking meeting room.');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeAttendeesCount = attendees.filter(item => {
    if (!item.end_date || item.end_date === 'Active') return true;
    return item.end_date > todayStr;
  }).length;

  const totalSeats = tenantInfo?.seats || 5;
  const activeSeats = activeAttendeesCount;

  const barData = {
    labels: ['Allocated Seats', 'Active Attendees'],
    datasets: [
      {
        label: 'Workspace Count',
        data: [totalSeats, activeSeats],
        backgroundColor: ['#048c7f', '#28a99e'],
        borderRadius: 8,
        barThickness: 50,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    animation: { duration: 1200, easing: 'easeInOutQuart' },
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f3f5' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Calibri, sans-serif', overflow: 'hidden', position: 'relative' }}>
      
      {/* Top Mobile Navbar Toggle Bar */}
      <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a1128', color: '#fff', padding: '12px 20px', zIndex: 1100, position: 'fixed', top: 0, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={appLogo} alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain', background: '#fff', borderRadius: '4px', padding: '2px' }} />
          <span style={{ fontWeight: '700', fontSize: '15px' }}>{companyName || tenantInfo?.name || 'Tenant Portal'}</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tenant-sidebar {
            position: fixed !important;
            left: ${mobileMenuOpen ? '0' : '-280px'} !important;
            height: 100vh !important;
            transition: left 0.3s ease-in-out !important;
            top: 0 !important;
          }
          .tenant-main-content {
            margin-left: 0 !important;
            padding: 15px !important;
            padding-top: 60px !important;
          }
          .attendees-split-grid, .orders-split-grid, .invoice-split-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) {
          .tenant-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
          }
          .tenant-main-content {
            margin-left: ${isSidebarCollapsed ? '88px' : '280px'} !important;
            transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .attendees-split-grid {
            grid-template-columns: 380px 1fr !important;
          }
          .orders-split-grid {
            grid-template-columns: 1fr 380px !important;
          }
          .invoice-split-grid {
            grid-template-columns: 380px 1fr !important;
          }
        }
      `}</style>

      {/* 🌟 Fixed Professional Sidebar */}
      <div className="tenant-sidebar" style={{ 
        width: isSidebarCollapsed ? '88px' : '280px', 
        backgroundColor: '#0a1128', 
        color: '#fff', 
        padding: '24px 0 20px 14px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        zIndex: 1050, 
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Calibri, sans-serif',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          <div style={{ marginBottom: '22px', paddingBottom: '16px', paddingRight: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <img 
                  src={appLogo} 
                  alt="Tenant Logo" 
                  style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0, borderRadius: '6px', background: '#fff', padding: '2px' }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/38?text=T'; }} 
                />
                <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{ fontWeight: '800', color: '#ffffff', margin: 0, fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {companyName || tenantInfo?.name || 'Tenant Portal'}
                  </h5>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                    ● Active Workspace
                  </span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              style={{ 
                background: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.15)', 
                borderRadius: '50px', 
                width: isSidebarCollapsed ? '40px' : '28px', 
                height: '28px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                fontSize: '14px', 
                color: '#ffffff',
                margin: isSidebarCollapsed ? '0 auto' : '0 4px 0 0',
                transition: 'all 0.3s ease'
              }}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            >
              {isSidebarCollapsed ? '‹' : '›'}
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
              { id: 'overview', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
              { id: 'employees', label: 'Employees', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
              { id: 'orders', label: 'Orders', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
              { id: 'invoice', label: 'Invoice', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
              { id: 'notice', label: 'Notice', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> },
              // { id: 'reports', label: 'Reports', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
              { id: 'complaints', label: 'Raise a Complaints', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> },
              { id: 'meeting', label: 'Book Meeting Room', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button 
                    onClick={() => handleTabChange(tab.id)}
                    title={isSidebarCollapsed ? tab.label : ''}
                    style={{
                      width: '100%',
                      textAlign: isSidebarCollapsed ? 'center' : 'left',
                      padding: isSidebarCollapsed ? '12px 0' : '11px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '14.5px',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#2563eb' : 'transparent',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: 'Calibri, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      gap: '14px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#cbd5e1';
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

        {/* Bottom Profile / Account Card Dropdown */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', paddingRight: '14px', position: 'relative', flexShrink: 0 }}>
          
          <div 
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 14px)',
              left: isSidebarCollapsed ? '0' : '0',
              width: isSidebarCollapsed ? '60px' : 'calc(100% - 14px)',
              borderRadius: '14px',
              padding: '6px',
              background: '#131b31',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              zIndex: 100,
              color: '#fff',
              transform: bottomDropdownOpen ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.96)',
              opacity: bottomDropdownOpen ? 1 : 0,
              visibility: bottomDropdownOpen ? 'visible' : 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              transformOrigin: 'bottom left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <button 
              onClick={() => { setActiveTab('profile'); setBottomDropdownOpen(false); }}
              style={{ 
                width: isSidebarCollapsed ? '42px' : '100%', 
                textAlign: isSidebarCollapsed ? 'center' : 'left', 
                padding: isSidebarCollapsed ? '10px 0' : '10px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: activeTab === 'profile' ? 'rgba(37,99,235,0.2)' : 'transparent', 
                color: '#fff', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: 'pointer', 
                fontFamily: 'Calibri, sans-serif', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', 
                gap: '10px', 
                transition: 'background 0.2s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = activeTab === 'profile' ? 'rgba(37,99,235,0.2)' : 'transparent'}
              title="My Profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {!isSidebarCollapsed && <span>My Profile</span>}
            </button>

            <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '2px 0' }}></div>

            <button 
              onClick={() => {
                localStorage.removeItem('tenant_info');
                navigate('/login');
              }}
              style={{ 
                width: isSidebarCollapsed ? '42px' : '100%', 
                textAlign: isSidebarCollapsed ? 'center' : 'left', 
                padding: isSidebarCollapsed ? '10px 0' : '10px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: 'transparent', 
                color: '#f87171', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: 'pointer', 
                fontFamily: 'Calibri, sans-serif', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', 
                gap: '10px', 
                transition: 'background 0.2s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              title="Logout Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              {!isSidebarCollapsed && <span>Logout Account</span>}
            </button>
          </div>

          {/* Bottom Card Trigger */}
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
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title={isSidebarCollapsed ? (companyName || tenantInfo?.name || 'Tenant') : ''}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', width: '100%' }}>
              <img 
                src={appLogo} 
                alt="Tenant Logo" 
                style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0, borderRadius: '6px', background: '#fff', padding: '2px' }} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/36?text=T'; }} 
              />
              {!isSidebarCollapsed && (
                <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#ffffff', margin: 0, fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Calibri, sans-serif' }}>
                    {companyName || tenantInfo?.name || 'Tenant'}
                  </span>
                  <span style={{ color: '#38bdf8', fontSize: '11px', fontFamily: 'Calibri, sans-serif', marginTop: '1px' }}>● Online</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span style={{ 
                color: '#94a3b8', 
                fontSize: '10px', 
                fontWeight: 'bold', 
                transform: bottomDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                ▲
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="tenant-main-content" style={{ 
        flex: 1, 
        height: '100vh', 
        overflowY: 'auto', 
        marginLeft: isSidebarCollapsed ? '88px' : '280px', 
        padding: '40px', 
        boxSizing: 'border-box',
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
      }}>
        <div style={{ marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #e5e8eb' }}>
          <div>
            <h2 style={{ fontWeight: 'bold', color: '#025043', textTransform: 'capitalize', margin: 0, marginBottom: '5px', fontFamily: 'Calibri, sans-serif', fontSize: '28px' }}>
              {activeTab === 'meeting' ? 'Meeting Room Booking' : activeTab === 'complaints' ? 'Complaints & Support' : activeTab === 'orders' ? 'Food Order' : activeTab === 'invoice' ? 'Invoices' : activeTab.replace('-', ' ')}
            </h2>
            <p style={{ color: '#6c757d', margin: 0, fontSize: '15px', fontFamily: 'Calibri, sans-serif' }}>Welcome back, manage your workspace resources seamlessly.</p>
          </div>
        </div>
        {/* 1. Overview Tab */}
{activeTab === 'overview' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
    
    {/* Top Header Bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '15px' }}>
      <div>
        <h2 style={{ fontWeight: '800', color: '#1e293b', margin: 0, marginBottom: '4px', fontFamily: 'Calibri, sans-serif', fontSize: '26px' }}>
          Welcome back, {tenantInfo?.name || 'Tenant'} 👋
        </h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14.5px', fontFamily: 'Calibri, sans-serif' }}>
          Here's what's happening in your workspace today.
        </p>
      </div>

      {/* Right Controls: Search, Tenant Profile Badge & Date with Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', width: window.innerWidth < 768 ? '100%' : '240px' }}>
          <span style={{ position: 'absolute', top: '9px', left: '14px', color: '#94a3b8', fontSize: '14px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search orders, invoices, rooms..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (e.target.value || '').toLowerCase().trim();
                if (q.includes('order') || q.includes('food')) { setActiveTab('orders'); }
                else if (q.includes('inv') || q.includes('bill') || q.includes('pay')) { setActiveTab('invoice'); }
                else if (q.includes('emp') || q.includes('attend')) { setActiveTab('employees'); }
                else if (q.includes('meet') || q.includes('room') || q.includes('book')) { setActiveTab('meeting'); }
                else if (q.includes('comp') || q.includes('issue')) { setActiveTab('complaints'); }
                else if (q.includes('notic')) { setActiveTab('notice'); }
              }
            }}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '50px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          />
        </div>

        {/* Tenant Profile Pill */}
        <div style={{ backgroundColor: '#fff', padding: '5px 14px 5px 6px', borderRadius: '50px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <img 
            src={tenantInfo?.logo_url || 'https://via.placeholder.com/30?text=T'} 
            alt="Tenant Logo" 
            style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '50%', background: '#f1f5f9', padding: '2px' }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/30?text=T'; }} 
          />
          <div style={{ lineHeight: '1.2' }}>
            <span style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>
              {tenantInfo?.name || 'Tenant'}
            </span>
            <span style={{ display: 'block', fontSize: '10.5px', color: '#64748b' }}>
              {tenantInfo?.workspace || 'Workspace Tenant'}
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '2px' }}>▼</span>
        </div>

        {/* Date & Time Pill */}
        <div style={{ backgroundColor: '#fff', padding: '8px 16px', borderRadius: '50px', border: '1px solid #cbd5e1', fontWeight: '600', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span>📅</span> 
          <span>
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 
            {' • '} 
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
        </div>

      </div>
    </div>

    {/* Top Stat Summary Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10.5px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Active</span>
        <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div>
          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Allocated Seats</span>
          <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>
            {selectedMonth === '2026-06' || selectedMonth === '2026-07' ? 0 : (totalSeats || 0)}
          </h3>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10.5px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Active</span>
        <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <div>
          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Active Attendees</span>
          <h3 style={{ fontWeight: '800', color: '#10b981', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>
            {selectedMonth === '2026-06' || selectedMonth === '2026-07' ? 0 : (activeAttendeesCount || 0)}
          </h3>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10.5px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Active</span>
        <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>
        </div>
        <div>
          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Workspace</span>
          <h3 style={{ fontWeight: '800', color: '#9333ea', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '15px' : '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{tenantInfo?.workspace || 'N/A'}</h3>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '10.5px', backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>Active</span>
        <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#fff7ed', color: '#f97316', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
        <div>
          <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Tenant Profile</span>
          <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '15px' : '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{tenantInfo?.name || 'Tenant'}</h3>
        </div>
      </div>
    </div>

    {/* Middle Section: Revenue/Metrics Distribution & Donut Chart */}
    <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '20px' }}>{tenantInfo?.name || 'Workspace'} Revenue & Metrics Distribution</h4>
          <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Real-time module-wise activity filtered by actual creation dates.</p>
        </div>

        <select 
          value={typeof selectedMonth !== 'undefined' ? selectedMonth : '2026-08'}
          onChange={(e) => { if(typeof setSelectedMonth === 'function') setSelectedMonth(e.target.value); }}
          style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '13.5px', fontWeight: '600', color: '#1e293b', outline: 'none', cursor: 'pointer' }}
        >
          <option value="2026-08">Current Month (August 2026)</option>
          <option value="2026-07">July 2026</option>
          <option value="2026-06">June 2026</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1.2fr 2fr', gap: '25px', alignItems: 'center' }}>
        
        {/* Donut Chart View */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px', position: 'relative' }}>
          {(() => {
            const isOldMonth = selectedMonth === '2026-06' || selectedMonth === '2026-07';
            const chartSeats = isOldMonth ? 0 : (totalSeats || 0);
            const chartAttendees = isOldMonth ? 0 : (activeAttendeesCount || 0);

            const customDonutData = {
              labels: ['Allocated Seats', 'Active Attendees'],
              datasets: [{
                data: [chartSeats, chartAttendees],
                backgroundColor: ['#2563eb', '#10b981'],
                borderWidth: 3,
                borderColor: '#ffffff'
              }]
            };

            return (
              <Doughnut 
                key={typeof animationKey !== 'undefined' ? animationKey : 1}
                data={customDonutData} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                  cutout: '68%' 
                }} 
              />
            );
          })()}
        </div>

        {/* Metric Summary Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)', gap: '15px' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', borderLeft: '4px solid #2563eb' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>ALLOCATED SEATS</span>
            <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '4px 0 0 0', fontSize: '22px' }}>
              {selectedMonth === '2026-06' || selectedMonth === '2026-07' ? 0 : (totalSeats || 0)}
            </h3>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>ACTIVE ATTENDEES</span>
            <h3 style={{ fontWeight: '800', color: '#10b981', margin: '4px 0 0 0', fontSize: '22px' }}>
              {selectedMonth === '2026-06' || selectedMonth === '2026-07' ? 0 : (activeAttendeesCount || 0)}
            </h3>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>WORKSPACE</span>
            <h3 style={{ fontWeight: '800', color: '#f59e0b', margin: '4px 0 0 0', fontSize: '18px' }}>{tenantInfo?.workspace || 'N/A'}</h3>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', borderLeft: '4px solid #9333ea' }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>PORTAL STATUS</span>
            <h3 style={{ fontWeight: '800', color: '#9333ea', margin: '4px 0 0 0', fontSize: '16px' }}>Active & Secure</h3>
          </div>
        </div>

      </div>
    </div>

  </div>
)}

        

        {/* 2. Attendees Tab */}
        {activeTab === 'employees' && (
          <div style={{ fontFamily: 'Calibri, sans-serif', padding: '10px 0' }}>
            
            {/* Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: window.innerWidth < 768 ? '20px' : '24px', letterSpacing: '-0.5px' }}>Attendees</h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '3px 0 0 0' }}>Manage and view all workspace attendees</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                <div style={{ position: 'relative', width: window.innerWidth < 768 ? '100%' : '240px' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8', fontSize: '13px' }}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search attendees..." 
                    value={searchTerm || ''} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13.5px', backgroundColor: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <button 
                  onClick={handleOpenAddAtt} 
                  style={{ width: window.innerWidth < 768 ? '100%' : 'auto', padding: '9px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
                >
                  <span>+</span> Add Attendee
                </button>
              </div>
            </div>

            {attendeesView === 'list' ? (
              <div>
                {/* Split View Layout (Stacked on Mobile) */}
                <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '24px', alignItems: 'start' }}>
                  
                  {/* Left Side: Attendees List Card */}
                  <div style={{ width: window.innerWidth < 768 ? '100%' : '380px', flexShrink: 0, backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    
                    <div>
                      {/* Filter Tabs & Universal Database Logic */}
                      {(() => {
                        const todayStr = new Date().toLocaleDateString('en-CA');

                        const baseSearchList = attendees.filter(item => 
                          item.name.toLowerCase().includes((searchTerm || '').toLowerCase()) || 
                          item.role.toLowerCase().includes((searchTerm || '').toLowerCase())
                        );

                        const activeList = baseSearchList.filter(item => {
                          return (!item.end_date || item.end_date === '' || item.end_date === 'Active' || item.end_date > todayStr);
                        });

                        const inactiveList = baseSearchList.filter(item => {
                          return (item.end_date && item.end_date !== '' && item.end_date !== 'Active' && item.end_date <= todayStr);
                        });

                        let currentTabList = activeList;
                        if (activeTabFilter === 'All') currentTabList = baseSearchList;
                        if (activeTabFilter === 'Active') currentTabList = activeList;
                        if (activeTabFilter === 'Inactive') currentTabList = inactiveList;

                        return (
                          <div>
                            {/* Tab Navigation */}
                            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: '700' }}>
                              <span 
                                onClick={() => { setActiveTabFilter('All'); setAttendeesPage(1); }} 
                                style={{ color: activeTabFilter === 'All' ? '#2563eb' : '#64748b', cursor: 'pointer', borderBottom: activeTabFilter === 'All' ? '2px solid #2563eb' : 'none', paddingBottom: '10px', marginBottom: '-11px' }}
                              >
                                All ({baseSearchList.length})
                              </span>
                              <span 
                                onClick={() => { setActiveTabFilter('Active'); setAttendeesPage(1); }} 
                                style={{ color: activeTabFilter === 'Active' ? '#2563eb' : '#64748b', cursor: 'pointer', borderBottom: activeTabFilter === 'Active' ? '2px solid #2563eb' : 'none', paddingBottom: '10px', marginBottom: '-11px' }}
                              >
                                Active ({activeList.length})
                              </span>
                              <span 
                                onClick={() => { setActiveTabFilter('Inactive'); setAttendeesPage(1); }} 
                                style={{ color: activeTabFilter === 'Inactive' ? '#2563eb' : '#64748b', cursor: 'pointer', borderBottom: activeTabFilter === 'Inactive' ? '2px solid #2563eb' : 'none', paddingBottom: '10px', marginBottom: '-11px' }}
                              >
                                Inactive ({inactiveList.length})
                              </span>
                            </div>

                            {/* Scrollable List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
                              {currentTabList.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                                  <p style={{ fontSize: '13.5px', fontWeight: '600', margin: 0 }}>No attendees found.</p>
                                </div>
                              ) : (
                                currentTabList
                                  .slice((attendeesPage - 1) * perPage, attendeesPage * perPage)
                                  .map((item) => {
                                    const isSelected = selectedAttendee && selectedAttendee.id === item.id;
                                    const initials = item.name ? item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AT';
                                    const isActive = !item.end_date || item.end_date === '' || item.end_date === 'Active' || item.end_date > todayStr;

                                    return (
                                      <div 
                                        key={item.id} 
                                        onClick={() => setSelectedAttendee(item)}
                                        style={{ 
                                          padding: '12px 14px', 
                                          backgroundColor: isSelected ? '#f5f3ff' : '#ffffff', 
                                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0', 
                                          borderRadius: '12px', 
                                          cursor: 'pointer',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          boxSizing: 'border-box',
                                          transition: 'all 0.2s ease'
                                        }}
                                      >
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                          <div style={{ 
                                            width: '36px', height: '36px', backgroundColor: isSelected ? '#2563eb' : '#e0e7ff', 
                                            color: isSelected ? '#fff' : '#2563eb', borderRadius: '50%', display: 'flex', 
                                            alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0
                                          }}>
                                            {initials}
                                          </div>
                                          <div>
                                            <h5 style={{ margin: 0, fontSize: '13.5px', fontWeight: '800', color: '#1e293b' }}>{item.name}</h5>
                                            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{item.role}</p>
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <span style={{ 
                                            fontSize: '10.5px', padding: '2px 8px', borderRadius: '20px', 
                                            backgroundColor: isActive ? '#dcfce7' : '#f1f5f9', 
                                            color: isActive ? '#166534' : '#64748b', fontWeight: '700' 
                                          }}>
                                            {isActive ? 'Active' : 'Inactive'}
                                          </span>
                                          <span style={{ color: '#cbd5e1', fontSize: '13px' }}>›</span>
                                        </div>
                                      </div>
                                    );
                                  })
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Pagination Controls */}
                    {(() => {
                      const todayStr = new Date().toLocaleDateString('en-CA');
                      const baseSearchList = attendees.filter(item => item.name.toLowerCase().includes((searchTerm || '').toLowerCase()) || item.role.toLowerCase().includes((searchTerm || '').toLowerCase()));
                      let currentTabList = baseSearchList.filter(item => !item.end_date || item.end_date === '' || item.end_date === 'Active' || item.end_date > todayStr);
                      
                      if (activeTabFilter === 'Active') currentTabList = baseSearchList.filter(item => !item.end_date || item.end_date === '' || item.end_date === 'Active' || item.end_date > todayStr);
                      if (activeTabFilter === 'Inactive') currentTabList = baseSearchList.filter(item => item.end_date && item.end_date !== '' && item.end_date !== 'Active' && item.end_date <= todayStr);

                      const totalPages = Math.ceil(currentTabList.length / perPage) || 1;

                      return (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Page {attendeesPage} of {totalPages}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button 
                              disabled={attendeesPage === 1} 
                              onClick={() => setAttendeesPage(attendeesPage - 1)} 
                              style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: attendeesPage === 1 ? '#f8fafc' : '#fff', color: attendeesPage === 1 ? '#cbd5e1' : '#334155', cursor: attendeesPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                            >
                              ‹
                            </button>
                            <button 
                              disabled={attendeesPage >= totalPages} 
                              onClick={() => setAttendeesPage(attendeesPage + 1)} 
                              style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: attendeesPage >= totalPages ? '#f8fafc' : '#fff', color: attendeesPage >= totalPages ? '#cbd5e1' : '#334155', cursor: attendeesPage >= totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                            >
                              ›
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* Right Side: Selected Attendee Profile & Overview Details */}
                  <div style={{ width: '100%', flex: '1', backgroundColor: '#ffffff', padding: window.innerWidth < 768 ? '20px' : '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                    {selectedAttendee ? (
                      <div>
                        {/* Profile Top Banner */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', position: 'relative', flexWrap: 'wrap', gap: '15px' }}>
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                            <div style={{ width: '56px', height: '56px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', flexShrink: 0 }}>
                              {selectedAttendee?.name ? selectedAttendee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AT'}
                            </div>
                            <div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px', flexWrap: 'wrap' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{selectedAttendee?.name}</h3>
                                {(() => {
                                  const todayStr = new Date().toLocaleDateString('en-CA');
                                  const isSelActive = !selectedAttendee.end_date || selectedAttendee.end_date === '' || selectedAttendee.end_date === 'Active' || selectedAttendee.end_date > todayStr;
                                  return (
                                    <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '20px', backgroundColor: isSelActive ? '#dcfce7' : '#f1f5f9', color: isSelActive ? '#166534' : '#64748b', fontWeight: '700' }}>
                                      {isSelActive ? 'Active' : 'Inactive'}
                                    </span>
                                  );
                                })()}
                              </div>
                              <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{selectedAttendee?.role} &nbsp;•&nbsp; ID: <strong style={{ color: '#0f172a' }}>{selectedAttendee?.att_id}</strong></p>
                              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                  {selectedAttendee?.phone}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Three-Dots Menu */}
                          <div style={{ position: 'relative' }}>
                            <button 
                              onClick={() => setAttendeeMenuOpen(!attendeeMenuOpen)}
                              style={{ 
                                width: '34px', height: '34px', backgroundColor: '#f8fafc', border: '1.5px solid #cbd5e1', 
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                cursor: 'pointer', fontSize: '16px', color: '#475569', fontWeight: 'bold' 
                              }}
                              title="Options"
                            >
                              ⋮
                            </button>

                            {attendeeMenuOpen && (
                              <div style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '120px',
                                backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                border: '1px solid #e2e8f0', zIndex: 100, padding: '5px', display: 'flex', flexDirection: 'column', gap: '3px'
                              }}>
                                <button 
                                  onClick={() => { setAttendeeMenuOpen(false); handleOpenEditAtt(selectedAttendee); }}
                                  style={{ padding: '7px 10px', background: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  Edit
                                </button>
                                <button 
                                  onClick={() => { setAttendeeMenuOpen(false); handleDeleteAtt(selectedAttendee.id); }}
                                  style={{ padding: '7px 10px', background: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Navigation Tab Header */}
                        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #f1f5f9', marginBottom: '20px', fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>
                          <span style={{ paddingBottom: '8px', borderBottom: '2.5px solid #2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            Overview
                          </span>
                        </div>

                        {/* Personal Information Box */}
                        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ margin: '0 0 14px 0', fontSize: '14.5px', fontWeight: '800', color: '#0f172a' }}>Personal Information</h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '14px', fontSize: '13.5px' }}>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Full Name</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.name}</p>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Employee ID</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.att_id}</p>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Phone Number</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.phone}</p>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Role / Designation</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.role}</p>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Workspace</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.workspace}</p>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Join Date</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.join_date}</p>
                            </div>
                            <div>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>End Date</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.end_date || 'Active'}</p>
                            </div>
                            <div style={{ gridColumn: window.innerWidth < 768 ? 'span 1' : 'span 2' }}>
                              <p style={{ color: '#64748b', margin: '0 0 2px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Address</p>
                              <p style={{ fontWeight: '700', color: '#0f172a', margin: 0, fontSize: '14px' }}>{selectedAttendee?.address}</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
                        <p style={{ fontSize: '15px', fontWeight: '800', color: '#334155', margin: '0 0 6px 0' }}>Select an attendee from the list</p>
                        <p style={{ fontSize: '12.5px', margin: 0, color: '#64748b' }}>Click on any attendee card to view their complete information.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ) : (
              // Add / Edit Form View
              <div style={{ backgroundColor: '#ffffff', padding: window.innerWidth < 768 ? '20px' : '36px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', maxWidth: '900px', margin: '0 auto', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                  <h3 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: '18px' }}>{isAttEditing ? 'Edit Attendee Profile' : 'Register New Attendee'}</h3>
                  <button onClick={() => setAttendeesView('list')} style={{ padding: '7px 14px', backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>← Back</button>
                </div>
                <form onSubmit={handleSaveOrUpdateAtt}>
                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Attendee ID</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none' }} placeholder="e.g. ATT-001" value={attId} onChange={(e) => setAttId(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Full Name</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none' }} placeholder="e.g. Raj Kumar" value={attName} onChange={(e) => setAttName(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Tenant Name</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', boxSizing: 'border-box', fontSize: '13.5px' }} value={attTenantName} disabled />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Workspace</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', boxSizing: 'border-box', fontSize: '13.5px' }} value={attWorkspace} disabled />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Phone Number</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none' }} placeholder="e.g. +91 9876543210" value={attPhone} onChange={(e) => setAttPhone(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Role / Designation</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none' }} placeholder="e.g. Software Developer" value={attRole} onChange={(e) => setAttRole(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Join Date</label>
                      <input type="date" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none' }} value={attJoinDate} onChange={(e) => setAttJoinDate(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>End Date</label>
                      <input type="date" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none', backgroundColor: '#fff' }} value={attEndDate === 'Active' ? '' : attEndDate} onChange={(e) => setAttEndDate(e.target.value)} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase' }}>Address</label>
                    <textarea style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', height: '80px', boxSizing: 'border-box', fontSize: '13.5px', outline: 'none', resize: 'vertical' }} placeholder="Enter address..." value={attAddress} onChange={(e) => setAttAddress(e.target.value)} required></textarea>
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '14.5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>{isAttEditing ? 'Update Attendee Profile' : 'Save New Attendee'}</button>
                </form>
              </div>
            )}
          </div>
        )}
        {/* 📦 Food Order / Order Management Tab */}
        {activeTab === 'orders' && (
          <div style={{ fontFamily: 'Calibri, sans-serif' }}>

            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '24px', alignItems: 'start' }}>
              
              {/* Left Side: Food Menu Cards Grid */}
              <div style={{ width: '100%', flex: 1, boxSizing: 'border-box' }}>
                {tenantFoods.length === 0 ? (
                  <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '16px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>No food items available from your workspace administrator right now.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fill, minmax(210px, 1fr))', gap: '20px' }}>
                    {tenantFoods.map((food) => (
                      <div 
                        key={food.id} 
                        style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}
                      >
                        <div>
                          <div style={{ position: 'relative' }}>
                            <img src={food.img_url} alt={food.food_name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }} />
                          </div>
                          <div style={{ padding: '16px' }}>
                            <h5 style={{ fontWeight: '800', margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>{food.food_name}</h5>
                            <p style={{ color: '#64748b', fontSize: '12.5px', margin: '0 0 12px 0', lineHeight: '1.4' }}>Freshly prepared in-house meal.</p>
                            <p style={{ color: '#046c4e', fontWeight: '800', margin: 0, fontSize: '17px' }}>₹{food.price}</p>
                          </div>
                        </div>
                        
                        <div style={{ padding: '0 16px 16px 16px' }}>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(food);
                            }}
                            style={{ width: '100%', padding: '10px', backgroundColor: '#f0fdf4', color: '#046c4e', border: '1.5px solid #bbf7d0', borderRadius: '10px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Your Order / Receipt Card (Sticky) */}
              <div style={{ width: window.innerWidth < 768 ? '100%' : '380px', flexShrink: 0, backgroundColor: '#fff', padding: '24px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', position: window.innerWidth < 768 ? 'static' : 'sticky', top: '20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h5 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: '17px' }}>Your Order</h5>
                    <span style={{ backgroundColor: '#046c4e', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cart.reduce((acc, item) => acc + item.qty, 0)}
                    </span>
                  </div>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Clear Cart">🗑️</button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0', fontSize: '14px', fontWeight: '600' }}>Your order is empty.<br/>Select items from the menu.</p>
                ) : (
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                      {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #f1f5f9', paddingBottom: '12px', gap: '10px' }}>
                          <img src={item.img_url} alt={item.food_name} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', flexShrink: '0' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }} />
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <p style={{ margin: '0 0 2px 0', fontWeight: '700', fontSize: '13.5px', color: '#0f172a' }}>{item.food_name}</p>
                            <span style={{ color: '#046c4e', fontWeight: '800', fontSize: '13px' }}>₹{item.price * item.qty}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                            <button onClick={() => handleUpdateQty(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#64748b' }}>-</button>
                            <span style={{ fontSize: '13px', fontWeight: '800', minWidth: '14px', textAlign: 'center', color: '#0f172a' }}>{item.qty}</span>
                            <button onClick={() => handleUpdateQty(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: '#64748b' }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bill Total Only */}
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '16px' }}>Total</span>
                      <span style={{ fontWeight: '800', color: '#046c4e', fontSize: '20px' }}>₹{cart.reduce((total, item) => total + (parseFloat(item.price) * item.qty), 0).toFixed(2)}</span>
                    </div>

                    <button 
                      onClick={handleCheckout} 
                      style={{ width: '100%', padding: '14px', backgroundColor: '#046c4e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '15.5px', boxShadow: '0 6px 16px rgba(4,108,78,0.3)', transition: 'background 0.2s' }}
                    >
                      Place Order
                    </button>
                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '10px', fontWeight: '600' }}>Order will be delivered in 30-40 mins</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 📄 Tenant Invoice Tab */}
        {activeTab === 'invoice' && (
          <div style={{ fontFamily: 'Calibri, sans-serif' }}>
            
            {/* Top Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: window.innerWidth < 768 ? '12px' : '20px', marginBottom: '25px' }}>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', boxSizing: 'border-box' }}>
                <span style={{ fontSize: window.innerWidth < 768 ? '11px' : '12.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Paid</span>
                <h3 style={{ fontWeight: '800', color: '#046c4e', margin: '6px 0 0 0', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}>
                  ₹{invoicesList.reduce((acc, inv) => acc + (inv.status === 'Paid' ? parseFloat(inv.total_amount || 0) : 0), 0).toLocaleString()}
                </h3>
              </div>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', boxSizing: 'border-box' }}>
                <span style={{ fontSize: window.innerWidth < 768 ? '11px' : '12.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Invoices</span>
                <h3 style={{ fontWeight: '800', color: '#0f172a', margin: '6px 0 0 0', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}>{invoicesList.length}</h3>
              </div>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', boxSizing: 'border-box' }}>
                <span style={{ fontSize: window.innerWidth < 768 ? '11px' : '12.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Average / Month</span>
                <h3 style={{ fontWeight: '800', color: '#0f172a', margin: '6px 0 0 0', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}>
                  ₹{invoicesList.length > 0 ? (invoicesList.reduce((acc, inv) => acc + parseFloat(inv.total_amount || 0), 0) / invoicesList.length).toFixed(0) : 0}
                </h3>
              </div>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gridColumn: window.innerWidth < 768 ? 'span 2' : 'auto', boxSizing: 'border-box' }}>
                <div>
                  <span style={{ fontSize: window.innerWidth < 768 ? '11px' : '12.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Outstanding</span>
                  <h3 style={{ fontWeight: '800', color: '#0f172a', margin: '6px 0 0 0', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}>
                    ₹{invoicesList.reduce((acc, inv) => acc + (inv.status !== 'Paid' ? parseFloat(inv.total_amount || 0) : 0), 0).toLocaleString()}
                  </h3>
                  <small style={{ color: '#64748b', fontSize: '11px' }}>Pending amounts</small>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>✓</div>
              </div>
            </div>

            {invoicesList.length === 0 ? (
              <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '16px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>No invoices have been dispatched by the admin yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '24px', alignItems: 'start' }}>
                
                {/* Left Side: Invoice History List */}
                <div style={{ width: window.innerWidth < 768 ? '100%' : '380px', flexShrink: 0, backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', boxSizing: 'border-box' }}>
                  <h4 style={{ fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0', fontSize: '17px' }}>Invoice History</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {invoicesList.map((inv) => {
                      let monthFormatted = inv.billing_month;
                      try {
                        const [y, m] = inv.billing_month.split('-');
                        const dateObj = new Date(parseInt(y), parseInt(m) - 1, 1);
                        monthFormatted = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
                      } catch (err) {
                        monthFormatted = inv.billing_month;
                      }

                      const isSelected = selectedInvoice && selectedInvoice.id === inv.id;
                      const isPaid = inv.status === 'Paid';

                      return (
                        <div 
                          key={inv.id} 
                          onClick={() => setSelectedInvoice(inv)}
                          style={{ 
                            padding: '14px 16px', 
                            backgroundColor: isSelected ? '#f5f3ff' : '#f8fafc', 
                            border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0', 
                            borderRadius: '14px', 
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxSizing: 'border-box',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div>
                            <h5 style={{ margin: '0 0 3px 0', fontSize: '14.5px', fontWeight: '800', color: '#0f172a' }}>{monthFormatted}</h5>
                            <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b', fontWeight: '600' }}>01 {monthFormatted.split(' ')[0]} - 31 {monthFormatted.split(' ')[0]}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: '0 0 3px 0', fontSize: '14.5px', fontWeight: '800', color: '#0f172a' }}>₹{parseFloat(inv.total_amount || 0).toLocaleString()}</p>
                            <span style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '12px', backgroundColor: isPaid ? '#dcfce7' : '#fef3c7', color: isPaid ? '#166534' : '#92400e', fontWeight: '700' }}>
                              {isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Detailed Selected Invoice View */}
                {selectedInvoice && (
                  <div style={{ width: '100%', flex: 1, backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '32px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', boxSizing: 'border-box' }}>
                    {(() => {
                      let monthFormatted = selectedInvoice.billing_month;
                      try {
                        const [y, m] = selectedInvoice.billing_month.split('-');
                        const dateObj = new Date(parseInt(y), parseInt(m) - 1, 1);
                        monthFormatted = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
                      } catch (err) {
                        monthFormatted = selectedInvoice.billing_month;
                      }

                      const isPaid = selectedInvoice.status === 'Paid';
                      const paymentDateFormatted = isPaid ? (selectedInvoice.due_date ? selectedInvoice.due_date.split('T')[0].split(' ')[0] : 'N/A') : 'Not Paid Yet';

                      return (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <div style={{ width: '42px', height: '42px', backgroundColor: '#e0e7ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📄</div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Invoice</h4>
                                <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#2563eb' }}>{monthFormatted}</h3>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '700', backgroundColor: isPaid ? '#dcfce7' : '#fef3c7', color: isPaid ? '#166534' : '#92400e' }}>
                                {isPaid ? 'Paid ✓' : 'Pending ⏳'}
                              </span>
                              <button onClick={() => window.print()} style={{ padding: '6px 14px', backgroundColor: '#046c4e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Print</button>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '13.5px' }}>
                            <div>
                              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Billed To</p>
                              <h5 style={{ fontWeight: '800', color: '#0f172a', margin: '0 0 3px 0', fontSize: '15px' }}>{companyName || tenantInfo?.name || 'Innovate Hub'}</h5>
                              <p style={{ color: '#64748b', fontSize: '12.5px', margin: 0, lineHeight: '1.4' }}>{tenantInfo?.address || 'Workspace Address Not Provided'}</p>
                            </div>
                            <div style={{ textAlign: window.innerWidth < 768 ? 'left' : 'right', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '13px' }}>
                              <p style={{ margin: 0, color: '#64748b' }}>Invoice No.: <strong style={{ color: '#0f172a' }}>INV/FOD/{selectedInvoice.billing_month.replace('-', '/')}</strong></p>
                              <p style={{ margin: 0, color: '#64748b' }}>Invoice Date: <strong style={{ color: '#0f172a' }}>{selectedInvoice.billing_month}-01</strong></p>
                              <p style={{ margin: 0, color: '#64748b' }}>Payment Date: <strong style={{ color: isPaid ? '#046c4e' : '#92400e' }}>{paymentDateFormatted}</strong></p>
                            </div>
                          </div>

                          {/* Invoice Items Table */}
                          <div style={{ overflowX: 'auto', width: '100%' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13.5px', minWidth: '450px' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                                  <th style={{ padding: '10px 12px', fontWeight: '700' }}>#</th>
                                  <th style={{ padding: '10px 12px', fontWeight: '700' }}>Description</th>
                                  <th style={{ padding: '10px 12px', fontWeight: '700', textAlign: 'center' }}>Quantity</th>
                                  <th style={{ padding: '10px 12px', fontWeight: '700', textAlign: 'right' }}>Amount (₹)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '10px 12px', color: '#64748b' }}>1</td>
                                  <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a' }}>Workspace & Food Services</td>
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>1</td>
                                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700' }}>{parseFloat(selectedInvoice.total_amount || 0).toLocaleString()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Total Amount */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginBottom: '20px', fontSize: '13.5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: window.innerWidth < 768 ? '100%' : '240px', borderTop: '2px solid #0f172a', paddingTop: '8px', marginTop: '4px' }}>
                              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>Total Amount</span>
                              <span style={{ fontWeight: '800', color: '#046c4e', fontSize: '18px' }}>₹{parseFloat(selectedInvoice.total_amount || 0).toLocaleString()}</span>
                            </div>
                          </div>

                          {isPaid && (
                            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700', fontSize: '13.5px', boxSizing: 'border-box' }}>
                              <span>✓</span>
                              <span>Thank you! Your payment has been received on {paymentDateFormatted}.</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

       {/* 📢 Notice Tab (Separated Clean Cards for Categories & Month Filter + Accurate Real-World Month Filtering) */}
        {activeTab === 'notice' && (
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '24px', fontFamily: 'Calibri, sans-serif', width: '100%', boxSizing: 'border-box' }}>
            
            {/* Left Side: Two Separate Cards (Stacked on Mobile) */}
            <div style={{ width: window.innerWidth < 768 ? '100%' : '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
              
              {/* Card 1: Notice Categories */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <h4 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: '15px' }}>Notice Categories</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => setNoticeTypeFilter('all')}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none',
                      backgroundColor: noticeTypeFilter === 'all' ? '#0f172a' : '#f8fafc',
                      color: noticeTypeFilter === 'all' ? '#fff' : '#334155',
                      fontWeight: '700', fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', boxSizing: 'border-box'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    All Notices ({dbNotices.length})
                  </button>

                  <button
                    onClick={() => setNoticeTypeFilter('broadcast')}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none',
                      backgroundColor: noticeTypeFilter === 'broadcast' ? '#16a34a' : '#f8fafc',
                      color: noticeTypeFilter === 'broadcast' ? '#fff' : '#334155',
                      fontWeight: '700', fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', boxSizing: 'border-box'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    Broadcast ({dbNotices.filter(n => n.notice_type !== 'private').length})
                  </button>

                  <button
                    onClick={() => setNoticeTypeFilter('private')}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none',
                      backgroundColor: noticeTypeFilter === 'private' ? '#2563eb' : '#f8fafc',
                      color: noticeTypeFilter === 'private' ? '#fff' : '#334155',
                      fontWeight: '700', fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', boxSizing: 'border-box'
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Direct Private ({dbNotices.filter(n => n.notice_type === 'private').length})
                  </button>
                </div>
              </div>

              {/* Card 2: Filter by Month */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <h4 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: '15px' }}>Filter by Month</h4>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(() => {
                    const monthsSet = new Set();
                    dbNotices.forEach(n => {
                      if (n.date) {
                        const d = new Date(n.date);
                        if (!isNaN(d.getTime())) {
                          const y = d.getFullYear();
                          const m = String(d.getMonth() + 1).padStart(2, '0');
                          monthsSet.add(`${y}-${m}`);
                        }
                      }
                    });
                    const sortedMonths = Array.from(monthsSet).sort().reverse();

                    return (
                      <>
                        <button
                          onClick={() => setNoticeMonthFilter('all')}
                          style={{
                            width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none',
                            backgroundColor: noticeMonthFilter === 'all' ? '#2563eb' : '#f8fafc',
                            color: noticeMonthFilter === 'all' ? '#fff' : '#334155',
                            fontWeight: '700', fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          <span>All Months</span>
                        </button>

                        {sortedMonths.map(mStr => {
                          const [yr, mn] = mStr.split('-');
                          const dateObj = new Date(yr, parseInt(mn) - 1, 1);
                          const label = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
                          const isSelected = noticeMonthFilter === mStr;

                          return (
                            <button
                              key={mStr}
                              onClick={() => setNoticeMonthFilter(mStr)}
                              style={{
                                width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none',
                                backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                                color: isSelected ? '#fff' : '#334155',
                                fontWeight: '700', fontSize: '13px', textAlign: 'left', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box'
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              </div>

            </div>

            {/* Right Side: Notices Display Area */}
            <div style={{ width: '100%', flex: 1, backgroundColor: '#ffffff', padding: window.innerWidth < 768 ? '20px' : '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
              
              <div style={{ marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <div>
                  <h3 style={{ fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0', fontSize: window.innerWidth < 768 ? '17px' : '20px' }}>Workspace Notices & Broadcast Updates</h3>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12.5px' }}>Important announcements and direct private notices shared by your workspace administrator.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(() => {
                  const filteredNotices = dbNotices.filter(n => {
                    const isPrivate = n.notice_type === 'private';
                    
                    if (noticeTypeFilter === 'broadcast' && isPrivate) return false;
                    if (noticeTypeFilter === 'private' && !isPrivate) return false;

                    if (noticeMonthFilter !== 'all') {
                      if (!n.date) return false;
                      const d = new Date(n.date);
                      if (isNaN(d.getTime())) return false;
                      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                      if (mStr !== noticeMonthFilter) return false;
                    }

                    return true;
                  });

                  if (filteredNotices.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1.5px dashed #cbd5e1', color: '#94a3b8', fontSize: '14px', fontWeight: '600' }}>
                        No notices available matching your filter.
                      </div>
                    );
                  }

                  return filteredNotices.map((n) => {
                    const isPrivate = n.notice_type === 'private';
                    return (
                      <div 
                        key={n.id} 
                        style={{ 
                          padding: '18px 20px', 
                          backgroundColor: isPrivate ? '#f0f7ff' : '#f0fdf4', 
                          borderRadius: '14px', 
                          borderLeft: `5px solid ${isPrivate ? '#2563eb' : '#16a34a'}`, 
                          border: `1px solid ${isPrivate ? '#bfdbfe' : '#bbf7d0'}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          color: '#1e293b',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: isPrivate ? '#2563eb' : '#16a34a', letterSpacing: '0.5px', backgroundColor: isPrivate ? '#dbeafe' : '#dcfce7', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isPrivate ? (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                Direct Private Notice
                              </>
                            ) : (
                              <>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                Broadcast Notice
                              </>
                            )}
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            {n.date}
                          </span>
                        </div>
                        <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{n.message}</p>
                      </div>
                    );
                  });
                })()}
              </div>

            </div>

          </div>
        )}

       {/* ⚠️ Complaints & Support Tab */}
{activeTab === 'complaints' && (
  <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', width: '100%', boxSizing: 'border-box' }}>
    
    {/* <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: window.innerWidth < 768 ? '22px' : '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Complaints & Support</h2>
      <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Submit your workspace issues for immediate assistance.</p>
    </div> */}

    {/* Form Card */}
    <div style={{ backgroundColor: '#ffffff', padding: window.innerWidth < 768 ? '20px' : '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '24px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '36px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <h3 style={{ fontSize: window.innerWidth < 768 ? '17px' : '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Raise a Support Ticket</h3>
      </div>

      <form onSubmit={handleRaiseComplaint}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Select Issue Category *</label>
          <select 
            style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
            value={complaintSubject}
            onChange={(e) => setComplaintSubject(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="Internet Connectivity Issue">Internet Connectivity Issue</option>
            <option value="Power Outage / Electrical issue">Power Outage / Electrical issue</option>
            <option value="AC / Cooling Issue">AC / Cooling Issue</option>
            <option value="Housekeeping / Cleanliness">Housekeeping / Cleanliness</option>
            <option value="Water Supply Issue">Water Supply Issue</option>
            <option value="Meeting Room / Equipment Issue">Meeting Room / Equipment Issue</option>
            <option value="Food / Pantry Issue">Food / Pantry Issue</option>
            <option value="Others">Others / General Support</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Detailed Description *</label>
          <textarea 
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', height: '110px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8fafc' }}
            placeholder="Tell us more about the issue..."
            value={complaintMessage}
            onChange={(e) => setComplaintMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" style={{ width: window.innerWidth < 768 ? '100%' : 'auto', padding: '12px 28px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
          Submit Ticket
        </button>
      </form>
    </div>

    {/* History Logs */}
    <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
      <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px', fontSize: window.innerWidth < 768 ? '17px' : '18px' }}>History Logs</h3>
      
      {(!complaintsList || complaintsList.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13.5px' }}>No records found.</div>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '450px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px' }}>S.No</th>
                <th style={{ padding: '14px' }}>Issue</th>
                <th style={{ padding: '14px' }}>Raised Date</th>
                <th style={{ padding: '14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaintsList.map((c, index) => (
                <tr key={c.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', color: '#64748b' }}>{index + 1}</td>
                  <td style={{ padding: '14px', fontWeight: '700', color: '#1e293b' }}>{c.subject}</td>
                  <td style={{ padding: '14px', color: '#64748b' }}>{c.date_raised || c.date || '19 Aug 2026'}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ 
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700',
                      backgroundColor: c.status === 'Solved' ? '#dcfce7' : '#fef3c7',
                      color: c.status === 'Solved' ? '#166534' : '#92400e'
                    }}>
                      {c.status || 'Open / Pending'}
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


        {/* 📅 Meeting Room Booking Tab */}
        {activeTab === 'meeting' && (
          <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', width: '100%', boxSizing: 'border-box' }}>
            
            {/* Page Header
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: window.innerWidth < 768 ? '22px' : '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Meeting Room Booking</h2>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Select an available meeting room from your workspace (<strong style={{ color: '#0f172a' }}>{tenantInfo?.workspace || 'Assigned Workspace'}</strong>) and book your slot.</p>
            </div> */}

            {/* Booking Form Card */}
            <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '40px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '24px', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: window.innerWidth < 768 ? '17px' : '20px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Book a Meeting Room
              </h3>

              <form onSubmit={handleBookMeetingRoom}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Select Meeting Room *</label>
                  <select 
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                    value={selectedMeetingRoom}
                    onChange={(e) => setSelectedMeetingRoom(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Meeting Room --</option>
                    {workspaceMeetingRooms.length === 0 ? (
                      <option disabled value="">No meeting rooms configured for this workspace</option>
                    ) : (
                      workspaceMeetingRooms.map((roomName, idx) => (
                        <option key={idx} value={roomName}>{roomName}</option>
                      ))
                    )}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Booking Date *</label>
                    <input 
                      type="date" 
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8fafc' }}
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Time Slot *</label>
                    <select 
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', backgroundColor: '#f8fafc', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      required
                    >
                      <option value="">-- Select Time Slot --</option>
                      <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Purpose / Agenda *</label>
                  <textarea 
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', height: '110px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical', backgroundColor: '#f8fafc' }}
                    placeholder="Enter purpose of meeting..."
                    value={meetingPurpose}
                    onChange={(e) => setMeetingPurpose(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" style={{ width: window.innerWidth < 768 ? '100%' : 'auto', padding: '12px 28px', backgroundColor: '#046c4e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(4,108,78,0.2)' }}>
                  Confirm Booking
                </button>
              </form>
            </div>
            {/* History Logs Table Card */}
            <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
              <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px', fontSize: window.innerWidth < 768 ? '17px' : '18px' }}>Booked Meetings History</h3>
              
              {(!bookedMeetingsList || bookedMeetingsList.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '13.5px' }}>No meeting rooms booked yet.</div>
              ) : (() => {
                const rowsPerPage = 5;
                const totalPages = Math.ceil(bookedMeetingsList.length / rowsPerPage) || 1;
                const paginatedMeetings = bookedMeetingsList.slice((meetingPage - 1) * rowsPerPage, meetingPage * rowsPerPage);

                return (
                  <div>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '600px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase' }}>
                            <th style={{ padding: '14px' }}>S.No</th>
                            <th style={{ padding: '14px' }}>Room Name</th>
                            <th style={{ padding: '14px' }}>Date</th>
                            <th style={{ padding: '14px' }}>Time Slot</th>
                            <th style={{ padding: '14px' }}>Purpose</th>
                            <th style={{ padding: '14px' }}>Status</th>
                            <th style={{ padding: '14px', textAlign: 'center' }}>Action</th> {/* 🌟 புதிய Action Column */}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedMeetings.map((m, index) => (
                            <tr key={m.id || index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '14px', color: '#64748b' }}>{(meetingPage - 1) * rowsPerPage + index + 1}</td>
                              <td style={{ padding: '14px', fontWeight: '700', color: '#1e293b' }}>{m.room_name || m.room}</td>
                              <td style={{ padding: '14px', color: '#64748b' }}>
                                {new Date(m.booking_date || m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td style={{ padding: '14px', color: '#64748b' }}>{m.time_slot || m.time}</td>
                              <td style={{ padding: '14px', color: '#334155', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.purpose}</td>
                              <td style={{ padding: '14px' }}>
                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700', backgroundColor: m.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: m.status === 'Completed' ? '#166534' : '#d97706' }}>
                                  {m.status || 'Confirmed'}
                                </span>
                              </td>
                              {/* 🌟 இந்த இடத்தில் அந்தப் பட்டன் வைக்கப்பட்டுள்ளது */}
                            <td style={{ padding: '14px', textAlign: 'center' }}>
                              {m.status !== 'Completed' ? (
                                <button 
                                onClick={() => handleMarkTenantMeetingCompleted(m.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                                title="Click when meeting is finished"
                              >
                                 Mark as Completed
                              </button>
                            ) : (
                              <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '11.5px', display: 'inline-block' }}>
                                Solved ✓
                              </span>
                            )}
                            </td>
                          </tr>
                          ))}
                        </tbody>
                    </table>
                  </div>

            

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                        <button 
                          disabled={meetingPage === 1}
                          onClick={() => setMeetingPage(prev => Math.max(prev - 1, 1))}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: meetingPage === 1 ? '#f8fafc' : '#fff', color: meetingPage === 1 ? '#cbd5e1' : '#334155', cursor: meetingPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                          ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            onClick={() => setMeetingPage(num)}
                            style={{
                              padding: '5px 10px', borderRadius: '6px', border: 'none',
                              backgroundColor: meetingPage === num ? '#2563eb' : '#fff',
                              color: meetingPage === num ? '#fff' : '#334155',
                              fontWeight: 'bold', fontSize: '13.5px', cursor: 'pointer'
                            }}
                          >
                            {num}
                          </button>
                        ))}

                        <button 
                          disabled={meetingPage >= totalPages}
                          onClick={() => setMeetingPage(prev => Math.min(prev + 1, totalPages))}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: meetingPage >= totalPages ? '#f8fafc' : '#fff', color: meetingPage >= totalPages ? '#cbd5e1' : '#334155', cursor: meetingPage >= totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

          </div>
        )}
        {/* Profile Tab - Professional Clean Corporate UI with Logo Modal */}
{activeTab === 'profile' && (
  <div style={{ fontFamily: "'Inter', 'Segoe UI', Calibri, sans-serif", color: '#334155', position: 'relative' }}>
    
    {/* Top Header & Logo Edit Modal Trigger Button */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
      <div>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>My Profile</h2>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>Dashboard &gt; My Profile</p>
      </div>
      <button 
        onClick={() => setShowLogoModal(true)}
        style={{ padding: '9px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(37,99,235,0.2)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        Change Logo (URL / Local)
      </button>
    </div>

    {/* Top Banner Card with Avatar */}
    <div style={{ backgroundColor: '#fff', padding: '28px 32px', borderRadius: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} title="Logo">
          <img 
            src={appLogo} 
            alt="Company Logo" 
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', background: '#fff', padding: '3px' }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/70?text=T'; }}
          />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{companyName || tenantInfo?.name || 'N/A'}</h3>
            <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '600' }}>Tenant</span>
            <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '20px', backgroundColor: '#f0fdf4', color: '#166534', fontWeight: '600' }}>Active</span>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', fontWeight: '400' }}>Member of <strong style={{ color: '#334155', fontWeight: '600' }}>{tenantInfo?.workspace || 'N/A'}</strong> workspace</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Member Since</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{tenantInfo?.join_date || '01 Jun 2025'}</span>
          </div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
          <div>
            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Allocated Seats</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{totalSeats} Seats</span>
          </div>
        </div>
      </div>

    </div>

    {/* Personal Information Card with Clean Grid */}
    <div style={{ backgroundColor: '#fff', padding: '28px 32px', borderRadius: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Personal Information
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '13.5px' }}>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Company / Tenant Name</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{companyName || tenantInfo?.name || 'N/A'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Email Address</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{tenantInfo?.email || 'N/A'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Registered Address</span>
            <span style={{ fontWeight: '500', color: '#0f172a', fontSize: '13.5px', lineHeight: '1.4' }}>{tenantInfo?.address || 'N/A'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Phone Number</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{tenantInfo?.phone || 'N/A'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Date of Joining</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>{tenantInfo?.join_date || 'N/A'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <div>
            <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>GST & PAN Details</span>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '13px' }}>GST: {tenantInfo?.gst || 'N/A'} | PAN: {tenantInfo?.pan || 'N/A'}</span>
          </div>
        </div>

      </div>
    </div>

    {/* Bottom Split Grid: Workspace Info & Account / Documents Info */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginBottom: '24px' }}>
      
      {/* Workspace Information */}
      <div style={{ backgroundColor: '#fff', padding: '28px 32px', borderRadius: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Workspace Information
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Workspace Name</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>{tenantInfo?.workspace || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Allocated Seats</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>{totalSeats} Seats</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Username</span>
            <span style={{ fontWeight: '600', color: '#0f172a' }}>@{tenantInfo?.username || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px' }}>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Contract Status</span>
            <span style={{ fontWeight: '600', color: '#166534', backgroundColor: '#f0fdf4', padding: '2px 10px', borderRadius: '12px', fontSize: '12px' }}>{tenantInfo?.end_date || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Account Documents & Files */}
      <div style={{ backgroundColor: '#fff', padding: '28px 32px', borderRadius: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Official Documents & Agreements
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Verification Document</span>
            {tenantInfo?.document ? (
              <a 
                href={`http://localhost:5000/uploads/${tenantInfo.document}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', 
                  backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', 
                  color: '#0f172a', fontSize: '13px', fontWeight: '500', textDecoration: 'none', 
                  width: '100%', boxSizing: 'border-box', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{tenantInfo.document}</span>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>View ↗</span>
              </a>
            ) : (
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>No document uploaded.</p>
            )}
          </div>

          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Workspace Agreement</span>
            {tenantInfo?.agreement ? (
              <a 
                href={`http://localhost:5000/uploads/${tenantInfo.agreement}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', 
                  backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', 
                  color: '#0f172a', fontSize: '13px', fontWeight: '500', textDecoration: 'none', 
                  width: '100%', boxSizing: 'border-box', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{tenantInfo.agreement}</span>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>View ↗</span>
              </a>
            ) : (
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>No agreement uploaded.</p>
            )}
          </div>

          {/* ✨ Additional Documents காட்டுவதற்கான பகுதி (Added cleanly without changing other parts) */}
          {tenantInfo?.extra_documents && (
            <div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Additional Documents</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tenantInfo.extra_documents.split(',').map((docName, idx) => {
                  const trimmedName = docName.trim();
                  if (!trimmedName) return null;
                  return (
                    <a 
                      key={idx}
                      href={`http://localhost:5000/uploads/${trimmedName}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', 
                        backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', 
                        color: '#0f172a', fontSize: '12.5px', fontWeight: '500', textDecoration: 'none', 
                        width: '100%', boxSizing: 'border-box', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{trimmedName}</span>
                      <span style={{ fontSize: '11.5px', color: '#2563eb', fontWeight: '600' }}>View ↗</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>

    {/* Activity Summary Cards Bar */}
    <div style={{ backgroundColor: '#fff', padding: '24px 32px', borderRadius: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 18px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        Activity Summary
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Bookings Made</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{bookedMeetingsList.length}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Food Orders</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{tenantOrders.length}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Complaints Raised</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{complaintsList.length}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', display: 'block' }}>Invoices Paid</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#046c4e' }}>
              ₹{invoicesList.reduce((acc, inv) => acc + (inv.status === 'Paid' ? parseFloat(inv.total_amount || 0) : 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* 🌟 Change Logo Popup Modal Form */}
    {showLogoModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '420px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Update Workspace Logo</h3>
            <button onClick={() => setShowLogoModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Option 1: Upload Local Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  handleTenantLogoUpload(e);
                  setShowLogoModal(false);
                }}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box', backgroundColor: '#f8fafc', cursor: 'pointer' }} 
              />
            </div>

            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#94a3b8', fontSize: '12px' }}>OR</div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Option 2: Enter Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/logo.png" 
                value={logoUrlInput}
                onChange={(e) => setLogoUrlInput(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box', outline: 'none', marginBottom: '12px' }}
              />
              <button 
                onClick={() => {
                  handleTenantUrlLogoSave();
                  setShowLogoModal(false);
                }}
                style={{ width: '100%', padding: '11px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
              >
                Save Logo URL to DB
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

  </div>
)}
      </div>
    </div>
  );
}