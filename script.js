// ====== Firebase Configuration Placeholder ======
// DO NOT REPLACE with new code; instead plug your EXACT existing configuration credentials here.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ====== UI Elements ======
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userProfile = document.getElementById('user-profile');
const userPic = document.getElementById('user-pic');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const loader = document.getElementById('loader');
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// ====== Authentication Persistence & Session Handling ======
// Set persistence to Local so session survives redirects/reloads
setPersistence(auth, browserLocalPersistence).then(() => {
    // Listen to Auth State
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            loginBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');
            
            userPic.src = user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
            userName.textContent = user.displayName || 'User';
            userEmail.textContent = user.email || '';
        } else {
            // User is signed out
            loginBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    });
});

// Login Logic
loginBtn?.addEventListener('click', async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Authentication Error:", error.message);
        alert("Failed to login: " + error.message);
    }
});

// Logout Logic
logoutBtn?.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
});

// ====== Theme Toggle ======
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle?.addEventListener('click', () => {
    const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if(themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
}

// ====== 3D Mouse Parallax Effect ======
const card = document.getElementById('tilt-card');
if(card) {
    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Reset on mouse leave window
    document.addEventListener('mouseleave', () => {
        card.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
}

// ====== Loader ======
window.addEventListener('load', () => {
    setTimeout(() => {
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    }, 500); // Small delay for smooth effect
});