
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🌟 லோகோவை ஸ்டோர் செய்து எடுப்பது
  const [appLogo, setAppLogo] = useState(() => {
    return localStorage.getItem('persistent_base64_logo') || 'https://via.placeholder.com/40?text=Q';
  });
  
  const [companyTitle, setCompanyTitle] = useState('Qifaw Technologies');

  // இமேஜை Base64-ஆக மாற்றி நிரந்தரமாக ஸ்டோர் செய்யும் ஃபங்ஷன்
  const handleCustomLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAppLogo(base64String);
        localStorage.setItem('persistent_base64_logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (data.role === 'superadmin') {
        
        localStorage.removeItem('admin_username');
        navigate('/super-admin-dashboard');
      } else if (data.role === 'admin') {
        localStorage.setItem('admin_username', username);
        navigate('/admin-dashboard');
      } else if (data.role === 'tenant') {
        localStorage.removeItem('admin_username');
        localStorage.setItem(
          'tenant_info',
          JSON.stringify(data.tenant)
        );
        navigate('/tenant-dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server connection error!');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f1f5f9',
      fontFamily: 'Calibri, sans-serif',
      margin: 0,
      padding: window.innerWidth < 768 ? '10px' : '20px',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      overflowY: 'auto'
    }}>
      {/* Inline Animation Style & Responsive Media Query */}
      <style>
        {`
          @keyframes fadeInSlide {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-corporate-form {
            animation: fadeInSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .form-input-field:focus {
            border-color: #2563eb !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
          }
          .submit-btn:hover {
            background-color: #1d4ed8 !important;
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35) !important;
          }
          /* 🌟 Mobile Responsive Adjustments */
          @media (max-width: 900px) {
            .login-card-container {
              flex-direction: column !important;
              height: auto !important;
              max-height: 95vh !important;
              overflow-y: auto !important;
            }
            .left-banner-side {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Perfect Center Floating Corporate Modal Card */}
      <div className="login-card-container" style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1100px',
        height: '670px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #e2e8f0',
        margin: 'auto',
        zIndex: 10
      }}>
        
        {/* Top-Right 'X' Close Button */}
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 40,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          title="Back to Home"
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#475569'; }}
        >
          <span style={{ fontSize: '20px', fontWeight: 'bold', lineHeight: 1 }}>&times;</span>
        </button>

        {/* Left Side: Workspace Image Showcase with 3 Feature Cards */}
        <div className="left-banner-side" style={{
          flex: 1.1,
          position: 'relative',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.75)), url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '45px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#ffffff',
          fontFamily: 'Calibri, sans-serif'
        }}>
          <div></div>

          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 14px 0', color: '#ffffff', fontFamily: 'Calibri, sans-serif' }}>
              Welcome Back
            </h1>
            <div style={{ width: '45px', height: '4px', backgroundColor: '#3b82f6', marginBottom: '16px', borderRadius: '2px' }}></div>
            <p style={{ fontSize: '15px', color: '#cbd5e1', margin: 0, lineHeight: '1.5', maxWidth: '340px', fontFamily: 'Calibri, sans-serif' }}>
              Sign in to your workspace and manage everything in one place.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontFamily: 'Calibri, sans-serif' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '14px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '16px', marginBottom: '6px' }}>👥</div>
              <h6 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', color: '#fff', fontFamily: 'Calibri, sans-serif' }}>Smart Workspace</h6>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.25', fontFamily: 'Calibri, sans-serif' }}>Manage rooms, members and resources efficiently</p>
            </div>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '14px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '16px', marginBottom: '6px' }}>📅</div>
              <h6 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', color: '#fff', fontFamily: 'Calibri, sans-serif' }}>Easy Booking</h6>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.25', fontFamily: 'Calibri, sans-serif' }}>Book meeting rooms in just a few clicks</p>
            </div>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '14px 10px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '16px', marginBottom: '6px' }}>📊</div>
              <h6 style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', color: '#fff', fontFamily: 'Calibri, sans-serif' }}>Real-time Insights</h6>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.25', fontFamily: 'Calibri, sans-serif' }}>Track occupancy and usage in real-time</p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Corporate Login Form */}
        <div style={{
          flex: 1.15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          fontFamily: 'Calibri, sans-serif',
          padding: window.innerWidth < 768 ? '25px 20px' : '35px 50px',
          overflowY: 'auto'
        }}>
          
          <div className="animate-corporate-form" style={{
            width: '100%',
            maxWidth: '390px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>

            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <label title="Click to upload/change logo" style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '12px' }}>
                <div style={{ width: '65px', height: '65px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={appLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <input type="file" accept="image/*" onChange={handleCustomLogoUpload} style={{ display: 'none' }} />
              </label>
              <h3 style={{ fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', fontSize: '24px', fontFamily: 'Calibri, sans-serif' }}>
                Sign in to your account
              </h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0, fontFamily: 'Calibri, sans-serif' }}>
                Enter your credentials to access your dashboard
              </p>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                borderRadius: '8px',
                fontSize: '13.5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontWeight: '600',
                border: '1px solid #fecaca',
                fontFamily: 'Calibri, sans-serif'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontFamily: 'Calibri, sans-serif' }}>
              <div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '13px', left: '14px', color: '#94a3b8', fontSize: '15px' }}>👤</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-input-field"
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      fontFamily: 'Calibri, sans-serif',
                      transition: 'all 0.25s ease'
                    }}
                    placeholder="Username or Email"
                  />
                </div>
              </div>

              <div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '13px', left: '14px', color: '#94a3b8', fontSize: '15px' }}>🔒</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input-field"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 40px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      fontFamily: 'Calibri, sans-serif',
                      transition: 'all 0.25s ease'
                    }}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '14px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      fontSize: '15px'
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontFamily: 'Calibri, sans-serif' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', cursor: 'pointer', fontFamily: 'Calibri, sans-serif', fontWeight: '500' }}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                  Remember me
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password recovery feature.'); }} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontFamily: 'Calibri, sans-serif' }}>
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit"
                className="submit-btn"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.25s ease',
                  marginTop: '4px',
                  fontFamily: 'Calibri, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>🔒</span> Sign In
              </button>
            </form>

            {/* Footer SSL Protection */}
            <div style={{ textAlign: 'center', marginTop: '25px', fontFamily: 'Calibri, sans-serif' }}>
              <span style={{ fontSize: '11.5px', color: '#94a3b8', fontFamily: 'Calibri, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                🛡️ Secure login protected by 256-bit SSL encryption
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}