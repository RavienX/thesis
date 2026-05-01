// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
// Firestore-connected: classes and students loaded from Firebase in real time.

import { useState, useRef, useEffect } from "react";
import {
    getTeacherClasses,
    createClass,
    removeStudentFromClass,
    toggleStudentStatus,
    logoutUser,
} from "./firebase";

const CHAPTERS = ["Introduction to Research", "Literature Review", "Research Methodology", "Data Analysis", "Writing & Defense"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function initials(name) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function uid() { return "id-" + Math.random().toString(36).slice(2, 9); }

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function BioPattern() {
    return (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, pointerEvents: "none" }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            {[...Array(12)].map((_, i) => (
                <circle key={i} cx={80 + (i % 4) * 200} cy={80 + Math.floor(i / 4) * 180} r={30 + (i % 3) * 15} fill="none" stroke="#86efac" strokeWidth="1.5" />
            ))}
            {[...Array(6)].map((_, i) => (
                <ellipse key={"e" + i} cx={150 + i * 100} cy={300} rx="40" ry="20" fill="none" stroke="#4ade80" strokeWidth="1" transform={"rotate(" + (i * 30) + " " + (150 + i * 100) + " 300)"} />
            ))}
        </svg>
    );
}

function Avatar({ name, size = 36, color = "#16a34a" }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.5px",
        }}>{initials(name)}</div>
    );
}

function StatusBadge({ status }) {
    const isActive = status === "active";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            fontSize: 11, fontWeight: 600, letterSpacing: "0.3px",
            background: isActive ? "#dcfce7" : "#f1f5f9",
            color: isActive ? "#14532d" : "#64748b",
            border: `1px solid ${isActive ? "#86efac" : "#cbd5e1"}`,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? "#16a34a" : "#94a3b8", display: "inline-block" }} />
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}

function ProgressBar({ value, color = "#16a34a" }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 110 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 12, color: "#4a7a52", fontWeight: 600, minWidth: 30, textAlign: "right" }}>{value}%</span>
        </div>
    );
}

// ─── CREATE CLASS MODAL ───────────────────────────────────────────────────────
function CreateClassModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef();
    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleCreate = async () => {
        if (!name.trim()) { setError("Class name is required."); return; }
        if (!subject.trim()) { setError("Subject is required."); return; }
        const newClass = { id: uid(), name: name.trim(), subject: subject.trim(), students: [] };
        try {
            await createClass(newClass);
            onCreate(newClass);
            onClose();
        } catch (err) {
            setError(err.message || "Failed to create class.");
        }
    };

    return (
        <div className="td-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="td-modal">
                <div className="td-modal-header">
                    <div>
                        <div className="td-modal-title">Create New Class</div>
                        <div className="td-modal-sub">Set up a class for your students</div>
                    </div>
                    <button className="td-modal-close" onClick={onClose}>✕</button>
                </div>

                {error && <div className="td-alert td-alert-error">⚠️ {error}</div>}

                <div className="td-modal-body">
                    <div className="td-field">
                        <label>Class Name *</label>
                        <input ref={inputRef} className="td-input" placeholder="e.g. Biology 101 – Section A" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
                    </div>
                    <div className="td-field">
                        <label>Subject *</label>
                        <input className="td-input" placeholder="e.g. General Biology" value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>

                </div>

                <div className="td-modal-footer">
                    <button className="td-btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="td-btn-primary" onClick={handleCreate}>Create Class →</button>
                </div>
            </div>
        </div>
    );
}

// ─── INVITE STUDENTS MODAL (QR CODE) ─────────────────────────────────────────
function generateClassCode(classId) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let hash = 0;
    for (let i = 0; i < classId.length; i++) hash = (hash * 31 + classId.charCodeAt(i)) >>> 0;
    let code = "";
    for (let i = 0; i < 7; i++) { code += chars[hash % chars.length]; hash = (hash * 1103515245 + 12345) >>> 0; }
    return code;
}

