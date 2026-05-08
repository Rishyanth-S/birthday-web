// --- 1. CONFIGURATION ---
const targetDate = new Date('2026-05-07T22:21:00').getTime(); // Already passed for immediate unlock

// Initialize Lucide Icons
lucide.createIcons();

// Elements
const lockScreen = document.getElementById('lock-screen');
const unlockBtn = document.getElementById('unlock-btn');
const countdownContainer = document.getElementById('countdown-container');
const music = document.getElementById('bg-music');

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

// Focus Mode
const proposalVideo = document.getElementById('proposal-video');
if (proposalVideo) {
    proposalVideo.addEventListener('play', () => {
        if (music) music.pause();
    });
    proposalVideo.addEventListener('ended', () => {
        if (music) music.play().catch(() => {});
    });
    proposalVideo.addEventListener('pause', () => {
        if (music) music.play().catch(() => {});
    });
}
