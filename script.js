// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 3D Scroll Effect
function update3DTransform() {
    const sections = document.querySelectorAll('.section-3d');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        let progress = 0;
        if (sectionTop < 0) {
            progress = Math.abs(sectionTop) / sectionHeight;
        }

        progress = Math.min(progress, 1.5);

        const scale = 1 - progress * 0.15;
        const translateZ = -progress * 200;
        const opacity = Math.max(1 - progress * 0.6, 0.3);

        section.style.transform = `perspective(1000px) translateZ(${translateZ}px) scale(${scale})`;
        section.style.opacity = opacity;
        section.style.transformOrigin = 'center top';
    });
}

window.addEventListener('scroll', update3DTransform, { passive: true });
update3DTransform();

// Animated Background
const canvas = document.getElementById('animatedCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };
let animationFrame;

const ideas = [
    "DATA", "AI", "01", "STRATEGY", "INSIGHTS", "10", "ANALYTICS", "11",
    "CREATIVE", "00", "DIGITAL", "101", "GROWTH", "110", "SOCIAL", "111",
    "CONTENT", "001", "ENGAGEMENT", "010", "KPI", "GOALS", "95%", "MUTANT",
    "MEME", "ER", "LIKE", "SHARE", "COMMENT"
];

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 12000);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            text: ideas[Math.floor(Math.random() * ideas.length)],
            size: Math.random() * 8 + 10
        });
    }
}

function animate() {
    ctx.fillStyle = 'rgba(26, 28, 44, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        // Calculate distance from mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repel from mouse
        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 150;
            particle.vx -= Math.cos(angle) * force * 0.5;
            particle.vy -= Math.sin(angle) * force * 0.5;
        }

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Gradually slow down
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Keep base movement
        if (Math.abs(particle.vx) < 0.3) particle.vx += (Math.random() - 0.5) * 0.1;
        if (Math.abs(particle.vy) < 0.3) particle.vy += (Math.random() - 0.5) * 0.1;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle
        ctx.font = `${particle.size}px 'Inter', monospace`;
        ctx.fillStyle = `rgba(212, 175, 55, ${0.15 + Math.random() * 0.1})`;
        ctx.fillText(particle.text, particle.x, particle.y);

        // Draw connections
        particles.forEach(other => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 120)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        });
    });

    animationFrame = requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
});

window.addEventListener('resize', () => {
    setCanvasSize();
    initParticles();
});

setCanvasSize();
initParticles();
animate();
