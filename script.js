// CONFIGURATION
const BIRTHDAY_DATE = "May 8, 2026 00:00:00"; // Set her birthday here
const HER_NAME = "Brijisha";
const YOUR_NAME = "Rishy";

// Initialize Lucide Icons
lucide.createIcons();

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Elements
const lockScreen = document.getElementById('lock-screen');
const mainContent = document.getElementById('main-content');
const unlockBtn = document.getElementById('unlock-btn');
const countdownItems = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

// --- 1. COUNTDOWN LOGIC ---
function updateCountdown() {
    const target = new Date('2026-05-07T22:01:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('countdown-container').style.display = 'none';
        unlockBtn.classList.remove('hidden');
        gsap.to(unlockBtn, { opacity: 1, y: 0, display: 'block', duration: 1 });
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

    unlockBtn.classList.add('hidden');
    return false;
}

// Update countdown initially
updateCountdown();

// Update every second
const timerInterval = setInterval(() => {
    if (updateCountdown()) {
        clearInterval(timerInterval);
    }
}, 1000);

// --- 2. UNLOCK ANIMATION ---
function unlock() {
    gsap.to(lockScreen, {
        y: '-100%',
        duration: 2,
        ease: 'power4.inOut',
        onComplete: () => {
            lockScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Re-trigger ScrollTrigger refresh after unlock to ensure positions are correct
            ScrollTrigger.refresh();
            
            startCinematicIntro();
        }
    });

    mainContent.classList.remove('opacity-0', 'pointer-events-none');
    gsap.to(mainContent, { opacity: 1, duration: 1, delay: 1 });
}

unlockBtn.addEventListener('click', unlock);

// Debug: Press 'U' to skip countdown
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'u') unlock();
});

// --- 3. CINEMATIC INTRO (HERO) ---
function startCinematicIntro() {
    const tl = gsap.timeline();
    
    // Cinematic Hero Text Reveal
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        tl.to(heroTitle, { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out' })
          .to('#hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
          .to('#hero-heart', { opacity: 1, scale: 1, duration: 1, ease: 'back.out' }, '-=0.5');
    }

    // Start music only after interaction
    const music = document.getElementById('bg-music');
    if (music) {
        music.load(); // Start loading
        music.play().catch(err => console.log("Music play blocked by browser"));
    }

    createPetals();
    createFloatingHearts();
}

// Parallax background
gsap.to('#gradient-bg', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
    },
    y: 200,
    ease: 'none'
});


// --- 4. FLOATING HEARTS ---
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '<i data-lucide="heart"></i>';
    heart.style.left = (x || Math.random() * 100) + (x ? 'px' : 'vw');
    heart.style.top = (y || window.innerHeight + 50) + 'px';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.animation = `floatUp ${Math.random() * 3 + 2}s linear forwards`;

    document.body.appendChild(heart);
    lucide.createIcons();

    setTimeout(() => heart.remove(), 5000);
}

function createFloatingHearts() {
    setInterval(() => {
        createHeart();
    }, 2000);
}

document.addEventListener('click', (e) => {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeart(e.clientX + (Math.random() * 40 - 20), e.clientY + (Math.random() * 40 - 20)), i * 100);
    }
});

// --- 5. PARTICLES CANVAS ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Particle system disabled for extreme performance
// for (let i = 0; i < 50; i++) particles.push(new Particle()); 
initCanvas();
// animateParticles(); 
window.addEventListener('resize', initCanvas);

// --- 5. SLIDESHOW LOGIC ---
let currentSlide = 0;
const slides = document.querySelectorAll('#slideshow .slide');
let slideInterval;

function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    resetSlideTimer();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000); // Updated to 4 seconds
}

// Initial start
resetSlideTimer();

// Manual Controls
document.getElementById('prev-slide')?.addEventListener('click', prevSlide);
document.getElementById('next-slide')?.addEventListener('click', nextSlide);

// Parallax for memories
gsap.to('#slideshow img', {
    scrollTrigger: {
        trigger: '#memories',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    },
    y: 50,
    ease: 'none'
});


// --- 6. SCROLL LOGIC ---

// Scroll Progress
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";

    // Update active dot
    const sections = ['hero', 'memories', 'wishes', 'letter', 'proposal'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
            document.querySelectorAll('.scroll-dot').forEach(dot => dot.classList.remove('active'));
            document.querySelector(`.scroll-dot[data-section="${id}"]`)?.classList.add('active');
        }
    });
});

// Navigation Dots Click
document.querySelectorAll('.scroll-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const target = dot.getAttribute('data-section');
        document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
    });
});

// Reveal cards
document.querySelectorAll('.wish-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
        },
        opacity: 0,
        y: 50,
        rotate: i % 2 === 0 ? -5 : 5,
        duration: 1,
        ease: 'power3.out'
    });
});

// Optimized Letter Reveal
document.querySelectorAll('.reveal-text').forEach((text, i) => {
    // Hide initially via JS only
    gsap.set(text, { opacity: 0, y: 30 });
    
    gsap.to(text, {
        scrollTrigger: {
            trigger: text,
            start: 'top 95%', // Trigger earlier
            once: true
        },
        opacity: 1,
        y: 0,
        duration: 1,
        delay: i * 0.15,
        ease: 'power3.out',
        onComplete: () => {
            console.log(`Letter paragraph ${i} revealed`);
        }
    });
});

