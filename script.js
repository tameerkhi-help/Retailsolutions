// ========== MOBILE MENU TOGGLE (Fixed) ==========
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuToggleBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  const closeBtn = document.querySelector('.close-menu-btn');
  const body = document.body;

  function openMenu() {
    if (overlay) overlay.classList.add('open');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (overlay) overlay.classList.remove('open');
    body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close menu when clicking on a nav link
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click (optional)
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });
  }
});

// ========== FIREBASE CONFIG (Placeholders) ==========
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_PLACEHOLDER",
  authDomain: "YOUR_AUTH_DOMAIN_PLACEHOLDER",
  projectId: "YOUR_PROJECT_ID_PLACEHOLDER",
  storageBucket: "YOUR_STORAGE_BUCKET_PLACEHOLDER",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: "YOUR_APP_ID_PLACEHOLDER"
};

let db = null;
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase ready");
  } catch(e) { console.error(e); }
} else if (typeof firebase !== 'undefined' && firebase.apps.length) {
  db = firebase.firestore();
}

async function sendToFirestore(collectionName, data, statusId) {
  const statusDiv = document.getElementById(statusId);
  if (!db) {
    if (statusDiv) statusDiv.innerHTML = '⚠️ Firebase not configured. Add your keys.';
    return false;
  }
  try {
    await db.collection(collectionName).add({
      ...data,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    if (statusDiv) {
      statusDiv.innerHTML = '✅ Submitted! We’ll contact you soon.';
      statusDiv.style.color = '#0070F3';
    }
    return true;
  } catch(err) {
    console.error(err);
    if (statusDiv) {
      statusDiv.innerHTML = '❌ Submission failed. Please try again.';
      statusDiv.style.color = '#E53E3E';
    }
    return false;
  }
}

// Contact form handler
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

// Schedule call handler
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
