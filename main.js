const products = [
    {
        id: 1,
        name: "PureSteel Flask",
        price: 34.99,
        img: "https://images.unsplash.com/photo-1602143399827-721300975148?auto=format&fit=crop&w=800&q=80",
        desc: "Surgical-grade steel for the ultimate temperature retention."
    },
    {
        id: 2,
        name: "Linen Bento Set",
        price: 24.50,
        img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
        desc: "Hand-crafted aesthetic cutlery in premium organic linen."
    },
    {
        id: 3,
        name: "Solar Core Pro",
        price: 89.00,
        img: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&w=600&q=80",
        desc: "High-efficiency portable solar panel for the modern explorer."
    },
    {
        id: 4,
        name: "Urban Eco Pack",
        price: 120.00,
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        desc: "Weatherproof backpack made from 30 recycled plastic bottles."
    },
    {
        id: 5,
        name: "Zen Mist Diffuser",
        price: 45.00,
        img: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80",
        desc: "Sustainably sourced wood essential oil diffuser."
    },
    {
        id: 6,
        name: "Bamboo Tech Mat",
        price: 19.00,
        img: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=600&q=80",
        desc: "Elegant workspace ergonomics with natural bamboo finish."
    }
];

let cart = [];

// --- Gesture Navigation (Swipe Detection) ---
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    const swipeDistance = touchStartX - touchEndX;
    const routes = ['home', 'shop', 'contact'];
    let currentId = window.location.hash.substring(1) || 'home';
    let currentIndex = routes.indexOf(currentId);

    if (Math.abs(swipeDistance) > 100) {
        if (swipeDistance > 0 && currentIndex < routes.length - 1) { // Swipe Left (Next)
            document.getElementById(`nav-${routes[currentIndex + 1]}`).click();
        } else if (swipeDistance < 0 && currentIndex > 0) { // Swipe Right (Prev)
            document.getElementById(`nav-${routes[currentIndex - 1]}`).click();
        }
    }
}

document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
});

// --- Reveal on Scroll Observer ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

// --- Hand Gesture Recognition logic ---
let lastHandGesture = "";
let handGestureTimeout = null;
let cameraActive = false;
let stream = null;

async function setupGestureRecognition() {
    const videoElement = document.getElementById('webcam');
    const previewElement = document.getElementById('webcam-preview');
    const statusText = document.getElementById('gesture-text');
    const gestureBtn = document.getElementById('gesture-start-btn');

    if (!window.Hands) {
        console.error("MediaPipe Hands library not found.");
        return;
    }

    // Initialize MediaPipe Hands
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(results => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            // Simple gesture detection based on finger positions relative to palm base
            const thumbOpen = landmarks[4].x < landmarks[3].x;
            const indexOpen = landmarks[8].y < landmarks[6].y;
            const middleOpen = landmarks[12].y < landmarks[10].y;
            const ringOpen = landmarks[16].y < landmarks[14].y;
            const pinkyOpen = landmarks[20].y < landmarks[18].y;

            // Hand Symbol Rules:
            // ✌️ Victory (Index + Middle) -> Home
            if (indexOpen && middleOpen && !ringOpen && !pinkyOpen) {
                processHandGesture('victory');
            }
            // 👍 Thumbs Up -> Shop
            else if (thumbOpen && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) {
                processHandGesture('thumbs_up');
            }
            // 🖐️ Full Palm -> Contact
            else if (indexOpen && middleOpen && ringOpen && pinkyOpen) {
                processHandGesture('palm');
            }
        }
    });

    function processHandGesture(name) {
        if (name === lastHandGesture) return;
        clearTimeout(handGestureTimeout);
        lastHandGesture = name;
        handGestureTimeout = setTimeout(() => { lastHandGesture = ""; }, 3000);

        if (name === 'victory') {
            statusText.textContent = "Home detected (✌️)";
            document.getElementById('nav-home').click();
            showToast("✌️ Gesture: Home");
        } else if (name === 'thumbs_up') {
            statusText.textContent = "Shop detected (👍)";
            document.getElementById('nav-shop').click();
            showToast("👍 Gesture: Shop");
        } else if (name === 'palm') {
            statusText.textContent = "Contact detected (🖐️)";
            document.getElementById('nav-contact').click();
            showToast("🖐️ Gesture: Contact");
        }
    }

    // Start processing frames manually for maximum reliability
    async function processFrame() {
        if (!cameraActive) return;
        if (videoElement.readyState >= 2) {
            await hands.send({ image: videoElement });
        }
        requestAnimationFrame(processFrame);
    }

    gestureBtn.addEventListener('click', async () => {
        if (!cameraActive) {
            try {
                // FORCE triggering the camera light using Standard MediaDevices API
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                });

                videoElement.srcObject = stream;
                previewElement.srcObject = stream; // Direct link for internal preview

                cameraActive = true;
                gestureBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Gestures';
                gestureBtn.classList.add('active');
                previewElement.style.display = 'block';

                videoElement.play();
                previewElement.play();
                processFrame();

                showToast("Camera Activated: Show 👍, ✌️, or 🖐️");
            } catch (err) {
                console.error("Camera access failed:", err);
                showToast("Error: Please enable camera and click again.");
            }
        } else {
            // Stop Camera and turn off the light
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            cameraActive = false;
            location.reload(); // Hard reset for assignments
        }
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    setupVoiceRecognition();
    setupKeyboardShortcuts();
    setupGestureRecognition();

    // Start observing products
    document.querySelectorAll('.product-card').forEach(card => revealObserver.observe(card));
});