// Section Header Reveals
document.querySelectorAll('.section-reveal').forEach((header) => {
    ScrollTrigger.create({
        trigger: header,
        start: 'top 85%',
        onEnter: () => header.classList.add('active'),
        once: true
    });
});

// --- 7. PROPOSAL SECTION ---
const startProposalBtn = document.getElementById('start-proposal');
const videoContainer = document.getElementById('video-container');
const proposalVideo = document.getElementById('proposal-video');
const videoOverlay = document.getElementById('video-overlay');

gsap.to('#pre-text-1', {
    scrollTrigger: '#proposal',
    opacity: 1, y: 0, duration: 1
});
gsap.to('#pre-text-2', {
    scrollTrigger: '#proposal',
    opacity: 1, y: 0, duration: 1, delay: 0.3
});
gsap.to('#start-proposal', {
    scrollTrigger: '#proposal',
    opacity: 1, y: 0, duration: 1, delay: 0.6
});

startProposalBtn.addEventListener('click', () => {
    videoContainer.classList.remove('hidden');
    videoContainer.classList.add('flex');
    gsap.from(videoContainer, { opacity: 0, duration: 0.5 });
});

videoOverlay.addEventListener('click', () => {
    videoOverlay.style.display = 'none';
    proposalVideo.play();
});

proposalVideo.onended = () => {
    // Confetti Burst!
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    setTimeout(() => {
        videoContainer.classList.add('hidden');
        videoContainer.classList.remove('flex');
        document.getElementById('anime-section').scrollIntoView({ behavior: 'smooth' });
    }, 3000);
};

document.getElementById('close-video').addEventListener('click', () => {
    videoContainer.classList.add('hidden');
    videoContainer.classList.remove('flex');
    proposalVideo.pause();
});

// --- 8. PETALS ANIMATION ---
function createPetals() {
    const container = document.getElementById('petals-container');
    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 15 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = -20 + 'px';
        container.appendChild(petal);

        gsap.to(petal, {
            y: '110vh',
            x: '+=' + (Math.random() * 200 - 100),
            rotation: Math.random() * 360,
            duration: Math.random() * 5 + 5,
            repeat: -1,
            delay: Math.random() * 5,
            ease: 'none'
        });
    }
}

// --- 8b. CHERRY BLOSSOMS (Anime Section) ---
function createCherryBlossoms() {
    const container = document.getElementById('cherry-blossoms');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.background = '#ffd1dc'; // Soft pink
        const size = Math.random() * 8 + 5;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.top = -20 + 'px';
        container.appendChild(petal);
        
        gsap.to(petal, {
            y: '100vh',
            x: '+=' + (Math.random() * 300 - 150),
            rotation: Math.random() * 720,
            duration: Math.random() * 8 + 8,
            repeat: -1,
            delay: Math.random() * 10,
            ease: 'none'
        });
    }
}

// Anime Section Reveal
gsap.to('.anime-card', {
    scrollTrigger: {
        trigger: '#anime-section',
        start: 'top 60%',
    },
    opacity: 1,
    x: 0,
    stagger: 0.3,
    duration: 1.5,
    ease: 'expo.out',
    onStart: () => createCherryBlossoms()
});

gsap.to('#anime-caption', {
    scrollTrigger: {
        trigger: '#anime-section',
        start: 'top 30%',
    },
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 1
});

// --- 9. AUDIO TOGGLE ---
const audioToggle = document.getElementById('audio-toggle');
const music = document.getElementById('bg-music');
let isMuted = false;

audioToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    music.muted = isMuted;
    audioToggle.innerHTML = isMuted ?
        '<i data-lucide="volume-x" class="w-6 h-6 text-white/50"></i>' :
        '<i data-lucide="volume-2" class="w-6 h-6 text-pink-400"></i>';
    lucide.createIcons();
});

// --- 10. CURSOR GLOW & TRAIL ---
const cursorGlow = document.getElementById('cursor-glow');
let lastMove = 0;

document.addEventListener('mousemove', (e) => {
    gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });

    // Throttled mouse trail hearts
    const now = Date.now();
    if (now - lastMove > 100) {
        createHeart(e.clientX, e.clientY);
        lastMove = now;
    }
});

// --- 11. FINAL ENDING FIREWORKS ---
document.querySelectorAll('.reveal-final').forEach((el, i) => {
    gsap.to(el, {
        scrollTrigger: {
            trigger: '#ending',
            start: 'top 50%',
            onEnter: () => {
                if (i === 0) {
                    // Start fireworks when ending section is reached
                    const end = Date.now() + (10 * 1000);
                    const colors = ['#ff2d75', '#4a148c', '#ffffff'];

                    (function frame() {
                        confetti({
                            particleCount: 3,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: colors
                        });
                        confetti({
                            particleCount: 3,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: colors
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    }());
                }
            }
        },
        opacity: 1,
        y: 0,
        duration: 1,
        delay: i * 0.5,
        ease: 'power3.out'
    });
});

document.getElementById('replay-btn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