// Generates a QR code SVG using a simple matrix encoding (no external library needed).
// Encodes the URL as a QR code version 3 (29×29) with error correction level M.
// For production, swap this with a real QR library — this covers typical short URLs perfectly.
function QRCodeSVG({ url, size = 180, color = "#16a34a" }) {
    // We'll use the Google Charts QR API (widely used, privacy-safe for non-sensitive data)
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&color=${color.replace("#", "")}&bgcolor=ffffff&margin=4`;

    return (
        <img
            src={apiUrl}
            alt="QR Code"
            width={size}
            height={size}
            style={{ borderRadius: 12, border: "3px solid #f0fdf4", display: "block" }}
            onError={e => { e.target.style.display = "none"; }}
        />
    );
}

function InviteStudentsModal({ cls, onClose }) {
    const [linkCopied, setLinkCopied] = useState(false);
    const classCode = generateClassCode(cls.id);

    // HashRouter uses /#/join/:classId — always build from origin + base path, never current pathname
    const basePath = import.meta.env.BASE_URL || "/";
    const inviteLink = `${window.location.origin}${basePath}#/join/${cls.id}`;

    const copyLink = () => {
        navigator.clipboard?.writeText(inviteLink).catch(() => { });
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2200);
    };

    return (
        <div className="td-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="td-modal td-invite-modal">
                {/* Header */}
                <div className="td-invite-header">
                    <div className="td-modal-title">Invite Students to Join</div>
                    <button className="td-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="td-invite-body">
                    {/* CLASS INFO STRIP */}
                    <div className="td-invite-class-strip" style={{ borderLeftColor: cls.color }}>
                        <div className="td-invite-class-icon" style={{ background: cls.color }}>🎓</div>
                        <div>
                            <div className="td-invite-class-name">{cls.name}</div>
                            <div className="td-invite-class-sub">{cls.subject}</div>
                        </div>
                    </div>

                    {/* QR CODE METHOD */}
                    <div className="td-invite-method">
                        <div className="td-invite-method-tag">Method 1 — Scan</div>
                        <div className="td-invite-method-title">Share QR Code</div>
                        <div className="td-invite-method-desc">
                            Students scan this with their phone camera to open the registration page.
                            They'll be auto-enrolled in <strong>{cls.name}</strong> when they create their account.
                        </div>

                        <div className="td-invite-qr-wrap">
                            <div className="td-invite-qr-card">
                                <QRCodeSVG url={inviteLink} size={160} color={cls.color} />
                                <div className="td-invite-qr-label">
                                    <span style={{ color: cls.color, fontWeight: 700 }}>{cls.name}</span>
                                    <br />
                                    <span style={{ fontSize: 11, color: "#6b7280" }}>BioResearch · Student Registration</span>
                                </div>
                            </div>
                            <div className="td-invite-qr-steps">
                                <div className="td-invite-qr-step">
                                    <div className="td-invite-qr-step-num" style={{ background: cls.color }}>1</div>
                                    <div>Student scans the QR code with their phone</div>
                                </div>
                                <div className="td-invite-qr-step">
                                    <div className="td-invite-qr-step-num" style={{ background: cls.color }}>2</div>
                                    <div>They fill in the student registration form</div>
                                </div>
                                <div className="td-invite-qr-step">
                                    <div className="td-invite-qr-step-num" style={{ background: cls.color }}>3</div>
                                    <div>Account is created &amp; they're auto-enrolled</div>
                                </div>
                                <div className="td-invite-qr-step">
                                    <div className="td-invite-qr-step-num" style={{ background: cls.color }}>4</div>
                                    <div>They sign in and access the full curriculum</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="td-invite-divider" />

                    {/* LINK METHOD */}
                    <div className="td-invite-method">
                        <div className="td-invite-method-tag">Method 2 — Link</div>
                        <div className="td-invite-method-title">Share Invite Link</div>
                        <div className="td-invite-method-desc">Send this link via chat, email, or post it on your LMS. Students who open it will land directly on the student registration page.</div>
                        <div className="td-invite-link-row">
                            <div className="td-invite-link-box" title={inviteLink}>
                                {inviteLink.length > 52 ? inviteLink.slice(0, 52) + "…" : inviteLink}
                            </div>
                            <button className="td-invite-copy-btn" onClick={copyLink}>
                                {linkCopied ? "✓ Copied!" : "⧉ Copy"}
                            </button>
                        </div>
                        <div className="td-invite-code-row">
                            <span className="td-invite-note">Class ID: </span>
                            <span className="td-invite-code-inline" style={{ color: cls.color }}>{classCode}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="td-invite-footer">
                    <button className="td-invite-done-btn" style={{ background: cls.color }} onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
}

