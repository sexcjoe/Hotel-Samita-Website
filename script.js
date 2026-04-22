// ==========================================
// 1. PAGE TRANSITION & DYNAMIC BOOKING ENGINE
// ==========================================
function initLuxuryInteractions() {
    const overlay = document.querySelector('.transition-overlay');
    if(overlay) { setTimeout(() => { overlay.classList.remove('active'); }, 100); }

    // Normal Links
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.href;
            if(overlay) overlay.classList.add('active');
            setTimeout(() => { window.location.href = target; }, 700);
        });
    });

    // ------------------------------------------
    // DYNAMIC MULTI-STEP BOOKING LOGIC
    // ------------------------------------------
    const bar = document.getElementById('main-booking-bar');
    const dynamicBtn = document.getElementById('dynamic-book-btn');
    const step1 = document.querySelector('.step-1');
    const step2 = document.querySelector('.step-2');
    
    let bookingState = 0; // 0: Collapsed, 1: Dates, 2: Info

    // Validation Functions
    function validateStep1() {
        const ci = document.getElementById('checkin-input');
        const co = document.getElementById('checkout-input');
        if (ci && co && bookingState === 1) {
            dynamicBtn.disabled = !(ci.value !== "" && co.value !== "");
        }
    }

    function validateStep2() {
        const name = document.getElementById('guest-name');
        const phone = document.getElementById('guest-phone');
        if (name && phone && bookingState === 2) {
            const cleanPhone = phone.value.replace(/\D/g, ''); // keep only numbers
            dynamicBtn.disabled = !(name.value.trim().length > 0 && cleanPhone.length >= 10);
        }
    }

    if (dynamicBtn && bar) {
        dynamicBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (bookingState === 0) {
                // Expand to Step 1
                bar.classList.remove('collapsed');
                bar.classList.add('expanded');
                step1.style.display = 'flex';
                dynamicBtn.innerText = 'NEXT';
                dynamicBtn.disabled = true;
                bookingState = 1;
                validateStep1(); 
            } 
            else if (bookingState === 1) {
                // Move to Step 2
                step1.style.display = 'none';
                step2.style.display = 'flex';
                dynamicBtn.innerText = 'MAKE RESERVATION';
                dynamicBtn.disabled = true;
                bookingState = 2;
                validateStep2();
            } 
            else if (bookingState === 2) {
                // Submit Form via Email
                const dest = document.getElementById('dest-select').value;
                const checkIn = document.getElementById('checkin-input').value;
                const checkOut = document.getElementById('checkout-input').value;
                const guests = document.getElementById('guests-select').value;
                const name = document.getElementById('guest-name').value;
                const phone = "+91 " + document.getElementById('guest-phone').value;

                const email = dest === "The Samita Grand" ? "hotelsamitagrand@gmail.com" : "newsamitagrand@gmail.com";
                const body = `Hello\n\nI want to book a stay at ${dest} for the following dates :\n${checkIn} to ${checkOut}\n${guests}\n\nGuest Details:\nName: ${name}\nPhone: ${phone}\n\nPlease do let me know if the stay can be arranged.`;
                
                window.location.href = `mailto:${email}?subject=Booking Request for ${dest}&body=${encodeURIComponent(body)}`;
                
                // Optional: Flash transition overlay to confirm action
                if(overlay) {
                    overlay.classList.add('active');
                    setTimeout(() => { overlay.classList.remove('active'); }, 1500);
                }
            }
        });

        // Input listeners for Step 2 validation
        const nameInput = document.getElementById('guest-name');
        const phoneInput = document.getElementById('guest-phone');
        if (nameInput) nameInput.addEventListener('input', validateStep2);
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0,10); // Force max 10 numeric digits
                validateStep2();
            });
        }
    }

    // Sub-page regular book buttons redirect to contact page
    const genericBookButtons = document.querySelectorAll('.btn-gold-solid');
    genericBookButtons.forEach(btn => {
        if(btn.id === 'dynamic-book-btn' || btn.classList.contains('get-directions')) return;
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
                altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today", disableMobile: "true",
                onChange: function() { if (typeof validateStep1 === 'function') validateStep1(); }
            });
            flatpickr(checkinInput, {
                altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today", disableMobile: "true",
                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length > 0) {
                        const nextDay = new Date(selectedDates[0]);
                        nextDay.setDate(nextDay.getDate() + 1);
                        checkoutPicker.set('minDate', nextDay);
                        if (checkoutPicker.selectedDates.length > 0 && checkoutPicker.selectedDates[0] <= selectedDates[0]) {
                            checkoutPicker.clear();
                        }
                    }
                    if (typeof validateStep1 === 'function') validateStep1();
                }
            });
        } else {
            flatpickr("input[type=date]", { altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today", disableMobile: "true" });
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

        scrollTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { scrollTopBtn.classList.add('show'); } 
            else { scrollTopBtn.classList.remove('show'); }
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