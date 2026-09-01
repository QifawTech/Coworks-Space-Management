import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // அட்மினுக்கான நோட்டிஃபிகேஷன் டேட்டாவை பேக்-என்டில் இருந்து ஃபெட்ச் செய்தல்
  useEffect(() => {
    // 🌟 இந்தப்பக்கத்திற்கு வந்தவுடன் பெல் ஐகானில் உள்ள சிவப்பு கவுண்ட் மறைந்துவிடும்
    localStorage.setItem('adminUnreadCount', '0');

    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Error fetching all notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: "'Inter', 'Segoe UI', Calibri, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Top Header & Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ fontSize: '28px' }}>🔔</span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>All Notifications</h2>
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Here you can view all historical notifications and activities from your tenants.</p>
        </div>
        
        <button 
          onClick={() => navigate('/admin-dashboard')}
          style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#334155', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Notifications List Container */}
      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Notification History Logs</h4>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '10px' }}>
            Total: {notifications.length}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8', fontSize: '14.5px', fontWeight: '600' }}>No notifications found. All records are clear!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notifications.map((notif, index) => (
              <div 
                key={notif.id || index} 
                style={{ 
                  padding: '18px 20px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '14px', 
                  borderLeft: '5px solid #2563eb', 
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '14.5px', color: '#1e293b', fontWeight: '700', lineHeight: '1.4' }}>
                    {index + 1}. {notif.message}
                  </p>
                  <small style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>📅 Received On: {notif.date || notif.date_sent || 'N/A'}</small>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: '700', padding: '4px 12px', backgroundColor: '#e0e7ff', color: '#2563eb', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  System Log
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}