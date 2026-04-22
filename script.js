// ==========================================
// 1. PAGE TRANSITION, STAGGER TEXT & BOOKING
// ==========================================
function initLuxuryInteractions() {
    const overlay = document.querySelector('.transition-overlay');
    
    if(overlay) {
        setTimeout(() => { overlay.classList.remove('active'); }, 100);
    }

    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.href;
            if(overlay) overlay.classList.add('active');
            setTimeout(() => { window.location.href = target; }, 700);
        });
    });

    // Automated Email Booking Engine (Homepage)
    const homeBookBtn = document.getElementById('home-book-btn');
    if (homeBookBtn) {
        homeBookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const dest = document.getElementById('dest-select').value;
            const checkIn = document.getElementById('checkin-input').value || "Date not selected";
            const checkOut = document.getElementById('checkout-input').value || "Date not selected";
            const guestsRooms = document.getElementById('guests-select').value;
            
            const email = dest === "The Samita Grand" ? "hotelsamitagrand@gmail.com" : "newsamitagrand@gmail.com";
            
            const body = `Hello\n\nI want to book a stay at ${dest} for the following dates :\n${checkIn} to ${checkOut}\n${guestsRooms}\n\nPlease do let me know if the stay can be arranged.`;
            
            window.location.href = `mailto:${email}?subject=Booking Request for ${dest}&body=${encodeURIComponent(body)}`;
        });
    }

    // Generic Book Now redirects (for sub-pages)
    const bookNowButtons = document.querySelectorAll('.btn-gold-solid');
    bookNowButtons.forEach(btn => {
        if(btn.closest('form') || btn.closest('.master-reveal-btn') || btn.classList.contains('get-directions') || btn.id === 'home-book-btn') return;
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); 
            if(overlay) overlay.classList.add('active');
            setTimeout(() => { window.location.href = 'contact-booking.html'; }, 700);
        });
    });

    // ==========================================
    // 2. DYNAMIC LINKED CALENDARS (FLATPICKR)
    // ==========================================
    if (typeof flatpickr !== 'undefined') {
        const checkinInput = document.getElementById('checkin-input');
        const checkoutInput = document.getElementById('checkout-input');

        if (checkinInput && checkoutInput) {
            const checkoutPicker = flatpickr(checkoutInput, { 
                altInput: true, 
                altFormat: "F j, Y", 
                dateFormat: "Y-m-d", 
                minDate: "today",
                disableMobile: "true" /* FIXED: Forces custom calendar on iPhone */
            });
            flatpickr(checkinInput, {
                altInput: true, 
                altFormat: "F j, Y", 
                dateFormat: "Y-m-d", 
                minDate: "today",
                disableMobile: "true", /* FIXED: Forces custom calendar on iPhone */
                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length > 0) {
                        const nextDay = new Date(selectedDates[0]);
                        nextDay.setDate(nextDay.getDate() + 1);
                        checkoutPicker.set('minDate', nextDay);
                        if (checkoutPicker.selectedDates.length > 0 && checkoutPicker.selectedDates[0] <= selectedDates[0]) {
                            checkoutPicker.clear();
                        }
                    }
                }
            });
        } else {
            flatpickr("input[type=date]", { 
                altInput: true, 
                altFormat: "F j, Y", 
                dateFormat: "Y-m-d", 
                minDate: "today",
                disableMobile: "true" /* FIXED: Forces custom calendar on iPhone */
            });
        }
    }

    // ==========================================
    // 3. STAGGERED WAVE TEXT ANIMATION
    // ==========================================
    const staggerElements = document.querySelectorAll('.stagger-text');
    staggerElements.forEach(el => {
        if (el.classList.contains('stagger-initialized')) return;
        const text = el.innerText;
        el.innerText = ''; 
        text.split('').forEach((char, i) => {
            const wrap = document.createElement('span');
            wrap.className = 'char-wrap';
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.innerText = char === ' ' ? '\u00A0' : char; 
            charSpan.setAttribute('data-char', char === ' ' ? '\u00A0' : char);
            charSpan.style.setProperty('--char-index', i);
            wrap.appendChild(charSpan);
            el.appendChild(wrap);
        });
        el.classList.add('stagger-initialized');
    });

    // ==========================================
    // 4. RETURN TO TOP BUTTON INJECTION
    // ==========================================
    if (!document.getElementById('scroll-top-btn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'scroll-top-btn';
        scrollTopBtn.innerHTML = '↑';
        document.body.appendChild(scrollTopBtn);

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
    }
}

