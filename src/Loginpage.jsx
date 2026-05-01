// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
// Updated to use Firebase Authentication via loginUser()
import { useState } from "react";
import { loginUser, getUserProfile } from "./firebase";

function DNAHelix() {
  return (
    <svg style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", opacity: 0.12, animation: "dna-float 6s ease-in-out infinite" }} width="80" height="400" viewBox="0 0 80 400" fill="none">
      {Array.from({ length: 10 }).map((_, i) => {
        const y1 = i * 40 + 20;
        const x1 = 10 + Math.sin((i / 10) * Math.PI * 2) * 30;
        const x2 = 70 - Math.sin((i / 10) * Math.PI * 2) * 30;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y1} stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
            <circle cx={x1} cy={y1} r="5" fill="#16a34a" />
            <circle cx={x2} cy={y1} r="5" fill="#0d9488" />
          </g>
        );
      })}
    </svg>
  );
}

function BioPattern() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={80 + (i % 4) * 200} cy={80 + Math.floor(i / 4) * 180} r={30 + (i % 3) * 15} fill="none" stroke="#86efac" strokeWidth="1.5" />
      ))}
      {[...Array(6)].map((_, i) => (
        <ellipse key={"e" + i} cx={150 + i * 100} cy={300} rx="40" ry="20" fill="none" stroke="#4ade80" strokeWidth="1" transform={"rotate(" + (i * 30) + " " + (150 + i * 100) + " 300)"} />
      ))}
    </svg>
  );
}

export default function LoginPage({ onLogin, onGoRegister, successMsg }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Sign in with Firebase Auth
      await loginUser(email, password);

      // 2. Fetch full profile from Firestore via Cloud Function
      const { user } = await getUserProfile();

      // 3. Pass user to parent (App.jsx)
      onLogin(user);
    } catch (err) {
      // Map Firebase error codes to friendly messages
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a moment and try again.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.message || "Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lr-root">
        <BioPattern />

        {/* MOBILE HERO */}
        <div className="lr-mobile-hero">
          <div className="lr-mobile-brand">
            <div className="lr-brand-icon">🧬</div>
            <span className="lr-brand-name">Bio<span className="lr-brand-green">Research</span></span>
          </div>
          <div className="lr-mobile-tagline">Master the art of <em>scientific inquiry</em></div>
          <p className="lr-mobile-desc">An interactive research manual for biology students navigating thesis writing, methodology, and academic research.</p>
        </div>

        {/* DESKTOP LEFT */}
        <div className="lr-left">
          <DNAHelix />
          <div className="lr-brand">
            <div className="lr-brand-icon">🧬</div>
            <span className="lr-brand-name">Bio<span className="lr-brand-green">Research</span></span>
          </div>
          <div className="lr-tagline">Master the art of <em>scientific inquiry</em></div>
          <p className="lr-desc">An interactive research manual designed for biology students navigating thesis writing, methodology, and academic research skills.</p>
        </div>

        {/* FORM PANEL */}
        <div className="lr-right">
          <div className="lr-card">
            <div className="lr-card-title">Welcome back 🌿</div>
            <div className="lr-card-sub">Sign in to continue your research journey</div>
            {successMsg && <div className="lr-success">✅ {successMsg}</div>}
            {error && <div className="lr-error">⚠️ {error}</div>}
            <div className="lr-field">
              <label>Email Address</label>
              <div className="lr-input-wrap">
                <span className="lr-icon">📧</span>
                <input className="lr-input" type="email" placeholder="student@university.edu"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} disabled={loading} />
              </div>
            </div>
            <div className="lr-field">
              <label>Password</label>
              <div className="lr-input-wrap">
                <span className="lr-icon">🔒</span>
                <input className="lr-input" type="password" placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} disabled={loading} />
              </div>
            </div>
            <button className="lr-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
            <div className="lr-divider"><hr /><span>or</span><hr /></div>
            <div className="lr-switch">
              Don't have an account? <a onClick={onGoRegister}>Create one free</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.lr-root {
  width: 100vw; min-height: 100vh; display: flex; flex-direction: row;
  background: #0f2417; position: relative; overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.lr-mobile-hero { display: none; width: 100%; padding: 40px 22px 26px; background: linear-gradient(160deg, #0f2417 0%, #163020 100%); position: relative; z-index: 3; flex-shrink: 0; }
