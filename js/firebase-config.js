/* ============================================================
   Indra Football Academy — Firebase Configuration
   Handles: Google Auth, Email/Password Auth, Firestore, Storage
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    signInWithRedirect,
    getRedirectResult,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============ FIREBASE CONFIG ============
const firebaseConfig = {
    apiKey: "AIzaSyDMhwa7bxclPaeW44agM8s-FRVQxkbTAuU",
    authDomain: "indra-football-academy.firebaseapp.com",
    projectId: "indra-football-academy",
    storageBucket: "indra-football-academy.firebasestorage.app",
    messagingSenderId: "794774125541",
    appId: "1:794774125541:web:54bb5c00c61e10b3b38d0c"
};

// ============ INITIALIZE ============
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// ============ GOOGLE SIGN-IN ============
// Using REDIRECT method (not popup) — much more reliable on deployed sites
function signInWithGoogle() {
    // This navigates the user away to Google, then back to this page
    return signInWithRedirect(auth, googleProvider);
}

// ============ EMAIL/PASSWORD SIGN-UP ============
async function signUpWithEmail(email, password) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Send verification email
        await sendEmailVerification(user);
        await saveUserProfile(user);
        return user;
    } catch (error) {
        throw error;
    }
}

// ============ EMAIL/PASSWORD SIGN-IN ============
async function signInWithEmail(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error) {
        throw error;
    }
}

// ============ SIGN OUT ============
async function logOut() {
    await signOut(auth);
}

// ============ SAVE USER PROFILE ============
async function saveUserProfile(user) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName || '',
                email: user.email,
                photoURL: user.photoURL || '',
                provider: user.providerData[0]?.providerId || 'unknown',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                role: 'student'
            });
        } else {
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
    } catch (e) {
        console.error('Error saving profile:', e);
    }
}

// ============ AUTH STATE LISTENER ============
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Signed in:', user.email);
        updateUIForLoggedInUser(user);
        if (typeof checkIfAdmin === 'function') {
            checkIfAdmin(user);
        }
    } else {
        console.log('Signed out');
        updateUIForLoggedOutUser();
    }
});

// ============ REDIRECT RESULT HANDLER ============
getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            saveUserProfile(result.user);
            updateUIForLoggedInUser(result.user);
            // Dispatch custom event so signin page can react
            window.dispatchEvent(new CustomEvent('firebase-redirect-success', { detail: result.user }));
        }
    })
    .catch((error) => {
        if (error.code) {
            console.error('Redirect error:', error.code, error.message);
            window.dispatchEvent(new CustomEvent('firebase-redirect-error', { detail: error }));
        }
    });

// ============ UI HELPERS ============
function updateUIForLoggedInUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="bi bi-person-check me-1"></i>${user.displayName?.split(' ')[0] || 'Account'}`;
        loginBtn.onclick = logOut;
    }
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="bi bi-person-circle me-1"></i>Sign In';
    }
}

function showAuthToast(msg, type) {
    console.log(`[${type}] ${msg}`);
}

// ============ EXPOSE GLOBALLY ============
window.signInWithGoogle = signInWithGoogle;
window.signUpWithEmail = signUpWithEmail;
window.signInWithEmail = signInWithEmail;
window.firebaseLogin = signInWithGoogle;
window.logOut = logOut;
window.firebaseAuth = auth;
