import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import adminImg from '../assets/admin.jpg';
import tenantImg from '../assets/tenant.jpg';
import heroDashboardImg from '../assets/dashboard.png';
import contactPlantImg from '../assets/contact.jpg'; 
import ctaBgImg from '../assets/work.jpg';
import logoImg from '../assets/logo.jpg'; // 👈 .png-க்கு பதிலாக .jpg என மாற்றவும் 

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 🌟 Contact Form State
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '', 
    message: '' 
  });
  
  const sectionRefs = {
    hero: useRef(null),
    features: useRef(null),
    roles: useRef(null),
    benefits: useRef(null),
    cta: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const options = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, options);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white text-dark min-vh-100" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      
      {/* ========================================================= */}
      {/* ===== STYLES & FULL SCREEN WIDTH LAYOUT ===== */}
      {/* ========================================================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        .section-hero, .section-features, .section-roles, .section-benefits, .section-cta, .section-contact {
          opacity: 0; transform: translateY(20px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .section-hero.animate-in, .section-features.animate-in, .section-roles.animate-in, .section-benefits.animate-in, .section-cta.animate-in, .section-contact.animate-in {
          opacity: 1; transform: translateY(0);
        }

        /* NAVBAR */
        .navbar-clean {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 16px 5%;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }
        .navbar-clean.scrolled {
          padding: 10px 5%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .brand-logo {
          font-size: 20px; font-weight: 800; color: #0f172a; text-decoration: none;
          display: flex; align-items: center; gap: 8px;
        }
        .brand-icon {
          background: #2563eb; color: #fff; padding: 4px 10px; border-radius: 8px;
          font-size: 14px; font-weight: 800;
        }
        .nav-link-item {
          font-size: 13.5px; font-weight: 500; color: #475569; text-decoration: none;
          padding: 6px 12px; border-radius: 6px; transition: all 0.2s;
        }
        .nav-link-item:hover { color: #2563eb; background: #eff6ff; }

        .btn-login-clean {
          background: transparent; color: #2563eb; border: 1.5px solid #2563eb;
          padding: 6px 18px; border-radius: 50px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-login-clean:hover { background: #eff6ff; }
        .btn-demo-clean {
          background: #2563eb; color: #fff; border: none; padding: 7px 20px;
          border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .btn-demo-clean:hover { background: #1d4ed8; transform: translateY(-1px); }

        /* HAMBURGER & MOBILE MENU */
        .hamburger-btn {
          display: none; background: transparent; border: none; font-size: 24px; color: #0f172a; cursor: pointer;
        }
        .mobile-menu-drawer {
          position: fixed; top: 65px; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 15px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 10px;
          z-index: 999;
        }

        /* HERO SECTION */
        .hero-clean { padding: 130px 5% 70px; background: #fff; width: 100%; }
        .hero-title { font-size: 48px; font-weight: 800; color: #0f172a; line-height: 1.15; letter-spacing: -1.5px; margin-bottom: 16px; }
        .hero-title .highlight { background: linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-desc { font-size: 16px; color: #64748b; line-height: 1.7; margin-bottom: 24px; max-width: 580px; }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
          background: #eff6ff; color: #2563eb; border-radius: 50px; font-size: 13px; font-weight: 600;
          margin-right: 8px; margin-bottom: 10px; border: 1px solid rgba(37,99,235,0.1);
        }

        /* FEATURES SECTION (MARQUEE SCROLL) */
        .features-section { padding: 70px 0; background: #f8fafc; width: 100%; overflow: hidden; }
        .marquee-container { overflow: hidden; width: 100%; position: relative; padding: 10px 0; display: flex; }
        .marquee-track-right-to-left { display: flex; gap: 20px; width: max-content; animation: scrollLeft 35s linear infinite; }
        .marquee-track-left-to-right { display: flex; gap: 20px; width: max-content; animation: scrollRight 35s linear infinite; }

        @keyframes scrollLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes scrollRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

        .marquee-container:hover .marquee-track-right-to-left,
        .marquee-container:hover .marquee-track-left-to-right { animation-play-state: paused; }

        .tool-card-clean {
          background: #fff; border-radius: 14px; padding: 24px 20px; border: 1px solid #e2e8f0;
          width: 300px; flex-shrink: 0; text-align: center; transition: all 0.3s ease;
        }
        .tool-card-clean:hover { transform: translateY(-3px); border-color: #2563eb; box-shadow: 0 10px 25px rgba(37,99,235,0.06); }
        .feature-icon-box {
          width: 48px; height: 48px; border-radius: 12px; background: #eff6ff; color: #16a34a;
          display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 12px;
        }

        /* ROLES SECTION */
        .roles-section { padding: 80px 5%; background: #fff; width: 100%; }
        .role-card-clean {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 35px 30px; height: 100%;
          transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.01);
        }
        .role-card-clean:hover { transform: translateY(-3px); border-color: #2563eb; box-shadow: 0 12px 30px rgba(37,99,235,0.06); }
        .role-icon-wrap { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .role-check-item { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #475569; padding: 5px 0; }
        .role-check-dot { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; color: #fff; }
        .role-check-dot.admin { background: #2563eb; }
        .role-check-dot.tenant { background: #16a34a; }

        .img-fix-container {
          width: 100%; height: 200px; display: flex; align-items: center; justify-content: center;
          background: transparent !important; border: none !important; box-shadow: none !important; padding: 0; overflow: hidden;
        }
        .img-fix-container img {
          width: 100%; height: 100%; object-fit: contain !important; background: transparent !important;
        }

        /* BENEFITS SECTION */
        .benefits-section-clean { padding: 80px 5%; background: #f8fafc; width: 100%; }
        .benefit-card-clean {
          background: #fff; border-radius: 16px; padding: 25px 20px; border: 1px solid #e2e8f0;
          text-align: center; height: 100%; transition: all 0.3s ease;
        }
        .benefit-card-clean:hover { transform: translateY(-3px); border-color: #2563eb; box-shadow: 0 10px 25px rgba(37,99,235,0.06); }

        /* ===== PROFESSIONAL IMAGE CTA BANNER (Buttons Aligned Left) ===== */
        .cta-clean { padding: 30px 5%; width: 100%; background: #fff; }
        .cta-box-image-banner {
          position: relative;
          background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 55%, rgba(37, 99, 235, 0.4) 100%);
          border-radius: 24px;
          padding: 50px 50px;
          color: #fff;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(37,99,235,0.15);
        }
        .cta-bg-image {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 50%;
          height: 100%;
          background-image: url(${ctaBgImg});
          background-size: cover;
          background-position: center;
          opacity: 0.85;
          mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%);
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%);
          z-index: 1;
        }
        .cta-content-area {
          position: relative;
          z-index: 2;
        }

        /* FULL-SCREEN CONTACT SECTION WITH IMAGE */
        .contact-section-fullscreen {
          padding: 80px 5%; background: #fff; width: 100%; min-height: 90vh;
          display: flex; align-items: center; justify-content: center;
        }
        .contact-fullscreen-content {
          width: 100%; max-width: 1400px;
          background: #fff; border: 1.5px solid #e2e8f0; border-radius: 28px;
          padding: 60px; box-shadow: 0 15px 45px rgba(0,0,0,0.03);
        }
        .contact-input-white {
          background: #f8fafc !important; border: 1.5px solid #e2e8f0 !important;
          padding: 14px 18px !important; border-radius: 12px !important; font-size: 14.5px !important;
          color: #0f172a !important; transition: all 0.2s !important;
        }
        .contact-input-white:focus {
          border-color: #2563eb !important; box-shadow: 0 0 0 4px rgba(37,99,235,0.08) !important; background: #fff !important;
        }
        .contact-info-item { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 18px; }
        .contact-icon-box {
          width: 44px; height: 44px; border-radius: 12px; background: #eff6ff; color: #2563eb;
          display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
        }
        .contact-img-fix {
          width: 100%; height: 210px; object-fit: contain !important; background: transparent !important;
        }

        /* PROFESSIONAL FOOTER */
        .footer-pro-compact {
          background: #0b0f19; color: #fff; padding: 45px 5% 25px;
          width: 100%; border-top: 1px solid #1e293b;
        }
        .footer-heading {
          font-size: 14.5px; font-weight: 700; color: #fff; margin-bottom: 15px; letter-spacing: 0.5px;
        }
        .footer-link {
          color: #94a3b8; text-decoration: none; font-size: 13.5px; transition: all 0.2s ease; display: inline-block; margin-bottom: 8px;
        }
        .footer-link:hover { color: #2563eb; transform: translateX(3px); }
        .footer-bottom-center {
          border-top: 1px solid #1e293b; margin-top: 35px; padding-top: 20px;
          text-align: center; color: #94a3b8; font-size: 13px;
        }
        .footer-company-link {
          color: #38bdf8; font-weight: 600; text-decoration: none; transition: color 0.2s;
        }
        .footer-company-link:hover { color: #60a5fa; text-decoration: underline; }

        @media (max-width: 992px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
          .hero-title { font-size: 36px; }
          .contact-fullscreen-content { padding: 30px 20px; }
          .cta-bg-image { display: none; } 
          .cta-box-image-banner { padding: 35px 25px; }
        }
      `}</style>


      {/* ============================================================ */}
      {/* ===== NAVBAR ===== */}
      {/* ============================================================ */}
      <nav className={`navbar-clean ${scrolled ? 'scrolled' : ''}`}>
  <div className="d-flex align-items-center justify-content-between w-100">
    <a className="brand-logo text-decoration-none" href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      
      {/* 🌟 லோகோ படம் மற்றும் அளவு */}
      <img 
        src={logoImg} 
        alt="QSpace Logo" 
        style={{ height: '48px', width: 'auto', objectFit: 'contain' }} 
      />

      {/* 🌟 QSpace டைட்டில் பெயர் */}
      <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
        QSpace
      </span>

    </a>

    <div className="desktop-nav d-none d-lg-flex align-items-center">
      <a className="nav-link-item" href="#home">Home</a>
      <a className="nav-link-item" href="#features">Features</a>
      <a className="nav-link-item" href="#roles">Who Can Use</a>
      <a className="nav-link-item" href="#benefits">Benefits</a>
      <a className="nav-link-item" href="#contact">Contact</a>
    </div>

    <div className="d-flex align-items-center gap-2">
      <button onClick={() => navigate('/login')} className="btn-login-clean d-none d-sm-block">Login</button>
      <a href="#contact" className="btn-demo-clean d-none d-lg-block text-decoration-none text-center">Book a Demo</a>
      
      <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? '✕' : '☰'}
      </button>
    </div>
  </div>

  {mobileMenuOpen && (
    <div className="mobile-menu-drawer d-lg-none">
      <a className="nav-link-item" href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
      <a className="nav-link-item" href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
      <a className="nav-link-item" href="#roles" onClick={() => setMobileMenuOpen(false)}>Who Can Use</a>
      <a className="nav-link-item" href="#benefits" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
      <a className="nav-link-item" href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
      <div className="pt-2 border-top d-flex flex-column gap-2">
        <button onClick={() => navigate('/login')} className="btn-login-clean w-100 py-2">Login</button>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="btn-demo-clean w-100 py-2 text-decoration-none text-center">Book a Demo</a>
      </div>
    </div>
  )}
</nav>


      {/* ============================================================ */}
      {/* ===== HERO SECTION ===== */}
      {/* ============================================================ */}
      <section className="hero-clean section-hero" id="home" ref={sectionRefs.hero}>
        <div className="row align-items-center g-5 w-100 m-0">
          <div className="col-lg-6 ps-lg-4">
            <span className="hero-tag">✦ All-in-One ERP</span>
            <h1 className="hero-title mt-2">
              All-in-One Coworking <br />
              <span className="highlight">Space Management ERP</span>
            </h1>
            <p className="hero-desc">
              Manage your workspaces, members, bookings, billing, employees and more — from a single, powerful platform.
            </p>

            <div className="mb-3">
              <span className="hero-tag">⚡ Smart Management</span>
              <span className="hero-tag">📊 Real-time Insights</span>
              <span className="hero-tag">⭐ Better Experience</span>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <a href="#contact" className="btn-demo-clean px-4.5 py-3 text-decoration-none">
                Get Started Free
              </a>
              <button onClick={() => navigate('/login')} className="btn-login-clean px-4.5 py-3">
                Explore Features
              </button>
            </div>
          </div>

          <div className="col-lg-6 pe-lg-4 text-center">
            <div className="hero-image-wrap d-inline-block w-100">
              <img 
                src={heroDashboardImg} 
                alt="Dashboard Preview" 
                className="img-fluid w-100 rounded-4 shadow-sm"
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* ===== FEATURES SECTION ===== */}
      {/* ============================================================ */}
      <section id="features" className="features-section section-features" ref={sectionRefs.features}>
        <div className="text-center mb-4">
          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: 11.5, letterSpacing: '1.5px' }}>Features</span>
          <h2 className="fw-bold fs-2 text-dark mt-1 mb-2">What Can You Do With This Tool?</h2>
          <p className="text-muted small">Powerful features to simplify and automate your coworking space operations.</p>
        </div>

        <div className="marquee-container mb-3">
          <div className="marquee-track-right-to-left">
            {[
              { icon: '🏢', title: 'Manage Workspaces', desc: 'Manage locations & track occupancy.' },
              { icon: '👥', title: 'Tenant Management', desc: 'Add and manage tenants & companies.' },
              { icon: '🪑', title: 'Seat & Space Management', desc: 'Hot desks and private cabins.' },
              { icon: '📅', title: 'Meeting Room Booking', desc: 'Manage conference room schedules.' },
              { icon: '🏢', title: 'Manage Workspaces', desc: 'Manage locations & track occupancy.' },
              { icon: '👥', title: 'Tenant Management', desc: 'Add and manage tenants & companies.' },
            ].map((item, i) => (
              <div className="tool-card-clean" key={i}>
                <div className="feature-icon-box">{item.icon}</div>
                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: 15 }}>{item.title}</h6>
                <p className="text-muted small mb-0" style={{ fontSize: 13, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee-track-left-to-right">
            {[
              { icon: '💰', title: 'Invoice & Billing', desc: 'Generate invoices and track payments.' },
              { icon: '📄', title: 'Document Management', desc: 'Securely store agreements & records.' },
              { icon: '🔧', title: 'Complaint Management', desc: 'Address and resolve tenant issues.' },
              { icon: '📊', title: 'Dashboard & Reports', desc: 'Real-time revenue and booking stats.' },
              { icon: '💰', title: 'Invoice & Billing', desc: 'Generate invoices and track payments.' },
              { icon: '📄', title: 'Document Management', desc: 'Securely store agreements & records.' },
            ].map((item, i) => (
              <div className="tool-card-clean" key={i}>
                <div className="feature-icon-box">{item.icon}</div>
                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: 15 }}>{item.title}</h6>
                <p className="text-muted small mb-0" style={{ fontSize: 13, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* ===== WHO CAN USE (ROLES) ===== */}
      {/* ============================================================ */}
      <section id="roles" className="roles-section section-roles" ref={sectionRefs.roles}>
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: 11.5, letterSpacing: '1.5px' }}>Who Can Use Us</span>
          <h2 className="fw-bold fs-2 text-dark mt-1 mb-2">Designed for Everyone in Your Coworking Ecosystem</h2>
          <p className="text-muted small">Role-based access for different users to manage and access the right information.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="role-card-clean">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="role-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>👑</div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: 19 }}>Admin / Workspace Manager</h5>
                  </div>
                </div>
                <span className="badge" style={{ background: '#eff6ff', color: '#2563eb', fontWeight: 600, fontSize: 11, padding: '5px 12px', borderRadius: '6px' }}>Full Control</span>
              </div>
              <p className="text-muted small mb-3" style={{ fontSize: 14, lineHeight: 1.6 }}>
                Admins have full control over all operations and can manage everything from a centralized dashboard.
              </p>

              <div className="row align-items-center g-3">
                <div className="col-md-7">
                  <div className="d-flex flex-column gap-2">
                    {[
                      'Manage workspaces, seats, and facilities',
                      'Add and manage tenants, employees, and companies',
                      'Handle billing, invoices, and payments',
                      'Manage meeting rooms and bookings',
                      'Monitor reports, revenue, and performance',
                      'Manage complaints, notices, and announcements'
                    ].map((text, i) => (
                      <div className="role-check-item" key={i}>
                        <div className="role-check-dot admin">✓</div>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-5 text-center">
                  <div className="img-fix-container" style={{ height: '180px' }}>
                    <img src={adminImg} alt="Admin Working" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="role-card-clean">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="role-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>👤</div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: 19 }}>Tenant / Member</h5>
                  </div>
                </div>
                <span className="badge" style={{ background: '#f0fdf4', color: '#16a34a', fontWeight: 600, fontSize: 11, padding: '5px 12px', borderRadius: '6px' }}>Self-Service</span>
              </div>
              <p className="text-muted small mb-3" style={{ fontSize: 14, lineHeight: 1.6 }}>
                Tenants get a self-service portal to access everything they need, anytime.
              </p>

              <div className="row align-items-center g-3">
                <div className="col-md-7">
                  <div className="d-flex flex-column gap-2">
                    {[
                      'View workspace and membership details',
                      'Check assigned seats or cabins',
                      'Book meeting rooms and check availability',
                      'View invoices and payment history',
                      'Raise complaints and track status',
                      'Access important documents and agreements'
                    ].map((text, i) => (
                      <div className="role-check-item" key={i}>
                        <div className="role-check-dot tenant">✓</div>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-5 text-center">
                  <div className="img-fix-container" style={{ height: '180px' }}>
                    <img src={tenantImg} alt="Tenant Working" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* ===== BENEFITS SECTION ===== */}
      {/* ============================================================ */}
      <section id="benefits" className="benefits-section-clean section-benefits" ref={sectionRefs.benefits}>
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase" style={{ fontSize: 11.5, letterSpacing: '1.5px' }}>Key Benefits</span>
          <h2 className="fw-bold fs-2 text-dark mt-1 mb-2">Why Coworking Space Owners & Managers Love Our ERP</h2>
        </div>

        <div className="row g-4">
          {[
            { icon: '⏱️', title: 'Save Time', desc: 'Automate repetitive tasks and reduce manual work.' },
            { icon: '🏢', title: 'Everything In One Place', desc: 'Manage all operations from a single platform.' },
            { icon: '📈', title: 'Better Business Insights', desc: 'Real-time dashboards for better decisions.' },
            { icon: '😊', title: 'Improved Experience', desc: 'Provide a smooth experience for members.' },
            { icon: '💰', title: 'Revenue Management', desc: 'Track payments and revenue efficiently.' },
            { icon: '🛡️', title: 'Secure Data', desc: 'Keep business and tenant data safe.' },
            { icon: '🚀', title: 'Scalable Growth', desc: 'Grow from one location to multiple branches.' },
            { icon: '⚡', title: 'Increased Efficiency', desc: 'Streamline operations and improve productivity.' },
          ].map((item, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <div className="benefit-card-clean">
                <div style={{ fontSize: 26, marginBottom: 10 }}>{item.icon}</div>
                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: 15 }}>{item.title}</h6>
                <p className="text-muted small mb-0" style={{ fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ============================================================ */}
      {/* ===== CTA SECTION WITH LOCAL IMAGE BANNER (Buttons Aligned Left) ===== */}
      {/* ============================================================ */}
      <section className="cta-clean section-cta" ref={sectionRefs.cta}>
        <div className="cta-box-image-banner">
          <div className="cta-bg-image"></div>
          <div className="row align-items-center g-4 cta-content-area">
            <div className="col-lg-7 text-start">
              <h3 className="fw-bold mb-2 text-white" style={{ fontSize: 28, letterSpacing: '-0.5px' }}>
                Ready to Simplify Your Coworking Space Management?
              </h3>
              <p className="text-white-50 mb-4" style={{ fontSize: 14.5 }}>
                Join hundreds of coworking spaces that trust Q4flow ERP to run their business smarter and more efficiently.
              </p>
              <div className="d-flex gap-3 justify-content-start">
                <a href="#contact" className="btn btn-light fw-bold px-4 py-2.5 rounded-pill text-decoration-none text-dark shadow-sm" style={{ fontSize: 14 }}>Request Demo</a>
                <a href="#contact" className="btn btn-outline-light fw-bold px-4 py-2.5 rounded-pill text-decoration-none" style={{ fontSize: 14 }}>Talk to Sales</a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* ===== FULL-SCREEN CONTACT SECTION WITH IMAGE & INFO ===== */}
      {/* ============================================================ */}
      <section id="contact" className="contact-section-fullscreen section-contact" ref={sectionRefs.contact}>
        <div className="contact-fullscreen-content">
          <div className="row g-5 align-items-center w-100 m-0">
            
            <div className="col-lg-5">
              <span className="text-primary fw-bold text-uppercase" style={{ fontSize: 11.5, letterSpacing: '1px' }}>Contact Us</span>
              <h2 className="fw-bold text-dark mt-1 mb-3" style={{ fontSize: 30, lineHeight: 1.25 }}>Let's Talk About Your Workspace</h2>
              <p className="text-muted small mb-4" style={{ fontSize: 14, lineHeight: 1.7 }}>
                Have questions or want to see our ERP in action? Reach out to us or fill out the form.
              </p>

              <div className="mb-4 text-center">
                <img 
                  src={contactPlantImg} 
                  alt="Workspace Illustration" 
                  className="img-fluid rounded-3 shadow-sm contact-img-fix"
                />
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="contact-info-item mb-0">
                  <div className="contact-icon-box">📞</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Call Us</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a' }}>+91 9965604236</div>
                  </div>
                </div>
                <div className="contact-info-item mb-0">
                  <div className="contact-icon-box">✉️</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Email Us</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a' }}>qifawtechnologies@gmail.com</div>
                  </div>
                </div>
                <div className="contact-info-item mb-0">
                  <div className="contact-icon-box">📍</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Location</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#0f172a' }}>PS. No. 8, First Floor, Beside Zackria Complex, Junction, Central Bustand, Trichy - 620001</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7 ps-lg-5">
              <h4 className="fw-bold text-dark mb-1" style={{ fontSize: 24 }}>Send a Message</h4>
              <p className="text-muted small mb-4">Fill out the form and we'll respond promptly.</p>

              {/* 🌟 Google Apps Script Connected Form */}
              <form onSubmit={async (e) => { 
                e.preventDefault(); 
                try {
                  const response = await fetch('https://script.google.com/macros/s/AKfycby7ax_F_vnHdtEG5OH1vxyPyTIjflpp6kLLVEz8dULNoXynYEmzviKeapzaQOKSeTEQuw/exec', {
                    method: 'POST',
                    body: JSON.stringify(contactForm)
                  });
                  
                  const result = await response.json();
                  if (result.success) {
                    alert('✅ Message sent successfully! We have received your message in our email.');
                    setContactForm({ name: '', email: '', phone: '', company: '', message: '' });
                  } else {
                    alert('Failed to send message. Please try again.');
                  }
                } catch (err) {
                  console.error(err);
                  alert('Server connection error.');
                }
              }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary mb-1" style={{ fontSize: 13 }}>Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="form-control contact-input-white" 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary mb-1" style={{ fontSize: 13 }}>Your Email</label>
                    <input 
                      type="email" 
                      required 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="form-control contact-input-white" 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary mb-1" style={{ fontSize: 13 }}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="form-control contact-input-white" 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-secondary mb-1" style={{ fontSize: 13 }}>Company / Workspace</label>
                    <input 
                      type="text" 
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      className="form-control contact-input-white" 
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-secondary mb-1" style={{ fontSize: 13 }}>Message</label>
                    <textarea 
                      rows="4" 
                      required 
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="form-control contact-input-white"
                    ></textarea>
                  </div>
                  <div className="col-12 mt-3">
                    <button type="submit" className="btn-demo-clean py-3.5 w-100" style={{ fontSize: 15.5 }}>
                      Send Message 🚀
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* ===== PROFESSIONAL FOOTER ===== */}
      {/* ============================================================ */}
      <footer className="footer-pro-compact" id="policy">
        <div className="row g-4 w-100 m-0 align-items-center">
          
          <div className="col-lg-4">
            <a className="brand-logo text-white mb-2" href="#home" style={{ fontSize: 16 }}>
              <span className="brand-icon" style={{ fontSize: 12, padding: '3px 8px' }}>CW</span>
              CoWork ERP
            </a>
            <p className="text-white-50 small mb-0" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
              All-in-one solution to manage your coworking spaces, members, billing, bookings and more.
            </p>
          </div>

          <div className="col-lg-4">
            <h6 className="footer-heading">Contact Details</h6>
            <div className="d-flex flex-column gap-1 text-white-50 small" style={{ fontSize: 13 }}>
              <div>📞 <b>Phone:</b> +91 9965604236</div>
              <div>✉️ <b>Email:</b> qifawtechnologies@gmail.com</div>
              <div>📍 <b>Location:</b> PS. No. 8, First Floor, Beside Zackria Complex, Junction, Central Bustand, Trichy - 620001</div>
            </div>
          </div>

          <div className="col-lg-4">
            <h6 className="footer-heading">Quick Links & Policy</h6>
            <div className="d-flex gap-4">
              <div className="d-flex flex-column">
                <a href="#home" className="footer-link">Home</a>
                <a href="#features" className="footer-link">Features</a>
              </div>
              <div className="d-flex flex-column">
                <a href="#contact" className="footer-link">Contact</a>
                {/* <a href="#policy" className="footer-link">Privacy Policy</a> */}
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom-center">
          © 2026 CoWork ERP. Developed by <a href="https://qifawtechnologies.com/" target="_blank" rel="noopener noreferrer" className="footer-company-link">Qifaw Technologies</a>. All rights reserved.
        </div>
      </footer>

    </div>
  );
}