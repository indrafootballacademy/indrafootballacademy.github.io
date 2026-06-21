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
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    OAuthProvider 
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

// Microsoft/Outlook OAuth Provider
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.addScope('openid');
microsoftProvider.addScope('profile');
microsoftProvider.addScope('email');

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
        console.error('Google sign-in error:', error);
        showAuthToast('Sign-in failed. Please try again.', 'danger');
        throw error;
    }
}

/**
 * Sign in with Microsoft/Outlook
 * @returns {Promise<Object>} User object
 */
async function signInWithMicrosoft() {
    try {
        const result = await signInWithPopup(auth, microsoftProvider);
        const user = result.user;
        
        await saveUserProfile(user);
        
        showAuthToast(`Welcome, ${user.displayName}!`, 'success');
        updateUIForLoggedInUser(user);
        
        return user;
    } catch (error) {
        console.error('Microsoft sign-in error:', error);
        showAuthToast('Sign-in failed. Please try again.', 'danger');
        throw error;
    }
}

/**
 * Sign out the current user
 */
async function logOut() {
    try {
        await signOut(auth);
        showAuthToast('Signed out successfully.', 'info');
        updateUIForLoggedOutUser();
    } catch (error) {
        console.error('Sign-out error:', error);
    }
}

/**
 * Listen for auth state changes
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User signed in:', user.displayName);
        updateUIForLoggedInUser(user);
    } else {
        console.log('User signed out');
        updateUIForLoggedOutUser();
    }
});

// ============ USER PROFILE MANAGEMENT ============

/**
 * Save or update user profile in Firestore
 */
async function saveUserProfile(user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        // New user — create profile
        await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            provider: user.providerData[0]?.providerId || 'unknown',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: 'student'  // default role
        });
    } else {
        // Existing user — update last login
        await setDoc(userRef, {
            lastLogin: serverTimestamp()
        }, { merge: true });
    }
}

// ============ REGISTRATION FUNCTIONS ============

/**
 * Register a user for a coaching program
 */
async function registerForProgram(programId, additionalData = {}) {
    const user = auth.currentUser;
    if (!user) {
        showAuthToast('Please sign in to register.', 'warning');
        return null;
    }
    
    try {
        const registration = await addDoc(collection(db, 'registrations'), {
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            programId: programId,
            status: 'pending',
            paymentStatus: 'unpaid',
            registeredAt: serverTimestamp(),
            ...additionalData
        });
        
        showAuthToast('Registration successful! We\'ll be in touch soon.', 'success');
        return registration.id;
    } catch (error) {
        console.error('Registration error:', error);
        showAuthToast('Registration failed. Please try again.', 'danger');
        throw error;
    }
}

/**
 * Get user's registrations
 */
async function getUserRegistrations() {
    const user = auth.currentUser;
    if (!user) return [];
    
    const q = query(
        collection(db, 'registrations'),
        where('userId', '==', user.uid),
        orderBy('registeredAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============ GALLERY FUNCTIONS ============

/**
 * Get all gallery images (public)
 */
async function getGalleryImages() {
    const q = query(
        collection(db, 'gallery'),
        orderBy('uploadDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Upload image (admin only)
 */
async function uploadImage(file, caption = '') {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save metadata to Firestore
    await addDoc(collection(db, 'gallery'), {
        url: downloadURL,
        caption: caption,
        uploadedBy: user.uid,
        uploadDate: serverTimestamp(),
        fileName: file.name,
        fileSize: file.size
    });
    
    return downloadURL;
}

// ============ UI UPDATE FUNCTIONS ============

function updateUIForLoggedInUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = `
            <img src="${user.photoURL || ''}" alt="" class="rounded-circle me-1" width="20" height="20" onerror="this.style.display='none'">
            ${user.displayName?.split(' ')[0] || 'Account'}
        `;
        loginBtn.onclick = logOut;
    }
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="bi bi-person-circle me-1"></i>Sign In';
        loginBtn.onclick = () => handleLogin();
    }
}

function showAuthToast(message, type) {
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

// ============ EXPOSE FUNCTIONS GLOBALLY ============
// (So they can be called from HTML onclick handlers)
window.firebaseLogin = signInWithGoogle;
window.signInWithGoogle = signInWithGoogle;
window.signInWithMicrosoft = signInWithMicrosoft;
window.logOut = logOut;
window.registerForProgram = registerForProgram;
window.getUserRegistrations = getUserRegistrations;
window.getGalleryImages = getGalleryImages;
window.uploadImage = uploadImage;

// Export for module usage
export {
    auth,
    db,
    storage,
    signInWithGoogle,
    signInWithMicrosoft,
    logOut,
    registerForProgram,
    getUserRegistrations,
    getGalleryImages,
    uploadImage
};
