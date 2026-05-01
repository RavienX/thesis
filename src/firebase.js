import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    serverTimestamp,
} from "firebase/firestore";

// ─── FIREBASE CONFIG ──────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyAOy4Am2vQoqdK_xxyobRrhTN2GxBuKrjE",
    authDomain: "thesis-53cba.firebaseapp.com",
    projectId: "thesis-53cba",
    storageBucket: "thesis-53cba.firebasestorage.app",
    messagingSenderId: "699450391170",
    appId: "1:699450391170:web:c07bff150dddba8f0f929b",
};

// ─── INITIALIZE ───────────────────────────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ─── AUTH: REGISTER ───────────────────────────────────────────────────────────
export async function registerUser({ email, password, name, role, institution, studentId, yearLevel, section }) {
    // Validation
    if (!email || !password || !name || !role) throw new Error("Please fill in all fields.");
    if (role === "teacher" && !institution?.trim()) throw new Error("Institution is required.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");

    // Create Firebase Auth user
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Set display name
    await updateProfile(credential.user, { displayName: name });

    // Write Firestore profile
    const now = serverTimestamp();
    await setDoc(doc(db, "users", uid), {
        uid,
        email,
        name,
        role,
        institution: institution || null,
        createdAt: now,
        updatedAt: now,
        ...(role === "student" && {
            studentId: studentId || null,
            yearLevel: yearLevel || null,
            section: section || null,
            progress: {
                completedLessons: [],
                quizAnswers: {},
                quizSubmitted: {},
                currentLesson: 0,
                totalScore: 0,
            },
        }),
        ...(role === "teacher" && {
            classes: [],
            studentsEnrolled: 0,
        }),
    });

    return { uid, name, email, role, institution: institution || null };
}

// ─── AUTH: LOGIN ──────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    // Fetch Firestore profile
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) throw new Error("User profile not found.");
    return snap.data();
}

// ─── AUTH: LOGOUT ─────────────────────────────────────────────────────────────
export async function logoutUser() {
    await signOut(auth);
}

// ─── AUTH: STATE CHANGE ───────────────────────────────────────────────────────
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// ─── AUTH: GET PROFILE ────────────────────────────────────────────────────────
export async function getUserProfile() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) throw new Error("Profile not found.");
    return { user: snap.data() };
}

// ─── PROGRESS: GET ────────────────────────────────────────────────────────────
export async function getProgress() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) throw new Error("Profile not found.");
    return { progress: snap.data().progress || {} };
}

// ─── PROGRESS: SAVE ───────────────────────────────────────────────────────────
export async function saveProgress({ lessonId, completed, quizAnswers, submitted }) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");

    const snap = await getDoc(doc(db, "users", uid));
    const progress = snap.data()?.progress || {};

    const completedLessons = new Set(progress.completedLessons || []);
    if (completed === true) completedLessons.add(lessonId);
    if (completed === false) completedLessons.delete(lessonId);

    const updatedAnswers = {
        ...(progress.quizAnswers || {}),
        ...(quizAnswers ? { [lessonId]: quizAnswers } : {}),
    };

    const updatedSubmitted = {
        ...(progress.quizSubmitted || {}),
        ...(submitted !== undefined ? { [lessonId]: submitted } : {}),
    };

    const totalScore = Object.values(updatedSubmitted).filter(Boolean).length;

    await updateDoc(doc(db, "users", uid), {
        "progress.completedLessons": Array.from(completedLessons),
        "progress.quizAnswers": updatedAnswers,
        "progress.quizSubmitted": updatedSubmitted,
        "progress.currentLesson": lessonId,
        "progress.totalScore": totalScore,
        updatedAt: serverTimestamp(),
    });

    return { success: true, completedLessons: Array.from(completedLessons), totalScore };
}