// --- UI Rendering ---
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <article class="product-card" tabindex="0" aria-label="${p.name}, $${p.price}">
            <div class="product-img">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-footer">
                    <span class="price">$${p.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${p.id})">+ Add</button>
                </div>
            </div>
        </article>
    `).join('');
}

// --- Ecommerce Logic ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();

    // Add visual feedback to the cart button
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);

    showToast(`${product.name} added to cart!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price}</span>
                <button onclick="removeFromCart(${index})" aria-label="Remove item">&times;</button>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    const removed = cart.splice(index, 1);
    updateCartUI();
    showToast(`${removed[0].name} removed from cart.`);
}

// --- HCI Rules & Accessibility ---

// 1. Keyboard Navigation (Shortcuts & Focus)
function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        // Alt + H (Home)
        if (e.altKey && e.key === 'h') {
            document.getElementById('nav-home').click();
        }
        // Alt + S (Shop)
        if (e.altKey && e.key === 's') {
            document.getElementById('nav-shop').click();
        }
        // Alt + C (Cart)
        if (e.altKey && e.key === 'c') {
            document.getElementById('cart-btn').click();
        }
    });
}

// 2. Voice Interaction (Robust Web Speech Implementation)
function setupVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.warn("Speech Recognition not supported in this browser.");
        document.getElementById('voice-help-btn').style.display = 'none';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = true; // Show text while speaking

    const voiceBtn = document.getElementById('voice-help-btn');
    const indicator = document.getElementById('voice-indicator');
    const status = document.getElementById('voice-status');
    let isListening = false;

    voiceBtn.addEventListener('click', () => {
        if (!isListening) {
            try {
                recognition.start();
                isListening = true;
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Voice';
                voiceBtn.classList.add('active');
                indicator.classList.add('active');
                status.textContent = "Listening...";
                showToast("Voice Mode Activated! Try 'Open Shop' or 'Submit'");
            } catch (e) {
                console.error("Recognition error:", e);
            }
        } else {
            recognition.stop();
        }
    });

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        // Show live feedback
        status.textContent = interimTranscript || "Listening...";

        if (finalTranscript) {
            const command = finalTranscript.toLowerCase().trim();
            console.log("Final Command:", command);
            status.textContent = `Command: "${command}"`;

            if (command.includes('home')) {
                document.getElementById('nav-home').click();
                showToast("Navigating Home");
            } else if (command.includes('shop') || command.includes('buy')) {
                document.getElementById('nav-shop').click();
                showToast("Opening Shop");
            } else if (command.includes('contact') || command.includes('support')) {
                document.getElementById('nav-contact').click();
                showToast("Opening Contact");
            } else if (command.includes('cart') || command.includes('basket')) {
                document.getElementById('cart-btn').click();
                showToast("Opening Cart");
            } else if (command.includes('add to cart') || command.includes('add product') || command.includes('add item')) {
                // Feature: Add first product from grid if user says "add to cart"
                const firstAddBtn = document.querySelector('.add-to-cart');
                if (firstAddBtn) {
                    firstAddBtn.click();
                } else {
                    showToast("No products found to add.");
                }
            } else if (command.includes('submit') || command.includes('send') || command.includes('done')) {
                const form = document.getElementById('contact-form');
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            } else if (command.includes('close') || command.includes('exit')) {
                const closeBtn = document.getElementById('close-cart');
                if (closeBtn) closeBtn.click();
            }
        }
    };

    recognition.onend = () => {
        isListening = false;
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Commands';
        voiceBtn.classList.remove('active');
        indicator.classList.remove('active');
        status.textContent = "Voice Off";
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') {
            showToast("Microphone access denied. Please allow in browser settings.");
        }
        isListening = false;
        indicator.classList.remove('active');
    };
}

// 3. Mouse & Modal Logic
function setupEventListeners() {
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const contactForm = document.getElementById('contact-form');

    cartBtn.onclick = () => cartModal.classList.add('active');
    closeCart.onclick = () => cartModal.classList.remove('active');

    // Close modal on outside click
    window.onclick = (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    };

    // 4. Form Validation (Golden Rule: Error Prevention)
    contactForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        let valid = true;

        if (name.value.length < 3) {
            showError('name', 'Name must be at least 3 characters');
            valid = false;
        } else {
            hideError('name');
        }

        if (!email.value.includes('@')) {
            showError('email', 'Please enter a valid email');
            valid = false;
        } else {
            hideError('email');
        }

        if (valid) {
            showToast("Form submitted successfully! (Design Closure)");
            contactForm.reset();
        }
    };
}

function showError(id, msg) {
    const errorEl = document.getElementById(`${id}-error`);
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    document.getElementById(id).style.borderColor = 'var(--error)';
}

function hideError(id) {
    const errorEl = document.getElementById(`${id}-error`);
    errorEl.style.display = 'none';
    document.getElementById(id).style.borderColor = '#e5e7eb';
}

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
