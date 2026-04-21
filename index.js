// ==========================================
// 1. HOMEPAGE REDIRECTS
// ==========================================
// Select the buttons on the home page
const samitaGrandBtn = document.getElementById('btn-samita-grand');
const newSamitaGrandBtn = document.getElementById('btn-new-samita-grand');

// Add click events to redirect users to the respective hotel pages
if (samitaGrandBtn) {
    samitaGrandBtn.addEventListener('click', () => {
        window.location.href = 'samita-grand.html'; 
    });
}

if (newSamitaGrandBtn) {
    newSamitaGrandBtn.addEventListener('click', () => {
        window.location.href = 'new-samita-grand.html';
    });
}

// ==========================================
// 2. EXPANDABLE LOCAL ATTRACTIONS
// ==========================================
const expandAttractionsBtn = document.getElementById('expand-attractions-btn');
const attractionsDetails = document.getElementById('attractions-detailed-view');

if (expandAttractionsBtn && attractionsDetails) {
    expandAttractionsBtn.addEventListener('click', () => {
        // Toggle the 'show' class which will be handled in CSS (e.g., display: block;)
        attractionsDetails.classList.toggle('show');
        
        // Change the button text based on whether it's open or closed
        if (attractionsDetails.classList.contains('show')) {
            expandAttractionsBtn.innerText = "[- Click to hide details ]";
        } else {
            expandAttractionsBtn.innerText = "[+ Click to see more detailed info and pictures of each spot ]";
        }
    });
}

// ==========================================
// 3. ROOM CARD INTERACTIVITY (Grid to Expanded View)
// ==========================================
// Grab all room cards on the page
const roomCards = document.querySelectorAll('.room-card');

roomCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remove the 'expanded' class from all OTHER cards so only one is open at a time
        roomCards.forEach(otherCard => {
            if (otherCard !== this) {
                otherCard.classList.remove('expanded');
            }
        });
        
        // Toggle the 'expanded' class on the clicked card
        this.classList.toggle('expanded');
    });
});

// ==========================================
// 4. PREVENT "BOOK NOW" FROM TRIGGERING CARD EXPANSION
// ==========================================
// When a user clicks the "Book Now" button inside a room card, 
// we don't want the whole card to expand/collapse. We just want to redirect them.
const bookNowButtons = document.querySelectorAll('.btn-book-now');

bookNowButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        // Stop the click from bubbling up to the room-card element
        event.stopPropagation(); 
        
        // Redirect to booking page (replace with your actual booking link)
        window.location.href = 'contact-booking.html'; 
    });
});

// ==========================================
// 5. SMOOTH SCROLLING FOR FOOTER LINKS
// ==========================================
// This makes the page scroll down smoothly when they click "Rooms" or "Find Us" in the footer
const smoothScrollLinks = document.querySelectorAll('.footer-link');

smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        // Only prevent default if it's an anchor link on the same page (starts with #)
        if (this.getAttribute('href').startsWith('#')) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
		  });
            }
        }
    });
});