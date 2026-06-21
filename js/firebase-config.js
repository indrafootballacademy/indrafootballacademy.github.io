/* ============================================================
   ProStrike Football Academy — Firebase Configuration
   Handles: Authentication (Google/Microsoft), Firestore, Storage
   
   SETUP INSTRUCTIONS:
   1. Go to https://console.firebase.google.com
   2. Create a new project called "prostrike-academy"
   3. Go to Project Settings → General → Your apps → Web app
   4. Copy the config values below
   5. Enable Authentication → Google & Microsoft providers
   6. Enable Firestore Database
   7. Enable Storage
   ============================================================ */

// Firebase SDK Imports (ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ============ FIREBASE CONFIGURATION ============
const firebaseConfig = {
    apiKey: "AIzaSyDMhwa7bxclPaeW44agM8s-FRVQxkbTAuU",
    authDomain: "indra-football-academy.firebaseapp.com",
    projectId: "indra-football-academy",
    storageBucket: "indra-football-academy.firebasestorage.app",
    messagingSenderId: "794774125541",
    appId: "1:794774125541:web:54bb5c00c61e10b3b38d0c"
};

// ============ INITIALIZE FIREBASE ============
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ============ AUTH PROVIDERS ============
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Microsoft provider removed — using Google only

// ============ AUTHENTICATION FUNCTIONS ============

/**
 * Sign in with Google
 * @returns {Promise<Object>} User object
 */
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Save user to Firestore (create profile if new)
        await saveUserProfile(user);
        
        showAuthToast(`Welcome, ${user.displayName}!`, 'success');
        updateUIForLoggedInUser(user);
        
        return user;
    } catch (error) {
        // If popup blocked or fails, try redirect method
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
            console.log('Popup failed, trying redirect...');
            await signInWithRedirect(auth, googleProvider);
            return null; // page will reload after redirect
        } else {
            console.error('Google sign-in error:', error);
            showAuthToast('Sign-in failed. Please try again.', 'danger');
            throw error;
        }
    }
}

// Handle redirect result (when page reloads after redirect sign-in)
getRedirectResult(auth).then((result) => {
    if (result && result.user) {
        saveUserProfile(result.user);
        updateUIForLoggedInUser(result.user);
    }
}).catch((error) => {
    console.error('Redirect sign-in error:', error);
});

logOut,
    registerForProgram,
    getUserRegistrations,
    getGalleryImages,
    uploadImage
};
