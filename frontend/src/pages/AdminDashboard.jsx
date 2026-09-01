import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [selectedOverviewMonth, setSelectedOverviewMonth] = useState('this_month');
  const adminUsername = localStorage.getItem('admin_username');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullAdminProfile, setFullAdminProfile] = useState(null);
  
  
  // 🌟 Sidebar Collapse/Expand State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [bottomDropdownOpen, setBottomDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 🌟 Notifications Dropdown State
  // 🌟 Receipt Modal State for Notification Click
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Workspace Admin');
  const [appLogo, setAppLogo] = useState(() => {
    return localStorage.getItem(`admin_logo_${adminUsername}`) || 'https://via.placeholder.com/40?text=A';
  });
  const [complaintNotifications, setComplaintNotifications] = useState([]);
  const [complaintUnreadCount, setComplaintUnreadCount] = useState(0);
  const [complaintDropdownOpen, setComplaintDropdownOpen] = useState(false);
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);

  // Logo Upload States for Admin
  const [logoInputType, setLogoInputType] = useState('local');
  const [logoUrlInput, setLogoUrlInput] = useState('');

  const [stats, setStats] = useState({ workspaces: 0, employees: 0, tenants: 0, foods: 0 });

  const [workspaceView, setWorkspaceView] = useState('list');
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isWsEditing, setIsWsEditing] = useState(false);
  const [editWorkspaceId, setEditWorkspaceId] = useState(null);

  const [wsName, setWsName] = useState('');
  const [wsLocation, setWsLocation] = useState('');
  const [totalSeatCapacity, setTotalSeatCapacity] = useState('');
  const [seatTypes, setSeatTypes] = useState([{ name: '', capacity: '' }]);
  const [meetingRooms, setMeetingRooms] = useState([{ name: '', capacity: '' }]);
  const [wsPage, setWsPage] = useState(1);
  const wsPerPage = 6;

  const [employeeView, setEmployeeView] = useState('list');
  const [employees, setEmployees] = useState([]);
  const [isEmpEditing, setIsEmpEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empWorkspace, setEmpWorkspace] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empAddress, setEmpAddress] = useState('');
  const [empPage, setEmpPage] = useState(1);
  const empPerPage = 5;
  const [empJoinDate, setEmpJoinDate] = useState('');
  const [empEndDate, setEmpEndDate] = useState('');

  const [tenantView, setTenantView] = useState('list');
  const [tenants, setTenants] = useState([]);
  const [isTenantEditing, setIsTenantEditing] = useState(false);
  const [editTenantId, setEditTenantId] = useState(null);

  const [tName, setTName] = useState('');
  const [tUsername, setTUsername] = useState('');
  const [tPassword, setTPassword] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tAddress, setTAddress] = useState('');
  const [tWorkspace, setTWorkspace] = useState('');
  const [tSeats, setTSeats] = useState('');
  const [tGst, setTGst] = useState('');
  const [tPan, setTPan] = useState('');
  const [tJoinDate, setTJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [tEndDate, setTEndDate] = useState('Active');
  
  // File States for Tenant Form
  const [tDocFile, setTDocFile] = useState(null);
  const [tAgreementFile, setTAgreementFile] = useState(null);
  const [tDocName, setTDocName] = useState('');
  const [tAgreementName, setTAgreementName] = useState('');
  const [extraDocs, setExtraDocs] = useState([]);

  const [tenantPage, setTenantPage] = useState(1);
  const tenantPerPage = 5;

  const [foodView, setFoodView] = useState('list');
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [foodImgUrl, setFoodImgUrl] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [isFoodEditing, setIsFoodEditing] = useState(false);
  const [editFoodId, setEditFoodId] = useState(null);

  const [invoiceView, setInvoiceView] = useState('list');
  const [selectedTenantOrders, setSelectedTenantOrders] = useState([]);
  const [activeTenantName, setActiveTenantName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [invoiceStatuses, setInvoiceStatuses] = useState({});
  const [sentInvoicesList, setSentInvoicesList] = useState([]);

  
  // Invoice Search & Filter & Pagination States (5 per page)
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceTenantFilter, setInvoiceTenantFilter] = useState('All');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');
  const [invoicePage, setInvoicePage] = useState(1);
  const invoicePerPage = 5;
  // 🌟 இதோ இந்த State-ஐ மற்ற useState-களுடன் சேர்க்கவும்
  const [toastMessage, setToastMessage] = useState('');
  const [selectedInvoiceMonth, setSelectedInvoiceMonth] = useState('2026-09');
 

  const [customInvoiceStatuses, setCustomInvoiceStatuses] = useState({});
  const [invoicePaymentDates, setInvoicePaymentDates] = useState({});

  // 🌟 Notice Pagination State
  const [noticePage, setNoticePage] = useState(1);
  const noticePerPage = 5;

  // 🌟 Complaints Search & Pagination State
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintPage, setComplaintPage] = useState(1);
  const complaintPerPage = 5;
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // 🌟 Order Expand Toggle State (For collapsing/expanding individual order items list)
  const [expandedOrdersMap, setExpandedOrdersMap] = useState({});

  // 🌟 Store real tenant orders map to calculate accurate amounts in invoice table
  const [allTenantsOrdersMap, setAllTenantsOrdersMap] = useState({});

  const [noticeText, setNoticeText] = useState('');
  const [noticesList, setNoticesList] = useState([]);
  const [targetTenant, setTargetTenant] = useState('');
  const [separateNoticeText, setSeparateNoticeText] = useState('');
  const [separateNoticesList, setSeparateNoticesList] = useState([]);

  // Complaints States
  const [adminComplaints, setAdminComplaints] = useState([]);

  // Meeting Bookings State for Admin
  const [adminMeetings, setAdminMeetings] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [meetingPage, setMeetingPage] = useState(1);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(7);
  // const [selectedDateStr, setSelectedDateStr] = useState('2026-08-13');
  const [bookView, setBookView] = useState('dashboard'); // 'dashboard' or 'form'
  const [selectedWsForBook, setSelectedWsForBook] = useState('');
  const [selectedRmForBook, setSelectedRmForBook] = useState('');
  const [selectedSlotForBook, setSelectedSlotForBook] = useState('10:00 AM - 11:30 AM');
  const [attendeesCount, setAttendeesCount] = useState(6);
  const [purposeText, setPurposeText] = useState('Client Meeting');
  const [descText, setDescText] = useState('Quarterly review meeting with the client.');
  const [tenantNameInput, setTenantNameInput] = useState('Zoho Corp');
  const [bookingFormDate, setBookingFormDate] = useState('2026-08-13');
  const [selectedDetailBooking, setSelectedDetailBooking] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
 

  // Crm

const [crmLeads, setCrmLeads] = useState([]);
const [filterStatus, setFilterStatus] = useState('All');
const [crmPage, setCrmPage] = useState(1);
const crmPerPage = 10;
const [showAddLeadModal, setShowAddLeadModal] = useState(false);

// atteendes
const [attendeesList, setAttendeesList] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('All');



  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isTaskEditing, setIsTaskEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [activeDropdownTask, setActiveDropdownTask] = useState(null);
  
  const [taskData, setTaskData] = useState({ 
    taskName: '', 
    priority: '', 
    workspace: '', 
    assignedTo: '', 
    status: '', 
    assignDate: '', 
    endDate: '' 
  });
  const [taskPage, setTaskPage] = useState(1);
  const tasksPerPage = 10; // ஒரு பக்கத்திற்கு 5 டாஸ்க்குகள் வரை 
  const [viewingTask, setViewingTask] = useState(null); // View Modal pop-up state




// vsitors
 const [visitorsList, setVisitorsList] = useState([]);
const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
const [visitorForm, setVisitorForm] = useState({ 
  name: '', 
  phone: '', 
  workspace: '', 
  tenant_name: '', 
  purpose: '', 
  entry_time: '', 
  exit_time: '' 
});  
const [companiesInWorkspace, setCompaniesInWorkspace] = useState([]);

const [isEditExitModalOpen, setIsEditExitModalOpen] = useState(false);
const [selectedVisitor, setSelectedVisitor] = useState(null);
const [exitTimeUpdate, setExitTimeUpdate] = useState('');

  // 🌟 2. Filtered tenants for Invoice Management
    const filteredInvoicesList = tenants.filter((t, idx) => {
    const matchName = invoiceTenantFilter === 'All' || t.name.toLowerCase() === invoiceTenantFilter.toLowerCase();
    const matchSearch = !invoiceSearch || t.name.toLowerCase().includes(invoiceSearch.toLowerCase());
    const tenantStatus = getTenantStatus(t.id, idx);
    const matchStatus = invoiceStatusFilter === 'All' || tenantStatus.toLowerCase() === invoiceStatusFilter.toLowerCase();
    return matchName && matchSearch && matchStatus;
  });

  const totalInvoicePages = Math.ceil(filteredInvoicesList.length / invoicePerPage) || 1;
  const currentInvoicesPageList = filteredInvoicesList.slice((invoicePage - 1) * invoicePerPage, invoicePage * invoicePerPage);

  const totalInvoicesCount = tenants.length > 0 ? tenants.length : 3;

  


  

  // 🌟 டேட்டாபேஸ் மற்றும் இன்வாய்ஸ் நிலையின் அடிப்படையில் சரியான தொகையைக் கணக்கிடுதல்
  // 🌟 1. டேட்டாபேஸ் மற்றும் இன்வாய்ஸ் நிலையின் அடிப்படையில் சரியான தொகையைக் கணக்கிடுதல்
  // let calculatedPaidAmount = 0;
  // let calculatedPendingAmount = 0;

  // tenants.forEach((t, idx) => {
  //   const status = getTenantStatus(t.id, t.name, idx);
    
  //   const foundInv = sentInvoicesList.find(
  //     inv => typeof inv.tenant_name === 'string' && inv.tenant_name.toLowerCase() === t.name.toLowerCase()
  //   );

  //   // const amt = foundInv && foundInv.total_amount !== undefined 
  //   //   ? parseFloat(foundInv.total_amount) 
  //   //   : (allTenantsOrdersMap[t.id] !== undefined ? allTenantsOrdersMap[t.id] : (t.seats ? parseInt(t.seats) * 180 : 0));
  //      const amt = foundInv && foundInv.total_amount !== undefined 
  //      ? parseFloat(foundInv.total_amount) 
  //     : (allTenantsOrdersMap[t.name] !== undefined ? allTenantsOrdersMap[t.name] : 0);


  //   if (status === 'Paid') {
  //     calculatedPaidAmount += amt;
  //   } else if (status === 'Pending') {
  //     calculatedPendingAmount += amt;
  //   }
  // });
 let calculatedPaidAmount = 0;
 let calculatedPendingAmount = 0;

