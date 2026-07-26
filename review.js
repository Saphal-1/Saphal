// ====== Firebase Firestore Initialization Placeholder ======
// Add your Firebase Config here. This uses standard V9 syntax.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ====== Star Rating Logic ======
const stars = document.querySelectorAll('#star-selector i');
const ratingInput = document.getElementById('review-rating');

stars.forEach(star => {
    star.addEventListener('click', (e) => {
        let val = e.target.getAttribute('data-value');
        ratingInput.value = val;
        
        // Update UI
        stars.forEach(s => s.classList.remove('active'));
        for(let i=0; i<val; i++) {
            stars[i].classList.add('active');
        }
    });
});

// Default to 5 stars UI active
for(let i=0; i<5; i++) { stars[i].classList.add('active'); }

// ====== Firestore Submission ======
const form = document.getElementById('review-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewer-name').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;
    const submitBtn = form.querySelector('.submit-btn');

    try {
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        await addDoc(collection(db, "reviews"), {
            name: name,
            rating: parseInt(rating),
            comment: comment,
            timestamp: serverTimestamp()
        });

        // Reset form
        form.reset();
        ratingInput.value = 5;
        stars.forEach(s => s.classList.add('active'));
        
        alert("Review submitted successfully!");
    } catch (error) {
        console.error("Error adding review: ", error);
        alert("Could not submit review. Check console/Firebase config.");
    } finally {
        submitBtn.textContent = 'Submit Review';
        submitBtn.disabled = false;
    }
});

// ====== Fetch and Display Reviews ======
const reviewsGrid = document.getElementById('reviews-grid');

// Real-time listener for reviews
const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    reviewsGrid.innerHTML = ''; // Clear current
    
    if (snapshot.empty) {
        reviewsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align:center;">No reviews yet. Be the first!</p>';
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleDateString() : 'Just now';
        
        // Generate Stars HTML
        let starsHtml = '';
        for(let i=1; i<=5; i++) {
            starsHtml += `<i class="fas fa-star ${i <= data.rating ? 'active' : ''}" ${i <= data.rating ? 'style="color:#f59e0b;"' : 'style="color:#475569;"'}></i>`;
        }

        const reviewEl = document.createElement('div');
        reviewEl.className = 'review-item';
        reviewEl.innerHTML = `
            <div class="review-header">
                <div class="review-author">
                    <div class="avatar">${data.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <span>${data.name}</span>
                        <div class="display-stars" style="font-size: 0.8rem; margin: 0;">${starsHtml}</div>
                    </div>
                </div>
                <span class="review-date">${date}</span>
            </div>
            <p class="review-text">${data.comment}</p>
        `;
        
        reviewsGrid.appendChild(reviewEl);
    });
}, (error) => {
    console.error("Error fetching reviews:", error);
    reviewsGrid.innerHTML = '<p style="color: #ef4444; text-align:center;">Make sure you add your Firebase Config to see real-time reviews.</p>';
});