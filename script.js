// ========== 1. MOBILE MENU TOGGLE (Enhanced UX) ==========
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const body = document.body;

  if (menuToggle) {
    menuToggle.addEventListener('change', (e) => {
      if (menuToggle.checked) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });
  }

  // Close mobile menu when a nav link is clicked
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle) menuToggle.checked = false;
      body.style.overflow = '';
    });
  });
});

// ========== 2. FIREBASE INITIALIZATION (Placeholder) ==========
// Replace these placeholder values with your own Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_PLACEHOLDER",
  authDomain: "YOUR_AUTH_DOMAIN_PLACEHOLDER",
  projectId: "YOUR_PROJECT_ID_PLACEHOLDER",
  storageBucket: "YOUR_STORAGE_BUCKET_PLACEHOLDER",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: "YOUR_APP_ID_PLACEHOLDER"
};

// Firebase will be loaded from CDN. We check if Firebase is available.
let db = null;
if (typeof firebase !== 'undefined' && firebase.apps?.length === 0) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
} else if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
  db = firebase.firestore();
}

// ========== 3. HELPER: SEND DATA TO FIRESTORE ==========
async function sendToFirestore(collectionName, formData, statusElementId) {
  const statusDiv = document.getElementById(statusElementId);
  if (!db) {
    if (statusDiv) statusDiv.innerHTML = '⚠️ Firebase not configured. Please add your keys.';
    return false;
  }
  try {
    await db.collection(collectionName).add({
      ...formData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    if (statusDiv) {
      statusDiv.innerHTML = '✅ Submitted successfully! We’ll get back to you shortly.';
      statusDiv.style.color = '#0070F3';
    }
    return true;
  } catch (error) {
    console.error(`Firestore error (${collectionName}):`, error);
    if (statusDiv) {
      statusDiv.innerHTML = '❌ Submission failed. Please try again or contact us directly.';
      statusDiv.style.color = '#E53E3E';
    }
    return false;
  }
}

// ========== 4. CONTACT FORM HANDLER ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      company: form.querySelector('[name="company"]')?.value || '',
      message: form.querySelector('[name="message"]')?.value || '',
      type: 'general_inquiry'
    };
    await sendToFirestore('contacts', formData, 'contactFormStatus');
    if (db) form.reset();
  });
}

// ========== 5. SCHEDULE CALL FORM HANDLER ==========
const scheduleForm = document.getElementById('scheduleCallForm');
if (scheduleForm) {
  scheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      phone: form.querySelector('[name="phone"]')?.value || '',
      preferredDate: form.querySelector('[name="preferredDate"]')?.value || '',
      notes: form.querySelector('[name="notes"]')?.value || '',
      type: 'schedule_call'
    };
    await sendToFirestore('contacts', formData, 'scheduleFormStatus');
    if (db) form.reset();
  });
}