.lr-mobile-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.lr-brand-icon { width: 42px; height: 42px; background: #16a34a; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 21px; box-shadow: 0 4px 16px rgba(22,163,74,0.45); flex-shrink: 0; }
.lr-brand-name { font-family: 'Lora', Georgia, serif; font-size: 21px; color: #fff; font-weight: 700; }
.lr-brand-green { color: #86efac; }
.lr-mobile-tagline { font-family: 'Lora', Georgia, serif; font-size: 26px; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 12px; }
.lr-mobile-tagline em { color: #86efac; font-style: italic; }
.lr-mobile-desc { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.7; }
.lr-left { width: 48%; flex-shrink: 0; padding: 56px 64px; display: flex; flex-direction: column; justify-content: center; position: relative; z-index: 2; background: linear-gradient(135deg, #0f2417 0%, #163020 60%, #0f2417 100%); }
.lr-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
.lr-tagline { font-family: 'Lora', Georgia, serif; font-size: 36px; font-weight: 700; color: #fff; line-height: 1.25; margin-bottom: 16px; }
.lr-tagline em { color: #86efac; font-style: italic; }
.lr-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.75; max-width: 340px; }
.lr-right { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; z-index: 2; }
.lr-card { background: #fff; border-radius: 24px; padding: 40px 44px; width: 100%; max-width: 420px; box-shadow: 0 24px 64px rgba(0,0,0,0.3); }
.lr-card-title { font-family: 'Lora', Georgia, serif; font-size: 26px; font-weight: 700; color: #0d1f12; margin-bottom: 6px; }
.lr-card-sub { font-size: 13px; color: #4a7a52; margin-bottom: 28px; line-height: 1.5; }
.lr-field { margin-bottom: 18px; }
.lr-field label { display: block; font-size: 12px; font-weight: 600; color: #0d1f12; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
.lr-input-wrap { position: relative; }
.lr-input { width: 100%; height: 46px; border: 1.5px solid #c8e6c8; border-radius: 10px; padding: 0 14px 0 40px; font-size: 16px; font-family: 'Plus Jakarta Sans', sans-serif; color: #0d1f12; background: #f5fbf5; outline: none; transition: all 0.2s; box-sizing: border-box; }
.lr-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
.lr-input:disabled { opacity: 0.7; cursor: not-allowed; }
.lr-input::placeholder { color: #b0c4b0; }
.lr-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
.lr-btn { width: 100%; height: 48px; background: #16a34a; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.2s; margin-top: 4px; touch-action: manipulation; }
.lr-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22,163,74,0.35); }
.lr-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.lr-divider { display: flex; align-items: center; gap: 10px; margin: 20px 0; }
.lr-divider hr { flex: 1; border: none; height: 1px; background: #c8e6c8; }
.lr-divider span { font-size: 11px; color: #7aaa7a; text-transform: uppercase; letter-spacing: 0.5px; }
.lr-switch { text-align: center; font-size: 13px; color: #4a7a52; margin-top: 20px; }
.lr-switch a { color: #16a34a; font-weight: 600; cursor: pointer; text-decoration: none; }
.lr-switch a:hover { text-decoration: underline; }
.lr-success { background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #14532d; margin-bottom: 16px; }
.lr-error { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #991b1b; margin-bottom: 16px; }
@keyframes dna-float { 0%,100%{transform:translateY(-50%) rotate(0deg);}50%{transform:translateY(-52%) rotate(2deg);} }
@media (max-width: 768px) { .lr-root { flex-direction: column; } .lr-mobile-hero { display: flex; flex-direction: column; } .lr-left { display: none; } .lr-right { flex: unset; width: 100%; justify-content: flex-start; padding: 0 16px 48px; } .lr-card { padding: 28px 20px; border-radius: 18px; max-width: 100%; } }
`;