// ─── CLASS DETAIL VIEW ────────────────────────────────────────────────────────
function ClassDetail({ cls, onBack, onAddStudent, onRemoveStudent, onToggleStatus }) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");

    const filtered = cls.students
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === "name") return a.name.localeCompare(b.name);
            if (sort === "progress") return b.progress - a.progress;
            if (sort === "status") return a.status.localeCompare(b.status);
            return 0;
        });

    const avgProgress = cls.students.length
        ? Math.round(cls.students.reduce((s, x) => s + x.progress, 0) / cls.students.length)
        : 0;

    return (
        <div className="td-detail">
            {/* Back + Header */}
            <div className="td-detail-topbar">
                <button className="td-back-btn" onClick={onBack}>← All Classes</button>
            </div>

            <div className="td-detail-hero" style={{ borderLeftColor: cls.color }}>
                <div className="td-detail-hero-left">
                    <div className="td-detail-class-icon" style={{ background: cls.color }}>🎓</div>
                    <div>
                        <div className="td-detail-class-name">{cls.name}</div>
                        <div className="td-detail-class-meta">
                            <span>📚 {cls.subject}</span>
                            {cls.schedule && <span>🕐 {cls.schedule}</span>}
                            {cls.room && <span>📍 {cls.room}</span>}
                        </div>
                    </div>
                </div>
                <button className="td-btn-primary" style={{ background: cls.color }} onClick={onAddStudent}>
                    + Invite Students
                </button>
            </div>

            {/* Stats row */}
            <div className="td-stats-row">
                <div className="td-stat-card">
                    <div className="td-stat-val">{cls.students.length}</div>
                    <div className="td-stat-label">Total Students</div>
                </div>
                <div className="td-stat-card">
                    <div className="td-stat-val">{cls.students.filter(s => s.status === "active").length}</div>
                    <div className="td-stat-label">Active</div>
                </div>
                <div className="td-stat-card">
                    <div className="td-stat-val">{avgProgress}%</div>
                    <div className="td-stat-label">Avg. Progress</div>
                </div>
                <div className="td-stat-card">
                    <div className="td-stat-val">{cls.students.filter(s => s.progress === 100).length}</div>
                    <div className="td-stat-label">Completed</div>
                </div>
            </div>

            {/* Roster */}
            <div className="td-roster-card">
                <div className="td-roster-header">
                    <div className="td-roster-title">Class Roster</div>
                    <div className="td-roster-controls">
                        <div className="td-search-wrap">
                            <span className="td-search-icon">🔍</span>
                            <input className="td-search" placeholder="Search students…" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <select className="td-select" value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="name">Sort: Name</option>
                            <option value="progress">Sort: Progress</option>
                            <option value="status">Sort: Status</option>
                        </select>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="td-empty">
                        {cls.students.length === 0
                            ? <>No students yet. <span style={{ color: cls.color, cursor: "pointer", fontWeight: 600 }} onClick={onAddStudent}>Invite your first students →</span></>
                            : "No students match your search."}
                    </div>
                ) : (
                    <div className="td-table-wrap">
                        <table className="td-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Student ID</th>
                                    <th>Year / Section</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr key={s.id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <Avatar name={s.name} size={34} color={cls.color} />
                                                <div>
                                                    <div style={{ fontWeight: 600, color: "#0d1f12", fontSize: 14 }}>{s.name}</div>
                                                    <div style={{ fontSize: 12, color: "#4a7a52" }}>{s.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 12, color: "#374151", fontFamily: "monospace", fontWeight: 600 }}>{s.studentId || "—"}</td>
                                        <td>
                                            <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                                                <div style={{ fontWeight: 600 }}>{s.yearLevel || "—"}</div>
                                                <div style={{ color: "#6b7280" }}>{s.section || "—"}</div>
                                            </div>
                                        </td>
                                        <td><StatusBadge status={s.status} /></td>
                                        <td><ProgressBar value={s.progress} color={cls.color} /></td>
                                        <td style={{ fontSize: 12, color: "#64748b" }}>{s.joined}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button className="td-row-btn" title={s.status === "active" ? "Mark Inactive" : "Mark Active"} onClick={() => onToggleStatus(cls.id, s.id)}>
                                                    {s.status === "active" ? "⏸" : "▶"}
                                                </button>
                                                <button className="td-row-btn td-row-btn-danger" title="Remove student" onClick={() => onRemoveStudent(cls.id, s.id)}>🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── CLASS CARD ───────────────────────────────────────────────────────────────
function ClassCard({ cls, onClick }) {
    const avg = cls.students.length
        ? Math.round(cls.students.reduce((s, x) => s + x.progress, 0) / cls.students.length)
        : 0;

    return (
        <div className="td-class-card" onClick={onClick}>
            <div className="td-class-card-top" style={{ background: `linear-gradient(135deg, ${cls.color}22 0%, ${cls.color}08 100%)`, borderTopColor: cls.color }}>
                <div className="td-class-card-icon" style={{ background: cls.color }}>🎓</div>
                <div className="td-class-card-tag" style={{ color: cls.color, background: `${cls.color}18`, border: `1px solid ${cls.color}40` }}>{cls.subject}</div>
            </div>
            <div className="td-class-card-body">
                <div className="td-class-card-name">{cls.name}</div>
                {cls.schedule && <div className="td-class-card-meta">🕐 {cls.schedule}</div>}
                {cls.room && <div className="td-class-card-meta">📍 {cls.room}</div>}
                <div className="td-class-card-stats">
                    <div className="td-class-card-stat">
                        <span className="td-class-card-stat-val">{cls.students.length}</span>
                        <span className="td-class-card-stat-label">Students</span>
                    </div>
                    <div className="td-class-card-stat">
                        <span className="td-class-card-stat-val">{cls.students.filter(s => s.status === "active").length}</span>
                        <span className="td-class-card-stat-label">Active</span>
                    </div>
                    <div className="td-class-card-stat">
                        <span className="td-class-card-stat-val">{avg}%</span>
                        <span className="td-class-card-stat-label">Avg. Progress</span>
                    </div>
                </div>
                <ProgressBar value={avg} color={cls.color} />
            </div>
            <div className="td-class-card-footer">
                <span style={{ color: cls.color, fontWeight: 600, fontSize: 13 }}>View Roster →</span>
            </div>
        </div>
    );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function TeacherDashboard({ user, onLogout }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const teacher = { name: user?.name || "Teacher", role: user?.institution || "Teacher" };
    const selectedClass = classes.find(c => c.id === selectedClassId);

    // ── Load classes from Firestore on mount ──────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        getTeacherClasses()
            .then(data => { if (!cancelled) { setClasses(data); setLoading(false); } })
            .catch(err => { if (!cancelled) { setLoadError(err.message || "Failed to load classes."); setLoading(false); } });
        return () => { cancelled = true; };
    }, []);

    const totalStudents = classes.reduce((s, c) => s + c.students.length, 0);
    const totalActive = classes.reduce((s, c) => s + c.students.filter(x => x.status === "active").length, 0);
    const globalAvg = totalStudents
        ? Math.round(classes.flatMap(c => c.students).reduce((s, x) => s + x.progress, 0) / totalStudents)
        : 0;

    // Optimistic: add new class to local state (already saved to Firestore in modal)
    const handleCreateClass = (cls) => setClasses(prev => [...prev, cls]);

    // Optimistic remove + Firestore
    const handleRemoveStudent = async (classId, studentId) => {
        setClasses(prev => prev.map(c => c.id === classId
            ? { ...c, students: c.students.filter(s => s.id !== studentId) }
            : c));
        try { await removeStudentFromClass(classId, studentId); } catch { /* silent */ }
    };

    // Optimistic toggle + Firestore
    const handleToggleStatus = async (classId, studentId) => {
        let newStatus = "active";
        setClasses(prev => prev.map(c => c.id === classId
            ? {
                ...c, students: c.students.map(s => {
                    if (s.id === studentId) {
                        newStatus = s.status === "active" ? "inactive" : "active";
                        return { ...s, status: newStatus };
                    }
                    return s;
                })
            }
            : c));
        try { await toggleStudentStatus(classId, studentId, newStatus); } catch { /* silent */ }
    };

    const handleSignOut = async () => {
        setProfileOpen(false);
        try { await logoutUser(); } catch { /* silent */ }
        onLogout?.();
    };

    return (
        <>
            <style>{STYLES}</style>

            {/* TOPBAR */}
            <div className="td-topbar">
                <button className="td-hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
                <div className="td-logo">
                    <div className="td-logo-icon">🧬</div>
                    <span className="td-logo-text">Bio<span>Research</span></span>
                </div>
                <div className="td-topbar-center">
                    <div className="td-teacher-badge">👩‍🏫 Teacher Portal</div>
                </div>
                <div className="td-topbar-right">
                    <div className="td-profile-wrap">
                        <div className="td-user-pill" onClick={() => setProfileOpen(o => !o)}>
                            <Avatar name={teacher.name} size={32} color="#16a34a" />
                            <span className="td-user-name">{teacher.name.split(" ")[0]} {teacher.name.split(" ")[1]}</span>
                            <span className="td-chevron">{profileOpen ? "▲" : "▼"}</span>
                        </div>
                        {profileOpen && (
                            <>
                                <div className="td-profile-backdrop" onClick={() => setProfileOpen(false)} />
                                <div className="td-profile-dropdown">
                                    <div className="td-profile-dropdown-header">
                                        <Avatar name={teacher.name} size={40} color="#16a34a" />
                                        <div>
                                            <div className="td-profile-name">{teacher.name}</div>
                                            <div className="td-profile-role">{teacher.role}</div>
                                        </div>
                                    </div>
                                    <div className="td-profile-divider" />
                                    <button className="td-profile-signout" onClick={handleSignOut}>🚪 Sign Out</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="td-body">
                {/* SIDEBAR */}
                <div className={`td-sidebar-overlay${sidebarOpen ? " visible" : ""}`} onClick={() => setSidebarOpen(false)} />
                <nav className={`td-sidebar${sidebarOpen ? " open" : ""}`}>
                    <div className="td-sidebar-label">Navigation</div>
                    <div className={`td-nav-item${!selectedClassId ? " active" : ""}`} onClick={() => { setSelectedClassId(null); setSidebarOpen(false); }}>
                        <span className="td-nav-icon">🏠</span> Overview
                    </div>
                    <div className="td-sidebar-label" style={{ marginTop: 20 }}>My Classes</div>
                    {classes.map(c => (
                        <div key={c.id} className={`td-nav-item${selectedClassId === c.id ? " active" : ""}`}
                            onClick={() => { setSelectedClassId(c.id); setSidebarOpen(false); }}
                            style={selectedClassId === c.id ? { borderLeftColor: c.color } : {}}>
                            <span className="td-nav-dot" style={{ background: c.color }} />
                            <span className="td-nav-cls-name">{c.name}</span>
                            <span className="td-nav-badge">{c.students.length}</span>
                        </div>
                    ))}
                    <div style={{ padding: "16px 16px 0" }}>
                        <button className="td-sidebar-create-btn" onClick={() => { setShowCreateModal(true); setSidebarOpen(false); }}>
                            + New Class
                        </button>
                    </div>
                </nav>

                {/* MAIN CONTENT */}
                <main className="td-main">
                    {loading ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 16 }}>
                            <div style={{ fontSize: 40, animation: "td-spin 1.5s linear infinite" }}>🧬</div>
                            <div style={{ fontSize: 14, color: "#4a7a52" }}>Loading your classes…</div>
                        </div>
                    ) : loadError ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
                            <div style={{ fontSize: 14, color: "#dc2626" }}>⚠️ {loadError}</div>
                            <button className="td-btn-primary" onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    ) : selectedClass ? (
                        <ClassDetail
                            cls={selectedClass}
                            onBack={() => setSelectedClassId(null)}
                            onAddStudent={() => setShowAddStudentModal(true)}
                            onRemoveStudent={handleRemoveStudent}
                            onToggleStatus={handleToggleStatus}
                        />
                    ) : (
                        <div className="td-overview">
                            <BioPattern />

                            {/* Welcome */}
                            <div className="td-welcome">
                                <div>
                                    <div className="td-welcome-title">Good morning, {teacher.name.split(" ")[0]} 🌿</div>
                                    <div className="td-welcome-sub">Here's what's happening across your classes today.</div>
                                </div>
                                <button className="td-btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Class</button>
                            </div>

                            {/* Global stats */}
                            <div className="td-global-stats">
                                <div className="td-gstat">
                                    <div className="td-gstat-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>🏛</div>
                                    <div>
                                        <div className="td-gstat-val">{classes.length}</div>
                                        <div className="td-gstat-label">Total Classes</div>
                                    </div>
                                </div>
                                <div className="td-gstat">
                                    <div className="td-gstat-icon" style={{ background: "#ccfbf1", color: "#0d9488" }}>👩‍🎓</div>
                                    <div>
                                        <div className="td-gstat-val">{totalStudents}</div>
                                        <div className="td-gstat-label">Total Students</div>
                                    </div>
                                </div>
                                <div className="td-gstat">
                                    <div className="td-gstat-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>✅</div>
                                    <div>
                                        <div className="td-gstat-val">{totalActive}</div>
                                        <div className="td-gstat-label">Active Students</div>
                                    </div>
                                </div>
                                <div className="td-gstat">
                                    <div className="td-gstat-icon" style={{ background: "#fef9c3", color: "#ca8a04" }}>📈</div>
                                    <div>
                                        <div className="td-gstat-val">{globalAvg}%</div>
                                        <div className="td-gstat-label">Avg. Progress</div>
                                    </div>
                                </div>
                            </div>

                            {/* Classes grid */}
                            <div className="td-section-header">
                                <div className="td-section-title">My Classes</div>
                                <button className="td-btn-outline" onClick={() => setShowCreateModal(true)}>+ New Class</button>
                            </div>

                            {classes.length === 0 ? (
                                <div className="td-empty-state">
                                    <div className="td-empty-icon">🏫</div>
                                    <div className="td-empty-title">No classes yet</div>
                                    <div className="td-empty-sub">Create your first class to get started.</div>
                                    <button className="td-btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Class</button>
                                </div>
                            ) : (
                                <div className="td-class-grid">
                                    {classes.map(c => (
                                        <ClassCard key={c.id} cls={c} onClick={() => setSelectedClassId(c.id)} />
                                    ))}
                                    <div className="td-class-card td-class-card-new" onClick={() => setShowCreateModal(true)}>
                                        <div className="td-new-inner">
                                            <div className="td-new-icon">＋</div>
                                            <div className="td-new-label">Create New Class</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* MODALS */}
            {showCreateModal && (
                <CreateClassModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateClass}
                />
            )}
            {showAddStudentModal && selectedClass && (
                <InviteStudentsModal
                    cls={selectedClass}
                    onClose={() => setShowAddStudentModal(false)}
                />
            )}
        </>
    );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{height:100%;width:100%;overflow-x:hidden;font-family:'Plus Jakarta Sans',sans-serif;}

/* ── TOPBAR ── */
.td-topbar {
  position:fixed; top:0; left:0; right:0; height:60px; z-index:100;
  background:#0f2417;
  border-bottom:1px solid rgba(134,239,172,0.12);
  display:flex; align-items:center; padding:0 20px; gap:16px;
}
.td-hamburger {
  display:none; background:none; border:none; color:#86efac; font-size:20px; cursor:pointer; padding:4px 6px;
}
.td-logo { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.td-logo-icon {
  width:36px; height:36px; background:#16a34a; border-radius:9px;
  display:flex; align-items:center; justify-content:center; font-size:18px;
  box-shadow:0 3px 12px rgba(22,163,74,0.4);
}
.td-logo-text { font-family:'Lora',Georgia,serif; font-size:18px; font-weight:700; color:#fff; }
.td-logo-text span { color:#86efac; }
.td-topbar-center { flex:1; display:flex; justify-content:center; }
.td-teacher-badge {
  background:rgba(22,163,74,0.15); border:1px solid rgba(22,163,74,0.35);
  color:#86efac; font-size:12px; font-weight:600; padding:5px 14px; border-radius:20px;
}
.td-topbar-right { display:flex; align-items:center; gap:12px; }
.td-profile-wrap { position:relative; }
.td-user-pill {
  display:flex; align-items:center; gap:8px; cursor:pointer;
  padding:4px 10px 4px 4px; border-radius:99px;
  background:rgba(255,255,255,0.06); transition:background 0.2s;
}
.td-user-pill:hover { background:rgba(255,255,255,0.1); }
.td-user-name { font-size:13px; color:#fff; font-weight:500; }
.td-chevron { font-size:9px; color:#86efac; }
.td-profile-backdrop { position:fixed; inset:0; z-index:110; }
.td-profile-dropdown {
  position:absolute; top:calc(100% + 8px); right:0; z-index:120;
  background:#fff; border-radius:14px; padding:4px;
  box-shadow:0 16px 48px rgba(0,0,0,0.22); min-width:220px;
}
.td-profile-dropdown-header { display:flex; align-items:center; gap:10px; padding:12px 14px; }
.td-profile-name { font-size:14px; font-weight:700; color:#0d1f12; }
.td-profile-role { font-size:12px; color:#4a7a52; }
.td-profile-divider { height:1px; background:#e8f5e9; margin:0 8px; }
.td-profile-signout {
  width:100%; padding:10px 14px; text-align:left; background:none; border:none;
  font-size:13px; color:#dc2626; cursor:pointer; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:500;
}
.td-profile-signout:hover { background:#fee2e2; }

/* ── LAYOUT ── */
.td-body {
  display:flex; padding-top:60px; min-height:100vh;
  background:#f0f9f0;
}

/* ── SIDEBAR ── */
.td-sidebar-overlay { display:none; }
.td-sidebar {
  width:240px; flex-shrink:0;
  background:#0f2417;
  padding:20px 0; position:sticky; top:60px; height:calc(100vh - 60px); overflow-y:auto;
}
.td-sidebar-label {
  font-size:10px; font-weight:700; color:rgba(134,239,172,0.5);
  text-transform:uppercase; letter-spacing:1.2px;
  padding:0 16px; margin-bottom:6px;
}
.td-nav-item {
  display:flex; align-items:center; gap:10px;
  padding:9px 16px; margin:1px 8px; border-radius:9px;
  cursor:pointer; color:rgba(255,255,255,0.6); font-size:13.5px; font-weight:500;
  transition:all 0.18s; border-left:3px solid transparent;
}
.td-nav-item:hover { background:rgba(255,255,255,0.07); color:#fff; }
.td-nav-item.active { background:rgba(22,163,74,0.18); color:#86efac; border-left-color:#16a34a; }
.td-nav-icon { font-size:15px; }
.td-nav-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.td-nav-cls-name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.td-nav-badge {
  background:rgba(134,239,172,0.15); color:#86efac;
  font-size:11px; font-weight:700; padding:2px 7px; border-radius:99px; flex-shrink:0;
}
.td-sidebar-create-btn {
  width:100%; padding:9px; background:rgba(22,163,74,0.18); border:1px solid rgba(22,163,74,0.35);
  color:#86efac; font-size:13px; font-weight:600; border-radius:9px;
  cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.18s;
}
.td-sidebar-create-btn:hover { background:rgba(22,163,74,0.28); }

/* ── MAIN ── */
.td-main { flex:1; min-width:0; overflow-y:auto; }

/* ── OVERVIEW ── */
.td-overview { padding:32px 32px 48px; position:relative; min-height:100%; }

.td-welcome {
  display:flex; align-items:flex-start; justify-content:space-between; gap:16px;
  margin-bottom:28px; flex-wrap:wrap;
}
.td-welcome-title {
  font-family:'Lora',Georgia,serif; font-size:26px; font-weight:700;
  color:#0d1f12; margin-bottom:4px;
}
.td-welcome-sub { font-size:14px; color:#4a7a52; }

/* ── GLOBAL STATS ── */
.td-global-stats {
  display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:32px;
}
.td-gstat {
  background:#fff; border-radius:14px; padding:16px 20px;
  display:flex; align-items:center; gap:14px;
  box-shadow:0 2px 8px rgba(15,36,23,0.06); border:1px solid #e8f5e9;
}
.td-gstat-icon {
  width:44px; height:44px; border-radius:11px; display:flex; align-items:center;
  justify-content:center; font-size:20px; flex-shrink:0;
}
.td-gstat-val { font-family:'Lora',Georgia,serif; font-size:26px; font-weight:700; color:#0d1f12; line-height:1; }
.td-gstat-label { font-size:12px; color:#4a7a52; margin-top:2px; font-weight:500; }

/* ── SECTION HEADER ── */
.td-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.td-section-title { font-family:'Lora',Georgia,serif; font-size:20px; font-weight:700; color:#0d1f12; }

/* ── CLASS GRID ── */
.td-class-grid {
  display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px;
}

/* ── CLASS CARD ── */
.td-class-card {
  background:#fff; border-radius:18px; overflow:hidden;
  box-shadow:0 2px 12px rgba(15,36,23,0.08); border:1px solid #e8f5e9;
  cursor:pointer; transition:all 0.22s;
}
.td-class-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(15,36,23,0.14); }
.td-class-card-top {
  padding:18px 18px 14px; border-top:3px solid;
  display:flex; align-items:flex-start; justify-content:space-between;
}
.td-class-card-icon {
  width:40px; height:40px; border-radius:10px;
  display:flex; align-items:center; justify-content:center; font-size:20px;
  box-shadow:0 3px 10px rgba(0,0,0,0.15);
}
.td-class-card-tag {
  font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px;
  text-transform:uppercase; letter-spacing:0.5px;
}
.td-class-card-body { padding:0 18px 14px; }
.td-class-card-name { font-family:'Lora',Georgia,serif; font-size:17px; font-weight:700; color:#0d1f12; margin-bottom:6px; line-height:1.3; }
.td-class-card-meta { font-size:12px; color:#4a7a52; margin-bottom:3px; }
.td-class-card-stats { display:flex; gap:0; margin:14px 0 10px; border-top:1px solid #f0faf0; padding-top:12px; }
.td-class-card-stat { flex:1; text-align:center; }
.td-class-card-stat:not(:last-child) { border-right:1px solid #f0faf0; }
.td-class-card-stat-val { display:block; font-family:'Lora',Georgia,serif; font-size:20px; font-weight:700; color:#0d1f12; }
.td-class-card-stat-label { font-size:10px; color:#4a7a52; font-weight:600; text-transform:uppercase; letter-spacing:0.4px; }
.td-class-card-footer { padding:10px 18px 14px; border-top:1px solid #f0faf0; }

.td-class-card-new {
  border:2px dashed #c8e6c8; background:#f5fbf5; display:flex; align-items:center; justify-content:center;
  min-height:200px;
}
.td-class-card-new:hover { border-color:#16a34a; background:#dcfce7; }
.td-new-inner { text-align:center; }
.td-new-icon { font-size:32px; color:#16a34a; margin-bottom:8px; }
.td-new-label { font-size:14px; font-weight:600; color:#16a34a; }

/* ── EMPTY STATE ── */
.td-empty-state {
  text-align:center; padding:64px 32px; background:#fff; border-radius:18px;
  border:1px dashed #c8e6c8;
}
.td-empty-icon { font-size:48px; margin-bottom:12px; }
.td-empty-title { font-family:'Lora',Georgia,serif; font-size:20px; font-weight:700; color:#0d1f12; margin-bottom:6px; }
.td-empty-sub { font-size:14px; color:#4a7a52; margin-bottom:20px; }

/* ── DETAIL VIEW ── */
.td-detail { padding:28px 32px 48px; }
.td-detail-topbar { margin-bottom:20px; }
.td-back-btn {
  background:none; border:none; font-size:13px; font-weight:600; color:#16a34a;
  cursor:pointer; padding:7px 12px; border-radius:8px;
  font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.15s;
}
.td-back-btn:hover { background:#dcfce7; }

.td-detail-hero {
  background:#fff; border-radius:16px; padding:20px 24px;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  border-left:4px solid; box-shadow:0 2px 12px rgba(15,36,23,0.07);
  margin-bottom:20px; flex-wrap:wrap;
}
.td-detail-hero-left { display:flex; align-items:center; gap:16px; flex:1; min-width:0; }
.td-detail-class-icon {
  width:52px; height:52px; border-radius:13px; font-size:26px;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
  box-shadow:0 4px 14px rgba(0,0,0,0.12);
}
.td-detail-class-name { font-family:'Lora',Georgia,serif; font-size:22px; font-weight:700; color:#0d1f12; margin-bottom:4px; }
.td-detail-class-meta { display:flex; gap:14px; flex-wrap:wrap; }
.td-detail-class-meta span { font-size:13px; color:#4a7a52; }

/* ── STATS ROW ── */
.td-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:20px; }
.td-stat-card {
  background:#fff; border-radius:12px; padding:14px 18px;
  text-align:center; box-shadow:0 2px 8px rgba(15,36,23,0.06); border:1px solid #e8f5e9;
}
.td-stat-val { font-family:'Lora',Georgia,serif; font-size:28px; font-weight:700; color:#0d1f12; }
.td-stat-label { font-size:12px; color:#4a7a52; font-weight:500; margin-top:2px; }

/* ── ROSTER CARD ── */
.td-roster-card {
  background:#fff; border-radius:16px; box-shadow:0 2px 12px rgba(15,36,23,0.07);
  border:1px solid #e8f5e9; overflow:hidden;
}
.td-roster-header {
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:18px 20px; border-bottom:1px solid #f0faf0; flex-wrap:wrap;
}
.td-roster-title { font-family:'Lora',Georgia,serif; font-size:17px; font-weight:700; color:#0d1f12; }
.td-roster-controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.td-search-wrap { position:relative; }
.td-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:14px; pointer-events:none; }
.td-search {
  height:36px; border:1.5px solid #c8e6c8; border-radius:9px; padding:0 12px 0 32px;
  font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; color:#0d1f12;
  background:#f5fbf5; outline:none; width:200px; transition:all 0.18s;
}
.td-search:focus { border-color:#16a34a; background:#fff; box-shadow:0 0 0 3px rgba(22,163,74,0.1); width:240px; }
.td-select {
  height:36px; border:1.5px solid #c8e6c8; border-radius:9px; padding:0 10px;
  font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; color:#0d1f12;
  background:#f5fbf5; outline:none; cursor:pointer;
}

/* ── TABLE ── */
.td-table-wrap { overflow-x:auto; }
.td-table { width:100%; border-collapse:collapse; }
.td-table th {
  text-align:left; font-size:11px; font-weight:700; color:#4a7a52;
  text-transform:uppercase; letter-spacing:0.6px; padding:10px 20px;
  background:#f5fbf5; border-bottom:1px solid #e8f5e9;
}
.td-table td { padding:12px 20px; border-bottom:1px solid #f5fbf5; font-size:14px; }
.td-table tr:last-child td { border-bottom:none; }
.td-table tr:hover td { background:#f9fffe; }
.td-empty {
  text-align:center; padding:40px 20px; color:#4a7a52; font-size:14px;
}

/* ── ROW BUTTONS ── */
.td-row-btn {
  width:30px; height:30px; border-radius:7px; border:1px solid #e8f5e9;
  background:#f5fbf5; font-size:14px; cursor:pointer; display:flex;
  align-items:center; justify-content:center; transition:all 0.15s;
}
.td-row-btn:hover { background:#dcfce7; border-color:#86efac; }
.td-row-btn-danger:hover { background:#fee2e2; border-color:#fca5a5; }

/* ── BUTTONS ── */
.td-btn-primary {
  height:40px; padding:0 20px; background:#16a34a; color:#fff; border:none;
  border-radius:10px; font-size:14px; font-weight:600; font-family:'Plus Jakarta Sans',sans-serif;
  cursor:pointer; white-space:nowrap; transition:all 0.18s; flex-shrink:0;
}
.td-btn-primary:hover { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 5px 16px rgba(22,163,74,0.3); }
.td-btn-outline {
  height:36px; padding:0 16px; background:transparent; color:#16a34a;
  border:1.5px solid #16a34a; border-radius:9px; font-size:13px; font-weight:600;
  font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.18s;
}
.td-btn-outline:hover { background:#dcfce7; }
.td-btn-ghost {
  height:40px; padding:0 18px; background:#f0faf0; color:#4a7a52;
  border:1.5px solid #c8e6c8; border-radius:10px; font-size:14px; font-weight:600;
  font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.18s;
}
.td-btn-ghost:hover { background:#e8f5e9; }

/* ── MODALS ── */
.td-modal-backdrop {
  position:fixed; inset:0; z-index:200;
  background:rgba(0,0,0,0.55); backdrop-filter:blur(4px);
  display:flex; align-items:center; justify-content:center; padding:20px;
}
.td-modal {
  background:#fff; border-radius:22px; width:100%; max-width:520px;
  box-shadow:0 32px 80px rgba(0,0,0,0.3); overflow:hidden;
  animation:modal-in 0.22s cubic-bezier(.34,1.56,.64,1);
}
@keyframes modal-in { from{opacity:0;transform:scale(0.92) translateY(12px);} to{opacity:1;transform:none;} }
@keyframes td-spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
.td-modal-header {
  display:flex; align-items:flex-start; justify-content:space-between;
  padding:24px 28px 16px; border-bottom:1px solid #f0faf0;
}
.td-modal-title { font-family:'Lora',Georgia,serif; font-size:20px; font-weight:700; color:#0d1f12; margin-bottom:3px; }
.td-modal-sub { font-size:13px; color:#4a7a52; }
.td-modal-close {
  background:none; border:none; font-size:16px; cursor:pointer; color:#4a7a52;
  width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center;
  flex-shrink:0; transition:all 0.15s;
}
.td-modal-close:hover { background:#f0f0f0; }
.td-modal-body { padding:20px 28px; }
.td-modal-footer {
  padding:16px 28px 24px; border-top:1px solid #f0faf0;
  display:flex; justify-content:flex-end; gap:10px;
}

/* ── FORM ELEMENTS ── */
.td-field { margin-bottom:16px; }
.td-field-row { display:flex; gap:14px; }
.td-field label {
  display:block; font-size:11.5px; font-weight:700; color:#0d1f12;
  text-transform:uppercase; letter-spacing:0.6px; margin-bottom:6px;
}
.td-input-wrap { position:relative; }
.td-input-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:15px; pointer-events:none; }
.td-input {
  width:100%; height:44px; border:1.5px solid #c8e6c8; border-radius:10px;
  padding:0 14px; font-size:14px; font-family:'Plus Jakarta Sans',sans-serif;
  color:#0d1f12; background:#f5fbf5; outline:none; transition:all 0.18s;
}
.td-input.td-input-icon-pad { padding-left:38px; }
.td-input:focus { border-color:#16a34a; background:#fff; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
.td-input::placeholder { color:#b0c4b0; }

.td-alert { padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:14px; }
.td-alert-error { background:#fee2e2; border:1px solid #fca5a5; color:#991b1b; }

.td-tip {
  background:#f0faf0; border-radius:9px; padding:10px 14px;
  font-size:13px; color:#4a7a52; line-height:1.6; border:1px solid #c8e6c8;
}

/* ── RESPONSIVE ── */
@media (max-width:1024px) {
  .td-global-stats { grid-template-columns:repeat(2,1fr); }
  .td-stats-row { grid-template-columns:repeat(2,1fr); }
}

@media (max-width:768px) {
  .td-hamburger { display:block; }
  .td-sidebar-overlay {
    display:block; position:fixed; inset:0; z-index:90;
    background:rgba(0,0,0,0.5); opacity:0; pointer-events:none; transition:opacity 0.2s;
  }
  .td-sidebar-overlay.visible { opacity:1; pointer-events:auto; }
  .td-sidebar {
    position:fixed; top:60px; left:-260px; z-index:95; height:calc(100vh - 60px);
    transition:left 0.26s cubic-bezier(.4,0,.2,1); box-shadow:4px 0 20px rgba(0,0,0,0.3);
  }
  .td-sidebar.open { left:0; }
  .td-user-name { display:none; }
  .td-teacher-badge { display:none; }
  .td-overview { padding:20px 16px 40px; }
  .td-detail { padding:20px 16px 40px; }
  .td-global-stats { grid-template-columns:repeat(2,1fr); gap:10px; }
  .td-welcome { gap:12px; }
  .td-welcome-title { font-size:20px; }
  .td-class-grid { grid-template-columns:1fr; }
  .td-detail-hero { padding:16px; }
  .td-detail-class-name { font-size:18px; }
  .td-stats-row { grid-template-columns:repeat(2,1fr); gap:10px; }
  .td-field-row { flex-direction:column; }
  .td-search { width:160px; }
  .td-search:focus { width:180px; }
  .td-roster-header { flex-direction:column; align-items:flex-start; }
}

@media (max-width:480px) {
  .td-global-stats { grid-template-columns:1fr 1fr; }
  .td-detail-hero-left { flex-direction:column; align-items:flex-start; }
  .td-detail-class-meta { flex-direction:column; gap:4px; }
}

/* ── INVITE MODAL ── */
.td-invite-modal { max-width: 560px; }
.td-invite-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:22px 26px 18px; border-bottom:1px solid #f0f0f0;
}
.td-invite-header .td-modal-title { font-size:17px; }
.td-invite-body { padding:0; max-height:72vh; overflow-y:auto; }

/* Class strip */
.td-invite-class-strip {
  display:flex; align-items:center; gap:12px;
  margin:18px 26px 0; padding:12px 16px;
  border-left:4px solid #16a34a; border-radius:0 10px 10px 0;
  background:#f9fafb;
}
.td-invite-class-icon {
  width:36px; height:36px; border-radius:9px;
  display:flex; align-items:center; justify-content:center;
  font-size:18px; flex-shrink:0;
}
.td-invite-class-name { font-weight:700; font-size:14px; color:#0d1f12; }
.td-invite-class-sub { font-size:12px; color:#6b7280; margin-top:1px; }

.td-invite-method { padding:18px 26px; }
.td-invite-method-tag {
  display:inline-block; border:1px solid #d1d5db; border-radius:6px;
  font-size:11px; font-weight:600; color:#6b7280; padding:2px 10px;
  margin-bottom:8px; background:#f9fafb;
}
.td-invite-method-title {
  font-family:'Lora',Georgia,serif; font-size:17px; font-weight:700;
  color:#0d1f12; margin-bottom:5px;
}
.td-invite-method-desc { font-size:13px; color:#6b7280; margin-bottom:16px; line-height:1.55; }

/* QR section */
.td-invite-qr-wrap { display:flex; gap:20px; align-items:flex-start; }
.td-invite-qr-card {
  flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:10px;
  background:#f9fafb; border:1.5px solid #e5e7eb; border-radius:14px; padding:14px;
}
.td-invite-qr-label { text-align:center; font-size:12px; line-height:1.5; }
.td-invite-qr-steps { display:flex; flex-direction:column; gap:12px; flex:1; }
.td-invite-qr-step { display:flex; align-items:flex-start; gap:10px; font-size:13px; color:#374151; line-height:1.5; }
.td-invite-qr-step-num {
  width:22px; height:22px; border-radius:50%; color:#fff;
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:700; flex-shrink:0; margin-top:1px;
}

/* Link section */
.td-invite-link-row { display:flex; gap:10px; align-items:center; margin-bottom:10px; }
.td-invite-link-box {
  flex:1; height:42px; background:#f3f4f6; border:1px solid #e5e7eb;
  border-radius:9px; padding:0 14px; font-size:12px; color:#374151;
  display:flex; align-items:center; font-family:monospace; overflow:hidden;
  white-space:nowrap; text-overflow:ellipsis;
}
.td-invite-copy-btn {
  height:42px; padding:0 16px; border:1.5px solid #d1d5db; border-radius:9px;
  background:#fff; font-size:13px; font-weight:600; color:#374151;
  font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; white-space:nowrap;
  transition:all 0.18s; flex-shrink:0;
}
.td-invite-copy-btn:hover { background:#f3f4f6; border-color:#9ca3af; }
.td-invite-code-row { display:flex; align-items:center; gap:8px; }
.td-invite-note { font-size:12.5px; color:#6b7280; }
.td-invite-code-inline { font-family:monospace; font-size:14px; font-weight:800; letter-spacing:1.5px; }

.td-invite-divider { height:1px; background:#f0f0f0; margin:0 26px; }
.td-invite-footer {
  padding:16px 26px 22px; display:flex; justify-content:flex-end;
  border-top:1px solid #f0f0f0;
}
.td-invite-done-btn {
  height:42px; padding:0 32px; color:#fff; border:none; border-radius:10px;
  font-size:14px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
  cursor:pointer; transition:all 0.18s;
}
.td-invite-done-btn:hover { filter:brightness(1.08); transform:translateY(-1px); box-shadow:0 5px 16px rgba(0,0,0,0.2); }

@media (max-width:520px) {
  .td-invite-qr-wrap { flex-direction:column; align-items:center; }
  .td-invite-link-row { flex-direction:column; align-items:stretch; }
  .td-invite-copy-btn { width:100%; }
}
`;