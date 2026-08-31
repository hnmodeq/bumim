'use client';

import { FormEvent, useEffect, useState } from 'react';

const ADMIN_USER = 'hnmodeq';
const ADMIN_PASS = 'asdasd123xX';
const SESSION_KEY = 'bumim_admin';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(237,241,236,0.14)',
  borderRadius: '10px',
  color: '#edf1ec',
  fontSize: '15px',
  fontFamily: '"Space Grotesk", system-ui, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function AdminPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(SESSION_KEY) === 'granted') {
      setLoggedIn(true);
    }
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    // brief delay so the button feedback is visible
    window.setTimeout(() => {
      if (user.trim() === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(SESSION_KEY, 'granted');
        // full navigation so the home page's inline scripts run and the panel shows
        window.location.href = '/';
      } else {
        setError('Invalid username or password.');
        setBusy(false);
      }
    }, 400);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
    setUser('');
    setPass('');
    setError('');
  }

  return (
    <>
      <style>{`html,body{height:auto!important;min-height:100%}body{overflow:auto!important}body.locked{overflow:auto!important}`}</style>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
          color: '#edf1ec',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: 'rgba(13,17,15,0.9)',
            border: '1px solid rgba(237,241,236,0.12)',
            borderRadius: '16px',
            padding: '32px 28px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.02em', color: '#f0a800' }}>
              Bumim
            </div>
            <div style={{ fontSize: 12, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#76827a', marginTop: 6 }}>
              Studio admin
            </div>
          </div>

          {loggedIn ? (
            <div>
              <p style={{ fontSize: 14, color: '#edf1ec', margin: '0 0 20px' }}>
                You are signed in as an admin. The live control panel is available on the home page.
              </p>
              <a
                href="/"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '13px 18px',
                  background: '#f0a800',
                  color: '#050706',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                Open the control panel
              </a>
              <button
                onClick={logout}
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '11px 18px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#edf1ec',
                  border: '1px solid rgba(237,241,236,0.14)',
                  borderRadius: '10px',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: '#76827a' }}>
                Username
              </label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ ...inputStyle, marginBottom: 16 }}
                autoComplete="username"
                placeholder="admin"
              />

              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: '#76827a' }}>
                Password
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                style={{ ...inputStyle, marginBottom: 20 }}
                autoComplete="current-password"
                placeholder="••••••••"
              />

              {error && (
                <p style={{ fontSize: 13, color: '#ff9c9c', margin: '0 0 16px' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  background: '#f0a800',
                  color: '#050706',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  cursor: busy ? 'wait' : 'pointer',
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, fontSize: 11, color: '#76827a', lineHeight: 1.6 }}>
            The live control panel lets admins tweak accent colours, fonts, section visibility and
            typography. Credentials are validated client-side for convenience only — this is not a
            substitute for server-side access control.
          </div>
        </div>
      </div>
    </>
  );
}
