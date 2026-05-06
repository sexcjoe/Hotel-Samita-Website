// ==========================================
// 1. PAGE TRANSITION & DYNAMIC BOOKING ENGINE
// ==========================================
function initLuxuryInteractions() {
    const overlay = document.querySelector('.transition-overlay');
    if(overlay) { setTimeout(() => { overlay.classList.remove('active'); }, 100); }

    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.href;
            if(overlay) overlay.classList.add('active');
            setTimeout(() => { window.location.href = target; }, 1800);
        });
    });

    const bar = document.getElementById('main-booking-bar');
    const dynamicBtn = document.getElementById('dynamic-book-btn');
    const step1 = document.querySelector('.step-1');
    const step2 = document.querySelector('.step-2');
    
    let bookingState = 0; 

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
        const phoneError = document.getElementById('phone-error');
        
        if (name && phone && bookingState === 2) {
            const cleanPhone = phone.value.replace(/\D/g, ''); 
            const isValidPhone = /^[6-9]\d{9}$/.test(cleanPhone);
            
            // SMART ERROR DISPLAY LOGIC
            if (phoneError) {
                // If it's valid, or if the box is completely empty, hide the error
                if (isValidPhone || cleanPhone.length === 0) {
                    phoneError.style.display = 'none';
                } 
                // If they typed a full 10 digits but it's an invalid Indian number, show error
                else if (cleanPhone.length === 10 && !isValidPhone) {
                    phoneError.style.display = 'block';
                }
            }

            dynamicBtn.disabled = !(name.value.trim().length > 0 && isValidPhone);
        }
    }

    if (dynamicBtn && bar) {
        dynamicBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();

            if (bookingState === 0) {
                bar.classList.remove('collapsed'); bar.classList.add('expanded');
                step1.style.display = 'flex'; dynamicBtn.innerText = 'NEXT'; dynamicBtn.disabled = true;
                bookingState = 1; validateStep1(); 
            } 
            else if (bookingState === 1) {
                step1.style.display = 'none'; step2.style.display = 'flex';
                dynamicBtn.innerText = 'MAKE RESERVATION'; dynamicBtn.disabled = true;
                bookingState = 2; validateStep2();
            } 
            else if (bookingState === 2) {
                const dest = document.getElementById('dest-select').value;
                const checkIn = document.getElementById('checkin-input').value;
                const checkOut = document.getElementById('checkout-input').value;
                const guests = document.getElementById('guests-select').value;
                const name = document.getElementById('guest-name').value;
                const phone = "+91 " + document.getElementById('guest-phone').value;

                let durationText = "";
                if(checkIn && checkOut) {
                    const ciDate = new Date(checkIn);
                    const coDate = new Date(checkOut);
                    if(!isNaN(ciDate) && !isNaN(coDate)) {
                        const diffDays = Math.ceil((coDate - ciDate) / (1000 * 60 * 60 * 24));
                        if(diffDays > 7) { durationText = `\nDuration: 7+ days (${diffDays} days)`; } 
                        else if(diffDays > 0) { durationText = `\nDuration: ${diffDays} days`; }
                    }
                }

                const email = dest === "The Samita Grand" ? "hotelsamitagrand@gmail.com" : "newsamitagrand@gmail.com";
                const body = `Hello\n\nI want to book a stay at ${dest} for the following dates :\n${checkIn} to ${checkOut}${durationText}\n${guests}\n\nGuest Details:\nName: ${name}\nPhone: ${phone}\n\nPlease do let me know if the stay can be arranged.`;
                
                window.location.href = `mailto:${email}?subject=Booking Request for ${dest}&body=${encodeURIComponent(body)}`;
                if(overlay) { overlay.classList.add('active'); setTimeout(() => { overlay.classList.remove('active'); }, 1500); }
            }
        });

        const nameInput = document.getElementById('guest-name');
        const phoneInput = document.getElementById('guest-phone');
        if (nameInput) nameInput.addEventListener('input', validateStep2);
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0,10); 
                validateStep2();
            });
            // Show error if they click away from the box and haven't finished typing 10 digits
            phoneInput.addEventListener('blur', (e) => {
                const cleanPhone = e.target.value.replace(/\D/g, '');
                const isValidPhone = /^[6-9]\d{9}$/.test(cleanPhone);
                const phoneError = document.getElementById('phone-error');
                if (cleanPhone.length > 0 && !isValidPhone && phoneError) {
                    phoneError.style.display = 'block';
                }
            });
        }
    }

    const genericBookButtons = document.querySelectorAll('.btn-gold-solid');
    genericBookButtons.forEach(btn => {
        if(btn.id === 'dynamic-book-btn' || btn.classList.contains('get-directions')) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation(); 
            if(overlay) overlay.classList.add('active');
            setTimeout(() => { window.location.href = 'contact-booking.html'; }, 700);
        });
    });

    // ==========================================
    // 2. DYNAMIC LINKED CALENDARS (14 DAY LIMIT)
    // ==========================================
    if (typeof flatpickr !== 'undefined') {
        const checkinInput = document.getElementById('checkin-input');
        const checkoutInput = document.getElementById('checkout-input');

        const maxBookingDate = new Date();
        maxBookingDate.setMonth(maxBookingDate.getMonth() + 6);

        if (checkinInput && checkoutInput) {
            const checkoutPicker = flatpickr(checkoutInput, { 
                altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today", disableMobile: "true", 
                onChange: function() { if (typeof validateStep1 === 'function') validateStep1(); } 
            });

            flatpickr(checkinInput, {
                altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today", maxDate: maxBookingDate, disableMobile: "true",
                onChange: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length > 0) {
                        const nextDay = new Date(selectedDates[0]); 
                        nextDay.setDate(nextDay.getDate() + 1);
                        
                        // Calculate exactly 14 days from check-in
                        const maxStay = new Date(selectedDates[0]);
                        maxStay.setDate(maxStay.getDate() + 14);

                        // Set the dynamic limits on the checkout calendar
                        checkoutPicker.set('minDate', nextDay);
                        checkoutPicker.set('maxDate', maxStay);
                        
                        // Clear checkout if their old date violates the new 14-day limit
                        if (checkoutPicker.selectedDates.length > 0) {
                            const currentCheckOut = checkoutPicker.selectedDates[0];
                            if (currentCheckOut <= selectedDates[0] || currentCheckOut > maxStay) { 
                                checkoutPicker.clear(); 
                            }
                        }
                    }
                    if (typeof validateStep1 === 'function') validateStep1();
                }
            });
        } else {
            flatpickr("input[type=date]", { altInput: true, altFormat: "F j, Y", dateFormat: "Y-m-d", minDate: "today", disableMobile: "true" });
        }
    }

    const staggerElements = document.querySelectorAll('.stagger-text');
    staggerElements.forEach(el => {
        if (el.classList.contains('stagger-initialized')) return;
        const text = el.innerText; el.innerText = ''; 
        text.split('').forEach((char, i) => {
            const wrap = document.createElement('span'); wrap.className = 'char-wrap';
            const charSpan = document.createElement('span'); charSpan.className = 'char';
            charSpan.innerText = char === ' ' ? '\u00A0' : char; 
            charSpan.setAttribute('data-char', char === ' ' ? '\u00A0' : char);
            charSpan.style.setProperty('--char-index', i);
            wrap.appendChild(charSpan); el.appendChild(wrap);
        });
        el.classList.add('stagger-initialized');
    });

    if (!document.getElementById('scroll-top-btn')) {
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'scroll-top-btn'; scrollTopBtn.innerHTML = '↑';
        document.body.appendChild(scrollTopBtn);

        scrollTopBtn.addEventListener('click', () => {
            const scrollStep = -window.scrollY / (1500 / 15);
            const scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep);
                } else {
                    clearInterval(scrollInterval);
                }
            }, 15);
        });
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { scrollTopBtn.classList.add('show'); } 
            else { scrollTopBtn.classList.remove('show'); }
        });
    }

    // ==========================================
    // 8. FOOTER ANIMATED NETWORK ENGINE
    // ==========================================
    const footerCanvas = document.getElementById('footer-network');
    if (footerCanvas) {
        const fctx = footerCanvas.getContext('2d');
        let fParticles = [];
        
        function resizeFooter() {
            footerCanvas.width = footerCanvas.parentElement.offsetWidth;
            footerCanvas.height = footerCanvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resizeFooter);
        resizeFooter();

        class FooterNode {
            constructor() {
                this.x = Math.random() * footerCanvas.width; this.y = Math.random() * footerCanvas.height;
                this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if(this.x < 0 || this.x > footerCanvas.width) this.vx *= -1;
                if(this.y < 0 || this.y > footerCanvas.height) this.vy *= -1;
            }
            draw() {
                fctx.beginPath(); fctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                fctx.fillStyle = '#C6A87C'; fctx.fill();
            }
        }

// Creates 80 particles on desktop, but only 30 on mobile!
let particleCount = window.innerWidth < 900 ? 30 : 80;
for(let i=0; i<particleCount; i++) fParticles.push(new FooterNode());

        function animateFooter() {
            fctx.clearRect(0, 0, footerCanvas.width, footerCanvas.height);
            for(let i=0; i<fParticles.length; i++) {
                fParticles[i].update(); fParticles[i].draw();
                for(let j = i + 1; j < fParticles.length; j++) {
                    const dx = fParticles[i].x - fParticles[j].x;
                    const dy = fParticles[i].y - fParticles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if(dist < 120) {
                        fctx.beginPath();
                        fctx.strokeStyle = `rgba(198, 168, 124, ${1 - dist/120})`;
                        fctx.lineWidth = 0.5;
                        fctx.moveTo(fParticles[i].x, fParticles[i].y);
                        fctx.lineTo(fParticles[j].x, fParticles[j].y);
                        fctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateFooter);
        }
        animateFooter();
    }
    
    // CUSTOM LUXURY CURSOR
    if (typeof initCustomCursor === 'function') initCustomCursor();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLuxuryInteractions);
} else {
    initLuxuryInteractions();
}