// ─── PROGRESS: RESET ──────────────────────────────────────────────────────────
export async function resetProgress() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");

    await updateDoc(doc(db, "users", uid), {
        "progress.completedLessons": [],
        "progress.quizAnswers": {},
        "progress.quizSubmitted": {},
        "progress.currentLesson": 0,
        "progress.totalScore": 0,
        updatedAt: serverTimestamp(),
    });

    return { success: true };
}

// ─── CLASSES: GET ALL FOR TEACHER ────────────────────────────────────────────
export async function getTeacherClasses() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");

    const q = query(collection(db, "classes"), where("teacherId", "==", uid));
    const snap = await getDocs(q);

    const classes = await Promise.all(snap.docs.map(async (classDoc) => {
        const cls = { id: classDoc.id, ...classDoc.data() };

        // Fetch enrolled students for this class
        const enrollSnap = await getDocs(collection(db, "classes", classDoc.id, "students"));
        cls.students = await Promise.all(enrollSnap.docs.map(async (enrollDoc) => {
            const enrollment = enrollDoc.data();
            // Fetch the student's progress from their user doc
            try {
                const userSnap = await getDoc(doc(db, "users", enrollDoc.id));
                const userData = userSnap.exists() ? userSnap.data() : {};
                const completedLessons = userData.progress?.completedLessons || [];
                const progressPct = Math.round((completedLessons.length / 5) * 100);
                return {
                    id: enrollDoc.id,
                    name: userData.name || enrollment.name || "Unknown",
                    email: userData.email || enrollment.email || "",
                    studentId: userData.studentId || "—",
                    yearLevel: userData.yearLevel || "—",
                    section: userData.section || "—",
                    status: enrollment.status || "active",
                    joined: enrollment.joinedAt?.toDate
                        ? enrollment.joinedAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—",
                    progress: progressPct,
                };
            } catch {
                return {
                    id: enrollDoc.id,
                    name: enrollment.name || "Unknown",
                    email: enrollment.email || "",
                    status: enrollment.status || "active",
                    joined: "—",
                    progress: 0,
                };
            }
        }));

        return cls;
    }));

    return classes;
}

// ─── CLASSES: CREATE ─────────────────────────────────────────────────────────
export async function createClass({ id, name, subject }) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");

    await setDoc(doc(db, "classes", id), {
        name,
        subject,
        teacherId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return { success: true };
}

// ─── CLASSES: DELETE ─────────────────────────────────────────────────────────
export async function deleteClass(classId) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");
    await deleteDoc(doc(db, "classes", classId));
    return { success: true };
}

// ─── STUDENTS: TOGGLE STATUS ─────────────────────────────────────────────────
export async function toggleStudentStatus(classId, studentId, newStatus) {
    await updateDoc(doc(db, "classes", classId, "students", studentId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
    });
    return { success: true };
}

// ─── STUDENTS: REMOVE ────────────────────────────────────────────────────────
export async function removeStudentFromClass(classId, studentId) {
    await deleteDoc(doc(db, "classes", classId, "students", studentId));
    return { success: true };
}

// ─── CLASSES: JOIN (student self-enroll) ─────────────────────────────────────
export async function joinClass(classId) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not logged in.");

    // Verify class exists
    const classSnap = await getDoc(doc(db, "classes", classId));
    if (!classSnap.exists()) throw new Error("Class not found. Please check the invite link.");

    // Get student profile
    const userSnap = await getDoc(doc(db, "users", uid));
    if (!userSnap.exists()) throw new Error("User profile not found.");
    const userData = userSnap.data();

    // Check if already enrolled
    const enrollSnap = await getDoc(doc(db, "classes", classId, "students", uid));
    if (enrollSnap.exists()) return { success: true, alreadyEnrolled: true };

    // Enroll student
    await setDoc(doc(db, "classes", classId, "students", uid), {
        name: userData.name,
        email: userData.email,
        status: "active",
        joinedAt: serverTimestamp(),
    });

    return { success: true, alreadyEnrolled: false };
}