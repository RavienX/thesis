// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
// Two modes:
//   • Teacher  → /register          (name, email, institution, password)
//   • Student  → /join/:classId     (name, email, student ID, year level,
//                                    section/strand, password)
//   After student registers → auto-enrolled in class → redirected to login
import { useState } from "react";
import { registerUser, joinClass } from "./firebase";

// ── Decorative SVGs ──────────────────────────────────────────────────────────
function DNAHelix() {
    return (
        <svg style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", opacity: 0.12, animation: "dna-float 6s ease-in-out infinite", pointerEvents: "none" }} width="80" height="400" viewBox="0 0 80 400" fill="none">
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
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            {[...Array(12)].map((_, i) => (
                <circle key={i} cx={80 + (i % 4) * 200} cy={80 + Math.floor(i / 4) * 180} r={30 + (i % 3) * 15} fill="none" stroke="#86efac" strokeWidth="1.5" />
            ))}
            {[...Array(6)].map((_, i) => (
                <ellipse key={`e${i}`} cx={150 + i * 100} cy={300} rx="40" ry="20" fill="none" stroke="#4ade80" strokeWidth="1" transform={`rotate(${i * 30} ${150 + i * 100} 300)`} />
            ))}
        </svg>
    );
}

// ── Reusable field wrapper ───────────────────────────────────────────────────
function Field({ label, icon, children }) {
    return (
        <div className="rr-field">
            <label>{label}</label>
            <div className="rr-input-wrap">
                <span className="rr-icon">{icon}</span>
                {children}
            </div>
        </div>
    );
}

