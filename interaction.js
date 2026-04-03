/**
 * NEBULUX // Interaction Engine
 * Features: Cinematic Cursor, 3D Glass Tilt, Magnetic CTA, & Scroll Reveals.
 */

const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
const cards = document.querySelectorAll('.tilt-element');
const magneticBtns = document.querySelectorAll('.magnetic');

// 1. DYNAMIC CURSOR SYSTEM
// Using requestAnimationFrame for silky smooth 60fps tracking
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate positioning for the center dot
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateCursor() {
    // Easing formula: current + (target - current) * dampening
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// 2. 3D GLASS TILT & REFRACTION
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Intensity of the tilt (increase/decrease the divisor for more/less "flex")
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;

        // Update CSS Variables for the "Spotlight" effect in glass.css
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// 3. MAGNETIC CTA INTERACTION
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull the button towards the cursor
        btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        
        // Visual feedback for the cursor
        outline.style.width = '65px';
        outline.style.height = '65px';
        outline.style.borderColor = 'rgba(255,255,255,0.8)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0, 0)`;
        outline.style.width = '30px';
        outline.style.height = '30px';
        outline.style.borderColor = 'rgba(255,255,255,0.4)';
    });
});

// 4. SMART SCROLL OBSERVER
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve to save memory after the "flex" is revealed
            revealOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealOnScroll.observe(el));
