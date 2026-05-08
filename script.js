// --- 1. CONFIGURATION ---
const targetDate = new Date('2026-05-07T22:21:00').getTime(); // Already passed for immediate unlock

// Initialize Lucide Icons
lucide.createIcons();

// Elements
const lockScreen = document.getElementById('lock-screen');
const unlockBtn = document.getElementById('unlock-btn');
const countdownContainer = document.getElementById('countdown-container');
const music = document.getElementById('bg-music');

// --- LUXURY PARTICLES AND CURSOR ---
function initLuxuryEffects() {
    const container = document.getElementById('particle-container') || document.body;
    
    // Heart particles
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'particle-heart';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        const duration = Math.random() * 5 + 5;
        heart.style.animationDuration = duration + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }, 1000);

    // Rose petals
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'particle-petal';
        petal.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 10 + 8;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        const duration = Math.random() * 6 + 6;
        petal.style.animationDuration = duration + 's';
        container.appendChild(petal);
        setTimeout(() => petal.remove(), duration * 1000);
    }, 800);

    // Custom Cursor tracking
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Occasional trail sparkle
        if (Math.random() > 0.9) {
            const trail = document.createElement('div');
            trail.className = 'particle-heart';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.fontSize = '8px';
            trail.style.animationDuration = '1.5s';
            trail.innerHTML = '✨';
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 1500);
        }
    });

    document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.8)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');

    // Add class to interactive elements for cursor hover
    const interactives = document.querySelectorAll('button, a, .slide-caption, .floating-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.5)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
}
initLuxuryEffects();

// --- 2. COUNTDOWN LOGIC ---
function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        if (countdownContainer) countdownContainer.style.display = 'none';
        if (unlockBtn) {
            unlockBtn.classList.remove('hidden');
            unlockBtn.style.opacity = '1';
            unlockBtn.style.display = 'block';
        }
        return true;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = s.toString().padStart(2, '0');

    return false;
}

const timerInterval = setInterval(() => {
    if (updateCountdown()) clearInterval(timerInterval);
}, 1000);
updateCountdown();

// --- 3. UNLOCK LOGIC ---
function unlock() {
    lockScreen.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
    lockScreen.style.transform = 'translateY(-100%)';
    
    setTimeout(() => {
        lockScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Start Music
        if (music) {
            music.play().catch(() => console.log("Music play blocked"));
        }
    }, 1500);
}

unlockBtn.addEventListener('click', unlock);

// --- 4. SLIDESHOW LOGIC ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(s => {
        s.classList.remove('active');
        s.style.opacity = '0';
    });
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    slides[currentSlide].style.opacity = '1';
}

// Initial state
showSlide(0);

setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

document.getElementById('prev-slide')?.addEventListener('click', () => showSlide(currentSlide - 1));
document.getElementById('next-slide')?.addEventListener('click', () => showSlide(currentSlide + 1));

// --- 6. TYPEWRITER EFFECT & INTERACTION ---
const typewriterElements = document.querySelectorAll('.typewriter-text');

const observerOptions = {
    threshold: 0.5
};

const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.getAttribute('data-text');
            if (!el.classList.contains('typed')) {
                typeText(el, text);
                el.classList.add('typed');
            }
        }
    });
}, observerOptions);

typewriterElements.forEach(el => typewriterObserver.observe(el));

function typeText(element, text) {
    let i = 0;
    element.innerHTML = '';
    const speed = 50; 

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Heart Burst & Sparkles on Hover
document.querySelectorAll('.floating-card').forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        createSparkles(card);
        createHeartBurst(e.clientX, e.clientY);
    });
});

function createSparkles(parent) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        parent.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    }
}

function createHeartBurst(x, y) {
    for (let i = 0; i < 6; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'fixed pointer-events-none text-xl z-[1000]';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        document.body.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let opacity = 1;
        let posX = x;
        let posY = y;

        function animate() {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            heart.style.left = posX + 'px';
            heart.style.top = posY + 'px';
            heart.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                heart.remove();
            }
        }
        requestAnimationFrame(animate);
    }
}

// --- 7. VIDEO REVEAL & FOCUS MODE ---
const startProposalBtn = document.getElementById('start-proposal');
const videoContainer = document.getElementById('video-container');
const closeVideoBtn = document.getElementById('close-video');
const proposalVideo = document.getElementById('proposal-video');
const videoOverlay = document.getElementById('video-overlay-play');

if (startProposalBtn && videoContainer) {
    startProposalBtn.addEventListener('click', () => {
        videoContainer.classList.remove('hidden');
        videoContainer.classList.add('flex');
        if (music) music.pause();
    });
}

if (videoOverlay && proposalVideo) {
    videoOverlay.addEventListener('click', () => {
        videoOverlay.classList.add('hidden');
        proposalVideo.play().catch(e => {
            console.error("Video play failed:", e);
        });
    });
}

if (closeVideoBtn) {
    closeVideoBtn.addEventListener('click', () => {
        if (proposalVideo) proposalVideo.pause();
        videoContainer.classList.add('hidden');
        videoContainer.classList.remove('flex');
        if (videoOverlay) videoOverlay.classList.remove('hidden'); // Reset overlay
        if (music) music.play().catch(()=>{});
        
        // Show ending
        const proposalSection = document.getElementById('proposal');
        if (proposalSection) proposalSection.style.display = 'none';
        const endingSection = document.getElementById('ending');
        if (endingSection) endingSection.scrollIntoView({ behavior: 'smooth' });
    });
}

if (proposalVideo) {
    proposalVideo.addEventListener('play', () => {
        if (videoOverlay) videoOverlay.classList.add('hidden');
        if (music) music.pause();
    });
    proposalVideo.addEventListener('ended', () => {
        if (music) music.play().catch(() => {});
    });
    proposalVideo.addEventListener('pause', () => {
        if (!videoContainer.classList.contains('hidden')) {
            if (music) music.play().catch(() => {});
        }
    });
}

// --- 8. SCROLL REVEAL OBSERVER ---
const revealElements = document.querySelectorAll('.opacity-0');
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            entry.target.style.transition = 'all 1s cubic-bezier(0.2, 1, 0.3, 1)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => scrollObserver.observe(el));