const YEAR_LEVELS = [
    "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
    "1st Year College", "2nd Year College",
    "3rd Year College", "4th Year College",
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function RegisterPage({ onGoLogin, onRegisterSuccess, classId }) {
    const isStudent = Boolean(classId);
    const role = isStudent ? "student" : "teacher";

    // Shared fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // Teacher-only
    const [institution, setInstitution] = useState("");

    // Student-only
    const [studentId, setStudentId] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [section, setSection] = useState("");

    // UI
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");

        if (!name.trim() || !email.trim() || !password || !confirm) {
            setError("Please fill in all required fields."); return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address."); return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters."); return;
        }
        if (password !== confirm) {
            setError("Passwords do not match."); return;
        }
        if (!isStudent && !institution.trim()) {
            setError("Please enter your institution name."); return;
        }
        if (isStudent) {
            if (!studentId.trim()) { setError("Please enter your Student ID number."); return; }
            if (!yearLevel) { setError("Please select your year level."); return; }
            if (!section.trim()) { setError("Please enter your section or strand."); return; }
        }

        setLoading(true);
        try {
            await registerUser({
                email: email.trim(),
                password,
                name: name.trim(),
                role,
                institution: isStudent ? null : institution.trim(),
                ...(isStudent && {
                    studentId: studentId.trim(),
                    yearLevel,
                    section: section.trim(),
                }),
            });

            if (isStudent && classId) {
                try { await joinClass(classId); }
                catch (e) { console.warn("Auto-enroll failed:", e.message); }
            }

            setSuccess(
                isStudent
                    ? "Account created! You have been enrolled. Taking you in..."
                    : "Teacher account created! Taking you to your dashboard..."
            );
            setTimeout(() => onRegisterSuccess(role), 1600);
        } catch (err) {
            const msg = err.message || "";
            if (msg.includes("email-already-in-use") || msg.includes("already exists")) {
                setError("An account with this email already exists.");
            } else if (msg.includes("weak-password")) {
                setError("Password is too weak. Use at least 6 characters.");
            } else {
                setError(msg || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{STYLES}</style>
            <div className="rr-root">
                <BioPattern />

                {/* MOBILE HERO */}
                <div className="rr-mobile-hero">
                    <div className="rr-mobile-brand">
                        <div className="rr-brand-icon">🧬</div>
                        <span className="rr-brand-name">Bio<span className="rr-brand-green">Research</span></span>
                    </div>
                    <div className="rr-mobile-tagline">
                        {isStudent ? <>Join as a <em>Student</em></> : <>Register as a <em>Teacher</em></>}
                    </div>
                    <p className="rr-mobile-desc">
                        {isStudent
                            ? "Your teacher invited you. Fill in your details to create your student account and join the class."
                            : "Create your educator account to manage classes and track student progress."}
                    </p>
                </div>

                {/* DESKTOP LEFT PANEL */}
                <div className="rr-left">
                    <DNAHelix />
                    <div className="rr-brand">
                        <div className="rr-brand-icon">🧬</div>
                        <span className="rr-brand-name">Bio<span className="rr-brand-green">Research</span></span>
                    </div>

                    {isStudent ? (
                        <>
                            <div className="rr-tagline">You have been <em>invited!</em></div>
                            <p className="rr-desc">Your teacher added you to a class on BioResearch — an interactive biology research manual for students.</p>
                            <div className="rr-benefit-list">
                                <div className="rr-benefit">📖 Access all 5 interactive lessons</div>
                                <div className="rr-benefit">🧪 Complete quizzes and track your scores</div>
                                <div className="rr-benefit">📊 Teacher monitors your progress live</div>
                                <div className="rr-benefit">✅ Auto-enrolled in your class on signup</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="rr-tagline">Begin your <em>research journey</em></div>
                            <p className="rr-desc">Join educators on an interactive platform for biology thesis writing and academic research mastery.</p>
                            <div className="rr-benefit-list">
                                <div className="rr-benefit">🏫 Create and manage multiple classes</div>
                                <div className="rr-benefit">👩‍🎓 Invite students via QR code or link</div>
                                <div className="rr-benefit">📊 Track student progress in real time</div>
                                <div className="rr-benefit">📝 Access the full BioResearch curriculum</div>
                            </div>
                        </>
                    )}
                </div>

                {/* FORM PANEL */}
                <div className="rr-right">
                    <div className="rr-card">

                        {isStudent ? (
                            <>
                                <div className="rr-card-title">Student Registration 🎓</div>
                                <div className="rr-card-sub">Fill in your details to join your class</div>
                                <div className="rr-class-badge">
                                    <span>🔗</span>
                                    <span>You will be auto-enrolled in your class</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="rr-card-title">Teacher Registration 👩‍🏫</div>
                                <div className="rr-card-sub">Create your educator account to get started</div>
                            </>
                        )}

                        {error && <div className="rr-error">⚠️ {error}</div>}
                        {success && <div className="rr-success">✅ {success}</div>}

                        {/* PERSONAL INFO */}
                        <div className="rr-section-label">Personal Information</div>

                        <Field label="Full Name *" icon="👤">
                            <input className="rr-input" type="text"
                                placeholder={isStudent ? "Juan dela Cruz" : "Dr. Elena Santos"}
                                value={name} onChange={e => setName(e.target.value)} disabled={loading} />
                        </Field>

                        <Field label="Email Address *" icon="📧">
                            <input className="rr-input" type="email"
                                placeholder={isStudent ? "student@school.edu" : "professor@university.edu"}
                                value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
                        </Field>

                        {!isStudent && (
                            <Field label="Institution / School *" icon="🏫">
                                <input className="rr-input" type="text"
                                    placeholder="University of the Philippines"
                                    value={institution} onChange={e => setInstitution(e.target.value)} disabled={loading} />
                            </Field>
                        )}

                        {/* STUDENT ACADEMIC INFO */}
                        {isStudent && (
                            <>
                                <div className="rr-section-label">Academic Information</div>

                                <Field label="Student ID Number *" icon="🪪">
                                    <input className="rr-input" type="text"
                                        placeholder="e.g. 2024-00123"
                                        value={studentId} onChange={e => setStudentId(e.target.value)} disabled={loading} />
                                </Field>

                                <div className="rr-field-row">
                                    <div className="rr-field rr-field-half">
                                        <label>Year Level *</label>
                                        <div className="rr-input-wrap">
                                            <span className="rr-icon">📅</span>
                                            <select className="rr-input rr-select"
                                                value={yearLevel} onChange={e => setYearLevel(e.target.value)} disabled={loading}>
                                                <option value="">Select...</option>
                                                {YEAR_LEVELS.map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="rr-field rr-field-half">
                                        <label>Section / Strand *</label>
                                        <div className="rr-input-wrap">
                                            <span className="rr-icon">🏷️</span>
                                            <input className="rr-input" type="text"
                                                placeholder="e.g. STEM-A"
                                                value={section} onChange={e => setSection(e.target.value)} disabled={loading} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SECURITY */}
                        <div className="rr-section-label">Security</div>

                        <Field label="Password *" icon="🔒">
                            <input className="rr-input" type="password"
                                placeholder="At least 6 characters"
                                value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
                        </Field>

                        <Field label="Confirm Password *" icon="🔑">
                            <input className="rr-input" type="password"
                                placeholder="Repeat your password"
                                value={confirm} onChange={e => setConfirm(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleRegister()} disabled={loading} />
                        </Field>

                        <button className="rr-btn" onClick={handleRegister} disabled={loading}>
                            {loading
                                ? "Creating account..."
                                : isStudent
                                    ? "Create Account & Join Class →"
                                    : "Create Teacher Account →"}
                        </button>

                        <div className="rr-switch">
                            Already have an account?{" "}
                            <a onClick={onGoLogin}>Sign in</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
.rr-root{width:100vw;min-height:100vh;display:flex;flex-direction:row;background:#0f2417;position:relative;overflow-x:hidden;font-family:'Plus Jakarta Sans',sans-serif;}

.rr-mobile-hero{display:none;width:100%;padding:40px 22px 26px;background:linear-gradient(160deg,#0f2417 0%,#163020 100%);position:relative;z-index:3;flex-shrink:0;}
.rr-mobile-brand{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.rr-brand-icon{width:42px;height:42px;background:#16a34a;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:21px;box-shadow:0 4px 16px rgba(22,163,74,0.45);flex-shrink:0;}
.rr-brand-name{font-family:'Lora',Georgia,serif;font-size:21px;color:#fff;font-weight:700;}
.rr-brand-green{color:#86efac;}
.rr-mobile-tagline{font-family:'Lora',Georgia,serif;font-size:26px;font-weight:700;color:#fff;line-height:1.3;margin-bottom:12px;}
.rr-mobile-tagline em{color:#86efac;font-style:italic;}
.rr-mobile-desc{font-size:13.5px;color:rgba(255,255,255,0.55);line-height:1.7;}

.rr-left{width:44%;padding:56px 56px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2;background:linear-gradient(135deg,#0f2417 0%,#163020 60%,#0f2417 100%);flex-shrink:0;}
.rr-brand{display:flex;align-items:center;gap:12px;margin-bottom:36px;}
.rr-tagline{font-family:'Lora',Georgia,serif;font-size:34px;font-weight:700;color:#fff;line-height:1.25;margin-bottom:14px;letter-spacing:-0.5px;}
.rr-tagline em{color:#86efac;font-style:italic;}
.rr-desc{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75;max-width:320px;margin-bottom:26px;}
.rr-benefit-list{display:flex;flex-direction:column;gap:9px;}
.rr-benefit{display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,0.75);line-height:1.5;padding:8px 13px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(134,239,172,0.1);}

.rr-right{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:28px 36px 48px;position:relative;z-index:2;overflow-y:auto;}
.rr-card{background:#fff;border-radius:24px;padding:32px 38px 34px;width:100%;max-width:460px;box-shadow:0 24px 64px rgba(0,0,0,0.3);margin:0 auto;}

.rr-card-title{font-family:'Lora',Georgia,serif;font-size:24px;font-weight:700;color:#0d1f12;margin-bottom:4px;}
.rr-card-sub{font-size:13px;color:#4a7a52;margin-bottom:12px;line-height:1.5;}
.rr-class-badge{display:flex;align-items:center;gap:8px;background:#f0fdf4;border:1.5px solid #86efac;border-radius:9px;padding:8px 13px;font-size:12.5px;color:#14532d;font-weight:500;margin-bottom:12px;}

.rr-section-label{font-size:10.5px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;margin-top:16px;padding-bottom:6px;border-bottom:1px solid #f0f9f0;}

.rr-field{margin-bottom:11px;}
.rr-field label{display:block;font-size:11.5px;font-weight:600;color:#0d1f12;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;}
.rr-input-wrap{position:relative;}
.rr-input{width:100%;height:44px;border:1.5px solid #c8e6c8;border-radius:10px;padding:0 14px 0 40px;font-size:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#0d1f12;background:#f5fbf5;outline:none;transition:all 0.2s;box-sizing:border-box;-webkit-appearance:none;appearance:none;}
.rr-input:focus{border-color:#16a34a;background:#fff;box-shadow:0 0 0 3px rgba(22,163,74,0.12);}
.rr-input:disabled{opacity:0.65;cursor:not-allowed;}
.rr-input::placeholder{color:#b0c4b0;}
.rr-select{cursor:pointer;padding-right:14px;}
.rr-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none;z-index:1;}

.rr-field-row{display:flex;gap:12px;}
.rr-field-half{flex:1;min-width:0;margin-bottom:11px;}
.rr-field-half label{display:block;font-size:11.5px;font-weight:600;color:#0d1f12;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:5px;}

.rr-btn{width:100%;height:48px;background:#16a34a;color:#fff;border:none;border-radius:10px;font-size:14.5px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all 0.2s;margin-top:8px;touch-action:manipulation;}
.rr-btn:hover:not(:disabled){background:#15803d;transform:translateY(-1px);box-shadow:0 6px 20px rgba(22,163,74,0.35);}
.rr-btn:disabled{opacity:0.7;cursor:not-allowed;transform:none;}

.rr-switch{text-align:center;font-size:13px;color:#4a7a52;margin-top:14px;}
.rr-switch a{color:#16a34a;font-weight:600;cursor:pointer;text-decoration:none;}
.rr-switch a:hover{text-decoration:underline;}

.rr-error{background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;padding:10px 14px;font-size:13px;color:#991b1b;margin-bottom:12px;}
.rr-success{background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:10px 14px;font-size:13px;color:#14532d;margin-bottom:12px;}

@keyframes dna-float{0%,100%{transform:translateY(-50%) rotate(0deg);}50%{transform:translateY(-52%) rotate(2deg);}}

@media(max-width:768px){
  .rr-root{flex-direction:column;}
  .rr-mobile-hero{display:flex;flex-direction:column;}
  .rr-left{display:none;}
  .rr-right{flex:unset;width:100%;align-items:flex-start;padding:0 16px 52px;}
  .rr-card{padding:26px 18px 32px;border-radius:18px;max-width:100%;}
  .rr-card-title{font-size:21px;}
  .rr-field-row{flex-direction:column;gap:0;}
}
`;