// Ensure interactions load reliably
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLuxuryInteractions);
} else {
    initLuxuryInteractions();
}

// ==========================================
// 5. MODAL (ROOM EXPANSION) LOGIC
// ==========================================
const roomCards = document.querySelectorAll('.room-card');
const closeButtons = document.querySelectorAll('.close-modal');
const modals = document.querySelectorAll('.modal-overlay');

roomCards.forEach(card => {
    card.addEventListener('click', function(e) {
        if(e.target.classList.contains('btn-book-now') || e.target.tagName.toLowerCase() === 'a') return; 
        const modalId = this.getAttribute('data-modal');
        const targetModal = document.getElementById(modalId);
        if (targetModal) {
            targetModal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    });
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal-overlay').classList.remove('active');
        document.body.style.overflow = 'auto'; 
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ==========================================
// 6. LIQUID CURSOR & MOUNTAIN REVEAL
// ==========================================
const hero = document.getElementById('home-hero');
const layer = document.getElementById('reveal-layer');
const mountainLayer = document.getElementById('mountain-layer');
const mBtn = document.getElementById('master-reveal');
window.isSnowFlurry = false; 

if (hero && layer && mountainLayer && mBtn) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, targetSize = 0, currentSize = 0, timer, isFull = false;

    mBtn.addEventListener('mouseenter', () => { 
        isFull = true; mountainLayer.classList.remove('closing'); mountainLayer.classList.add('active'); window.isSnowFlurry = true; 
    });
    
    mBtn.addEventListener('mouseleave', () => { 
        isFull = false; mountainLayer.classList.remove('active'); mountainLayer.classList.add('closing'); window.isSnowFlurry = false; 
    });

    hero.addEventListener('mousemove', (e) => {
        targetX = e.clientX; targetY = e.clientY;
        if(!isFull) { layer.classList.add('active'); targetSize = 200; }
        clearTimeout(timer);
        timer = setTimeout(() => {
            targetSize = 300; 
            setTimeout(() => { if(!isFull) { layer.classList.remove('active'); targetSize = 0; } }, 800);
        }, 100);
    });

    function updateLiquid() {
        currentX += (targetX - currentX) * 0.1; currentY += (targetY - currentY) * 0.1; currentSize += (targetSize - currentSize) * 0.05;
        layer.style.setProperty('--m-x', currentX + 'px'); layer.style.setProperty('--m-y', currentY + 'px'); layer.style.setProperty('--m-size', currentSize + 'px');
        requestAnimationFrame(updateLiquid);
    }
    updateLiquid();
}

// ==========================================
// 7. CANVAS SNOWFALL ANIMATION
// ==========================================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5; this.baseSpeedY = Math.random() * 1 + 0.2; 
            this.color = Math.random() > 0.8 ? '#C6A87C' : '#FFFFFF'; this.opacity = Math.random() * 0.8 + 0.2;
        }
        update() {
            if (window.isSnowFlurry) { this.y += this.baseSpeedY * 5; this.x += this.speedX + (Math.sin(this.y * 0.02) * 3); } 
            else { this.y += this.baseSpeedY; this.x += this.speedX; }
            if (this.y > canvas.height) this.y = 0; if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
        }
        draw() {
            ctx.globalAlpha = this.opacity; ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    function init() { particles = []; for (let i = 0; i < 150; i++) particles.push(new Particle()); }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resize); resize(); init(); animate();
}