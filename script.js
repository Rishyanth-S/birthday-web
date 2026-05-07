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

// --- 6. FOCUS MODE: AUDIO/VIDEO OPTIMIZATION ---
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