tenants.forEach((t, idx) => {
  const status = getTenantStatus(t.id, t.name, idx);
  
  // 🌟 டெனன்ட் பெயரைக் கொண்டு ஆர்டர் தொகையைத் துல்லியமாக எடுத்தல்
  const matchedKey = Object.keys(allTenantsOrdersMap).find(
    k => k.trim().toLowerCase() === t.name.trim().toLowerCase()
  );
  const amt = matchedKey ? parseFloat(allTenantsOrdersMap[matchedKey]) : 0;

  if (status === 'Paid') {
    calculatedPaidAmount += amt;
  } else if (status === 'Pending') {
    calculatedPendingAmount += amt;
  }
});

  const paidInvoicesCount = tenants.filter((t, idx) => getTenantStatus(t.id, t.name, idx) === 'Paid').length;
  const pendingInvoicesCount = tenants.filter((t, idx) => getTenantStatus(t.id, t.name, idx) === 'Pending').length;

  // 🌟 2. அனைத்து Fetch பங்க்ஷன்களும் (Components-க்கு உள்ளே, ஹூக்குகளுக்கு கீழே)
  const fetchAdminProfile = async () => {
  if (!adminUsername) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/profile?admin_username=${encodeURIComponent(adminUsername)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        setFullAdminProfile(data.profile); // 🌟 முழு Profile விவரங்களும் சேமிக்கப்படுகிறது
        if (data.profile.company_name) {
          setCompanyName(data.profile.company_name);
          localStorage.setItem(`admin_company_${adminUsername}`, data.profile.company_name);
        }
      }
    }
  } catch (err) {
    console.error("Error fetching admin profile:", err);
  }
};
const fetchAllTenantsOrdersMap = async () => {
  try {
    const currentAdmin = localStorage.getItem('admin_username') || '';
    const res = await fetch(`http://localhost:5000/api/admin/all-tenant-orders?admin_username=${encodeURIComponent(currentAdmin)}`);
    if (res.ok) {
      const data = await res.json();
      console.log("All Tenant Orders Map Data:", data); // கன்சோலில் செக் செய்ய
      const ordersMap = {};
      if (data.orders) {
        data.orders.forEach(ord => {
          if (ord.tenant_name) {
            ordersMap[ord.tenant_name.trim().toLowerCase()] = parseFloat(ord.total_amount || 0);
          }
        });
      }
      setAllTenantsOrdersMap(ordersMap);
    }
  } catch (err) {
    console.error("Error fetching tenant orders map:", err);
  }
};


  const fetchNotifications = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username') || '';
      const res = await fetch(`http://localhost:5000/api/admin/all-notifications?admin_username=${encodeURIComponent(currentAdmin)}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchAdminLogo = async () => {
    if (!adminUsername) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/logo?admin_username=${encodeURIComponent(adminUsername)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.logo_url) {
          setAppLogo(data.logo_url);
          localStorage.setItem(`admin_logo_${adminUsername}`, data.logo_url);
        }
      }
    } catch (err) {
      console.error("Error fetching admin logo from DB:", err);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const response = await fetch(`http://localhost:5000/api/workspaces?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data.workspaces);
        setStats(prev => ({ ...prev, workspaces: data.workspaces.length }));
      }
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    }
  };
  

  const fetchEmployees = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const response = await fetch(`http://localhost:5000/api/employees?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
        setStats(prev => ({ ...prev, employees: data.employees.length }));
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };
  

  const fetchManagedTenants = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const response = await fetch(`http://localhost:5000/api/tenants-managed?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants);
        setStats(prev => ({ ...prev, tenants: data.tenants.length }));
      }
    } catch (err) {
      console.error('Error fetching managed tenants:', err);
    }
  };
  
  const fetchAdminFoods = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const res = await fetch(`http://localhost:5000/api/foods?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (res.ok) {
        const data = await res.json();
        setFoods(data.foods);
        setStats(prev => ({ ...prev, foods: data.foods.length }));
      }
    } catch (err) {
      console.error('Error fetching foods:', err);
    }
  };

  const fetchSentInvoices = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const res = await fetch(`http://localhost:5000/api/admin/sent-invoices?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (res.ok) {
        const data = await res.json();
        setSentInvoicesList(data.invoices || []);
      }
    } catch (err) {
      console.error("Error fetching sent invoices:", err);
    }
  };

  const fetchAdminNoticesLogs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/notices-logs');
      if (res.ok) {
        const data = await res.json();
        const all = data.notices || [];
        setNoticesList(all.filter(n => {
          const type = (n.notice_type || '').toLowerCase();
          return type === 'broadcast' || type === 'announcement';
        }));
        setSeparateNoticesList(all.filter(n => {
          const type = (n.notice_type || '').toLowerCase();
          return type === 'private' || type === 'direct';
        }));
      }
    } catch (err) {
      console.error('Error fetching notice logs:', err);
    }
  };

  const fetchAdminComplaints = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const res = await fetch(`http://localhost:5000/api/admin/complaints?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (res.ok) {
        const data = await res.json();
        setAdminComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Error fetching admin complaints:", err);
    }
  };

  const fetchAdminMeetings = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      // 🌟 URL சரியாக இருக்கிறதா என்று கவனிக்கவும்
      const res = await fetch(`http://localhost:5000/api/meeting-bookings?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (res.ok) {
        const data = await res.json();
        // 🌟 டேட்டா வருகிறதா என்று பார்க்க கன்சோல் லாக்
        console.log("Admin Meetings Data:", data.bookings); 
        setAdminMeetings(data.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching admin meetings:", err);
    }
  };

  const fetchComplaintNotifications = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const res = await fetch(`http://localhost:5000/api/admin/complaints-notifications?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setComplaintNotifications(data.notifications);
          setComplaintUnreadCount(data.unreadCount);
        }
      }
    } catch (err) {
      console.error("Error fetching complaint notifications:", err);
    }
  };
  // CRM லீட்களை டேட்டாபேஸிலிருந்து ஃபெட்ச் செய்யும் பங்க்ஷன்
const fetchCrmLeads = async () => {
  try {
    const currentAdmin = localStorage.getItem('admin_username');
    const res = await fetch(`http://localhost:5000/api/admin/crm-leads?admin_username=${encodeURIComponent(currentAdmin)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setCrmLeads(data.leads || []);
      }
    }
  } catch (err) {
    console.error("Error fetching CRM leads:", err);
  }
};
// const fetchVisitors = async () => {
//   try {
//     const res = await fetch('http://localhost:5000/api/admin/visitors');
//     if (res.ok) {
//       const data = await res.json();
//       console.log("Visitors Data:", data); // கன்சோலில் டேட்டா வருதான்னு செக் பண்ண
//       setVisitorsList(data.visitors || []);
//     }
//   } catch (err) {
//     console.error("Error fetching visitors:", err);
//   }
// };
const fetchVisitors = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/visitors"
    );
    const data = await res.json();
    console.log("Visitors API Response:", data);
    if (res.ok && data.status === "success") {
      setVisitorsList(data.visitors || []);
    } else {
      setVisitorsList([]);
      console.error("Failed to fetch visitors:", data);
    }
  } catch (error) {
    console.error("Error fetching visitors:", error);
    setVisitorsList([]);
  }
};
  const fetchAttendees = async () => {
    try {
      const currentAdmin = localStorage.getItem('admin_username');
      const response = await fetch(`http://localhost:5000/api/admin/attendees?admin_username=${encodeURIComponent(currentAdmin)}`);
      if (response.ok) {
        const data = await response.json();
        setAttendeesList(data.attendees || []);
      }
    } catch (err) {
      console.error('Error fetching attendees:', err);
    }
  };

  // 🌟 3. சரியான useEffect ஹூக்குகள் (எந்தவொரு முறைகேடான ஹூக் அழைப்பும் இல்லாமல்)
  useEffect(() => {
    fetchAdminProfile();
    fetchAdminLogo();
    fetchNotifications();
    fetchWorkspaces();
    fetchManagedTenants();
    fetchEmployees();
    fetchAdminFoods();
    fetchSentInvoices();
    fetchAllTenantsOrdersMap();
    fetchAdminNoticesLogs();
    fetchAdminComplaints();
    fetchAdminMeetings();
    fetchComplaintNotifications();
    fetchCrmLeads();
    fetchTasksList();
    // fetchTenantAttendees();
    fetchVisitors();
    fetchAttendees();
  }, [activeTab]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchComplaintNotifications();
    const interval = setInterval(fetchComplaintNotifications, 10000);
    return () => clearInterval(interval);
  }, []);
  

  const handleUpdateComplaintStatus = async (compId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/complaints/${compId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminComplaints();
        if (selectedComplaint && selectedComplaint.id === compId) {
          setSelectedComplaint(prev => ({ ...prev, status: newStatus, date_solved: newStatus === 'Solved' ? new Date().toLocaleString() : prev.date_solved }));
        }
      } else {
        alert('Failed to update complaint status.');
      }
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
  };

  const handleOpenViewOrder = async (tenantName) => {
    setActiveTenantName(tenantName);
    setSelectedMonth('all');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/tenant-orders?tenant_name=${encodeURIComponent(tenantName)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTenantOrders(data.orders);
        
        const invRes = await fetch(`http://localhost:5000/api/tenant/monthly-invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenant_name: tenantName, billing_month: selectedMonth === 'all' ? '2026-08' : selectedMonth })
        });
        if (invRes.ok) {
          const invData = await invRes.json();
          if (invData.invoice) {
            setInvoiceStatuses(prev => ({ ...prev, [invData.invoice.billing_month]: invData.invoice.status }));
          }
        }

        setInvoiceView('details');
      }
    } catch (err) {
      console.error("Error fetching tenant orders:", err);
    }
  };
  const handleToggleStatus = async (task, currentChecked) => {
    const newStatus = currentChecked ? 'Completed' : 'Pending';
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/toggle-status/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchTasksList(); // டேபிளை ரெஃப்ரெஷ் செய்து புதிய End Date-ஐக் காட்ட
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Server connection failed.');
    }
  };
  const fetchTasksList = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  // 🌟 Send Invoice Function
  const handleSendInvoice = async () => {
    if (selectedMonth === 'all') {
      alert('Please select a specific month from the dropdown before sending the invoice!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_name: activeTenantName,
          billing_month: selectedMonth,
          total_amount: totalMonthlyBill,
          admin_username: adminUsername
        })
      });

      if (res.ok) {
        alert(`Official Invoice for ${selectedMonth} successfully sent to ${activeTenantName}! 📄✉️`);
        fetchSentInvoices();
      } else {
        alert('Failed to send invoice.');
      }
    } catch (err) {
      console.error('Error sending invoice:', err);
      alert('Network error while sending invoice.');
    }
  };

  // 🌟 Bill Download Function (Print / PDF format)
  const handleDownloadBill = () => {
    window.print();
  };

  function getTenantStatus(tId, tenantName, defaultIdx) {
  // 1. localStorage-ல் சேமிக்கப்பட்ட ஸ்டேட்டஸ் இருக்கிறதா எனச் சரிபார்த்தல்
  const savedStatuses = JSON.parse(localStorage.getItem('admin_invoice_statuses') || '{}');
  if (savedStatuses[tId]) {
    return savedStatuses[tId];
  }

  // 2. உள்ளூர் ஸ்டேட் இருந்தால் தருவது
  if (customInvoiceStatuses[tId]) {
    return customInvoiceStatuses[tId];
  }
  
  // 3. டேட்டாபேஸ் லிஸ்ட்டில் உள்ளதா எனப் பார்த்தல்
  const safeTenantName = typeof tenantName === 'string' ? tenantName.toLowerCase() : '';
  const foundInv = sentInvoicesList.find(
    inv => typeof inv.tenant_name === 'string' && inv.tenant_name.toLowerCase() === safeTenantName
  );
  
  if (foundInv && foundInv.status) {
    return foundInv.status;
  }
  
  return 'Pending';
}

  // 🌟 2. Green Toast Function
  const showGreenToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // 3 நொடிகளுக்குப் பிறகு மெசேஜ் மறைந்துவிடும்
  };
  const handleOpenEditTask = (task) => {
    setIsTaskEditing(true);
    setCurrentTaskId(task.id);
    setTaskData({
      taskName: task.task_name,
      priority: task.priority,
      workspace: task.workspace,
      assignedTo: task.assigned_to,
      status: task.status,
      assignDate: task.task_assign_date ? task.task_assign_date.split('T')[0] : '',
      endDate: task.task_end_date ? task.task_end_date.split('T')[0] : ''
    });
    setShowTaskForm(true);
    setActiveDropdownTask(null);
  };
  

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isTaskEditing 
        ? `http://localhost:5000/api/tasks/update/${currentTaskId}` 
        : 'http://localhost:5000/api/tasks/add';
      
      const method = isTaskEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const data = await res.json();
      if (data.success) {
        alert(isTaskEditing ? 'Task End Date & Status updated successfully!' : 'Task assigned successfully!');
        setShowTaskForm(false);
        setIsTaskEditing(false);
        setCurrentTaskId(null);
        setTaskData({ taskName: '', priority: 'Medium', workspace: '', assignedTo: '', status: 'Pending', assignDate: '', endDate: '' });
        fetchTasksList();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Server connection failed.');
    }
  };

  const handleUpdateInvoiceStatus = async (tId, tenantName, billingMonth, newStatus) => {
  try {
    // 1. சர்வரில் ஸ்டேட்டஸை மாற்றுகிறோம் (டேட்டாபேஸ் அப்டேட்)
    const res = await fetch(`http://localhost:5000/api/admin/mark-paid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        invoice_id: null,
        tenant_name: tenantName,
        billing_month: billingMonth || '2026-08',
        status: newStatus
      })
    });

    if (res.ok) {
      // 2. உள்ளூர் ஸ்டேட்டஸை உடனே மாற்றுகிறோம்
      setCustomInvoiceStatuses(prev => ({ ...prev, [tId]: newStatus }));
      
      // 3. 🌟 மிக முக்கியமானது: localStorage-ல் இதன் நிலையைச் சேமித்தல் (Refresh செய்தாலும் மாறாது)
      const savedStatuses = JSON.parse(localStorage.getItem('admin_invoice_statuses') || '{}');
      savedStatuses[tId] = newStatus;
      localStorage.setItem('admin_invoice_statuses', JSON.stringify(savedStatuses));
      
      // 4. பேமெண்ட் தேதியைச் செட் செய்தல்
      const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setInvoicePaymentDates(prev => ({ 
        ...prev, 
        [tId]: newStatus === 'Paid' ? todayFormatted : '—' 
      }));

      // 5. சர்வரிலிருந்து லேட்டஸ்ட் இன்வாய்ஸ் பட்டியலைப் பெறுதல்
      await fetchSentInvoices();
      
      showGreenToast(`Invoice successfully marked as ${newStatus}!`);
    } else {
      alert('Failed to update invoice status.');
    }
  } catch (err) {
    console.error("Error updating invoice status:", err);
    alert('Network error while updating status.');
  }
};
  const handlePublishNotice = async (e) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/send-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice_type: 'broadcast', recipient: 'All', message: noticeText })
      });
      if (res.ok) {
        alert('Notice broadcasted successfully to all tenants via Database! 📢');
        setNoticeText('');
        fetchAdminNoticesLogs();
      }
    } catch (err) {
      console.error('Error broadcasting notice:', err);
    }
  };

  const handleSendSeparateNotice = async (e) => {
    e.preventDefault();
    if (!targetTenant.trim() || !separateNoticeText.trim()) {
      alert('Please select tenant and enter message content.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/admin/send-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice_type: 'private', recipient: targetTenant, message: separateNoticeText })
      });
      if (res.ok) {
        alert('Direct private notice sent successfully via Database! ✉️');
        setSeparateNoticeText('');
        setTargetTenant('');
        fetchAdminNoticesLogs();
      }
    } catch (err) {
      console.error('Error sending private notice:', err);
    }
  };

  const chartData = {
    labels: ['Workspaces', 'Employees', 'Tenants', 'Total Foods'],
    datasets: [
      {
        data: [stats.workspaces, stats.employees, stats.tenants, stats.foods],
        backgroundColor: ['#0d6efd', '#ffc107', '#198754', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  // 🌟 1. லோக்கல் ஃபைல் மூலமாக அட்மின் லோகோவை டேட்டாபேஸில் சேமிக்க
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setAppLogo(base64String);
        localStorage.setItem(`admin_logo_${adminUsername}`, base64String);
        
        try {
          await fetch('http://localhost:5000/api/admin/logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              admin_username: adminUsername,
              logo_url: base64String
            })
          });
        } catch (err) {
          console.error('Error saving admin logo to DB:', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  // 🌟 2. URL மூலமாக அட்மின் லோகோவை டேட்டாபேஸில் சேமிக்க
  const handleUrlLogoSave = async () => {
    if (logoUrlInput.trim()) {
      const url = logoUrlInput.trim();
      setAppLogo(url);
      localStorage.setItem(`admin_logo_${adminUsername}`, url);
      
      try {
        const res = await fetch('http://localhost:5000/api/admin/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            admin_username: adminUsername,
            logo_url: url
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('Admin Logo URL updated and saved to DB successfully!');
        } else {
          alert('Failed to save logo to database.');
        }
      } catch (err) {
        console.error('Error saving admin logo URL to DB:', err);
        alert('Server connection failed.');
      }
    }
  };

  const handleCompanyNameChange = (name) => {
    setCompanyName(name);
    localStorage.setItem(`admin_company_${adminUsername}`, name);
  };

  const addSeatTypeRow = () => setSeatTypes([...seatTypes, { name: '', capacity: '' }]);
  const addMeetingRoomRow = () => setMeetingRooms([...meetingRooms, { name: '', capacity: '' }]);

  const handleOpenAddWs = () => {
    setIsWsEditing(false);
    setEditWorkspaceId(null);
    setWsName('');
    setWsLocation('');
    setTotalSeatCapacity('');
    setSeatTypes([{ name: '', capacity: '' }]);
    setMeetingRooms([{ name: '', capacity: '' }]);
    setWorkspaceView('form');
  };

  const parseFormattedString = (str) => {
    if (!str) return [];
    const items = str.split(',').map(item => item.trim()).filter(Boolean);
    return items.map(item => {
      const match = item.match(/^(.*?)\s*\((\d+)\)$/);
      if (match) {
        return { name: match[1].trim(), capacity: match[2].trim() };
      }
      return { name: item, capacity: '-' };
    });
  };

  const handleOpenEditWs = (ws, e) => {
    e.stopPropagation();
    setIsWsEditing(true);
    setEditWorkspaceId(ws.id);
    setWsName(ws.name);
    setWsLocation(ws.location);
    setTotalSeatCapacity(ws.total_seats || ws.totalSeats || '');
    
    const parsedSeats = parseFormattedString(ws.seats);
    setSeatTypes(parsedSeats.length > 0 ? parsedSeats : [{ name: '', capacity: '' }]);

    const parsedMeetings = parseFormattedString(ws.meetings);
    setMeetingRooms(parsedMeetings.length > 0 ? parsedMeetings : [{ name: '', capacity: '' }]);

    setWorkspaceView('form');
  };

  const handleDeleteWs = async (wsId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this workspace?')) {
      const res = await fetch(`http://localhost:5000/api/workspaces/${wsId}`, { method: 'DELETE' });
      if (res.ok) { fetchWorkspaces(); }
    }
  };

  const handleSaveOrUpdateWs = async (e) => {
    e.preventDefault();
    const formattedSeats = seatTypes.map(s => s.name ? (s.capacity ? `${s.name} (${s.capacity})` : s.name) : '').filter(Boolean).join(', ');
    const formattedMeetings = meetingRooms.map(m => m.name ? (m.capacity ? `${m.name} (${m.capacity})` : m.name) : '').filter(Boolean).join(', ');
    
    const wsData = { name: wsName, location: wsLocation, totalSeats: totalSeatCapacity, seats: formattedSeats, meetings: formattedMeetings, admin_username: localStorage.getItem('admin_username') };
    const url = isWsEditing ? `http://localhost:5000/api/workspaces/${editWorkspaceId}` : 'http://localhost:5000/api/workspaces';
    const method = isWsEditing ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(wsData) });
    if (res.ok) {
      alert(isWsEditing ? 'Workspace Updated Successfully!' : 'Workspace Saved Successfully!');
      setWorkspaceView('list');
      fetchWorkspaces();
    }
  };
  const handleDeleteVisitor = async (id) => {
    if (!window.confirm("Are you sure you want to checkout this visitor?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/visitors/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchVisitors();
      }
    } catch (err) {
      console.error("Error deleting visitor:", err);
    }
  };
  
  

  const handleOpenAddEmp = () => {
    setIsEmpEditing(false);
    setEditEmployeeId(null);
    setEmpId('');
    setEmpName('');
    setEmpRole('');
    setEmpWorkspace(workspaces.length > 0 ? workspaces[0].name : '');
    setEmpEmail('');
    setEmpPhone('');
    setEmpAddress('');
    setSelectedEmployee(null);
    setEmpJoinDate('');
    setEmpEndDate('');
    setEmployeeView('form');
  };

  const handleOpenEditEmp = (emp) => {
    setIsEmpEditing(true);
    setEditEmployeeId(emp.id);
    setEmpId(emp.emp_id);
    setEmpName(emp.name);
    setEmpRole(emp.role);
    setEmpWorkspace(emp.workspace);
    setEmpEmail(emp.email);
    setEmpPhone(emp.phone);
    setEmpAddress(emp.address);
    setSelectedEmployee(null);
    setEmpJoinDate(emp.join_date ? emp.join_date.split('T')[0] : '');
    setEmpEndDate(emp.end_date ? emp.end_date.split('T')[0] : '');
    setEmployeeView('form');
  };

  const handleOpenViewEmp = (emp) => {
    setSelectedEmployee(emp);
    setEmployeeView('details');
  };

  const handleDeleteEmp = async (empId) => {
    if (window.confirm('Delete this employee?')) {
      const res = await fetch(`http://localhost:5000/api/employees/${empId}`, { method: 'DELETE' });
      if (res.ok) { fetchEmployees(); }
    }
  };
  const handleSaveOrUpdateEmp = async (e) => {
    e.preventDefault();
    
    // 🌟 1. empData-வில் join_date மற்றும் end_date சேர்க்கப்பட்டுள்ளது
    const empData = { 
      empId, 
      name: empName, 
      role: empRole, 
      workspace: empWorkspace, 
      email: empEmail, 
      phone: empPhone, 
      address: empAddress, 
      admin_username: localStorage.getItem('admin_username'),
      join_date: empJoinDate || null, // 🌟 Join Date அனுப்பப்படுகிறது
      end_date: empEndDate || null      // 🌟 End Date அனுப்பப்படுகிறது (தேவைப்பட்டால் மட்டும்)
    };

    const url = isEmpEditing ? `http://localhost:5000/api/employees/${editEmployeeId}` : 'http://localhost:5000/api/employees';
    const method = isEmpEditing ? 'PUT' : 'POST';

    const res = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(empData) 
    });

    if (res.ok) {
      alert(isEmpEditing ? 'Employee Updated Successfully!' : 'Employee Added Successfully!');
      setEmployeeView('list');
      fetchEmployees();
    } else {
      alert('Failed to save employee data.');
    }
  };

  const handleOpenAddTenant = () => {
    setIsTenantEditing(false);
    setEditTenantId(null);
    setTName('');
    setTUsername('');
    setTPassword('');
    setTPhone('');
    setTEmail('');
    setTAddress('');
    setTWorkspace('');
    setTSeats('');
    setTGst('');
    setTPan('');
    setTJoinDate(new Date().toISOString().split('T')[0]);
    setTEndDate('Active');
    setTDocFile(null);
    setTAgreementFile(null);
    setTDocName('');
    setTAgreementName('');
    setTenantView('form');
  };

  const handleOpenEditTenant = (t) => {
    setIsTenantEditing(true);
    setEditTenantId(t.id);
    setTName(t.name);
    setTUsername(t.username || '');
    setTPassword('');
    setTPhone(t.phone);
    setTEmail(t.email);
    setTAddress(t.address);
    setTWorkspace(t.workspace);
    setTSeats(t.seats);
    setTGst(t.gst);
    setTPan(t.pan);
    setTJoinDate(t.join_date);
    setTEndDate(t.end_date || 'Active');
    
    // ✨ பழைய டாக்குமெண்ட் பெயர்கள் அழியாமல் அப்படியே செட் செய்யப்படுவது
    setTDocFile(null);
    setTAgreementFile(null);
    setTDocName(t.document || '');
    setTAgreementName(t.agreement || '');

    // ✨ ஏற்கனவே உள்ள கூடுதல் ஆவணங்களை (Extra Documents) ஃபார்மில் கொண்டு வர
    if (t.extra_documents) {
      const docsArray = t.extra_documents.split(',').map(d => d.trim()).filter(Boolean);
      setExtraDocs(docsArray);
    } else {
      setExtraDocs([]);
    }

    setTenantView('form');
  };

  const handleDeleteTenant = async (tId) => {
    if (window.confirm('Delete this tenant?')) {
      const res = await fetch(`http://localhost:5000/api/tenants-managed/${tId}`, { method: 'DELETE' });
      if (res.ok) { fetchManagedTenants(); }
    }
  };

  const getSelectedWorkspaceDetails = (wsNameTarget) => {
    const targetWsName = (wsNameTarget || tWorkspace).trim().toLowerCase();
    const ws = workspaces.find(w => w.name.trim().toLowerCase() === targetWsName);
    if (!ws) return { total: 0, balance: 0, location: '' };
    const total = parseInt(ws.total_seats || ws.totalSeats || 0);
    
    const bookedSeats = tenants
      .filter(t => {
        const matchWs = t.workspace && t.workspace.trim().toLowerCase() === ws.name.trim().toLowerCase();
        const isActive = !t.end_date || t.end_date === 'Active' || t.end_date.trim() === '';
        const notCurrentEditing = !isTenantEditing || t.id !== editTenantId;
        return matchWs && isActive && notCurrentEditing;
      })
      .reduce((acc, curr) => acc + parseInt(curr.seats || 0), 0);
      
    const balance = total - bookedSeats;
    return { total, balance, location: ws.location };
  };

  const wsDetails = getSelectedWorkspaceDetails();

  const handleSeatsChange = (e) => {
    const val = e.target.value;
    setTSeats(val);
    const requested = parseInt(val || 0);

    if (requested > 0) {
      const suitableWs = workspaces.find(ws => {
        const total = parseInt(ws.total_seats || ws.totalSeats || 0);
        const booked = tenants
          .filter(t => t.workspace && t.workspace.trim().toLowerCase() === ws.name.trim().toLowerCase() && (!t.end_date || t.end_date === 'Active' || t.end_date.trim() === '') && (!isTenantEditing || t.id !== editTenantId))
          .reduce((acc, curr) => acc + parseInt(curr.seats || 0), 0);
        const balance = total - booked;
        return requested <= balance;
      });

      if (suitableWs) {
        setTWorkspace(suitableWs.name);
      } else {
        setTWorkspace('');
      }
    } else {
      setTWorkspace('');
    }
  };
  const handleSaveOrUpdateTenant = async (e) => {
    e.preventDefault();

    if (!tEmail.includes('@') || !tEmail.includes('.')) {
      alert('Please enter a valid email address!');
      return;
    }
    if (tGst.length !== 15) {
      alert('GST Number must be exactly 15 characters!');
      return;
    }
    if (tPan.length !== 10) {
      alert('PAN Number must be exactly 10 characters!');
      return;
    }

    const requestedSeats = parseInt(tSeats || 0);
    if (!isTenantEditing && requestedSeats > wsDetails.balance) {
      alert(`Cannot allocate! Only ${wsDetails.balance} seats available in ${tWorkspace}.`);
      return;
    }

    const formData = new FormData();
    formData.append('name', tName);
    formData.append('username', tUsername);
    if (tPassword) formData.append('password', tPassword);
    formData.append('phone', tPhone);
    formData.append('email', tEmail);
    formData.append('address', tAddress);
    formData.append('workspace', tWorkspace);
    formData.append('seats', requestedSeats);
    formData.append('gst', tGst);
    formData.append('pan', tPan);
    formData.append('joinDate', tJoinDate);
    formData.append('endDate', tEndDate === '' ? 'Active' : tEndDate);
    formData.append('admin_username', localStorage.getItem('admin_username'));

    if (tDocFile) {
      formData.append('document', tDocFile);
    } else {
      formData.append('document', tDocName);
    }

    if (tAgreementFile) {
      formData.append('agreement', tAgreementFile);
    } else {
      formData.append('agreement', tAgreementName);
    }

    // ✨ பல ஆவணங்களை (Multiple Documents) FormData-வில் இணைக்கும் பகுதி
    if (extraDocs && extraDocs.length > 0) {
      extraDocs.forEach((file) => {
        if (file) {
          formData.append('extra_docs', file);
        }
      });
    }

    const url = isTenantEditing ? `http://localhost:5000/api/tenants-managed/${editTenantId}` : 'http://localhost:5000/api/tenants-managed';
    const method = isTenantEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        alert(isTenantEditing ? 'Tenant Updated Successfully!' : 'Tenant Added Successfully with Secure Credentials & Files!');
        setTenantView('list');
        fetchManagedTenants();
      } else {
        const errData = await res.json();
        alert('Error: ' + (errData.error || 'Failed to save tenant'));
      }
    } catch (err) {
      console.error('Tenant save error:', err);
      alert('Network error while saving tenant.');
    }
  };

  const handleOpenAddFood = () => {
    setIsFoodEditing(false);
    setEditFoodId(null);
    setFoodName('');
    setFoodImgUrl('');
    setFoodPrice('');
    setFoodView('form');
  };

  const handleOpenEditFood = (food) => {
    setIsFoodEditing(true);
    setEditFoodId(food.id);
    setFoodName(food.food_name);
    setFoodImgUrl(food.img_url);
    setFoodPrice(food.price);
    setFoodView('form');
  };

  const handleSaveOrUpdateFood = async (e) => {
    e.preventDefault();
    const currentAdmin = localStorage.getItem('admin_username');
    
    if (isFoodEditing) {
      try {
        const res = await fetch(`http://localhost:5000/api/foods/${editFoodId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: foodPrice })
        });
        if (res.ok) {
          alert('Food Price Updated Successfully!');
          setFoodName('');
          setFoodImgUrl('');
          setFoodPrice('');
          setFoodView('list');
          fetchAdminFoods();
        } else {
          alert('Failed to update food price.');
        }
      } catch (err) {
        console.error('Error updating food price:', err);
      }
    } else {
      const foodData = {
        foodName,
        imgUrl: foodImgUrl,
        price: foodPrice,
        admin_username: currentAdmin
      };
      try {
        const res = await fetch('http://localhost:5000/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(foodData)
        });
        if (res.ok) {
          alert('Food Added Successfully!');
          setFoodName('');
          setFoodImgUrl('');
          setFoodPrice('');
          setFoodView('list');
          fetchAdminFoods();
        } else {
          alert('Failed to add food.');
        }
      } catch (err) {
        console.error('Error saving food:', err);
      }
    }
  };

  const handleToggleAvailability = async (food) => {
    const newStatus = food.is_available === 1 || food.is_available === true ? 0 : 1;
    try {
      const res = await fetch(`http://localhost:5000/api/foods/${food.id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: newStatus })
      });
      if (res.ok) {
        fetchAdminFoods();
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Delete this food item?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/foods/${foodId}`, { method: 'DELETE' });
        if (res.ok) { fetchAdminFoods(); }
      } catch (err) {
        console.error('Error deleting food:', err);
      }
    }
  };

  useEffect(() => {
    fetchComplaintNotifications();
    const interval = setInterval(fetchComplaintNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const indexOfLastWs = wsPage * wsPerPage;
  const currentWorkspaces = workspaces.slice(indexOfLastWs - wsPerPage, indexOfLastWs);
  const totalWsPages = Math.ceil(workspaces.length / wsPerPage) || 1;

  const indexOfLastEmp = empPage * empPerPage;
  const currentEmployees = employees.slice(indexOfLastEmp - empPerPage, indexOfLastEmp);
  const totalEmpPages = Math.ceil(employees.length / empPerPage) || 1;

  const indexOfLastTenant = tenantPage * tenantPerPage;
  const currentTenantsList = tenants.slice(indexOfLastTenant - tenantPerPage, indexOfLastTenant);
  const totalTenantPages = Math.ceil(tenants.length / tenantPerPage) || 1;

  // 🌟 Combined notices list for Notice Management Tab (Broadcast + Private)
  const combinedNoticesList = [...noticesList, ...separateNoticesList];
  const totalNoticePages = Math.ceil(combinedNoticesList.length / noticePerPage) || 1;
  const currentNoticesPageList = combinedNoticesList.slice((noticePage - 1) * noticePerPage, noticePage * noticePerPage);

  const getAvailableMonths = () => {
    const monthsSet = new Set();
    selectedTenantOrders.forEach(ord => {
      const d = new Date(ord.order_date);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        monthsSet.add(`${year}-${month}`);
      }
    });

    const sortedMonths = Array.from(monthsSet).sort().reverse();
    
    return sortedMonths.map(mStr => {
      const [year, month] = mStr.split('-');
      const dateObj = new Date(year, parseInt(month) - 1, 1);
      const label = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      return { value: mStr, label };
    });
  };

  const availableMonths = getAvailableMonths();

  const filteredOrders = selectedMonth === 'all' 
    ? selectedTenantOrders 
    : selectedTenantOrders.filter(ord => {
        const d = new Date(ord.order_date);
        if (isNaN(d.getTime())) return true;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}` === selectedMonth;
      });

  const totalMonthlyBill = filteredOrders.reduce((acc, curr) => acc + parseFloat(curr.total_amount || 0), 0).toFixed(2);
  const totalTenantItemsCount = selectedTenantOrders.reduce((acc, curr) => {
    const items = curr.items ? curr.items.split(',').length : 1;
    return acc + items;
  }, 0);
  const avgOrderValue = selectedTenantOrders.length > 0 ? (parseFloat(totalMonthlyBill) / selectedTenantOrders.length).toFixed(2) : '0.00';

  const totalSystemSeats = workspaces.reduce((acc, ws) => acc + parseInt(ws.total_seats || ws.totalSeats || 0), 0);
  const totalBookedSeats = tenants
    .filter(t => (!t.end_date || t.end_date === 'Active' || t.end_date.trim() === ''))
    .reduce((acc, curr) => acc + parseInt(curr.seats || 0), 0);
  const totalAvailableSeats = totalSystemSeats - totalBookedSeats;
  const utilizationRate = totalSystemSeats > 0 ? Math.round((totalBookedSeats / totalSystemSeats) * 100) : 0;

  const activeTenantsCount = tenants.filter(t => !t.end_date || t.end_date === 'Active' || t.end_date.trim() === '').length;
  const inactiveTenantsCount = tenants.length - activeTenantsCount;

  // 🌟 Complaints Filter Calculations
  const filteredComplaints = adminComplaints.filter(comp => {
    const query = complaintSearch.toLowerCase();
    const tNameMatch = (comp.tenant_name || '').toLowerCase().includes(query);
    const subjMatch = (comp.subject || '').toLowerCase().includes(query);
    const msgMatch = (comp.message || '').toLowerCase().includes(query);
    return tNameMatch || subjMatch || msgMatch;
  });

  const totalComplaintsCount = adminComplaints.length;
  const pendingComplaintsCount = adminComplaints.filter(c => c.status !== 'Solved').length;
  const solvedComplaintsCount = adminComplaints.filter(c => c.status === 'Solved').length;

  const totalComplaintPages = Math.ceil(filteredComplaints.length / complaintPerPage) || 1;
  const currentComplaintsPageList = filteredComplaints.slice((complaintPage - 1) * complaintPerPage, complaintPage * complaintPerPage);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Calibri, sans-serif',flexDirection: window.innerWidth < 768 ? 'column' : 'row'}}>
     {/* 🌟 Mobile Top Navbar */}
{window.innerWidth < 768 && (
  <div style={{
    position: 'sticky',
    top: 0,
    backgroundColor: '#0a1128',
    color: '#fff',
    padding: '12px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src={appLogo} alt="Logo" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
      <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{companyName}</span>
    </div>
    <button 
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }}
    >
      {isMobileMenuOpen ? '✕' : '☰'}
    </button>
  </div>
)}
{/* 🌟 Professional Dark Sidebar */}
<div style={{
    width: window.innerWidth < 768 ? '260px' : (isSidebarCollapsed ? '80px' : '260px'),
    backgroundColor: '#0a1128',
    color: '#fff',
    padding: '24px 0 20px 14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: window.innerWidth < 768 ? 'fixed' : 'sticky',
    left: window.innerWidth < 768 ? (isMobileMenuOpen ? '0' : '-260px') : '0',
    top: 0,
    height: '100vh',
    zIndex: 1200,
    transition: 'width 0.3s ease, left 0.3s ease-in-out',
    boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
    fontFamily: 'Calibri, sans-serif',
    overflowX: 'hidden'
}}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* Top Header & Brand Area */}
          <div style={{ marginBottom: '22px', paddingBottom: '16px', paddingRight: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed && window.innerWidth >= 768 ? 'center' : 'space-between', gap: '8px', flexShrink: 0 }}>
            {(!isSidebarCollapsed || window.innerWidth < 768) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <img 
                  src={localStorage.getItem('superadmin_global_logo') || 'https://via.placeholder.com/44?text=QT'} 
                  alt="SuperAdmin Logo" 
                  style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/44?text=QT'; }} 
                />
                <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <h5 style={{ fontWeight: '800', color: '#ffffff', margin: 0, fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.3px' }}>
                    Qifaw Technology
                  </h5>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                    {companyName}
                  </span>
                </div>
              </div>
            )}
            
            {/* Desktop-ல் மட்டும் சுருக்க உதவும் ஆரோ பட்டன் */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              style={{ 
                background: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.15)', 
                borderRadius: '50px', 
                width: isSidebarCollapsed ? '36px' : '28px', 
                height: '28px', 
                display: window.innerWidth < 768 ? 'none' : 'flex', 
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
              { id: 'overview', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"></path></svg> },
              { id: 'workspace', label: 'Workspace', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
              { id: 'employee', label: 'Employees', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
              { id: 'tenant', label: 'Companies', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg> },
              { id: 'attendees', label: 'Attendees', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="m9 16 2 2 4-4"></path></svg> },
              { id: 'orders', label: 'Order Management', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> },
              { id: 'invoice', label: 'Invoice Management', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg> },
              { id: 'meeting', label: 'Meeting Rooms', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M4 18V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13"></path><line x1="12" y1="3" x2="12" y2="21"></line><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line></svg> },
              { id: 'notice', label: 'Notices', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> },
              { id: 'complaints', label: 'Complaints', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> },
              { id: 'crm', label: 'CRM', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
              { id: 'visitors', label: 'Visitors', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><line x1="19" y1="11" x2="22" y2="14"></line><line x1="22" y1="11" x2="19" y2="14"></line></svg> },
              { id: 'tasks', label: 'Tasks', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg> },
              // { id: 'profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button 
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false);
                      if(tab.id==='workspace') { setWorkspaceView('list'); setSelectedWorkspace(null); }
                      if(tab.id==='employee') { setEmployeeView('list'); setSelectedEmployee(null); }
                      if(tab.id === 'attendees') { setActiveTab('attendees'); }
                      if(tab.id==='tenant') setTenantView('list');
                      if(tab.id==='orders') setFoodView('list');
                      if(tab.id==='invoice') { setInvoiceView('list'); }
                      if(tab.id === 'visitors') { setActiveTab('visitors'); }
                    }}
                    title={isSidebarCollapsed && window.innerWidth >= 768 ? tab.label : ''}
                    style={{
                      width: '100%',
                      textAlign: isSidebarCollapsed && window.innerWidth >= 768 ? 'center' : 'left',
                      padding: isSidebarCollapsed && window.innerWidth >= 768 ? '12px 0' : '11px 16px',
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
                      justifyContent: isSidebarCollapsed && window.innerWidth >= 768 ? 'center' : 'flex-start',
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
                    {(!isSidebarCollapsed || window.innerWidth < 768) && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tab.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>



        {/* Bottom Profile / Account Card with Icon-Only Dropdown when Minimized */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', paddingRight: '14px', position: 'relative', flexShrink: 0 }}>
          
          {/* Smooth Dropdown Menu */}
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
            {/* 🌟 1. View Profile Button */}
            <button 
              onClick={() => { 
                setActiveTab('profile'); 
                setBottomDropdownOpen(false); 
              }}
              style={{ 
                width: isSidebarCollapsed ? '42px' : '100%', 
                textAlign: isSidebarCollapsed ? 'center' : 'left', 
                padding: isSidebarCollapsed ? '10px 0' : '10px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: activeTab === 'profile' ? '#2563eb' : 'transparent', 
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
              onMouseEnter={(e) => {
                if (activeTab !== 'profile') e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'profile') e.currentTarget.style.background = 'transparent';
              }}
              title="Admin Profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {!isSidebarCollapsed && <span>View Profile</span>}
            </button>

            <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '2px 0' }}></div>

            <button 
              onClick={() => navigate('/login')}
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
            title={isSidebarCollapsed ? companyName : ''}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', width: '100%' }}>
              <img 
                src={appLogo} 
                alt="Admin Logo" 
                style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0, borderRadius: '6px' }} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/36?text=A'; }} 
              />
              {!isSidebarCollapsed && (
                <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#ffffff', margin: 0, fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Calibri, sans-serif' }}>
                    {companyName}
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
      {/* மொபைல் வியூவில் மட்டும் தெரியும் பட்டன் */}

      <div style={{ flex: 1, padding: window.innerWidth < 768 ? '15px' : '30px 40px', overflowY: 'auto' }}>
        
        {/* Top Header Bar (Shown ONLY in 'overview' tab) */}
        {/* 1. Overview Tab */}
{activeTab === 'overview' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
      <div>
        <h2 style={{ fontWeight: '800', color: '#1e293b', margin: 0, marginBottom: '4px', fontFamily: 'Calibri, sans-serif', fontSize: '26px' }}>
          Welcome back, Admin 👋
        </h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14.5px', fontFamily: 'Calibri, sans-serif' }}>Here's what's happening in your workspace today.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        
        {/* 🌟 Functional Search Bar (Properly Fixed) */}
        <div style={{ position: 'relative', width: '260px' }}>
          <span style={{ position: 'absolute', top: '10px', left: '14px', color: '#94a3b8', fontSize: '14px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search invoices, tenants..." 
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const q = (e.target.value || '').toLowerCase().trim();
                if (q.includes('workspace') || q.includes('branch')) { setActiveTab('workspace'); }
                else if (q.includes('emp') || q.includes('staff')) { setActiveTab('employee'); }
                else if (q.includes('company') || q.includes('tenant')) { setActiveTab('tenant'); }
                else if (q.includes('attend')) { setActiveTab('attendees'); }
                else if (q.includes('order') || q.includes('food')) { setActiveTab('orders'); }
                else if (q.includes('inv') || q.includes('bill') || q.includes('pay')) { setActiveTab('invoice'); }
                else if (q.includes('meet') || q.includes('room') || q.includes('book')) { setActiveTab('meeting'); }
                else if (q.includes('notic')) { setActiveTab('notice'); }
                else if (q.includes('comp') || q.includes('issue')) { setActiveTab('complaints'); }
                else if (q.includes('crm') || q.includes('lead')) { setActiveTab('crm'); }
                else if (q.includes('visit')) { setActiveTab('visitors'); }
                else if (q.includes('task')) { setActiveTab('tasks'); }
              }
            }}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              borderRadius: '50px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          />
        </div>

        {/* Single Unified Notification Bell for Orders, Complaints & Meeting Bookings */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={async () => {
              const willOpen = !notificationsOpen;
              setNotificationsOpen(willOpen);
              if (willOpen && unreadCount > 0) {
                setUnreadCount(0);
                try {
                  await fetch('http://localhost:5000/api/admin/all-notifications/mark-read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ admin_username: localStorage.getItem('admin_username') })
                  });
                  fetchNotifications();
                } catch (err) {
                  console.error("Error marking as read:", err);
                }
              }
            }}
            style={{ 
              width: '40px', height: '40px', backgroundColor: '#f8f9fa', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', 
              cursor: 'pointer', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
            }}
            title="Tenant Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#025043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#ef4444', 
                color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff'
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {notificationsOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '390px', 
              maxHeight: '460px', overflowY: 'auto', backgroundColor: '#fff', borderRadius: '16px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.15)', border: '1px solid #cbd5e1', zIndex: 2000, padding: '16px',
              fontFamily: 'Calibri, sans-serif'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <h6 style={{ fontWeight: 'bold', margin: 0, fontSize: '15px', color: '#1e293b' }}>🔔 Tenant Activities & Alerts</h6>
                <button onClick={() => setNotificationsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#64748b' }}>✕</button>
              </div>
              
              {adminNotifications.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0', fontSize: '13.5px', margin: 0 }}>No new notifications.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...adminNotifications]
                    .sort((a, b) => {
                      const timeA = new Date(a.date || a.date_time || 0).getTime();
                      const timeB = new Date(b.date || b.date_time || 0).getTime();
                      return timeB - timeA;
                    })
                    .slice(0, 5)
                    .map((notif, index) => {
                      const isUnreadItem = notif.is_read === 0 || notif.is_read === false || notif.is_read === '0';
                      const isComplaint = notif.type === 'complaint';
                      const isMeeting = notif.type === 'meeting';

                      let bgCol = '#f8fafc', borderCol = '#f1f5f9', iconEmoji = '🍔', iconBg = '#eff6ff', iconColor = '#2563eb', badgeText = 'View 🧾';

                      if (isComplaint) {
                        bgCol = '#fffbeb'; borderCol = '#fde68a'; iconEmoji = '⚠️'; iconBg = '#fef3c7'; iconColor = '#d97706'; badgeText = 'Alert ⚠️';
                      } else if (isMeeting) {
                        bgCol = '#f5f3ff'; borderCol = '#ddd6fe'; iconEmoji = '🚪'; iconBg = '#ede9fe'; iconColor = '#7c3aed'; badgeText = 'Meeting 📅';
                      }

                      return (
                        <div 
                          key={index} 
                          onClick={() => {
                            setNotificationsOpen(false);
                            if (isComplaint) {
                              setActiveTab('complaints');
                              setSelectedComplaint(null);
                            } else if (isMeeting) {
                              setActiveTab('meeting');
                              setBookView('dashboard');
                            } else {
                              setActiveTab('invoice');
                              if (notif.tenant_name) handleOpenViewOrder(notif.tenant_name);
                            }
                          }}
                          style={{ 
                            padding: '12px 14px', backgroundColor: bgCol, borderRadius: '12px', 
                            border: `1px solid ${borderCol}`, display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                          }}
                        >
                          {isUnreadItem && (
                            <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                            <div style={{ width: '36px', height: '36px', backgroundColor: iconBg, color: iconColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                              {iconEmoji}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#1e293b', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '230px' }}>
                                {notif.message}
                              </span>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>📅 {notif.date || notif.date_time || 'Just now'}</span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', color: iconColor, fontWeight: 'bold' }}>{badgeText}</span>
                          </div>
                        </div>
                      );
                    })}

                  {adminNotifications.length > 5 && (
                    <button 
                      onClick={() => {
                        setNotificationsOpen(false);
                        setShowAllNotificationsModal(true);
                      }}
                      style={{
                        width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff',
                        border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px',
                        cursor: 'pointer', marginTop: '5px', textAlign: 'center'
                      }}
                    >
                      View All Notifications ({adminNotifications.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
            
        {/* Admin Profile Pill */}
        <div style={{ backgroundColor: '#fff', padding: '6px 14px 6px 6px', borderRadius: '50px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <img src={appLogo} alt="Admin Logo" style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '50%', background: '#f1f5f9', padding: '2px' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/30?text=A'; }} />
          <div style={{ lineHeight: '1.2' }}>
            <span style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{companyName}</span>
            <span style={{ display: 'block', fontSize: '10.5px', color: '#64748b' }}>Workspace Admin</span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '4px' }}>▼</span>
        </div>

        {/* Date Pill */}
        <div style={{ backgroundColor: '#fff', padding: '9px 16px', borderRadius: '50px', border: '1px solid #cbd5e1', fontWeight: '600', fontSize: '13.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span>📅</span> {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} – Today
        </div>
      </div>
    </div>
  </div>
)}
        

       {/* 🌟 Overview Tab (Modern Pro Cards with Smooth Hover Animation & SVG Icons) */}
{activeTab === 'overview' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>

    {/* Top 4 Stat Summary Cards with Responsive Grid & SVG Icons */}
    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
      {[
        { 
          title: 'TOTAL WORKSPACES', 
          val: workspaces.length || 0, 
          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="6" x2="15" y2="6"></line><line x1="9" y1="10" x2="15" y2="10"></line><line x1="12" y1="14" x2="12" y2="18"></line></svg>, 
          color: '#2563eb', 
          bg: '#eff6ff' 
        },
        { 
          title: 'TOTAL EMPLOYEES', 
          val: employees.length || 0, 
          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, 
          color: '#8b5cf6', 
          bg: '#f3e8ff' 
        },
        { 
          title: 'TOTAL TENANTS', 
          val: tenants.length || 0, 
          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>, 
          color: '#10b981', 
          bg: '#ecfdf5' 
        },
        { 
          title: 'TOTAL ORDERS', 
          val: (typeof orders !== 'undefined' ? orders.length : (typeof foods !== 'undefined' ? foods.length : 0)), 
          icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>, 
          color: '#f59e0b', 
          bg: '#fffbeb' 
        },
      ].map((item, idx) => (
        <div 
          key={idx} 
          style={{ 
            backgroundColor: '#fff', 
            padding: window.innerWidth < 768 ? '16px' : '24px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(37, 99, 235, 0.1)';
            e.currentTarget.style.borderColor = '#93c5fd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: window.innerWidth < 768 ? '38px' : '48px', height: window.innerWidth < 768 ? '38px' : '48px', backgroundColor: item.bg, color: item.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '20px' }}>Active</span>
          </div>
          <div>
            <h6 style={{ color: '#64748b', fontWeight: '700', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.title}</h6>
            <h3 style={{ fontWeight: '800', color: '#0f172a', margin: 0, fontSize: window.innerWidth < 768 ? '22px' : '30px' }}>{item.val}</h3>
          </div>
        </div>
      ))}
    </div>

    {/* Qifaw ERP Revenue Distribution Section */}
    <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', flexWrap: 'wrap', gap: '10px' }}>
        <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: window.innerWidth < 768 ? '16px' : '18px' }}>Qifaw ERP Revenue Distribution</h4>
        <select 
          value={selectedOverviewMonth}
          onChange={(e) => setSelectedOverviewMonth(e.target.value)}
          style={{ padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#334155', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <option value="this_month">Current Month ({new Date().toLocaleString('default', { month: 'long', year: 'numeric' })})</option>
          <option value="last_month">Previous Month</option>
          <option value="all">All Time (Total)</option>
        </select>
      </div>
      <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '13px' }}>Real-time module-wise activity filtered by actual creation dates.</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>

        {/* Donut Chart */}
        <div style={{ width: window.innerWidth < 768 ? '200px' : '240px', height: window.innerWidth < 768 ? '200px' : '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', position: 'relative' }}>
          {(() => {
            const currentDate = new Date();
            const currentMonthIndex = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const filterByMonth = (itemList) => {
              if (!itemList || !Array.isArray(itemList)) return 0;
              if (selectedOverviewMonth === 'all') return itemList.length;

              return itemList.filter(item => {
                const dateStr = item.created_at || item.order_date || item.date || item.timestamp;
                if (!dateStr) return selectedOverviewMonth === 'this_month';
                const itemDate = new Date(dateStr);
                const itemMonth = itemDate.getMonth();
                const itemYear = itemDate.getFullYear();

                if (selectedOverviewMonth === 'this_month') {
                  return itemMonth === currentMonthIndex && itemYear === currentYear;
                } else if (selectedOverviewMonth === 'last_month') {
                  const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
                  const targetYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
                  return itemMonth === lastMonthIndex && itemYear === targetYear;
                }
                return true;
              }).length;
            };

            const wsCount = filterByMonth(workspaces);
            const empCount = filterByMonth(employees);
            const tenCount = filterByMonth(tenants);
            const ordCount = filterByMonth(typeof orders !== 'undefined' ? orders : (typeof foods !== 'undefined' ? foods : []));

            const customDonutData = {
              labels: ['ERP / Workspaces', 'Website Builder / Employees', 'POS / Tenants', 'E-Commerce / Orders'],
              datasets: [{
                data: [wsCount, empCount, tenCount, ordCount],
                backgroundColor: ['#007bff', '#00c853', '#ffc107', '#ff6d00'],
                borderWidth: 2,
                borderColor: '#ffffff'
              }]
            };

            return (
              <Doughnut 
                data={customDonutData} 
                options={{ 
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                  cutout: '62%' 
                }} 
              />
            );
          })()}
        </div>

        {/* Legend Cards with Hover Effect */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', flex: 1, maxWidth: '520px', width: '100%' }}>
          {(() => {
            const currentDate = new Date();
            const currentMonthIndex = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const filterByMonth = (itemList) => {
              if (!itemList || !Array.isArray(itemList)) return 0;
              if (selectedOverviewMonth === 'all') return itemList.length;

              return itemList.filter(item => {
                const dateStr = item.created_at || item.order_date || item.date || item.timestamp;
                if (!dateStr) return selectedOverviewMonth === 'this_month';
                const itemDate = new Date(dateStr);
                const itemMonth = itemDate.getMonth();
                const itemYear = itemDate.getFullYear();

                if (selectedOverviewMonth === 'this_month') {
                  return itemMonth === currentMonthIndex && itemYear === currentYear;
                } else if (selectedOverviewMonth === 'last_month') {
                  const lastMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
                  const targetYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;
                  return itemMonth === lastMonthIndex && itemYear === targetYear;
                }
                return true;
              }).length;
            };

            const wsCount = filterByMonth(workspaces);
            const empCount = filterByMonth(employees);
            const tenCount = filterByMonth(tenants);
            const ordCount = filterByMonth(typeof orders !== 'undefined' ? orders : (typeof foods !== 'undefined' ? foods : []));

            const itemsList = [
              { label: 'ERP (Workspaces)', val: wsCount, color: '#007bff' },
              { label: 'Website Builder (Employees)', val: empCount, color: '#00c853' },
              { label: 'POS (Tenants)', val: tenCount, color: '#ffc107' },
              { label: 'E-Commerce (Orders)', val: ordCount, color: '#ff6d00' }
            ];

            return itemsList.map((item, idx) => (
              <div 
                key={idx} 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', transition: 'all 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '4px', height: '35px', backgroundColor: item.color, borderRadius: '4px' }}></div>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>{item.label}</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{item.val}</span>
                </div>
              </div>
            ));
          })()}
        </div>

      </div>
    </div>
  </div>
)}
       {/* Workspace Tab */}
        {activeTab === 'workspace' && (
          <div style={{ fontFamily: 'Calibri, sans-serif' }}>
            {workspaceView === 'list' ? (
              <div>
                {selectedWorkspace ? (
                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '35px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                      <div>
                        <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '24px', fontFamily: 'Calibri, sans-serif' }}>
                          🏢 {selectedWorkspace.name} — Facility Details
                        </h3>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px', fontFamily: 'Calibri, sans-serif' }}>Comprehensive breakdown of capacity, seats, and meeting rooms.</p>
                      </div>
                      <button 
                        onClick={() => setSelectedWorkspace(null)} 
                        style={{ padding: '9px 18px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif' }}
                      >
                        ← Back to Workspaces
                      </button>
                    </div>

                    {(() => {
                      const statsDetails = getSelectedWorkspaceDetails(selectedWorkspace.name);
                      const seatItems = parseFormattedString(selectedWorkspace.seats);
                      const meetingItems = parseFormattedString(selectedWorkspace.meetings);

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px' }}>
                            <div style={{ backgroundColor: '#f8fafc', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location / Branch</span>
                              <p style={{ fontSize: '17px', color: '#1e293b', margin: '6px 0 0 0', fontWeight: '700' }}>📍 {selectedWorkspace.location}</p>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seat Allocation Ratio</span>
                              <p style={{ fontSize: '17px', color: '#10b981', margin: '6px 0 0 0', fontWeight: '800' }}>
                                Total: {statsDetails.total} | Available: <span style={{ color: '#2563eb' }}>{statsDetails.balance}</span>
                              </p>
                            </div>
                          </div>

                          <div>
                            <h5 style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px', marginBottom: '12px' }}>🪑 Seat Types & Breakdown</h5>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflowX: 'auto', marginBottom: '25px' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                                    <th style={{ padding: '14px 20px', fontWeight: '700' }}>Seat Category / Type</th>
                                    <th style={{ padding: '14px 20px', fontWeight: '700' }}>Capacity</th>
                                    <th style={{ padding: '14px 20px', fontWeight: '700', textAlign: 'right' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {seatItems.length === 0 ? (
                                    <tr>
                                      <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No specific seat types listed.</td>
                                    </tr>
                                  ) : (
                                    seatItems.map((st, idx) => (
                                      <tr key={idx} style={{ borderBottom: idx !== seatItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: '600' }}>{st.name}</td>
                                        <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: '700' }}>{st.capacity}</td>
                                        <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: '700', textAlign: 'right' }}>Active / Ready</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <h5 style={{ fontWeight: '700', color: '#1e293b', fontSize: '16px', marginBottom: '12px' }}>📅 Meeting Rooms & Capacity</h5>
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '14px', overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                                    <th style={{ padding: '14px 20px', fontWeight: '700' }}>Meeting Room Name</th>
                                    <th style={{ padding: '14px 20px', fontWeight: '700' }}>Capacity</th>
                                    <th style={{ padding: '14px 20px', fontWeight: '700', textAlign: 'right' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {meetingItems.length === 0 ? (
                                    <tr>
                                      <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No meeting rooms listed.</td>
                                    </tr>
                                  ) : (
                                    meetingItems.map((mt, idx) => (
                                      <tr key={idx} style={{ borderBottom: idx !== meetingItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: '600' }}>{mt.name}</td>
                                        <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: '700' }}>{mt.capacity}</td>
                                        <td style={{ padding: '14px 20px', color: '#10b981', fontWeight: '700', textAlign: 'right' }}>Active / Ready</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                      <div>
                        <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '22px', fontFamily: 'Calibri, sans-serif' }}>Workspaces</h3>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '14px', fontFamily: 'Calibri, sans-serif' }}>Manage and monitor all your workspaces in one place.</p>
                      </div>
                      <button 
                        onClick={handleOpenAddWs} 
                        style={{ 
                          padding: '11px 22px', 
                          backgroundColor: '#2563eb', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '10px', 
                          fontWeight: '700', 
                          cursor: 'pointer', 
                          fontSize: '14px', 
                          fontFamily: 'Calibri, sans-serif', 
                          boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        + Add Workspace
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: window.innerWidth < 768 ? '12px' : '20px', marginBottom: '30px', fontFamily: 'Calibri, sans-serif' }}>
                      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏢</div>
                        <div>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '18px', fontFamily: 'Calibri, sans-serif' }}>{workspaces.length}</h4>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '11px', fontWeight: '600', fontFamily: 'Calibri, sans-serif' }}>Total Workspaces</p>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👥</div>
                        <div>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '18px', fontFamily: 'Calibri, sans-serif' }}>{totalSystemSeats}</h4>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '11px', fontWeight: '600', fontFamily: 'Calibri, sans-serif' }}>Total Capacity</p>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🪑</div>
                        <div>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '18px', fontFamily: 'Calibri, sans-serif' }}>{totalAvailableSeats}</h4>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '11px', fontWeight: '600', fontFamily: 'Calibri, sans-serif' }}>Available Seats</p>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', backgroundColor: '#fff7ed', color: '#f97316', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📈</div>
                        <div>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '18px', fontFamily: 'Calibri, sans-serif' }}>{utilizationRate}%</h4>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '11px', fontWeight: '600', fontFamily: 'Calibri, sans-serif' }}>Utilization Rate</p>
                        </div>
                      </div>
                    </div>

                    {workspaces.length === 0 ? (
                      <div style={{ backgroundColor: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '15px', fontFamily: 'Calibri, sans-serif' }}>No workspaces found in the system.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)', gap: '22px', fontFamily: 'Calibri, sans-serif' }}>
                        {workspaces.map((ws) => {
                          const wsStats = getSelectedWorkspaceDetails(ws.name);
                          const wsUtilization = parseInt(ws.total_seats || ws.totalSeats || 0) > 0 
                            ? Math.round(((parseInt(ws.total_seats || ws.totalSeats || 0) - wsStats.balance) / parseInt(ws.total_seats || ws.totalSeats || 0)) * 100) 
                            : 0;

                          return (
                            <div key={ws.id} style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.25s ease' }}>
                              <div>
                                <div style={{ position: 'relative', height: '110px', backgroundColor: '#e2e8f0', backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#10b981', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '10.5px', fontWeight: '700', letterSpacing: '0.5px' }}>
                                    + Active
                                  </div>
                                </div>

                                <div style={{ padding: '20px 20px 14px 20px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{ width: '36px', height: '36px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏢</div>
                                      <div>
                                        <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '16.5px', fontFamily: 'Calibri, sans-serif' }}>{ws.name}</h4>
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Calibri, sans-serif' }}>
                                          <span>📍</span> {ws.location}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '16px', fontFamily: 'Calibri, sans-serif' }}>
                                    <div>
                                      <span style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: '700', marginBottom: '2px' }}>Capacity</span>
                                      <strong style={{ color: '#1e293b', fontSize: '14px', fontWeight: '800' }}>{wsStats.total}</strong>
                                    </div>
                                    <div>
                                      <span style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: '700', marginBottom: '2px' }}>Available</span>
                                      <strong style={{ color: '#1e293b', fontSize: '14px', fontWeight: '800' }}>{wsStats.balance}</strong>
                                    </div>
                                    <div>
                                      <span style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: '700', marginBottom: '2px' }}>Utilization</span>
                                      <strong style={{ color: '#1e293b', fontSize: '14px', fontWeight: '800' }}>{wsUtilization}%</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div style={{ padding: '0 20px 18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', fontFamily: 'Calibri, sans-serif' }}>
                                <button 
                                  onClick={() => setSelectedWorkspace(ws)}
                                  style={{ flex: 1, padding: '9px 14px', backgroundColor: '#fff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'Calibri, sans-serif' }}
                                >
                                  View Details
                                </button>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={(e) => handleOpenEditWs(ws, e)} style={{ width: '34px', height: '34px', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }} title="Edit Workspace">✏️</button>
                                  <button onClick={(e) => handleDeleteWs(ws.id, e)} style={{ width: '34px', height: '34px', backgroundColor: '#fff', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }} title="Delete Workspace">🗑️</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '40px', borderRadius: '18px', width: '100%', boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                  <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '20px', fontFamily: 'Calibri, sans-serif' }}>{isWsEditing ? 'Edit Workspace' : 'Create New Workspace'}</h4>
                  <button onClick={() => setWorkspaceView('list')} style={{ padding: '8px 16px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', fontFamily: 'Calibri, sans-serif' }}>← Back</button>
                </div>
                <form onSubmit={handleSaveOrUpdateWs}>
                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#475569', marginBottom: '8px', fontFamily: 'Calibri, sans-serif' }}>Company Name</label>
                      <input type="text" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} value={wsName} onChange={(e) => setWsName(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#475569', marginBottom: '8px', fontFamily: 'Calibri, sans-serif' }}>Location</label>
                      <input type="text" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} value={wsLocation} onChange={(e) => setWsLocation(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#475569', marginBottom: '8px', fontFamily: 'Calibri, sans-serif' }}>Total Seat Capacity</label>
                      <input type="number" style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} value={totalSeatCapacity} onChange={(e) => setTotalSeatCapacity(e.target.value)} required />
                    </div>
                  </div>

                  <div style={{ marginBottom: '25px', backgroundColor: '#f8fafc', padding: window.innerWidth < 768 ? '15px' : '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '14px', fontFamily: 'Calibri, sans-serif' }}>Seat Types & Capacity</h6>
                      <button type="button" onClick={addSeatTypeRow} style={{ padding: '6px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'Calibri, sans-serif' }}>+ Add Seat Type</button>
                    </div>
                    {seatTypes.map((seat, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                        <input type="text" style={{ flex: 2, width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} placeholder="Seat Type Name" value={seat.name} onChange={(e) => { const n = [...seatTypes]; n[index].name = e.target.value; setSeatTypes(n); }} required />
                        <input type="number" style={{ flex: 2, width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} placeholder="Capacity" value={seat.capacity} onChange={(e) => { const n = [...seatTypes]; n[index].capacity = e.target.value; setSeatTypes(n); }} required />
                        {seatTypes.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setSeatTypes(seatTypes.filter((_, i) => i !== index))} 
                            style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', flexShrink: 0, transition: 'all 0.2s' }} 
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                            title="Delete"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: '30px', backgroundColor: '#f8fafc', padding: window.innerWidth < 768 ? '15px' : '22px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                      <h6 style={{ fontWeight: '700', color: '#1e293b', margin: 0, fontSize: '14px', fontFamily: 'Calibri, sans-serif' }}>Meeting Room Name & Capacity</h6>
                      <button type="button" onClick={addMeetingRoomRow} style={{ padding: '6px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: 'Calibri, sans-serif' }}>+ Add Meeting Room</button>
                    </div>
                    {meetingRooms.map((room, index) => (
                      <div key={index} style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                        <input type="text" style={{ flex: 2, width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} placeholder="Room Name" value={room.name} onChange={(e) => { const n = [...meetingRooms]; n[index].name = e.target.value; setMeetingRooms(n); }} required />
                        <input type="number" style={{ flex: 2, width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} placeholder="Capacity" value={room.capacity} onChange={(e) => { const n = [...meetingRooms]; n[index].capacity = e.target.value; setMeetingRooms(n); }} required />
                        {meetingRooms.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setMeetingRooms(meetingRooms.filter((_, i) => i !== index))} 
                            style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', flexShrink: 0, transition: 'all 0.2s' }} 
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fecaca'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                            title="Delete"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}>{isWsEditing ? 'Update Workspace' : 'Save Workspace'}</button>
                </form>
              </div>
            )}
          </div>
        )}
        
        {/* Order Management Tab */}
        {activeTab === 'orders' && (
          <div style={{ fontFamily: 'Calibri, sans-serif' }}>
            {foodView === 'list' ? (
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '15px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '20px' }}>Food Menu Management</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Manage and monitor all food items and prices.</p>
                  </div>
                  <button onClick={handleOpenAddFood} style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>+ Add Food</button>
                </div>

                {foods.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No food items added yet. Click "+ Add Food" to begin.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))', gap: window.innerWidth < 768 ? '10px' : '18px' }}>
                    {foods.map((food) => {
                      const isAvailable = food.is_available === 1 || food.is_available === true;
                      return (
                        <div key={food.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ position: 'relative', width: '100%', height: window.innerWidth < 768 ? '95px' : '110px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                              <img src={food.img_url} alt={food.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                              <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0, 0, 0, 0.75)', padding: '2px 6px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
                                <span style={{ color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>{isAvailable ? 'Active' : 'Hidden'}</span>
                                <input 
                                  type="checkbox" 
                                  checked={isAvailable} 
                                  onChange={() => handleToggleAvailability(food)} 
                                  style={{ cursor: 'pointer', width: '10px', height: '10px', accentColor: '#2563eb' }} 
                                />
                              </div>
                            </div>
                            <div style={{ padding: window.innerWidth < 768 ? '10px' : '12px 14px' }}>
                              <h6 style={{ fontWeight: '700', margin: '0 0 2px 0', fontSize: window.innerWidth < 768 ? '13px' : '14.5px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{food.food_name}</h6>
                              <p style={{ color: '#2563eb', fontWeight: '800', margin: 0, fontSize: window.innerWidth < 768 ? '13px' : '14.5px' }}>₹{food.price}</p>
                            </div>
                          </div>
                          <div style={{ padding: window.innerWidth < 768 ? '0 10px 10px 10px' : '0 12px 12px 12px', display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleOpenEditFood(food)} style={{ flex: 1, padding: '6px 4px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>✏️ Edit</button>
                            <button onClick={() => handleDeleteFood(food.id)} style={{ flex: 1, padding: '6px 4px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>🗑️ Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '25px', alignItems: 'flex-start' }}>
                
                <div style={{ width: '100%', flex: '1.3', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '15px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '20px' }}>Food Menu Management</h4>
                      <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Manage and monitor all food items and prices.</p>
                    </div>
                    <button onClick={handleOpenAddFood} style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif' }}>+ Add Food</button>
                  </div>

                  {foods.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No food items added yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
                      {foods.map((food) => {
                        const isAvailable = food.is_available === 1 || food.is_available === true;
                        return (
                          <div key={food.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ width: '100%', height: '90px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                              <img src={food.img_url} alt={food.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </div>
                            <div style={{ padding: '10px 12px' }}>
                              <h6 style={{ fontWeight: '700', margin: '0 0 2px 0', fontSize: '13.5px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{food.food_name}</h6>
                              <p style={{ color: '#2563eb', fontWeight: '800', margin: 0, fontSize: '13.5px' }}>₹{food.price}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ width: '100%', flex: '1.2', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '17px' }}>{isFoodEditing ? 'Edit Food Price' : 'Add New Food Item'}</h4>
                    <button type="button" onClick={() => setFoodView('list')} style={{ padding: '6px 12px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}>← Back</button>
                  </div>

                  <form onSubmit={handleSaveOrUpdateFood} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Food Name</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. Chicken Biryani" value={foodName} onChange={(e) => setFoodName(e.target.value)} disabled={isFoodEditing} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Image URL</label>
                      <input type="url" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="https://example.com/image.jpg" value={foodImgUrl} onChange={(e) => setFoodImgUrl(e.target.value)} disabled={isFoodEditing} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Price (₹)</label>
                      <input type="number" step="0.01" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. 180" value={foodPrice} onChange={(e) => setFoodPrice(e.target.value)} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14.5px', cursor: 'pointer', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', marginTop: '5px' }}>
                      {isFoodEditing ? 'Update Price' : 'Save Food Item'}
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        )}
        {/* 🌟 EMPLOYEE TAB */}
        {activeTab === 'employee' && (
          <div style={{ fontFamily: 'Calibri, sans-serif', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 26px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: window.innerWidth < 768 ? '40px' : '50px', height: window.innerWidth < 768 ? '40px' : '50px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: window.innerWidth < 768 ? '20px' : '24px', flexShrink: 0 }}>👥</div>
                <div>
                  <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Total Employees</span>
                  <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}>{employees.length}</h3>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>All Workspaces</small>
                </div>
              </div>

              {/* 🌟 Active Employees Count (End Date உள்ளவர்கள் கழிக்கப்பட்டு சரியாகக் காட்டும்) */}
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 26px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: window.innerWidth < 768 ? '40px' : '50px', height: window.innerWidth < 768 ? '40px' : '50px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: window.innerWidth < 768 ? '20px' : '24px', flexShrink: 0 }}>✅</div>
                <div>
                  <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Active Employees</span>
                  <h3 style={{ fontWeight: '800', color: '#2563eb', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '20px' : '24px' }}>
                    {employees.filter(emp => {
                      if (!emp.end_date || emp.end_date === '' || emp.end_date === 'null') return true;
                      const today = new Date().toISOString().split('T')[0];
                      return emp.end_date > today;
                    }).length}
                  </h3>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>Currently Active</small>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '25px', alignItems: 'flex-start' }}>
              
              <div style={{ width: '100%', flex: employeeView !== 'list' ? '1.3' : '1', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '18px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '20px' }}>Employees Directory</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Manage and view all employees across workspaces.</p>
                  </div>
                  <button onClick={handleOpenAddEmp} style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>+ Add Employee</button>
                </div>

                {employees.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No employees found in the system.</p>
                ) : (
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '450px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#2563eb', color: '#fff', borderBottom: '2px solid #1d4ed8' }}>
                          <th style={{ padding: '12px 14px', fontWeight: '700' }}>ID</th>
                          <th style={{ padding: '12px 14px', fontWeight: '700' }}>Employees</th>
                          <th style={{ padding: '12px 14px', fontWeight: '700' }}>Role</th>
                          <th style={{ padding: '12px 14px', fontWeight: '700' }}>Workspace</th>
                          <th style={{ padding: '12px 14px', fontWeight: '700' }}>Status</th>
                          <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEmployees.map((emp, index) => (
                          <tr key={emp.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                            <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>{emp.emp_id}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                                  {emp.name ? emp.name.charAt(0).toUpperCase() : 'E'}
                                </div>
                                <div>
                                  <span style={{ display: 'block', fontWeight: '700', color: '#1e293b', fontSize: '13.5px' }}>{emp.name}</span>
                                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b' }}>{emp.email}</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>{emp.role}</span>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#2563eb', fontWeight: '700' }}>🏢 {emp.workspace}</td>
                            
                            {/* 🌟 Dynamic Status (End Date கொடுக்கப்பட்டிருந்தால் / முடிந்திருந்தால் Inactive எனக் காட்டும்) */}
                            <td style={{ padding: '12px 14px' }}>
                              {(() => {
                                const today = new Date().toISOString().split('T')[0];
                                const hasEndDate = emp.end_date && emp.end_date !== '' && emp.end_date !== 'null';
                                const isActive = !hasEndDate || emp.end_date > today;
                                
                                return (
                                  <span style={{ 
                                    backgroundColor: isActive ? '#eff6ff' : '#fef2f2', 
                                    color: isActive ? '#2563eb' : '#dc2626', 
                                    padding: '3px 8px', 
                                    borderRadius: '6px', 
                                    fontSize: '11.5px', 
                                    fontWeight: '700' 
                                  }}>
                                    {isActive ? 'Active' : 'Inactive'}
                                  </span>
                                );
                              })()}
                            </td>

                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                                <button onClick={() => handleOpenViewEmp(emp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }} title="View Details"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                                <button onClick={() => handleOpenEditEmp(emp)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }} title="Edit Employee"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                <button onClick={() => handleDeleteEmp(emp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }} title="Delete Employee"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Page {empPage} of {totalEmpPages}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button disabled={empPage === 1} onClick={() => setEmpPage(empPage - 1)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: '600', cursor: 'pointer' }}>Previous</button>
                    <button disabled={empPage >= totalEmpPages} onClick={() => setEmpPage(empPage + 1)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: '600', cursor: 'pointer' }}>Next</button>
                  </div>
                </div>
              </div>

              {/* 🌟 EMPLOYEE VIEW SIDE PANEL */}
              {employeeView === 'details' && selectedEmployee && (
                <div style={{ width: '100%', flex: '1.2', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '17px' }}>Employee Profile — {selectedEmployee.name}</h4>
                    <button type="button" onClick={() => { setSelectedEmployee(null); setEmployeeView('list'); }} style={{ padding: '7px 14px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12.5px' }}>← Back</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                    <div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Employee ID</span>
                      <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>{selectedEmployee.emp_id}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Designation / Role</span>
                      <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '800' }}>{selectedEmployee.role}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Workspace</span>
                      <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>🏢 {selectedEmployee.workspace}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Email Address</span>
                      <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Phone Number</span>
                      <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>{selectedEmployee.phone}</p>
                    </div>

                    {/* 🌟 Join Date & End Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Join Date</span>
                        <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>{selectedEmployee.join_date || 'Not Assigned'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>End Date</span>
                        <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>{selectedEmployee.end_date || 'Ongoing'}</p>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Full Address</span>
                      <p style={{ fontSize: '15px', color: '#1e293b', margin: '4px 0 0 0', fontWeight: '700' }}>{selectedEmployee.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 🌟 EMPLOYEE FORM SIDE PANEL */}
              {employeeView === 'form' && (
                <div style={{ width: '100%', flex: '1.2', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '17px' }}>{isEmpEditing ? 'Edit Employee Record' : 'Register New Employee'}</h4>
                    <button type="button" onClick={() => setEmployeeView('list')} style={{ padding: '7px 14px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12.5px' }}>← Back</button>
                  </div>

                  <form onSubmit={handleSaveOrUpdateEmp} style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13.5px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Employee ID</label><input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={empId} onChange={(e) => setEmpId(e.target.value)} required /></div>
                      <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Full Name</label><input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={empName} onChange={(e) => setEmpName(e.target.value)} required /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Role / Designation</label><input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={empRole} onChange={(e) => setEmpRole(e.target.value)} required /></div>
                      <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Workspace</label><select style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#fff', boxSizing: 'border-box' }} value={empWorkspace} onChange={(e) => setEmpWorkspace(e.target.value)} required><option value="">-- Choose Workspace --</option>{workspaces.map((ws) => (<option key={ws.id} value={ws.name}>{ws.name} ({ws.location})</option>))}</select></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Email Address</label><input type="email" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} required /></div>
                      <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Phone Number</label><input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={empPhone} onChange={(e) => setEmpPhone(e.target.value)} required /></div>
                    </div>
                    
                  {/* Join Date & Optional End Date */}
                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Join Date</label>
                        {/* 🌟 Join Date-ல் disabled அல்லது readOnly சேர்க்கப்பட்டுள்ளது */}
                        <input 
                          type="date" 
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box', backgroundColor: isEmpEditing ? '#f1f5f9' : '#fff', cursor: isEmpEditing ? 'not-allowed' : 'pointer' }} 
                          value={empJoinDate} 
                          onChange={(e) => setEmpJoinDate(e.target.value)} 
                          disabled={isEmpEditing} 
                          required 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>End Date (Optional)</label>
                        <input type="date" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} value={empEndDate} onChange={(e) => setEmpEndDate(e.target.value)} />
                      </div>
                    </div>

                    <div><label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Address</label><textarea style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '65px', fontSize: '13.5px', boxSizing: 'border-box' }} value={empAddress} onChange={(e) => setEmpAddress(e.target.value)} required></textarea></div>
                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', marginTop: '5px' }}>{isEmpEditing ? 'Update Employee' : 'Save Employee'}</button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}
{/* 🌟 TASKS TAB */}
{activeTab === 'tasks' && (
  <div style={{ fontFamily: 'Calibri, sans-serif', display: 'flex', flexDirection: 'column', gap: '25px' }}>
    <div style={{ backgroundColor: '#ffffff', padding: window.innerWidth < 768 ? '20px' : '32px', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' }}>
      
      {/* 🌟 1. Form View (Add Task) */}
      {showTaskForm ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div>
              <h4 style={{ fontWeight: '850', color: '#0f172a', margin: '0 0 6px 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>
                Assign New Task
              </h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Fill out the details below to manage task workflow.</p>
            </div>
            <button 
              type="button" 
              onClick={() => setShowTaskForm(false)} 
              style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
            >
              ← Back to List
            </button>
          </div>

          <form onSubmit={handleTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px', maxWidth: '850px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '750', color: '#334155', marginBottom: '8px' }}>Task Name</label>
              <input type="text" placeholder="e.g. Design Landing Page & Dashboard UI" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} value={taskData.taskName} onChange={(e) => setTaskData({...taskData, taskName: e.target.value})} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '750', color: '#334155', marginBottom: '8px' }}>Priority Level</label>
                <select style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box', outline: 'none' }} value={taskData.priority} onChange={(e) => setTaskData({...taskData, priority: e.target.value})} required>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '750', color: '#334155', marginBottom: '8px' }}>Workspace</label>
                <select style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box', outline: 'none' }} value={taskData.workspace} onChange={(e) => setTaskData({...taskData, workspace: e.target.value})} required>
                  <option value="">-- Choose Workspace --</option>
                  {workspaces && workspaces.map((ws) => (<option key={ws.id} value={ws.name}>{ws.name} ({ws.location})</option>))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '750', color: '#334155', marginBottom: '8px' }}>Assigned To</label>
                <select style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff', boxSizing: 'border-box', outline: 'none' }} value={taskData.assignedTo} onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})} required>
                  <option value="">-- Choose Employee --</option>
                  {employees && employees.map((emp) => (<option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '750', color: '#334155', marginBottom: '8px' }}>Task Assign Date</label>
                <input type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} value={taskData.assignDate} onChange={(e) => setTaskData({...taskData, assignDate: e.target.value})} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" style={{ padding: '12px 26px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '750', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                Save & Assign Task
              </button>
              <button type="button" onClick={() => setShowTaskForm(false)} style={{ padding: '12px 22px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: '750', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* 🌟 2. Table & Header View */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h4 style={{ fontWeight: '850', color: '#0f172a', margin: '0 0 6px 0', fontSize: window.innerWidth < 768 ? '18px' : '22px', letterSpacing: '-0.3px' }}>Task Management Directory</h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Assign, prioritize, and track all workspace tasks seamlessly.</p>
            </div>

            <button 
              onClick={() => {
                setTaskData({ taskName: '', priority: 'Medium', workspace: '', assignedTo: '', status: 'Pending', assignDate: '', endDate: '' });
                setShowTaskForm(true);
              }} 
              style={{ 
                padding: '11px 22px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '750', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Task
            </button>
          </div>

          {/* Tasks Display Table */}
          <div style={{ overflowX: 'auto', marginTop: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 16px', fontWeight: '750', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>Task Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750' }}>Priority</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750' }}>Workspace</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750' }}>Assigned To</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750' }}>Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750' }}>Assign Date</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750' }}>End Date</th>
                  <th style={{ padding: '14px 16px', fontWeight: '750', textAlign: 'center', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontSize: '14.5px' }}>No tasks assigned yet.</td>
                  </tr>
                ) : (
                  tasks.slice((taskPage - 1) * tasksPerPage, taskPage * tasksPerPage).map((t, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', fontWeight: '750', color: '#0f172a' }}>{t.task_name}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: t.priority === 'Hard' ? '#fef2f2' : t.priority === 'Medium' ? '#fffbeb' : '#f0fdf4', color: t.priority === 'Hard' ? '#dc2626' : t.priority === 'Medium' ? '#d97706' : '#16a34a', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '750', display: 'inline-block' }}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#2563eb', fontWeight: '650' }}>{t.workspace}</td>
                      <td style={{ padding: '16px', color: '#334155', fontWeight: '600' }}>{t.assigned_to}</td>
                      
                      {/* Status Badge */}
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: t.status === 'Completed' ? '#ecfdf5' : '#fef3c7', color: t.status === 'Completed' ? '#047857' : '#d97706', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '750', display: 'inline-block' }}>
                          {t.status}
                        </span>
                      </td>

                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13.5px' }}>
                        {t.task_assign_date ? new Date(t.task_assign_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13.5px' }}>
                        {t.task_end_date ? new Date(t.task_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      
                      {/* 🌟 Action: Eye SVG Icon & Modern Toggle Switch */}
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          
                          {/* Eye SVG Icon for View Summary */}
                          <button 
                            onClick={() => setViewingTask(t)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                            title="View Summary"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>

                          {/* Toggle Switch (On = Completed, Off = Pending) */}
                          <label style={{ position: 'relative', display: 'inline-block', width: '38px', height: '20px', cursor: 'pointer', margin: 0 }} title={t.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}>
                            <input 
                              type="checkbox" 
                              checked={t.status === 'Completed'} 
                              onChange={(e) => handleToggleStatus(t, e.target.checked)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: t.status === 'Completed' ? '#22c55e' : '#cbd5e1',
                              transition: '.3s', borderRadius: '20px'
                            }}></span>
                            <span style={{
                              position: 'absolute', content: "''", height: '16px', width: '16px', left: t.status === 'Completed' ? '19px' : '2px', bottom: '2px',
                              backgroundColor: 'white', transition: '.3s', borderRadius: '50%'
                            }}></span>
                          </label>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {tasks.length > tasksPerPage && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '13.5px', fontWeight: '650' }}>
                Showing {((taskPage - 1) * tasksPerPage) + 1} to {Math.min(taskPage * tasksPerPage, tasks.length)} of {tasks.length} entries
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button disabled={taskPage === 1} onClick={() => setTaskPage(taskPage - 1)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: taskPage === 1 ? '#f8fafc' : '#fff', color: taskPage === 1 ? '#94a3b8' : '#334155', fontWeight: '700', cursor: taskPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}>Previous</button>
                <button disabled={taskPage * tasksPerPage >= tasks.length} onClick={() => setTaskPage(taskPage + 1)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: taskPage * tasksPerPage >= tasks.length ? '#f8fafc' : '#fff', color: taskPage * tasksPerPage >= tasks.length ? '#94a3b8' : '#334155', fontWeight: '700', cursor: taskPage * tasksPerPage >= tasks.length ? 'not-allowed' : 'pointer', fontSize: '13px' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🌟 View Summary Modal (Executive Minimalist & Ultra-Professional UI) */}
      {viewingTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '16px', width: '480px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #cbd5e1', position: 'relative', fontFamily: 'Calibri, sans-serif' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Task Details</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '20px', fontWeight: '850', letterSpacing: '-0.3px' }}>{viewingTask.task_name}</h3>
              </div>
              <button 
                onClick={() => setViewingTask(null)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '18px', fontWeight: '600', padding: '4px' }}
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content List (Clean Corporate Table Layout) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px', color: '#334155' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>Priority Level</span>
                <span style={{ color: '#0f172a', fontWeight: '800', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
                  {viewingTask.priority}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>Workspace</span>
                <span style={{ color: '#0f172a', fontWeight: '750' }}>{viewingTask.workspace}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>Assigned To</span>
                <span style={{ color: '#0f172a', fontWeight: '750' }}>{viewingTask.assigned_to}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>Current Status</span>
                <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '12.5px' }}>
                  {viewingTask.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>Assign Date</span>
                <span style={{ color: '#0f172a', fontWeight: '750' }}>
                  {viewingTask.task_assign_date ? new Date(viewingTask.task_assign_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontWeight: '700' }}>End Date</span>
                <span style={{ color: '#0f172a', fontWeight: '750' }}>
                  {viewingTask.task_end_date ? new Date(viewingTask.task_end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>

            </div>

            {/* Modal Footer Button */}
            <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <button 
                onClick={() => setViewingTask(null)}
                style={{ width: '100%', padding: '11px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13.5px', letterSpacing: '0.3px', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  </div>
)}





        
         
         


       {/* 🌟 REAL DATA INVOICE MANAGEMENT TAB */}
        {activeTab === 'invoice' && (
          <div style={{ fontFamily: 'Calibri, sans-serif', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {invoiceView === 'list' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>Invoice Management</h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Track, manage and download all tenant invoices</p>
                  </div>
                </div>

                {/* 3 Stat Summary Cards with Dynamic Amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '12px', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL INVOICES</span>
                      <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '6px 0 2px 0', fontSize: window.innerWidth < 768 ? '20px' : '26px' }}>{totalInvoicesCount}</h3>
                      <small style={{ color: '#94a3b8', fontSize: '11px' }}>All time invoices</small>
                    </div>
                    <div style={{ width: window.innerWidth < 768 ? '36px' : '42px', height: window.innerWidth < 768 ? '36px' : '42px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '12px', fontWeight: '700', textTransform: 'uppercase' }}>PAID INVOICES</span>
                      <h3 style={{ fontWeight: '800', color: '#10b981', margin: '6px 0 2px 0', fontSize: window.innerWidth < 768 ? '18px' : '26px' }}>₹{calculatedPaidAmount.toFixed(2)}</h3>
                      <small style={{ color: '#10b981', fontSize: window.innerWidth < 768 ? '11px' : '12px', fontWeight: '600' }}>{paidInvoicesCount} Paid Tenants</small>
                    </div>
                    <div style={{ width: window.innerWidth < 768 ? '36px' : '42px', height: window.innerWidth < 768 ? '36px' : '42px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gridColumn: window.innerWidth < 768 ? 'span 2' : 'auto' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '12px', fontWeight: '700', textTransform: 'uppercase' }}>PENDING INVOICES</span>
                      <h3 style={{ fontWeight: '800', color: '#f59e0b', margin: '6px 0 2px 0', fontSize: window.innerWidth < 768 ? '18px' : '26px' }}>₹{calculatedPendingAmount.toFixed(2)}</h3>
                      <small style={{ color: '#f59e0b', fontSize: window.innerWidth < 768 ? '11px' : '12px', fontWeight: '600' }}>{pendingInvoicesCount} Pending Tenants</small>
                    </div>
                    <div style={{ width: window.innerWidth < 768 ? '36px' : '42px', height: window.innerWidth < 768 ? '36px' : '42px', backgroundColor: '#fffbeb', color: '#f59e0b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '14px' : '16px 20px', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', width: window.innerWidth < 768 ? '100%' : 'auto', flex: 1 }}>
                    <div style={{ position: 'relative', width: window.innerWidth < 768 ? '100%' : '240px' }}>
                      <span style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8', fontSize: '13px' }}>🔍</span>
                      <input 
                        type="text" 
                        placeholder="Search invoices..." 
                        value={invoiceSearch}
                        onChange={(e) => { setInvoiceSearch(e.target.value); setInvoicePage(1); }}
                        style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <select 
                      value={invoiceTenantFilter}
                      onChange={(e) => { setInvoiceTenantFilter(e.target.value); setInvoicePage(1); }}
                      style={{ width: window.innerWidth < 768 ? '100%' : 'auto', padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '13.5px', color: '#334155', fontWeight: '600' }}
                    >
                      <option value="All">All Tenants</option>
                      {tenants.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                    <select 
                      value={invoiceStatusFilter}
                      onChange={(e) => { setInvoiceStatusFilter(e.target.value); setInvoicePage(1); }}
                      style={{ width: window.innerWidth < 768 ? '100%' : 'auto', padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '13.5px', color: '#334155', fontWeight: '600' }}
                    >
                      <option value="All">All Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Invoices Table */}
                <div style={{ backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                  {(() => {
                    const filteredInvoicesList = tenants.filter((t, index) => {
                      const status = getTenantStatus(t.id, t.name, index);
                      const matchesStatus = invoiceStatusFilter === 'All' || status.toLowerCase() === invoiceStatusFilter.toLowerCase();
                      const matchesTenant = invoiceTenantFilter === 'All' || t.name.toLowerCase() === invoiceTenantFilter.toLowerCase();
                      const matchesSearch = !invoiceSearch || t.name.toLowerCase().includes(invoiceSearch.toLowerCase()) || `INV-2026-001${99 - index}`.toLowerCase().includes(invoiceSearch.toLowerCase());
                      return matchesStatus && matchesTenant && matchesSearch;
                    });

                    const totalInvoicePages = Math.ceil(filteredInvoicesList.length / invoicePerPage) || 1;
                    const currentInvoicesPageList = filteredInvoicesList.slice((invoicePage - 1) * invoicePerPage, invoicePage * invoicePerPage);

                    if (filteredInvoicesList.length === 0) {
                      return <p style={{ color: '#64748b', textAlign: 'center', padding: '50px' }}>No invoices found matching your search or filter.</p>;
                    }

                    return (
                      <>
                        <div style={{ overflowX: 'auto', width: '100%', minHeight: '280px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '550px' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Invoice ID</th>
                                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Tenant / Workspace</th>
                                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Month</th>
                                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Amount (₹)</th>
                                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Status</th>
                                <th style={{ padding: '14px 16px', fontWeight: '700' }}>Payment Date</th>
                                <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentInvoicesPageList.map((t, index) => {
                                const realIndex = tenants.findIndex(item => item.id === t.id);
                                const isEven = index % 2 === 0;
                                const status = getTenantStatus(t.id, t.name, realIndex);
                                const statusBg = status === 'Paid' ? '#ecfdf5' : '#fffbeb';
                                const statusColor = status === 'Paid' ? '#047857' : '#b45309';
                                const invId = `INV-2026-001${99 - realIndex}`;
                                // const realTenantAmount = allTenantsOrdersMap[t.id] !== undefined ? allTenantsOrdersMap[t.id] : (t.seats ? parseInt(t.seats) * 180 : 0);
                                const realTenantAmount = allTenantsOrdersMap[t.name] !== undefined ? allTenantsOrdersMap[t.name] : 0;
                                const currentMonthName = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
                                
                                const savedDates = JSON.parse(localStorage.getItem('tenant_payment_dates') || '{}');
                                if (status === 'Paid' && !savedDates[t.id]) {
                                  savedDates[t.id] = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                  localStorage.setItem('tenant_payment_dates', JSON.stringify(savedDates));
                                } else if (status === 'Pending') {
                                  delete savedDates[t.id];
                                  localStorage.setItem('tenant_payment_dates', JSON.stringify(savedDates));
                                }
                                const paymentDateVal = savedDates[t.id] || '—';
                                const isChecked = status === 'Paid';

                                return (
                                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isEven ? '#fff' : '#f8fafc' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#2563eb' }}>{invId}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                      <span style={{ fontWeight: '700', color: '#1e293b', display: 'block' }}>{t.name}</span>
                                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>{t.workspace || 'Workspace 1'}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '600' }}>{currentMonthName}</td>
                                    <td style={{ padding: '14px 16px', fontWeight: '800', color: '#1e293b' }}>₹{realTenantAmount.toFixed(2)}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                      <span style={{ backgroundColor: statusBg, color: statusColor, padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        ● {status}
                                      </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: status === 'Paid' ? '#334155' : '#94a3b8', fontSize: '13px' }}>{paymentDateVal}</td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                                        <button 
                                          onClick={() => handleOpenViewOrder(t.name)} 
                                          style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }} 
                                          title="View Details"
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                        
                                        <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '18px', cursor: 'pointer', margin: 0 }} title={isChecked ? "Mark as Pending" : "Mark as Paid"}>
                                          <input 
                                            type="checkbox" 
                                            checked={isChecked} 
                                            onChange={(e) => {
                                              const newSt = e.target.checked ? 'Paid' : 'Pending';
                                              handleUpdateInvoiceStatus(t.id, t.name, '2026-08', newSt);
                                            }} 
                                            style={{ opacity: 0, width: 0, height: 0 }} 
                                          />
                                          <span style={{
                                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: isChecked ? '#2563eb' : '#cbd5e1',
                                            borderRadius: '20px', transition: '0.3s'
                                          }}>
                                            <span style={{
                                              position: 'absolute', content: '""', height: '12px', width: '12px', left: isChecked ? '21px' : '3px', bottom: '3px',
                                              backgroundColor: 'white', borderRadius: '50%', transition: '0.3s'
                                            }}></span>
                                          </span>
                                        </label>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
                          <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                            Showing {filteredInvoicesList.length > 0 ? (invoicePage - 1) * invoicePerPage + 1 : 0} to {Math.min(invoicePage * invoicePerPage, filteredInvoicesList.length)} of {filteredInvoicesList.length} invoices
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                disabled={invoicePage === 1} 
                                onClick={() => setInvoicePage(prev => Math.max(prev - 1, 1))}
                                style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: invoicePage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                              >
                                ‹
                              </button>
                              {Array.from({ length: totalInvoicePages }, (_, i) => i + 1).map(pNum => (
                                <button 
                                  key={pNum}
                                  onClick={() => setInvoicePage(pNum)}
                                  style={{ padding: '5px 10px', borderRadius: '6px', border: invoicePage === pNum ? 'none' : '1px solid #cbd5e1', backgroundColor: invoicePage === pNum ? '#2563eb' : '#fff', color: invoicePage === pNum ? '#fff' : '#334155', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                  {pNum}
                                </button>
                              ))}
                              <button 
                                disabled={invoicePage >= totalInvoicePages} 
                                onClick={() => setInvoicePage(prev => Math.min(prev + 1, totalInvoicePages))}
                                style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: invoicePage >= totalInvoicePages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                              >
                                ›
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>
                      Invoice Details: <span style={{ color: '#2563eb' }}>{activeTenantName}</span>
                    </h3>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700' }}>
                      Active Tenant
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600', fontSize: '13px', background: '#fff' }}
                    >
                      <option value="all">📅 All Months</option>
                      {availableMonths.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>

                    <button 
                      onClick={handleSendInvoice}
                      style={{ padding: '8px 14px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      📤 Send
                    </button>

                    <button 
                      onClick={() => setInvoiceView('list')} 
                      style={{ padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      ← Back
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Total Orders</span>
                      <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '4px 0 2px 0', fontSize: '22px' }}>{selectedTenantOrders.length}</h3>
                      <small style={{ color: '#94a3b8', fontSize: '11px' }}>All time</small>
                    </div>
                    <div style={{ width: '38px', height: '38px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Total Items</span>
                      <h3 style={{ fontWeight: '800', color: '#10b981', margin: '4px 0 2px 0', fontSize: '22px' }}>{totalTenantItemsCount}</h3>
                      <small style={{ color: '#94a3b8', fontSize: '11px' }}>All time</small>
                    </div>
                    <div style={{ width: '38px', height: '38px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Total Bill</span>
                      <h3 style={{ fontWeight: '800', color: '#f59e0b', margin: '4px 0 2px 0', fontSize: '22px' }}>₹{totalMonthlyBill}</h3>
                      <small style={{ color: '#94a3b8', fontSize: '11px' }}>All time</small>
                    </div>
                    <div style={{ width: '38px', height: '38px', backgroundColor: '#fffbeb', color: '#f59e0b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: '18px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>Avg. Order</span>
                      <h3 style={{ fontWeight: '800', color: '#9333ea', margin: '4px 0 2px 0', fontSize: '22px' }}>₹{avgOrderValue}</h3>
                      <small style={{ color: '#94a3b8', fontSize: '11px' }}>All time</small>
                    </div>
                    <div style={{ width: '38px', height: '38px', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No orders found for the selected period.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredOrders.map((ord, idx) => {
                      const itemsList = ord.items ? ord.items.split(',').map(i => i.trim()) : [];
                      const orderIdStr = `ORD-2026-${String(999 - idx).padStart(5, '0')}`;
                      const isOrderExpanded = !!expandedOrdersMap[ord.id || idx];

                      return (
                        <div 
                          key={ord.id || idx} 
                          onClick={() => setExpandedOrdersMap(prev => ({ ...prev, [ord.id || idx]: !prev[ord.id || idx] }))}
                          style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', overflow: 'hidden', cursor: 'pointer' }}
                        >
                          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              </div>
                              <div>
                                <span style={{ display: 'block', fontWeight: '700', color: '#1e293b', fontSize: '13.5px' }}>{ord.order_date || 'Wed, 12 Aug 2026'}</span>
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Workspace Order</span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: window.innerWidth < 768 ? '15px' : '30px' }}>
                              <div>
                                <span style={{ display: 'block', fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Order ID</span>
                                <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#2563eb' }}>{orderIdStr}</span>
                              </div>
                              <div>
                                <span style={{ display: 'block', fontSize: '10.5px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Amount</span>
                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>₹{ord.total_amount}</span>
                              </div>
                              <span style={{ fontSize: '14px', color: '#64748b', transform: isOrderExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▼</span>
                            </div>
                          </div>

                          {isOrderExpanded && (
                            <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#f8fafc', padding: '14px 20px', borderTop: '1px solid #e2e8f0', cursor: 'default' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                <thead>
                                  <tr style={{ color: '#64748b', borderBottom: '1px solid #cbd5e1' }}>
                                    <th style={{ paddingBottom: '6px', fontWeight: '700' }}>Item Name</th>
                                    <th style={{ paddingBottom: '6px', fontWeight: '700' }}>Qty</th>
                                    <th style={{ paddingBottom: '6px', fontWeight: '700', textAlign: 'right' }}>Total (₹)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {itemsList.map((itemStr, iIdx) => {
                                    let cleanName = itemStr;
                                    let itemTotal = 0;
                                    const match = itemStr.match(/^(.*?)\s*\(₹([\d.]+)\s*x\s*(\d+)\s*=\s*₹([\d.]+)\)$/);
                                    if (match) {
                                      cleanName = match[1].trim();
                                      itemTotal = parseFloat(match[4]);
                                    } else {
                                      itemTotal = parseFloat(ord.total_amount) / itemsList.length;
                                    }

                                    return (
                                      <tr key={iIdx} style={{ borderBottom: iIdx !== itemsList.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                        <td style={{ padding: '8px 0', fontWeight: '600', color: '#1e293b' }}>{cleanName}</td>
                                        <td style={{ padding: '8px 0', color: '#334155' }}>1</td>
                                        <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: '700', color: '#1e293b' }}>{itemTotal.toFixed(2)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

       {/* Notice Tab */}
        {activeTab === 'notice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
            
            {/* Top Header Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>Notice Management</h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Dashboard › Notices</p>
              </div>
            </div>

            {/* Top Banner Card & Summary Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr 1fr 1fr', gap: '15px' }}>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '18px' : '24px 30px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px', boxSizing: 'border-box' }}>
                <div style={{ width: window.innerWidth < 768 ? '40px' : '50px', height: window.innerWidth < 768 ? '40px' : '50px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: window.innerWidth < 768 ? '20px' : '24px', flexShrink: 0 }}>📢</div>
                <div>
                  <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '15px' : '18px' }}>Smart Communication, Strong Community</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Use broadcast to send announcements to all tenants or send direct notices to specific tenants.</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxSizing: 'border-box' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>👥</div>
                <div>
                  <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '20px' }}>{tenants.length}</h4>
                  <span style={{ color: '#64748b', fontSize: '10.5px', fontWeight: '600', textTransform: 'uppercase' }}>Total Tenants</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxSizing: 'border-box' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📤</div>
                <div>
                  <h4 style={{ fontWeight: '800', color: '#10b981', margin: '0 0 2px 0', fontSize: '20px' }}>{noticesList.length}</h4>
                  <span style={{ color: '#64748b', fontSize: '10.5px', fontWeight: '600', textTransform: 'uppercase' }}>Broadcasts Sent</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', boxSizing: 'border-box' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#fff7ed', color: '#f97316', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>✉️</div>
                <div>
                  <h4 style={{ fontWeight: '800', color: '#f97316', margin: '0 0 2px 0', fontSize: '20px' }}>{separateNoticesList.length}</h4>
                  <span style={{ color: '#64748b', fontSize: '10.5px', fontWeight: '600', textTransform: 'uppercase' }}>Direct Notices</span>
                </div>
              </div>
            </div>

            {/* Forms Row: Broadcast & Direct Notice */}
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '25px' }}>
              
              {/* Broadcast Form */}
              <div style={{ width: '100%', flex: '1', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', background: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📢</div>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '17px' }}>Broadcast to All Tenants</h4>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Send an announcement to all active tenants instantly.</p>
                  
                  <form onSubmit={handlePublishNotice}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#475569', marginBottom: '6px' }}>Announcement Message</label>
                      <div style={{ position: 'relative' }}>
                        <textarea 
                          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', height: '100px', fontSize: '13.5px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif', outline: 'none' }}
                          placeholder="Type your announcement here..."
                          value={noticeText}
                          onChange={(e) => setNoticeText(e.target.value)}
                          maxLength={1000}
                          required
                        ></textarea>
                        <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '11px', color: '#94a3b8' }}>{noticeText.length}/1000</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px' }}>ℹ️</span>
                      <small style={{ color: '#166534', fontSize: '12px', fontWeight: '600' }}>This message will be visible to all active tenants immediately.</small>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(79,70,229,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span>📤</span> Publish Broadcast
                    </button>
                  </form>
                </div>
              </div>

              {/* Direct Tenant Notice Form */}
              <div style={{ width: '100%', flex: '1', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', background: '#ecfdf5', color: '#10b981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✉️</div>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '17px' }}>Direct Tenant Notice</h4>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Send a private and confidential notice to a selected tenant.</p>
                  
                  <form onSubmit={handleSendSeparateNotice}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#475569', marginBottom: '6px' }}>Select Tenant</label>
                      <select 
                        style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif', boxSizing: 'border-box', outline: 'none' }}
                        value={targetTenant}
                        onChange={(e) => setTargetTenant(e.target.value)}
                        required
                      >
                        <option value="">-- Choose Tenant --</option>
                        {tenants.map(t => (
                          <option key={t.id} value={t.name}>{t.name} (@{t.username})</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '12.5px', color: '#475569', marginBottom: '6px' }}>Private Message</label>
                      <div style={{ position: 'relative' }}>
                        <textarea 
                          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', height: '65px', fontSize: '13.5px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif', outline: 'none' }}
                          placeholder="Type your private message here..."
                          value={separateNoticeText}
                          onChange={(e) => setSeparateNoticeText(e.target.value)}
                          maxLength={1000}
                          required
                        ></textarea>
                        <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '11px', color: '#94a3b8' }}>{separateNoticeText.length}/1000</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <span style={{ fontSize: '13px' }}>🔒</span>
                      <small style={{ color: '#065f46', fontSize: '12px', fontWeight: '600' }}>This message will be sent privately to the selected tenant.</small>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(5,150,105,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span>✉️</span> Send Private Notice
                    </button>
                  </form>
                </div>
              </div>

            </div>

            {/* Recent Notices Table Card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', overflow: 'hidden' }}>
              <div style={{ padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: '17px' }}>Recent Notices</h4>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12.5px' }}>View and manage all recently sent broadcast and direct notices.</p>
                </div>
              </div>

              {combinedNoticesList.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No notices published yet.</p>
              ) : (
                <div style={{ overflowX: 'auto', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '550px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Type</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Message</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Recipient</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Sent By</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Date & Time</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Status</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentNoticesPageList.map((n, index) => {
                        const isEven = index % 2 === 0;
                        const typeVal = (n.notice_type || '').toLowerCase();
                        const isBroadcast = typeVal === 'broadcast' || typeVal === 'announcement';
                        return (
                          <tr key={n.id || index} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isEven ? '#fff' : '#f8fafc' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ backgroundColor: isBroadcast ? '#eff6ff' : '#ecfdf5', color: isBroadcast ? '#2563eb' : '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '11.5px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {isBroadcast ? '📢 Broadcast' : '✉️ Direct'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', color: '#1e293b', fontWeight: '600', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {n.message}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '600' }}>{n.recipient || 'All Tenants'}</td>
                            <td style={{ padding: '14px 16px', color: '#64748b' }}>Admin</td>
                            <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{n.date_sent || n.date || '13 Aug 2026, 12:00 PM'}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>
                                Delivered
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <button style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer', color: '#334155', fontWeight: 'bold' }} title="Options">⋮</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                  Showing {combinedNoticesList.length > 0 ? (noticePage - 1) * noticePerPage + 1 : 0} to {Math.min(noticePage * noticePerPage, combinedNoticesList.length)} of {combinedNoticesList.length} notices
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      disabled={noticePage === 1} 
                      onClick={() => setNoticePage(prev => Math.max(prev - 1, 1))}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: noticePage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalNoticePages }, (_, i) => i + 1).map(pNum => (
                      <button 
                        key={pNum}
                        onClick={() => setNoticePage(pNum)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: noticePage === pNum ? 'none' : '1px solid #cbd5e1', backgroundColor: noticePage === pNum ? '#2563eb' : '#fff', color: noticePage === pNum ? '#fff' : '#334155', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {pNum}
                      </button>
                    ))}
                    <button 
                      disabled={noticePage >= totalNoticePages} 
                      onClick={() => setNoticePage(prev => Math.min(prev + 1, totalNoticePages))}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: noticePage >= totalNoticePages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

       {/* Complaints Tab (Redesigned with Detailed View matching target UI) */}
        {activeTab === 'complaints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
            
            {/* If a specific complaint is selected for View, show the detailed view matching the target UI */}
            {selectedComplaint ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Breadcrumb & Back Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>Complaint Details</h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Dashboard › Complaints › Complaint Details</p>
                  </div>
                  {/* <button 
                    onClick={handleDownloadBill} 
                    style={{ padding: '8px 14px', backgroundColor: '#fff', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    📥 Download / Print
                  </button> */}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button 
                    onClick={() => setSelectedComplaint(null)} 
                    style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ← Back to Complaints
                  </button>
                </div>

                {/* Top Banner Card matching target reference layout with proper spacing */}
                <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '18px' : '25px 30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: window.innerWidth < 768 ? '44px' : '55px', height: window.innerWidth < 768 ? '44px' : '55px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0', fontSize: window.innerWidth < 768 ? '16px' : '20px' }}>{selectedComplaint.subject}</h4>
                      <div style={{ display: 'flex', gap: window.innerWidth < 768 ? '15px' : '25px', flexWrap: 'wrap', color: '#64748b', fontSize: '13px', alignItems: 'center' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>Complaint ID</span>
                          <strong style={{ color: '#1e293b' }}>#CMP-{selectedComplaint.id}</strong>
                        </div>
                        <div style={{ borderLeft: window.innerWidth < 768 ? 'none' : '1px solid #e2e8f0', paddingLeft: window.innerWidth < 768 ? '0' : '25px' }}>
                          <span style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>Category</span>
                          <strong style={{ color: '#1e293b' }}>{selectedComplaint.subject}</strong>
                        </div>
                        <div style={{ borderLeft: window.innerWidth < 768 ? 'none' : '1px solid #e2e8f0', paddingLeft: window.innerWidth < 768 ? '0' : '25px' }}>
                          <span style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>Tenant</span>
                          <strong style={{ color: '#2563eb' }}>{selectedComplaint.tenant_name}</strong>
                        </div>
                        <div style={{ borderLeft: window.innerWidth < 768 ? 'none' : '1px solid #e2e8f0', paddingLeft: window.innerWidth < 768 ? '0' : '25px' }}>
                          <span style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '2px' }}>Workspace</span>
                          <strong style={{ color: '#1e293b' }}>{selectedComplaint.workspace || 'Workspace 1'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', backgroundColor: selectedComplaint.status === 'Solved' ? '#ecfdf5' : '#fffbeb', color: selectedComplaint.status === 'Solved' ? '#047857' : '#b45309' }}>
                      ● {selectedComplaint.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Main Two-Column Layout */}
                <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '25px', alignItems: 'flex-start' }}>
                  
                  {/* Left Column: Description & Timeline */}
                  <div style={{ width: '100%', flex: '2', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
                    
                    {/* Description Card */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0', fontSize: '15px' }}>Complaint Description</h5>
                      <p style={{ color: '#475569', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{selectedComplaint.message}</p>
                    </div>

                    {/* Activity Timeline Card */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 18px 0', fontSize: '15px' }}>Activity Timeline</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderLeft: '2px solid #e2e8f0', marginLeft: '10px', paddingLeft: '20px' }}>
                        
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '2px solid #fff' }}></span>
                          <strong style={{ display: 'block', color: '#1e293b', fontSize: '13.5px' }}>Complaint Raised</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Raised by {selectedComplaint.tenant_name}</span>
                          <span style={{ float: window.innerWidth < 768 ? 'none' : 'right', display: window.innerWidth < 768 ? 'block' : 'inline', fontSize: '11.5px', color: '#94a3b8' }}>{selectedComplaint.date_raised || '13 Aug 2026'}</span>
                        </div>

                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb', border: '2px solid #fff' }}></span>
                          <strong style={{ display: 'block', color: '#1e293b', fontSize: '13.5px' }}>Complaint Assigned</strong>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Assigned to: Facility Team</span>
                        </div>

                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-27px', top: '2px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedComplaint.status === 'Solved' ? '#10b981' : '#f59e0b', border: '2px solid #fff' }}></span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <strong style={{ color: '#1e293b', fontSize: '13.5px' }}>Status Updated</strong>
                            <span style={{ backgroundColor: selectedComplaint.status === 'Solved' ? '#ecfdf5' : '#fffbeb', color: selectedComplaint.status === 'Solved' ? '#047857' : '#b45309', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                              {selectedComplaint.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Right Column: Information & Actions */}
                  <div style={{ width: '100%', flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
                    
                    {/* Complaint Info Card */}
                    <div style={{ backgroundColor: '#fff', padding: '22px 24px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 14px 0', fontSize: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Complaint Information</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Complaint ID</span><strong style={{ color: '#1e293b' }}>#CMP-{selectedComplaint.id}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Status</span><strong style={{ color: selectedComplaint.status === 'Solved' ? '#10b981' : '#f59e0b' }}>{selectedComplaint.status || 'Pending'}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Category</span><strong style={{ color: '#1e293b' }}>{selectedComplaint.subject}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Tenant</span><strong style={{ color: '#1e293b' }}>{selectedComplaint.tenant_name}</strong></div>
                      </div>
                    </div>

                    {/* Actions Card */}
                    <div style={{ backgroundColor: '#fff', padding: '22px 24px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                      <h5 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 14px 0', fontSize: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Actions</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, 'In Progress')} style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>▷ Mark as In Progress</button>
                        <button onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, 'Solved')} style={{ width: '100%', padding: '10px', backgroundColor: '#fff', color: '#2563eb', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>✓ Mark as Solved</button>
                        <button onClick={() => setSelectedComplaint(null)} style={{ width: '100%', padding: '10px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>⊗ Close Complaint</button>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <>
                {/* Top Header & Breadcrumb */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>Complaints</h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Dashboard › Complaints</p>
                  </div>
                </div>

                {/* Top 3 Summary Cards with SVG Icons */}
                <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: window.innerWidth < 768 ? '38px' : '48px', height: window.innerWidth < 768 ? '38px' : '48px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>{totalComplaintsCount}</h3>
                      <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Total Complaints</span>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: window.innerWidth < 768 ? '38px' : '48px', height: window.innerWidth < 768 ? '38px' : '48px', backgroundColor: '#fffbeb', color: '#f59e0b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '800', color: '#f59e0b', margin: '0 0 2px 0', fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>{pendingComplaintsCount}</h3>
                      <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Pending</span>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px', gridColumn: window.innerWidth < 768 ? 'span 2' : 'auto' }}>
                    <div style={{ width: window.innerWidth < 768 ? '38px' : '48px', height: window.innerWidth < 768 ? '38px' : '48px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: '800', color: '#10b981', margin: '0 0 2px 0', fontSize: window.innerWidth < 768 ? '18px' : '24px' }}>{solvedComplaintsCount}</h3>
                      <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Solved</span>
                    </div>
                  </div>
                </div>

                {/* Complaints List Card Container */}
                <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '18px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: window.innerWidth < 768 ? '17px' : '18px' }}>Complaints List</h4>
                    {/* <button 
                      onClick={fetchAdminComplaints} 
                      style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🔄 Refresh
                    </button> */}
                  </div>

                  {/* Search & Filter Bar */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                      <span style={{ position: 'absolute', top: '10px', left: '12px', color: '#94a3b8', fontSize: '13px' }}>🔍</span>
                      <input 
                        type="text" 
                        placeholder="Search complaints..." 
                        value={complaintSearch}
                        onChange={(e) => { setComplaintSearch(e.target.value); setComplaintPage(1); }}
                        style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Complaints Table */}
                  {filteredComplaints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                      <p style={{ margin: 0, fontSize: '15px' }}>No complaints or support tickets found.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '550px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Tenant</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Subject / Issue</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Message Details</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Raised On</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentComplaintsPageList.map((comp, idx) => {
                            const isEven = idx % 2 === 0;
                            const isSolved = comp.status === 'Solved';

                            return (
                              <tr key={comp.id || idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isEven ? '#fff' : '#f8fafc' }}>
                                <td style={{ padding: '12px 14px' }}>
                                  <span style={{ fontWeight: '700', color: '#1e293b', display: 'block' }}>{comp.tenant_name}</span>
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>Workspace Client</span>
                                </td>
                                <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1e293b' }}>{comp.subject}</td>
                                <td style={{ padding: '12px 14px', color: '#475569', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.message}</td>
                                <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '13px' }}>{comp.date_raised || '13 Aug 2026'}</td>
                                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                  <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 'bold', backgroundColor: isSolved ? '#ecfdf5' : '#fffbeb', color: isSolved ? '#047857' : '#b45309' }}>
                                    {isSolved ? 'Solved ✓' : 'Pending ⏳'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                  <button 
                                    onClick={() => setSelectedComplaint(comp)} 
                                    style={{ padding: '5px 12px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                                  >
                                    👁️ View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', flexWrap: 'wrap', gap: '15px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                      Showing {filteredComplaints.length > 0 ? (complaintPage - 1) * complaintPerPage + 1 : 0} to {Math.min(complaintPage * complaintPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints
                    </span>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        disabled={complaintPage === 1} 
                        onClick={() => setComplaintPage(prev => Math.max(prev - 1, 1))}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: complaintPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                      >
                        ‹
                      </button>
                      {Array.from({ length: totalComplaintPages }, (_, i) => i + 1).map(pNum => (
                        <button 
                          key={pNum}
                          onClick={() => setComplaintPage(pNum)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: complaintPage === pNum ? 'none' : '1px solid #cbd5e1', backgroundColor: complaintPage === pNum ? '#2563eb' : '#fff', color: complaintPage === pNum ? '#fff' : '#334155', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {pNum}
                        </button>
                      ))}
                      <button 
                        disabled={complaintPage >= totalComplaintPages} 
                        onClick={() => setComplaintPage(prev => Math.min(prev + 1, totalComplaintPages))}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: complaintPage >= totalComplaintPages ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                      >
                        ›
                      </button>
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        )}
        {/* 🌟 Meeting Room Dashboard Tab */}
        {activeTab === 'meeting' && (
          <div>
            {bookView === 'dashboard' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif' }}>
                
                {/* Top Header & Book Room Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: '24px' }}>Meeting Room Dashboard</h3>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Overview of rooms and real tenant/admin bookings</p>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedDetailBooking(null);
                      setSelectedWsForBook('');
                      setSelectedRmForBook('');
                      setPurposeText('');
                      const currentAdminComp = (typeof adminCompany !== 'undefined' && adminCompany) ? adminCompany : ((typeof companyName !== 'undefined' && companyName) ? companyName : 'HCL');
                      setTenantNameInput(currentAdminComp);
                      setBookingFormDate(new Date().toISOString().split('T')[0]);
                      setSelectedSlotForBook('10:00 AM - 11:30 AM');
                      setBookView('form');
                    }}
                    style={{ padding: '11px 22px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>➕</span> Book Room
                  </button>
                </div>

                {/* Top Summary Cards */}
                {(() => {
                  const totalRoomsCount = workspaces.reduce((acc, ws) => acc + (ws.meetings ? ws.meetings.split(',').filter(Boolean).length : 0), 0);
                  const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const currentTimeFormatted = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                      <div style={{ backgroundColor: '#fff', padding: '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🚪</div>
                        <div>
                          <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '26px' }}>{totalRoomsCount}</h3>
                          <span style={{ color: '#64748b', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Total Rooms</span>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Across all workspaces</div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#fff', padding: '22px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>📅</div>
                        <div>
                          <h3 style={{ fontWeight: '800', color: '#2563eb', margin: '0 0 2px 0', fontSize: '20px' }}>{todayFormatted}</h3>
                          <span style={{ color: '#64748b', fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Today's Schedule Date</span>
                          <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>🕒 Current Time: {currentTimeFormatted}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Middle Section: Overview & Calendar */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'flex-start' }}>
                  
                  {/* Meeting Rooms Overview Grid */}
                  <div style={{ backgroundColor: '#fff', padding: '25px 30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '18px' }}>Meeting Rooms Overview</h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                      {workspaces.flatMap(ws => {
                        if (!ws.meetings) return [];
                        return ws.meetings.split(',').map(m => m.trim()).filter(Boolean).map((rmStr, rIdx) => {
                          const match = rmStr.match(/^(.*?)\s*\((\d+)\)$/);
                          const roomName = match ? match[1].trim() : rmStr;
                          const cap = match ? match[2] : '6';

                          const matchingBooking = adminMeetings.find(m => {
                            let rName = String(m.room_name || m.room || '').toLowerCase();
                            let dStr = String(m.booking_date || m.date || '').trim();
                            if (dStr.includes('T')) dStr = dStr.split('T')[0];
                            return rName.includes(roomName.toLowerCase()) && dStr === selectedDateStr;
                          });

                          const isBookedForSelectedDate = !!matchingBooking;

                          let displayName = matchingBooking?.tenant_name;
                          if (matchingBooking) {
                            const adminUserField = String(matchingBooking.admin_username || matchingBooking.booked_by || '').trim();
                            const tenantField = String(matchingBooking.tenant_name || matchingBooking.company || '').trim();
                            const isActuallyAdmin = adminUserField !== '' && adminUserField.toLowerCase() !== 'tenant' && adminUserField.toLowerCase() !== 'null';
                            displayName = isActuallyAdmin ? 'Admin' : (tenantField || 'Tenant');
                          }

                          return (
                            <div key={`${ws.id}-${rIdx}`} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', borderLeft: `4px solid ${isBookedForSelectedDate ? '#ef4444' : '#2563eb'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div>
                                  <h5 style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0', fontSize: '15px' }}>{roomName}</h5>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>Capacity: {cap} | {ws.name}</span>
                                </div>
                                <span style={{ fontSize: '16px' }}>👥</span>
                              </div>
                              {isBookedForSelectedDate && (
                                <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '8px', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px' }}>
                                  👤 {displayName} <br />⏰ {matchingBooking.time_slot}
                                </div>
                              )}
                              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', backgroundColor: isBookedForSelectedDate ? '#fef2f2' : '#eff6ff', color: isBookedForSelectedDate ? '#b91c1c' : '#2563eb' }}>
                                  {isBookedForSelectedDate ? 'In Use (Booked)' : 'Available'}
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })}
                    </div>
                  </div>

                  {/* Calendar Widget (Fixed 13th highlight bug by strictly checking active selectedDateStr) */}
{(() => {
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDayIndex = getFirstDayOfMonth(calYear, calMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '18px' : '24px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '16px' }}>Booking Calendar</h4>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button 
            onClick={() => { 
              const today = new Date();
              setCalYear(today.getFullYear()); 
              setCalMonth(today.getMonth()); 
              setSelectedDateStr(today.toISOString().split('T')[0]); 
            }} 
            style={{ padding: '4px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#2563eb' }}
          >
            Today
          </button>
          <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); } }} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', fontSize: '12px', cursor: 'pointer' }}>‹</button>
          <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); } }} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', fontSize: '12px', cursor: 'pointer' }}>›</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontWeight: '700', fontSize: '14.5px', color: '#2563eb', margin: '2px 0' }}>{monthNames[calMonth]} {calYear}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '13px' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
          <span key={index} style={{ color: '#64748b', fontWeight: 'bold', fontSize: '11px', paddingBottom: '6px' }}>{d}</span>
        ))}

        {Array.from({ length: firstDayIndex }, (_, i) => (
          <div key={`empty-${i}`} style={{ padding: '8px 0' }}></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dayStr = String(day).padStart(2, '0');
          const monthStr = String(calMonth + 1).padStart(2, '0');
          const currentDayFormatted = `${calYear}-${monthStr}-${dayStr}`;
          
          // துல்லியமான ஒப்பீடு (Selected date மட்டும் ப்ளூ கலர் ஆகும்)
          const isSelected = currentDayFormatted === String(selectedDateStr).split('T')[0];
          
          const todayCheckStr = new Date().toISOString().split('T')[0];
          const isToday = currentDayFormatted === todayCheckStr;
          
          const adminBookingOnThisDay = adminMeetings.find(m => {
            let rawD = m.booking_date || m.date || '';
            let dStr = String(rawD).trim();
            if (dStr.includes('GMT')) {
              const parts = dStr.split(' ');
              if (parts.length >= 4) {
                const monthsMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
                dStr = `${parts[3]}-${monthsMap[parts[2]] || '01'}-${parts[1]}`;
              }
            } else {
              if (dStr.includes('T')) dStr = dStr.split('T')[0];
              dStr = dStr.split(' ')[0];
            }

            const tName = String(m.tenant_name || '').trim().toLowerCase();
            const aUser = String(m.admin_username || m.booked_by || '').trim().toLowerCase();
            const currentAdminComp = String(typeof adminCompany !== 'undefined' && adminCompany ? adminCompany : ((typeof companyName !== 'undefined' && companyName) ? companyName : '')).trim().toLowerCase();

            const isMyCompanyBooking = (currentAdminComp && tName === currentAdminComp) || (currentAdminComp && aUser === currentAdminComp) || tName === 'admin' || tName === 'hcl' || tName === 'tcs' || (aUser !== 'tenant' && aUser !== '' && aUser !== 'null');

            return dStr === currentDayFormatted && isMyCompanyBooking;
          });

          const hasAdminBooking = !!adminBookingOnThisDay;

          return (
            <div 
              key={day}
              onClick={() => {
                setSelectedDateStr(currentDayFormatted);
                if (adminBookingOnThisDay) {
                  setSelectedDetailBooking(adminBookingOnThisDay);
                  setIsCompleted(false);
                  setBookView('detail');
                }
              }}
              style={{ 
                padding: '8px 0', 
                borderRadius: '10px', 
                backgroundColor: isSelected ? '#2563eb' : 'transparent', 
                color: isSelected ? '#fff' : (isToday ? '#2563eb' : '#1e293b'), 
                fontWeight: isSelected || isToday ? 'bold' : 'normal', 
                border: isToday && !isSelected ? '2px solid #2563eb' : '1px solid transparent',
                position: 'relative', 
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {day}
              {hasAdminBooking && (
                <span style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', backgroundColor: isSelected ? '#fff' : '#ef4444', borderRadius: '50%' }} title="Admin Meeting Booked"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
})()}

                </div>

                {/* Bookings History Table */}
                {(() => {
                  const meetingPerPage = 6;
                  const totalMeetingPages = Math.ceil(adminMeetings.length / meetingPerPage) || 1;
                  const currentMeetingPageList = adminMeetings.slice((meetingPage - 1) * meetingPerPage, meetingPage * meetingPerPage);

                  return (
                    <div style={{ backgroundColor: '#fff', padding: '25px 30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '18px' }}>Meeting Room Bookings History & Schedule</h4>
                      </div>

                      {adminMeetings.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>No meeting rooms booked yet.</p>
                      ) : (
                        <>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                                  <th style={{ padding: '14px 16px', fontWeight: '700' }}>Tenant Name</th>
                                  <th style={{ padding: '14px 16px', fontWeight: '700' }}>Booking Date</th>
                                  <th style={{ padding: '14px 16px', fontWeight: '700' }}>Time Slot</th>
                                  <th style={{ padding: '14px 16px', fontWeight: '700' }}>Room</th>
                                  <th style={{ padding: '14px 16px', fontWeight: '700' }}>Purpose</th>
                                  <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'center' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentMeetingPageList.map((m, idx) => {
                                  const isEven = idx % 2 === 0;
                                  
                                  let cleanDateStr = '—';
                                  const rawDate = m.booking_date || m.date || m.meeting_date || m.created_at;
                                  
                                  if (rawDate) {
                                    const str = String(rawDate).trim();
                                    let dateOnly = str;
                                    if (str.includes('GMT')) {
                                      const parts = str.split(' ');
                                      if (parts.length >= 4) {
                                        const monthsMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
                                        const d = parts[1];
                                        const mStr = monthsMap[parts[2]] || '01';
                                        const y = parts[3];
                                        dateOnly = `${y}-${mStr}-${d}`;
                                      }
                                    } else {
                                      dateOnly = str.split('T')[0].split(' ')[0];
                                    }

                                    const p = dateOnly.split('-');
                                    if (p.length === 3) {
                                      const yr = p[0];
                                      const mn = parseInt(p[1], 10) - 1;
                                      const dy = parseInt(p[2], 10);
                                      const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                      if (!isNaN(mn) && !isNaN(dy) && mNames[mn]) {
                                        cleanDateStr = `${dy} ${mNames[mn]} ${yr}`;
                                      } else {
                                        cleanDateStr = dateOnly;
                                      }
                                    } else {
                                      cleanDateStr = dateOnly;
                                    }
                                  }

                                  const timeSlotVal = m.time_slot || m.slot || m.timing || m.time || '—';
                                  const roomVal = m.room_name || m.room || m.meeting_room || 'Conference Room';
                                  
                                  const adminUserField = String(m.admin_username || m.booked_by || '').trim();
                                  const tenantField = String(m.tenant_name || m.username || m.company || '').trim();
                                  const isActuallyAdmin = adminUserField !== '' && adminUserField.toLowerCase() !== 'tenant' && adminUserField.toLowerCase() !== 'null';
                                  const tenantVal = isActuallyAdmin ? 'Admin' : (tenantField || 'Tenant Client');

                                  const purposeVal = m.purpose || m.title || m.description || 'Meeting';

                                  return (
                                    <tr key={m.id || idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: isEven ? '#fff' : '#f8fafc' }}>
                                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#1e293b' }}>{tenantVal}</td>
                                      <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '600' }}>
                                        {cleanDateStr}
                                      </td>
                                      <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 'bold', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                                          🕒 {timeSlotVal}
                                        </span>
                                      </td>
                                      <td style={{ padding: '14px 16px', fontWeight: '600', color: '#2563eb' }}>{roomVal}</td>
                                      <td style={{ padding: '14px 16px', color: '#475569' }}>{purposeVal}</td>
                                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        <button 
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDetailBooking(m);
                                            setIsCompleted(false);
                                            setBookView('detail');
                                          }}
                                          style={{ padding: '5px 14px', backgroundColor: '#fff', color: '#2563eb', border: '1px solid #93c5fd', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                          View
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Pagination Footer */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '15px' }}>
                            <span style={{ color: '#64748b', fontSize: '12.5px', fontWeight: '600' }}>
                              Showing {adminMeetings.length > 0 ? (meetingPage - 1) * meetingPerPage + 1 : 0} to {Math.min(meetingPage * meetingPerPage, adminMeetings.length)} of {adminMeetings.length} bookings
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <button disabled={meetingPage === 1} onClick={() => setMeetingPage(prev => Math.max(prev - 1, 1))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>‹</button>
                              {Array.from({ length: totalMeetingPages }, (_, i) => i + 1).map(pNum => (
                                <button key={pNum} onClick={() => setMeetingPage(pNum)} style={{ padding: '4px 10px', borderRadius: '6px', border: meetingPage === pNum ? 'none' : '1px solid #cbd5e1', backgroundColor: meetingPage === pNum ? '#2563eb' : '#fff', color: meetingPage === pNum ? '#fff' : '#334155', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>{pNum}</button>
                              ))}
                              <button disabled={meetingPage >= totalMeetingPages} onClick={() => setMeetingPage(prev => Math.min(prev + 1, totalMeetingPages))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>›</button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

              </div>
            ) : bookView === 'detail' ? (
              /* 🌟 BOOKING DETAILS VIEW */
              (() => {
                let cleanDetailDate = '—';
                const rawDetailDate = selectedDetailBooking?.booking_date || selectedDetailBooking?.date || selectedDetailBooking?.meeting_date;
                
                if (rawDetailDate) {
                  const str = String(rawDetailDate).trim();
                  let dateOnly = str;
                  if (str.includes('GMT')) {
                    const parts = str.split(' ');
                    if (parts.length >= 4) {
                      const monthsMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
                      const d = parts[1];
                      const mStr = monthsMap[parts[2]] || '01';
                      const y = parts[3];
                      dateOnly = `${y}-${mStr}-${d}`;
                    }
                  } else {
                    dateOnly = str.split('T')[0].split(' ')[0];
                  }

                  const p = dateOnly.split('-');
                  if (p.length === 3) {
                    const yr = p[0];
                    const mn = parseInt(p[1], 10) - 1;
                    const dy = parseInt(p[2], 10);
                    const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    if (!isNaN(mn) && !isNaN(dy) && mNames[mn]) {
                      cleanDetailDate = `${dy} ${mNames[mn]} ${yr}`;
                    } else {
                      cleanDetailDate = dateOnly;
                    }
                  } else {
                    cleanDetailDate = dateOnly;
                  }
                }

                const timeSlotStr = selectedDetailBooking?.time_slot || selectedDetailBooking?.slot || selectedDetailBooking?.timing || selectedDetailBooking?.time || '10:00 AM - 11:30 AM';
                const rawDateForCalc = selectedDetailBooking?.booking_date || selectedDetailBooking?.date || '2026-08-14';
                
                let dateCleanForCalc = String(rawDateForCalc).split('T')[0].split(' ')[0];
                if (String(rawDateForCalc).includes('GMT')) {
                  const parts = String(rawDateForCalc).trim().split(' ');
                  if (parts.length >= 4) {
                    const monthsMap = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
                    const d = parts[1];
                    const mStr = monthsMap[parts[2]] || '01';
                    const y = parts[3];
                    dateCleanForCalc = `${y}-${mStr}-${d}`;
                  }
                }
                
                const startTimeString = timeSlotStr.split('-')[0].trim();
                const now = new Date();
                const meetingStartDateTime = new Date(`${dateCleanForCalc} ${startTimeString}`);
                const isStarted = now >= meetingStartDateTime;

                // 🌟 டேட்டாபேஸில் இருந்து வரும் 'Completed' அல்லது 'Solved' ஸ்டேட்டஸை அடிப்படையாகக் கொள்ளுதல்
                let currentStep = 2; 
                const rawStatus = (selectedDetailBooking?.status || '').toLowerCase();
                if (rawStatus === 'completed' || rawStatus === 'solved' || isCompleted) {
                  currentStep = 4; // Completed / Finished
                } else if (isStarted) {
                  currentStep = 3; 
                }

                const bookedByVal = String(selectedDetailBooking?.admin_username || selectedDetailBooking?.booked_by || '').trim();
                const tenantFieldVal = String(selectedDetailBooking?.tenant_name || selectedDetailBooking?.company || '').trim();
                
                const tNameLower = tenantFieldVal.toLowerCase();
                const cNameLower = String(typeof adminCompany !== 'undefined' && adminCompany ? adminCompany : ((typeof companyName !== 'undefined' && companyName) ? companyName : '')).trim().toLowerCase();
                const isActuallyAdmin = (bookedByVal !== '' && bookedByVal.toLowerCase() !== 'tenant' && bookedByVal.toLowerCase() !== 'null') || (cNameLower && tNameLower === cNameLower) || tNameLower === 'admin' || tNameLower === 'hcl' || tNameLower === 'tcs';
                
                const finalBookedByDisplay = isActuallyAdmin ? 'Admin' : (tenantFieldVal || 'Tenant');
                const specificRoomName = selectedDetailBooking?.room_name || selectedDetailBooking?.room || 'Meeting Room';

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'Calibri, sans-serif', color: '#1e293b' }}>
                    
                    {/* Top Header & Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                          onClick={() => setBookView('dashboard')} 
                          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold', color: '#2563eb' }}
                        >
                          ←
                        </button>
                        <div>
                          <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 2px 0', fontSize: '22px' }}>Booking Details</h3>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>View complete meeting room booking information</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {isActuallyAdmin ? (
                          <>
                            {isStarted && !isCompleted && (
                              <button 
                                onClick={() => setIsCompleted(true)}
                                style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.3)', transition: 'all 0.2s ease' }}
                              >
                                🚀 Proceed
                              </button>
                            )}
                            {!isCompleted && (
                              <button 
                                onClick={() => setIsCompleted(true)}
                                style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.3)', transition: 'all 0.2s ease' }}
                              >
                                ✅ Mark as Completed
                              </button>
                            )}
                          </>
                        ) : null}

                        {/* Edit Booking Button */}
                        <button 
                          onClick={() => {
                            setSelectedWsForBook(selectedDetailBooking?.workspace_name || workspaces[0]?.name || '');
                            setSelectedRmForBook(selectedDetailBooking?.room_name || '');
                            setPurposeText(selectedDetailBooking?.purpose || '');
                            setTenantNameInput(selectedDetailBooking?.tenant_name || adminCompany || companyName || 'HCL');
                            setBookingFormDate(dateCleanForCalc);
                            setSelectedSlotForBook(timeSlotStr);
                            setBookView('form');
                          }}
                          style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#2563eb', border: '1px solid #93c5fd', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                        >
                          ✏️ Edit Booking
                        </button>

                        {/* Cancel / Delete Booking Button */}
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete/cancel this meeting booking?')) {
                              try {
                                const bookingId = selectedDetailBooking?.id;
                                const res = await fetch(`http://localhost:5000/api/tenant/meeting-bookings/${bookingId}`, {
                                  method: 'DELETE'
                                });
                                if (res.ok) {
                                  alert('Meeting booking successfully deleted! 🗑️');
                                  setBookView('dashboard');
                                  fetchAdminMeetings();
                                } else {
                                  const errData = await res.json();
                                  alert(errData.message || 'Failed to delete booking.');
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Network error while deleting booking.');
                              }
                            }
                          }}
                          style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                        >
                          🗑 Cancel Booking
                        </button>
                      </div>
                    </div>
                    <span style={{ 
                      backgroundColor: (selectedDetailBooking?.status === 'Completed' || selectedDetailBooking?.status === 'Solved') ? '#ecfdf5' : '#eff6ff', 
                      color: (selectedDetailBooking?.status === 'Completed' || selectedDetailBooking?.status === 'Solved') ? '#047857' : '#2563eb', 
                      padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 'bold' 
                    }}>
                      {(selectedDetailBooking?.status === 'Completed' || selectedDetailBooking?.status === 'Solved') ? 'Completed / Solved ✓' : (isStarted ? 'In Progress' : 'Booked')}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Status Type</span>
                      <strong style={{ color: (selectedDetailBooking?.status === 'Completed' || selectedDetailBooking?.status === 'Solved') ? '#10b981' : '#2563eb' }}>
                        {(selectedDetailBooking?.status === 'Completed' || selectedDetailBooking?.status === 'Solved') ? 'Finished & Solved' : (isStarted ? 'Live Meeting' : 'Upcoming')}
                      </strong>
                    </div>

                    {/* Top Banner Card */}
                    <div style={{ backgroundColor: '#fff', padding: '24px 30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr', gap: '20px', alignItems: 'center' }}>
                      
                      <div style={{ width: '100%', height: '110px', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '13px', fontWeight: 'bold', gap: '6px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '26px' }}>🏢</span>
                        <span>{specificRoomName}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '20px' }}>
                            {specificRoomName}
                          </h4>
                          <span style={{ backgroundColor: isCompleted ? '#ecfdf5' : '#eff6ff', color: isCompleted ? '#047857' : '#2563eb', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 'bold' }}>
                            {isCompleted ? 'Completed' : (isStarted ? 'In Progress' : 'Booked')}
                          </span>
                        </div>
                        <div style={{ fontSize: '13.5px', color: '#64748b' }}>
                          <span>👥 Meeting Room Booking</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', borderLeft: '1px solid #f1f5f9', paddingLeft: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Booked By</span><strong style={{ color: '#1e293b' }}>{finalBookedByDisplay}</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Workspace</span><strong style={{ color: '#1e293b' }}>Central Trichy</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Booked On</span><strong style={{ color: '#1e293b' }}>{cleanDetailDate}</strong></div>
                      </div>

                    </div>

                    {/* Middle Grid: Information & Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '25px', alignItems: 'flex-start' }}>
                      
                      {/* LEFT: Booking Information */}
                      <div style={{ backgroundColor: '#fff', padding: '25px 30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Booking Information</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📅</div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Date</div>
                              <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>
                                {cleanDetailDate}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>⏰</div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Time Slot</div>
                              <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>
                                {timeSlotStr}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#fffbeb', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📌</div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Purpose</div>
                              <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>
                                {selectedDetailBooking?.purpose || 'Client Meeting'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📝</div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Description</div>
                              <div style={{ fontSize: '14px', color: '#334155' }}>
                                Quarterly review meeting with the client regarding workspace progress.
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                            <div style={{ width: '36px', height: '36px', backgroundColor: '#fff7ed', color: '#ea580c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🏢</div>
                            <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Tenant / Company</div>
                              <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#1e293b' }}>
                                {selectedDetailBooking?.tenant_name || 'Zoho Corp'}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* RIGHT: Status & Time Slot Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        
                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '16px' }}>Booking Status Flow</h4>
                          
                          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '0 10px' }}>
                            <div style={{ position: 'absolute', top: '15px', left: '35px', right: '35px', height: '3px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                              <div style={{ width: '32px', height: '32px', backgroundColor: currentStep >= 1 ? '#10b981' : '#cbd5e1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>✓</div>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: currentStep >= 1 ? '#10b981' : '#64748b' }}>Booked</span>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{cleanDetailDate}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                              <div style={{ width: '32px', height: '32px', backgroundColor: currentStep >= 2 ? '#2563eb' : '#cbd5e1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>{currentStep >= 2 ? '✓' : '•'}</div>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: currentStep >= 2 ? '#2563eb' : '#64748b' }}>Confirmed</span>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{cleanDetailDate}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                              <div style={{ width: '32px', height: '32px', backgroundColor: currentStep >= 3 ? '#d97706' : '#cbd5e1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>{currentStep >= 3 ? '⏳' : '•'}</div>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: currentStep >= 3 ? '#d97706' : '#64748b' }}>In Progress</span>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{startTimeString}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                              <div style={{ width: '32px', height: '32px', backgroundColor: currentStep >= 4 ? '#059669' : '#cbd5e1', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>{currentStep >= 4 ? '✓' : '•'}</div>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: currentStep >= 4 ? '#059669' : '#64748b' }}>Completed</span>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>{currentStep >= 4 ? 'Finished' : 'Pending'}</span>
                            </div>

                          </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '16px' }}>Time Slot Details</h4>

                          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#065f46', fontSize: '14.5px' }}>{timeSlotStr}</div>
                              <div style={{ fontSize: '12.5px', color: '#047857' }}>{cleanDetailDate}</div>
                            </div>
                            <span style={{ backgroundColor: isCompleted ? '#059669' : '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 'bold' }}>
                              {isCompleted ? 'Completed' : 'Booked'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', paddingTop: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Total Duration</span><strong>1h 30m</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Status Type</span><strong style={{ color: '#2563eb' }}>{isCompleted ? 'Finished Session' : (isStarted ? 'Live Meeting' : 'Upcoming')}</strong></div>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })()
            ) : (
              /* 🌟 BOOK MEETING ROOM FORM VIEW */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Calibri, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <button onClick={() => setBookView('dashboard')} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>←</button>
                  <h3 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '22px' }}>{selectedDetailBooking?.id ? 'Edit Meeting Room Booking' : 'Book Meeting Room'}</h3>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>Meeting Rooms &gt; {selectedDetailBooking?.id ? 'Edit Booking' : 'Book Room'}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'flex-start' }}>
                  
                  <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>1. Booking Details</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Select Workspace *</label>
                        <select 
                          value={selectedWsForBook}
                          onChange={(e) => {
                            setSelectedWsForBook(e.target.value);
                            setSelectedRmForBook(''); 
                          }}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#fff', fontFamily: 'Calibri, sans-serif' }}
                        >
                          <option value="">-- Choose Workspace --</option>
                          {workspaces.map(ws => (
                            <option key={ws.id} value={ws.name}>{ws.name} ({ws.location})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Select Meeting Room *</label>
                        <select 
                          value={selectedRmForBook}
                          onChange={(e) => setSelectedRmForBook(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#fff', fontFamily: 'Calibri, sans-serif' }}
                        >
                          <option value="">-- Choose Meeting Room --</option>
                          {workspaces
                            .filter(ws => !selectedWsForBook || ws.name === selectedWsForBook)
                            .flatMap(ws => {
                              if (!ws.meetings) return [];
                              return ws.meetings.split(',').map(m => m.trim()).filter(Boolean).map((rm, idx) => {
                                const cleanRoomName = rm.replace(/\s*\(\d+\)\s*/g, '').trim();
                                return (
                                  <option key={`${ws.id}-${idx}`} value={cleanRoomName}>{cleanRoomName} — [{ws.name}]</option>
                                );
                              });
                            })
                          }
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Title / Purpose *</label>
                        <input type="text" value={purposeText} onChange={(e) => setPurposeText(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Tenant / Company *</label>
                        <input type="text" value={tenantNameInput} onChange={(e) => setTenantNameInput(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Description (Optional)</label>
                      <textarea value={descText} onChange={(e) => setDescText(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '65px', fontSize: '13.5px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }}></textarea>
                    </div>

                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '5px 0 0 0', fontSize: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>2. Booking Schedule</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Booking Date *</label>
                        <input 
                          type="date" 
                          value={bookingFormDate} 
                          min={new Date().toISOString().split('T')[0]} 
                          onChange={(e) => setBookingFormDate(e.target.value)} 
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box', fontFamily: 'Calibri, sans-serif' }} 
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Selected Slot *</label>
                        <input 
                          type="text" 
                          readOnly 
                          value={selectedSlotForBook} 
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#f8fafc', fontWeight: 'bold', color: '#2563eb', fontFamily: 'Calibri, sans-serif', boxSizing: 'border-box' }} 
                        />
                      </div>
                    </div>

                    {/* Booking Summary Box */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                      <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Booking Summary</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Workspace</span><strong>{selectedWsForBook || '—'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Room</span><strong>{selectedRmForBook || '—'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Tenant</span><strong>{tenantNameInput || '—'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Date</span><strong>{bookingFormDate}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Time</span><strong style={{ color: '#2563eb' }}>{selectedSlotForBook || '—'}</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Purpose</span><strong>{purposeText || '—'}</strong></div>
                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Status</span><span style={{ color: '#2563eb' }}>{selectedDetailBooking?.id ? 'Ready to Update' : 'Ready to Confirm'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                      <button type="button" onClick={() => { setSelectedDetailBooking(null); setBookView('dashboard'); }} style={{ flex: 1, padding: '11px', backgroundColor: '#fff', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', fontFamily: 'Calibri, sans-serif' }}>Cancel</button>
                      
                      <button 
                        type="button" 
                        onClick={async () => {
                          if (!selectedRmForBook || !tenantNameInput.trim() || !purposeText.trim()) {
                            alert('Please fill out all required fields!');
                            return;
                          }
                          try {
                            const isEditing = !!selectedDetailBooking?.id;
                            const endpoint = isEditing 
                              ? `http://localhost:5000/api/tenant/meeting-bookings/${selectedDetailBooking.id}` 
                              : 'http://localhost:5000/api/tenant/meeting-bookings';
                            
                            const methodType = isEditing ? 'PUT' : 'POST';

                            const res = await fetch(endpoint, {
                              method: methodType,
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                tenant_name: tenantNameInput,
                                admin_username: adminUsername,
                                room_name: selectedRmForBook,
                                booking_date: bookingFormDate,
                                time_slot: selectedSlotForBook,
                                purpose: purposeText
                              })
                            });
                            
                            let data = {};
                            const contentType = res.headers.get("content-type");
                            if (contentType && contentType.includes("application/json")) {
                              data = await res.json();
                            }

                            if (res.ok) {
                              alert(isEditing ? 'Meeting Room Successfully Updated! ✏️' : 'Meeting Room Successfully Booked! 📅');
                              setSelectedDetailBooking(null);
                              setBookView('dashboard');
                              fetchAdminMeetings();
                            } else {
                              alert(data.message || 'Failed to save meeting room booking.');
                            }
                          } catch (err) {
                            console.error(err);
                            alert('Network error while saving room booking.');
                          }
                        }}
                        style={{ flex: 2, padding: '11px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
                      >
                        {selectedDetailBooking?.id ? 'Update Booking ✏️' : 'Confirm Booking 🚀'}
                      </button>
                    </div>

                  </div>

                  {/* RIGHT COLUMN */}
                  {(() => {
                    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
                    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

                    const daysInMonth = getDaysInMonth(calYear, calMonth);
                    const firstDayIndex = getFirstDayOfMonth(calYear, calMonth);
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                    const standardSlots = [
                      '08:00 AM - 09:00 AM',
                      '09:00 AM - 10:00 AM',
                      '10:00 AM - 11:30 AM',
                      '12:00 PM - 01:00 PM',
                      '02:00 PM - 03:00 PM',
                      '03:00 PM - 04:00 PM',
                      '04:00 PM - 05:00 PM'
                    ];

                    const todayStr = new Date().toISOString().split('T')[0];

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '15px' }}>3. Select Date</h4>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); } }} style={{ padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>‹</button>
                              <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); } }} style={{ padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>›</button>
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: '#2563eb' }}>{monthNames[calMonth]} {calYear}</div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '12px' }}>
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                              <span key={d} style={{ color: '#64748b', fontWeight: 'bold', fontSize: '10px' }}>{d}</span>
                            ))}
                            {Array.from({ length: firstDayIndex }, (_, i) => (
                              <div key={`empty-${i}`}></div>
                            ))}
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                              const dStr = String(day).padStart(2, '0');
                              const mStr = String(calMonth + 1).padStart(2, '0');
                              const fullDateFormatted = `${calYear}-${mStr}-${dStr}`;
                              
                              const isPastDate = fullDateFormatted < todayStr;
                              const isSelectedDate = fullDateFormatted === bookingFormDate;

                              return (
                                <div 
                                  key={day}
                                  onClick={() => setBookingFormDate(fullDateFormatted)}
                                  style={{ 
                                    padding: '6px 0', 
                                    borderRadius: '6px', 
                                    backgroundColor: isSelectedDate ? '#2563eb' : 'transparent', 
                                    color: isPastDate ? '#94a3b8' : (isSelectedDate ? '#fff' : '#1e293b'), 
                                    fontWeight: isSelectedDate ? 'bold' : 'normal', 
                                    cursor: 'pointer',
                                    opacity: isPastDate ? 0.6 : 1
                                  }}
                                >
                                  {day}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '15px' }}>4. Available Time Slots ({bookingFormDate})</h4>
                          
                          {standardSlots.map((slot, sIdx) => {
                            const isBookedSlot = adminMeetings.some(m => {
                              if (selectedDetailBooking?.id && m.id === selectedDetailBooking.id) return false;

                              let mDate = String(m.booking_date || m.date || '').split('T')[0];
                              let mRoom = String(m.room_name || m.room || '').toLowerCase();
                              let mSlot = String(m.time_slot || '').trim();
                              
                              const cleanTargetRoom = (selectedRmForBook || '').toLowerCase();
                              const matchesRoom = cleanTargetRoom && (mRoom.includes(cleanTargetRoom) || cleanTargetRoom.includes(mRoom));

                              return mDate === bookingFormDate && matchesRoom && mSlot === slot;
                            });

                            const isSelectedSlot = selectedSlotForBook === slot;

                            return (
                              <div 
                                key={sIdx}
                                onClick={() => {
                                  if (!isBookedSlot) setSelectedSlotForBook(slot);
                                }}
                                style={{ 
                                  padding: '10px 14px', 
                                  borderRadius: '8px', 
                                  border: isSelectedSlot ? '2px solid #2563eb' : (isBookedSlot ? '1px solid #fecaca' : '1px solid #e2e8f0'), 
                                  backgroundColor: isSelectedSlot ? '#eff6ff' : (isBookedSlot ? '#fef2f2' : '#f8fafc'), 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  cursor: isBookedSlot ? 'not-allowed' : 'pointer',
                                  opacity: isBookedSlot ? 0.85 : 1
                                }}
                              >
                                <div>
                                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: isBookedSlot ? '#b91c1c' : (isSelectedSlot ? '#2563eb' : '#2563eb') }}>
                                    {slot}
                                  </div>
                                  <small style={{ color: isBookedSlot ? '#b91c1c' : (isSelectedSlot ? '#2563eb' : '#64748b'), fontWeight: isSelectedSlot ? '600' : 'normal' }}>
                                    {isBookedSlot ? 'Booked' : (isSelectedSlot ? 'Selected' : 'Available')}
                                  </small>
                                </div>
                                {isSelectedSlot && <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span>}
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })()}

                </div>
              </div>
            )}
          </div>
        )}
         {/* 🌟 Visitors Management Tab View */}
{activeTab === 'visitors' && (
  <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif' }}>
    
    {/* Header Area */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
      <div>
        <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '20px' }}>Visitors History & Management</h3>
        <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Track visitor check-ins, entry times, and update exit timings seamlessly.</p>
      </div>
      <button 
  type="button"
  onClick={() => {
    console.log("Add Visitor clicked"); // கன்சோலில் பிரிண்ட் ஆகுதான்னு செக் பண்ண
    setIsVisitorModalOpen(true);
  }} 
  style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
>
  + Add Visitor
</button>
    </div>

    {/* Visitors Table History */}
    {visitorsList.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
        <p style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>No visitors recorded yet.</p>
      </div>
    ) : (
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '850px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Visitor Name</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Phone</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Workspace</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Whom to Meet</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Purpose</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Entry Time</th>
              <th style={{ padding: '14px 16px', fontWeight: '700' }}>Exit Time</th>
              <th style={{ padding: '14px 16px', fontWeight: '700', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitorsList.map((vis, index) => (
              <tr key={vis.id || index} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#1e293b' }}>{vis.name}</td>
                <td style={{ padding: '14px 16px', color: '#334155' }}>{vis.phone || '—'}</td>
                <td style={{ padding: '14px 16px', color: '#2563eb', fontWeight: '600' }}>🏢 {vis.workspace || '—'}</td>
                <td style={{ padding: '14px 16px', color: '#1e293b', fontWeight: '600' }}>{vis.tenant_name || '—'}</td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{vis.purpose || '—'}</td>
                <td style={{ padding: '14px 16px', color: '#059669', fontWeight: '600', fontSize: '13px' }}>{vis.entry_time || '—'}</td>
                <td style={{ padding: '14px 16px', color: '#dc2626', fontWeight: '600', fontSize: '13px' }}>{vis.exit_time || 'Active / Not Exited'}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => {
                      setSelectedVisitor(vis);
                      setExitTimeUpdate(vis.exit_time || '');
                      setIsEditExitModalOpen(true);
                    }} 
                    style={{ padding: '6px 12px', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Edit Exit Time
                  </button>
                  <button 
                    onClick={() => handleDeleteVisitor(vis.id)} 
                    style={{ padding: '6px 10px', backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {/* 🌟 Add Visitor Modal Form */}
{isVisitorModalOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, fontFamily: 'Calibri, sans-serif' }}>
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '18px', width: '90%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontWeight: '800', color: '#1e293b', fontSize: '18px' }}>Add New Visitor</h3>
      
      <form onSubmit={async (e) => {
        e.preventDefault();
        try {
          const res = await fetch('http://localhost:5000/api/admin/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitorForm)
          });
          if (res.ok) {
            alert('Visitor added successfully!');
            setIsVisitorModalOpen(false);
            setVisitorForm({ name: '', phone: '', workspace: '', tenant_name: '', purpose: '', entry_time: '', exit_time: '' });
            fetchVisitors();
          } else {
            alert('Failed to save visitor.');
          }
        } catch (err) {
          console.error("Error saving visitor:", err);
        }
      }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
        
        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Visitor Name</label>
          <input type="text" required placeholder="e.g. John Doe" value={visitorForm.name} onChange={(e) => setVisitorForm({...visitorForm, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Phone Number</label>
          <input type="text" required placeholder="e.g. +91 9876543210" value={visitorForm.phone} onChange={(e) => setVisitorForm({...visitorForm, phone: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Workspace Assignment</label>
          <select 
            required 
            value={visitorForm.workspace} 
            onChange={async (e) => {
              const wsName = e.target.value;
              setVisitorForm({...visitorForm, workspace: wsName, tenant_name: ''});
              try {
                const res = await fetch(`http://localhost:5000/api/admin/workspace-tenants?workspace=${encodeURIComponent(wsName)}`);
                if (res.ok) {
                  const data = await res.json();
                  setCompaniesInWorkspace(data.tenants || []);
                }
              } catch (err) {
                console.error("Error fetching companies:", err);
              }
            }} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', boxSizing: 'border-box' }}
          >
            <option value="">-- Choose Workspace --</option>
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.name}>{ws.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Whom to Meet (Company Name)</label>
          <select 
            required 
            value={visitorForm.tenant_name} 
            onChange={(e) => setVisitorForm({...visitorForm, tenant_name: e.target.value})} 
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', boxSizing: 'border-box' }}
          >
            <option value="">-- Select Company --</option>
            {companiesInWorkspace.map((comp, idx) => (
              <option key={idx} value={comp.name}>{comp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Purpose of Visit</label>
          <input type="text" required placeholder="e.g. Business Meeting" value={visitorForm.purpose} onChange={(e) => setVisitorForm({...visitorForm, purpose: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Entry Time</label>
            <input type="time" value={visitorForm.entry_time || ''} onChange={(e) => setVisitorForm({...visitorForm, entry_time: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Exit Time</label>
            <input type="time" value={visitorForm.exit_time || ''} onChange={(e) => setVisitorForm({...visitorForm, exit_time: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '11px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Save Visitor</button>
          <button type="button" onClick={() => setIsVisitorModalOpen(false)} style={{ flex: 1, padding: '11px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

    {/* 🌟 Edit Exit Time Modal */}
    {isEditExitModalOpen && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>Update Visitor Exit Time</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Visitor: <b>{selectedVisitor?.name}</b></p>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px', fontSize: '13px' }}>Select Exit Time</label>
            <input 
              type="time" 
              value={exitTimeUpdate} 
              onChange={(e) => setExitTimeUpdate(e.target.value)} 
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:5000/api/admin/visitors/${selectedVisitor.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ exit_time: exitTimeUpdate })
                  });
                  if (res.ok) {
                    alert('Exit time updated successfully!');
                    setIsEditExitModalOpen(false);
                    fetchVisitors();
                  } else {
                    alert('Failed to update exit time.');
                  }
                } catch (err) {
                  console.error("Error updating exit time:", err);
                }
              }}
              style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Update
            </button>
            <button 
              onClick={() => setIsEditExitModalOpen(false)} 
              style={{ flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
)}
       
        
        
        
        
        {/* 🌟 TENANT SECTION */}
        {activeTab === 'tenant' && (
          <div style={{ fontFamily: 'Calibri, sans-serif', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: window.innerWidth < 768 ? '12px' : '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Total Tenants</span>
                  <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>{tenants.length}</h3>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>All Time</small>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Active Tenants</span>
                  <h3 style={{ fontWeight: '800', color: '#10b981', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>{activeTenantsCount}</h3>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>Currently Active</small>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#fff7ed', color: '#f97316', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Inactive Tenants</span>
                  <h3 style={{ fontWeight: '800', color: '#f97316', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>{inactiveTenantsCount}</h3>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>Currently Inactive</small>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: window.innerWidth < 768 ? '16px' : '20px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: window.innerWidth < 768 ? '38px' : '46px', height: window.innerWidth < 768 ? '38px' : '46px', backgroundColor: '#f3e8ff', color: '#9333ea', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h10v5H7z"></path><path d="M5 9h14a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2z"></path><path d="M9 5h6v4H9z"></path></svg>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: window.innerWidth < 768 ? '10px' : '11.5px', fontWeight: '700', textTransform: 'uppercase' }}>Total Seats</span>
                  <h3 style={{ fontWeight: '800', color: '#9333ea', margin: '2px 0 0 0', fontSize: window.innerWidth < 768 ? '18px' : '22px' }}>{totalBookedSeats}</h3>
                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>Allocated Seats</small>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '25px', alignItems: 'flex-start' }}>
              
              <div style={{ width: '100%', flex: tenantView === 'form' ? '1.3' : '1', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '18px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6', transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: window.innerWidth < 768 ? '18px' : '20px' }}>Tenants Directory</h4>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Manage and view all tenants in your system.</p>
                  </div>
                  <button 
                    onClick={handleOpenAddTenant}
                    style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}
                  >
                    + Add Tenant
                  </button>
                </div>

                {tenants.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No tenants found. Click "+ Add Tenant" to begin.</p>
                ) : (
                  <>
                    <div style={{ overflowX: 'auto', width: '100%' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '450px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#2563eb', color: '#fff', borderBottom: '2px solid #059669' }}>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Company / Username</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Workspace & Location</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Seats</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Phone</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700' }}>Status</th>
                            <th style={{ padding: '12px 14px', fontWeight: '700', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTenantsList.map((t, index) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                                {t.name} <br />
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>@{t.username}</span>
                              </td>
                              <td style={{ padding: '12px 14px', color: '#1e293b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>
                                {t.workspace}
                              </td>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13h10v5H7z"></path><path d="M5 9h14a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2z"></path></svg>
                                  {t.seats}
                                </span>
                              </td>
                              <td style={{ padding: '12px 14px' }}>{t.phone}</td>
                              <td style={{ padding: '12px 14px' }}>
                                <span style={{ backgroundColor: (!t.end_date || t.end_date === 'Active') ? '#ecfdf5' : '#fef2f2', color: (!t.end_date || t.end_date === 'Active') ? '#047857' : '#b91c1c', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>
                                  {t.end_date || 'Active'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                                  <button onClick={() => handleOpenEditTenant(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }} title="Edit Tenant">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                  </button>
                                  <button onClick={() => handleDeleteTenant(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }} title="Delete Tenant">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                      <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Page {tenantPage} of {totalTenantPages}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button disabled={tenantPage === 1} onClick={() => setTenantPage(tenantPage - 1)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: '600', cursor: 'pointer' }}>Previous</button>
                        <button disabled={tenantPage >= totalTenantPages} onClick={() => setTenantPage(tenantPage + 1)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: '600', cursor: 'pointer' }}>Next</button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {tenantView === 'form' && (
                <div style={{ width: '100%', flex: '1.2', backgroundColor: '#fff', padding: window.innerWidth < 768 ? '20px' : '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eef2f6', fontFamily: 'Calibri, sans-serif', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '17px' }}>{isTenantEditing ? 'Edit Tenant Record' : 'Add New Tenant'}</h4>
                    <button type="button" onClick={() => setTenantView('list')} style={{ padding: '7px 14px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12.5px' }}>← Back</button>
                  </div>

                  <form onSubmit={handleSaveOrUpdateTenant} style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '13.5px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Company Name / Tenant Name</label>
                      <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. Infosys Corp" value={tName} onChange={(e) => setTName(e.target.value)} required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Login Username</label>
                        <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. infosys_admin" value={tUsername} onChange={(e) => setTUsername(e.target.value)} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Login Password</label>
                        <input type="password" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="Secure password" value={tPassword} onChange={(e) => setTPassword(e.target.value)} required={!isTenantEditing} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Email Address</label>
                        <input type="email" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. info@infosys.com" value={tEmail} onChange={(e) => setTEmail(e.target.value)} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Phone Number</label>
                        <input type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. +91 9876543210" value={tPhone} onChange={(e) => setTPhone(e.target.value)} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Seats Required</label>
                        <input type="number" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="e.g. 15" value={tSeats} onChange={handleSeatsChange} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Workspace Assignment</label>
                        <select style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#fff', boxSizing: 'border-box' }} value={tWorkspace} onChange={(e) => setTWorkspace(e.target.value)} required>
                          <option value="">-- Choose Workspace --</option>
                          {workspaces.map(ws => (
                            <option key={ws.id} value={ws.name}>{ws.name} ({ws.location})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>GST Number (15 Chars)</label>
                        <input type="text" maxLength={15} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="GST Number" value={tGst} onChange={(e) => setTGst(e.target.value)} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>PAN Number (10 Chars)</label>
                        <input type="text" maxLength={10} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="PAN Number" value={tPan} onChange={(e) => setTPan(e.target.value)} required />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Document File</label>
                        {tDocName && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', marginBottom: '6px', fontSize: '12px', overflow: 'hidden' }}>
                            <a href={`http://localhost:5000/uploads/${tDocName}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              📄 {tDocName} (View ↗)
                            </a>
                          </div>
                        )}
                        <input type="file" style={{ width: '100%', padding: '8px', fontSize: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} onChange={(e) => { if (e.target.files[0]) { setTDocFile(e.target.files[0]); setTDocName(e.target.files[0].name); } }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Agreement File</label>
                        {tAgreementName && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', marginBottom: '6px', fontSize: '12px', overflow: 'hidden' }}>
                            <a href={`http://localhost:5000/uploads/${tAgreementName}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              📄 {tAgreementName} (View ↗)
                            </a>
                          </div>
                        )}
                        <input type="file" style={{ width: '100%', padding: '8px', fontSize: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} onChange={(e) => { if (e.target.files[0]) { setTAgreementFile(e.target.files[0]); setTAgreementName(e.target.files[0].name); } }} />
                      </div>
                    </div>

                    {/* ✨ Add New Tenant ஃபார்மிற்குள் மட்டும் நேர்த்தியாக இணைக்கப்பட்ட Multiple Documents பகுதி */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontWeight: '700', color: '#475569', fontSize: '12.5px' }}>Additional Documents</label>
                        <button 
                          type="button" 
                          onClick={() => setExtraDocs([...extraDocs, null])}
                          style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          + Add Document
                        </button>
                      </div>

                      {extraDocs.map((doc, index) => (
                        <div key={index} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {typeof doc === 'string' && doc.trim() !== '' ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11.5px' }}>
                              <a href={`http://localhost:5000/uploads/${doc}`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                📄 {doc} (View ↗)
                              </a>
                              <button 
                                type="button"
                                onClick={() => {
                                  const updatedDocs = extraDocs.filter((_, i) => i !== index);
                                  setExtraDocs(updatedDocs);
                                }}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <>
                              <input 
                                type="file" 
                                style={{ width: '100%', padding: '6px', fontSize: '11px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    const updatedDocs = [...extraDocs];
                                    updatedDocs[index] = e.target.files[0];
                                    setExtraDocs(updatedDocs);
                                  }
                                }} 
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const updatedDocs = extraDocs.filter((_, i) => i !== index);
                                  setExtraDocs(updatedDocs);
                                }}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                                title="Remove"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontWeight: '700', color: '#475569', marginBottom: '5px' }}>Company Address</label>
                      <textarea style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '65px', fontSize: '13.5px', boxSizing: 'border-box' }} placeholder="Full street address" value={tAddress} onChange={(e) => setTAddress(e.target.value)} required></textarea>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: 'Calibri, sans-serif', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', marginTop: '5px' }}>
                      {isTenantEditing ? 'Update Tenant Record' : 'Save Tenant Record'}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}
        {activeTab === 'crm' && (
  <div style={{ padding: '24px 30px', backgroundColor: '#f8fafc', borderRadius: '16px', fontFamily: 'Calibri, sans-serif' }}>
    
    {/* Header Section */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', backgroundColor: '#fff', padding: '20px 24px', borderRadius: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div>
          <h3 style={{ fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', fontSize: '20px' }}>Customer Relationship Management (CRM)</h3>
          <p style={{ color: '#64748b', margin: 0, fontSize: '13.5px' }}>Track leads, update follow-ups, and close deals seamlessly.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <label style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📥 Import CSV
          <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            onChange={async (e) => {
              const uploadedFile = e.target.files[0];
              if (!uploadedFile) return;
              const formData = new FormData();
              formData.append('file', uploadedFile);
              formData.append('admin_username', localStorage.getItem('admin_username'));
              try {
                const res = await fetch('http://localhost:5000/api/admin/crm-import', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) { alert(data.message); fetchCrmLeads(); }
                else { alert('Error: ' + data.error); }
              } catch (err) { console.error("Import error:", err); }
            }} 
          />
        </label>

        <button 
          onClick={() => setShowAddLeadModal(true)}
          style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
        >
          + Add New Lead
        </button>
      </div>
    </div>

    {/* Top Analytics Section (Clean SVG Donut Chart & Conversion Summary) */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      
      {/* Donut Chart Card */}
      <div style={{ backgroundColor: '#fff', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Lead Status Overview</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#d97706', borderRadius: '50%' }}></span> New Leads: <b>{crmLeads.filter(l => (l.status || 'Lead') === 'Lead').length}</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#4f46e5', borderRadius: '50%' }}></span> Followed: <b>{crmLeads.filter(l => l.status === 'Followed').length}</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#dc2626', borderRadius: '50%' }}></span> Not Interested: <b>{crmLeads.filter(l => l.status === 'Not Interested').length}</b></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', backgroundColor: '#059669', borderRadius: '50%' }}></span> Deal Closed: <b>{crmLeads.filter(l => l.status === 'Deal Closed').length}</b></div>
          </div>
        </div>

        {/* Professional SVG Donut Chart */}
        <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(() => {
            const total = crmLeads.length || 1;
            const newCount = crmLeads.filter(l => (l.status || 'Lead') === 'Lead').length;
            const followedCount = crmLeads.filter(l => l.status === 'Followed').length;
            const notIntCount = crmLeads.filter(l => l.status === 'Not Interested').length;
            const closedCount = crmLeads.filter(l => l.status === 'Deal Closed').length;

            let accum = 0;
            const getCoordinatesForPercent = (percent) => {
              const x = Math.cos(2 * Math.PI * percent);
              const y = Math.sin(2 * Math.PI * percent);
              return [x, y];
            };

            const slices = [
              { count: newCount, color: '#d97706' },
              { count: followedCount, color: '#4f46e5' },
              { count: notIntCount, color: '#dc2626' },
              { count: closedCount, color: '#059669' }
            ];

            return (
              <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {slices.map((slice, i) => {
                  if (slice.count === 0) return null;
                  const startPercent = accum / total;
                  accum += slice.count;
                  const endPercent = accum / total;

                  const [startX, startY] = getCoordinatesForPercent(startPercent);
                  const [endX, endY] = getCoordinatesForPercent(endPercent);
                  const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
                  const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

                  return <path key={i} d={pathData} fill={slice.color} />;
                })}
                <circle cx="0" cy="0" r="0.65" fill="#fff" />
              </svg>
            );
          })()}
          <div style={{ position: 'absolute', fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>
            {crmLeads.length}
          </div>
        </div>
      </div>

      {/* Quick Summary Card */}
      <div style={{ backgroundColor: '#fff', padding: '20px 24px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Conversion Summary</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#64748b' }}>Total Deals Successfully Closed in your workspace.</p>
        <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🎉 {crmLeads.filter(l => l.status === 'Deal Closed').length} Deals Closed
        </div>
      </div>

    </div>

    {/* Professional Tabs Navigation */}
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', overflowX: 'auto' }}>
      {[
        { label: 'All Leads', val: 'All', count: crmLeads.length },
        { label: 'Leads (New)', val: 'Lead', count: crmLeads.filter(l => (l.status || 'Lead') === 'Lead').length },
        { label: 'Followed', val: 'Followed', count: crmLeads.filter(l => l.status === 'Followed').length },
        { label: 'Not Interested', val: 'Not Interested', count: crmLeads.filter(l => l.status === 'Not Interested').length },
        { label: 'Deal Closed', val: 'Deal Closed', count: crmLeads.filter(l => l.status === 'Deal Closed').length }
      ].map((tab, idx) => {
        const isActive = filterStatus === tab.val;
        return (
          <button
            key={idx}
            onClick={() => { setFilterStatus(tab.val); setCrmPage(1); }}
            style={{
              padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              backgroundColor: isActive ? '#2563eb' : '#fff', color: isActive ? '#fff' : '#64748b',
              fontWeight: '700', fontSize: '13.5px', boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.2)' : '0 1px 3px rgba(0,0,0,0.02)',
              display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
          >
            <span>{tab.label}</span>
            <span style={{ padding: '2px 8px', borderRadius: '20px', backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9', color: isActive ? '#fff' : '#475569', fontSize: '12px' }}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>

    {/* Leads Table Card */}
    <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '16px 20px' }}>Name</th>
              <th style={{ padding: '16px 20px' }}>Address</th>
              <th style={{ padding: '16px 20px' }}>Phone Number</th>
              <th style={{ padding: '16px 20px' }}>Email</th>
              <th style={{ padding: '16px 20px' }}>Source</th>
              <th style={{ padding: '16px 20px' }}>Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {crmLeads.filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus).length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14.5px' }}>
                  No leads found in this section.
                </td>
              </tr>
            ) : (
              crmLeads
                .filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus)
                .slice((crmPage - 1) * crmPerPage, crmPage * crmPerPage)
                .map((lead, idx) => {
                  let sourceBg = '#f1f5f9', sourceColor = '#475569', sourceIcon = '🌐';
                  const src = (lead.source || '').toLowerCase();
                  if (src.includes('whats')) { sourceBg = '#d1fae5'; sourceColor = '#065f46'; sourceIcon = '🟢'; }
                  else if (src.includes('face')) { sourceBg = '#dbeafe'; sourceColor = '#1e40af'; sourceIcon = '🔵'; }
                  else if (src.includes('insta')) { sourceBg = '#fce7f3'; sourceColor = '#9d174d'; sourceIcon = '🟣'; }
                  else if (src.includes('twit')) { sourceBg = '#e0f2fe'; sourceColor = '#0369a1'; sourceIcon = '🪟'; }

                  const currentStatus = lead.status || 'Lead';

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1e293b' }}>{lead.name}</td>
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>{lead.address || '—'}</td>
                      <td style={{ padding: '16px 20px', color: '#334155', fontWeight: '600' }}>{lead.phone_number}</td>
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>{lead.email || '—'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '6px 14px', backgroundColor: sourceBg, color: sourceColor, borderRadius: '30px', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span>{sourceIcon}</span> {lead.source}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select 
                          value={currentStatus}
                          onChange={async (e) => {
                            const newSt = e.target.value;
                            try {
                              const res = await fetch('http://localhost:5000/api/admin/crm-leads/status', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: lead.id, status: newSt })
                              });
                              const data = await res.json();
                              if (data.success) {
                                fetchCrmLeads();
                              } else {
                                alert('Failed to update status');
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          style={{ 
                            padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                            backgroundColor: currentStatus === 'Deal Closed' ? '#d1fae5' : currentStatus === 'Not Interested' ? '#fee2e2' : '#f8fafc',
                            color: '#0f172a', fontWeight: '700', fontSize: '13px', cursor: 'pointer', outline: 'none'
                          }}
                        >
                          <option value="Lead">Lead (New)</option>
                          <option value="Followed">Followed</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Deal Closed">Deal Closed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {crmLeads.filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus).length > crmPerPage && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {((crmPage - 1) * crmPerPage) + 1} to {Math.min(crmPage * crmPerPage, crmLeads.filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus).length)} of {crmLeads.filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus).length} leads
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setCrmPage(prev => Math.max(prev - 1, 1))}
              disabled={crmPage === 1}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: crmPage === 1 ? '#f1f5f9' : '#fff', color: crmPage === 1 ? '#94a3b8' : '#334155', fontWeight: 'bold', cursor: crmPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <button 
              onClick={() => setCrmPage(prev => (prev * crmPerPage < crmLeads.filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus).length ? prev + 1 : prev))}
              disabled={crmPage * crmPerPage >= crmLeads.filter(lead => filterStatus === 'All' || (lead.status || 'Lead') === filterStatus).length}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#334155', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Add Lead Modal Form */}
    {showAddLeadModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
        <div style={{ width: '480px', backgroundColor: '#fff', borderRadius: '20px', padding: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
            <h4 style={{ margin: 0, fontWeight: '800', color: '#0f172a', fontSize: '18px' }}>✨ Add New Lead</h4>
            <button onClick={() => setShowAddLeadModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '14px', cursor: 'pointer', color: '#64748b', fontWeight: 'bold' }}>✕</button>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            const leadData = {
              admin_username: localStorage.getItem('admin_username'),
              name: e.target.name.value,
              address: e.target.address.value,
              phone_number: e.target.phone_number.value,
              email: e.target.email.value,
              source: e.target.source.value
            };

            try {
              const res = await fetch('http://localhost:5000/api/admin/crm-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
              });
              const data = await res.json();
              if (data.success) {
                alert('Lead added successfully!');
                setShowAddLeadModal(false);
                fetchCrmLeads();
              } else {
                alert('Failed to add lead');
              }
            } catch (err) {
              console.error(err);
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Full Name *</label>
              <input type="text" name="name" required placeholder="Enter customer name" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Address</label>
              <input type="text" name="address" placeholder="Enter location / address" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                <input type="text" name="phone_number" required placeholder="Mobile number" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input type="email" name="email" placeholder="name@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Lead Source</label>
              <select name="source" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#fff', boxSizing: 'border-box', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                <option value="WhatsApp">🟢 WhatsApp</option>
                <option value="Facebook">🔵 Facebook</option>
                <option value="Instagram">🟣 Instagram</option>
                <option value="Twitter">🪟 Twitter</option>
                <option value="Others">🌐 Others</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowAddLeadModal(false)} style={{ padding: '10px 20px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>Save Lead</button>
            </div>
          </form>
        </div>
      </div>
    )}

  </div>
)}
{activeTab === 'attendees' && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
            
            {/* Header & Filter Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3 style={{ fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0', fontSize: '20px' }}>Attendees Management</h3>
                <p style={{ color: '#64748b', margin: '0', fontSize: '13.5px' }}>List of all employees added by tenants and workspace admins.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Company Filter Dropdown */}
                <select
                  value={selectedCompanyFilter}
                  onChange={(e) => {
                    setSelectedCompanyFilter(e.target.value);
                    setCurrentPage(1); // Filter மாற்றும்போது முதல் பக்கத்திற்குச் செல்ல
                  }}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '13.5px', fontWeight: '600', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="All">All Companies</option>
                  {Array.from(new Set(attendeesList.map(item => item.tenant_name))).filter(Boolean).map((comp, idx) => (
                    <option key={idx} value={comp}>{comp}</option>
                  ))}
                </select>

                <div style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: '600' }}>
                  Total: <span style={{ color: '#0f172a' }}>{
                    selectedCompanyFilter === 'All' 
                      ? attendeesList.length 
                      : attendeesList.filter(item => item.tenant_name === selectedCompanyFilter).length
                  }</span>
                </div>
              </div>
            </div>

            {attendeesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#64748b', fontSize: '14px' }}>No attendees found.</div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Emp ID</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Name</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Role</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Company Name</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>Join Date</th>
                        <th style={{ padding: '14px 16px', fontWeight: '700' }}>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendeesList
                        .filter(item => selectedCompanyFilter === 'All' || item.tenant_name === selectedCompanyFilter)
                        .slice((currentPage - 1) * 10, currentPage * 10)
                        .map((att, idx) => (
                          <tr key={att.id || idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td style={{ padding: '14px 16px', fontWeight: '700', color: '#2563eb' }}>{att.att_id}</td>
                            <td style={{ padding: '14px 16px', color: '#1e293b', fontWeight: '600' }}>{att.name}</td>
                            <td style={{ padding: '14px 16px', color: '#475569' }}>{att.role}</td>
                            <td style={{ padding: '14px 16px', fontWeight: '600', color: '#0f172a' }}>{att.tenant_name}</td>
                            <td style={{ padding: '14px 16px', color: '#475569' }}>{att.join_date || '—'}</td>
                            <td style={{ padding: '14px 16px', color: '#475569' }}>{att.end_date || '—'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {(() => {
                  const filteredData = attendeesList.filter(item => selectedCompanyFilter === 'All' || item.tenant_name === selectedCompanyFilter);
                  const totalPages = Math.ceil(filteredData.length / 10) || 1;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '0 4px' }}>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        Showing {filteredData.length > 0 ? Math.min((currentPage - 1) * 10 + 1, filteredData.length) : 0} to {Math.min(currentPage * 10, filteredData.length)} of {filteredData.length} entries
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff', color: currentPage === 1 ? '#94a3b8' : '#334155', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}
                        >
                          Previous
                        </button>
                        <span style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                          Page {currentPage} of {totalPages}
                        </span>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage >= totalPages}
                          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: currentPage >= totalPages ? '#f1f5f9' : '#fff', color: currentPage >= totalPages ? '#94a3b8' : '#334155', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
        {activeTab === 'profile' && (
  <div style={{ maxWidth: '1080px', margin: '0 auto', fontFamily: 'Calibri, sans-serif' }}>
    
    {/* Page Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' }}>
          Account & Enterprise Settings
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
          Manage your executive credentials, organization branding, and verified agreements.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ 
          backgroundColor: '#f1f5f9', 
          color: '#334155', 
          border: '1px solid #cbd5e1', 
          padding: '6px 14px', 
          borderRadius: '8px', 
          fontSize: '12.5px', 
          fontWeight: '700' 
        }}>
          ROLE: WORKSPACE ADMIN
        </span>
        <span style={{ 
          backgroundColor: '#ecfdf5', 
          color: '#059669', 
          border: '1px solid #a7f3d0', 
          padding: '6px 14px', 
          borderRadius: '8px', 
          fontSize: '12.5px', 
          fontWeight: '700' 
        }}>
          ● SYSTEM ONLINE
        </span>
      </div>
    </div>

    {/* Section 1: Executive Overview Card */}
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '24px 28px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Admin Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '24px',
            flexShrink: 0
          }}>
            {fullAdminProfile?.name ? fullAdminProfile.name.charAt(0).toUpperCase() : (companyName ? companyName.charAt(0).toUpperCase() : 'A')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
              <h4 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>
                {fullAdminProfile?.name || 'Workspace Administrator'}
              </h4>
              <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', border: '1px solid #dbeafe' }}>
                VERIFIED
              </span>
            </div>
            <span style={{ fontSize: '13.5px', color: '#64748b' }}>
              Admin Identifier: <strong style={{ color: '#334155' }}>@{fullAdminProfile?.username || adminUsername}</strong>
            </span>
          </div>
        </div>

        {/* Organization Brand Badge */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '8px 16px 8px 10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img 
            src={appLogo} 
            alt="Org Logo" 
            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#ffffff', padding: '2px', border: '1px solid #cbd5e1' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/36?text=ORG'; }}
          />
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Assigned Entity</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{companyName}</span>
          </div>
        </div>

      </div>

      {/* Structured Meta Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: window.innerWidth < 768 ? '1fr 1fr' : 'repeat(4, 1fr)', 
        gap: '16px', 
        marginTop: '22px', 
        paddingTop: '20px', 
        borderTop: '1px solid #f1f5f9' 
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Tenure Start</span>
          <p style={{ margin: '3px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
            {fullAdminProfile?.start_date || '—'}
          </p>
        </div>

        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Tenure Expiry</span>
          <p style={{ margin: '3px 0 0 0', fontSize: '14px', fontWeight: '700', color: fullAdminProfile?.end_date ? '#ef4444' : '#059669' }}>
            {fullAdminProfile?.end_date || 'Active / Ongoing'}
          </p>
        </div>

        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Access Clearance</span>
          <p style={{ margin: '3px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>Full Super Admin Delegated</p>
        </div>

        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Records on File</span>
          <p style={{ margin: '3px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
            {(fullAdminProfile?.document_path || '').split(',').filter(Boolean).length} Document(s)
          </p>
        </div>
      </div>
    </div>

    {/* Section 2: Two-Column Split (Branding Configuration + Attached Records) */}
    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '1.3fr 1fr', gap: '20px' }}>
      
      {/* ⚙️ Organization Branding Form */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
            Organization Branding Configuration
          </h4>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Configure your enterprise display name and custom workspace branding mark.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Company Display Title
            </label>
            <input 
              type="text" 
              value={companyName} 
              onChange={(e) => handleCompanyNameChange(e.target.value)} 
              placeholder="e.g. Enterprise Global Corp"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
              Enterprise Logo Asset
            </label>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '12.5px', fontWeight: '600', color: '#334155' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="radio" name="adminLogoType" checked={logoInputType === 'local'} onChange={() => setLogoInputType('local')} /> Local Upload
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="radio" name="adminLogoType" checked={logoInputType === 'url'} onChange={() => setLogoInputType('url')} /> Image URL
              </label>
            </div>

            {logoInputType === 'local' ? (
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  fontSize: '12px'
                }}
              />
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="url" 
                  placeholder="https://company.com/logo.png" 
                  value={logoUrlInput} 
                  onChange={(e) => setLogoUrlInput(e.target.value)} 
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button 
                  type="button"
                  onClick={handleUrlLogoSave} 
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '12px'
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📁 Verified Legal Documents List */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
            Verified Identity & Agreements
          </h4>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>Records deposited on onboarding.</p>
        </div>

        {(() => {
          const rawDocs = fullAdminProfile?.document_path || '';
          const docsList = rawDocs.split(',').map(d => d.trim()).filter(Boolean);

          if (docsList.length === 0) {
            return (
              <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px', fontWeight: '600' }}>No legal records on file.</p>
              </div>
            );
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {docsList.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>📄</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }} title={doc}>
                      {doc}
                    </span>
                  </div>

                  <a
                    href={`http://localhost:5000/uploads/${doc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '4px 10px',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '700',
                      fontSize: '11px',
                      flexShrink: 0
                    }}
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

    </div>

  </div>
)}
        
        

</div>

    </div>
  );
}
