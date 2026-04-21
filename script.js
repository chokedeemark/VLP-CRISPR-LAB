// script.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-obsidian/95', 'shadow-lg');
        navbar.classList.remove('bg-obsidian/80');
    } else {
        navbar.classList.add('bg-obsidian/80');
        navbar.classList.remove('bg-obsidian/95', 'shadow-lg');
    }
});

// Particle Animation (Simulating biotech molecules/DNA in background)
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

// Handle resize
window.addEventListener('resize', () => {
    resizeCanvas();
    init();
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw method
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Update method
    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

// Initialize particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    
    // Custom colors from the palette (Cyan, Purple, Green)
    const colors = ['rgba(0, 240, 255, 0.6)', 'rgba(176, 38, 255, 0.4)', 'rgba(57, 255, 20, 0.3)'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect particles with lines if close enough
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                           ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue * 0.15})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Start
init();
animate();

// Lab Gallery Horizontal Scroll
document.addEventListener('DOMContentLoaded', () => {
    const labGallery = document.getElementById('lab-gallery');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    if(labGallery && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            labGallery.scrollBy({ left: -labGallery.clientWidth, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            labGallery.scrollBy({ left: labGallery.clientWidth, behavior: 'smooth' });
        });
    }

    // Scroll spy: highlight active mobile compact nav link
    const sections = document.querySelectorAll('section[id], footer[id]');
    const mobileCompactLinks = document.querySelectorAll('.mobile-compact-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        mobileCompactLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // run on load
});