const modalTriggers = document.querySelectorAll('.room-card, [data-modal]');
const closeButtons = document.querySelectorAll('.close-modal');
const modals = document.querySelectorAll('.modal-overlay');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        if(e.target.classList.contains('btn-book-now') || (e.target.tagName.toLowerCase() === 'a' && !e.target.hasAttribute('data-modal'))) return; 
        
        const modalId = this.getAttribute('data-modal') || e.target.getAttribute('data-modal');
        if(!modalId) return;

        const targetModal = document.getElementById(modalId);
        if (targetModal) { targetModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    });
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal-overlay').classList.remove('active'); document.body.style.overflow = 'auto'; 
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) { this.classList.remove('active'); document.body.style.overflow = 'auto'; }
    });
});

// ==========================================
// 6. LANDO NORRIS LIQUID MASK ENGINE
// ==========================================
const hero = document.getElementById('home-hero');
const layer = document.getElementById('reveal-layer');

if (hero && layer) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let targetSize = 0;
    let currentSize = 0;
    let idleTimer;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;

        targetSize = 250; 
        
        clearTimeout(idleTimer);
        
        idleTimer = setTimeout(() => {
            targetSize = 0;
        }, 1000);
    });

    hero.addEventListener('mouseenter', () => { targetSize = 250; });
    hero.addEventListener('mouseleave', () => { 
        targetSize = 0; 
        clearTimeout(idleTimer); 
    });

    function updateLiquid() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        
        const velX = targetX - currentX;
        const velY = targetY - currentY;
        const speed = Math.sqrt(velX * velX + velY * velY);
        
        let dynamicTargetSize = targetSize;
        if (targetSize > 0) {
            dynamicTargetSize = targetSize + (speed * 1.2);
            if (dynamicTargetSize > 400) dynamicTargetSize = 400; 
        }
        
        currentSize += (dynamicTargetSize - currentSize) * 0.15;

        layer.style.setProperty('--m-x', currentX + 'px');
        layer.style.setProperty('--m-y', currentY + 'px');
        layer.style.setProperty('--m-size', currentSize + 'px');
        
        requestAnimationFrame(updateLiquid);
    }
    updateLiquid();
}

// ==========================================
// 9. CUSTOM LUXURY CURSOR ENGINE
// ==========================================
function initCustomCursor() {
    if (window.innerWidth < 901) return;

    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'luxury-cursor-container';
    
    const triangle = document.createElement('div');
    triangle.className = 'cursor-triangle';
    
    const snowflake = document.createElement('div');
    snowflake.className = 'cursor-snowflake';
    snowflake.innerHTML = '<span class="snowflake-inner">❄</span>';
    
    cursorContainer.appendChild(triangle);
    cursorContainer.appendChild(snowflake);
    document.body.appendChild(cursorContainer);

    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        // Instant position for the triangle
        triangle.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) rotate(-30deg)`;
        
        // Smooth lagging effect for the snowflake
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        snowflake.style.transform = `translate(${curX}px, ${curY}px)`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();
}