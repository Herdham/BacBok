// ==========================================
// GSAP ANIMATIONS - FRIENDS PAGE
// ==========================================

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Page Load Animations
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // Navbar slides down
    tl.from('.navbar', {
        duration: 0.6,
        y: -80,
        opacity: 0,
        ease: "power2.out"
    })

    // Left sidebar fades in
    .from('.container main .first', {
        duration: 0.6,
        x: -60,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.3")

    // Header text fades up
    .from('.container main .second h4', {
        duration: 0.5,
        y: 30,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.2")

    // Friend cards stagger in
    .from('.card', {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        y: 40,
        stagger: 0.08,
        ease: "back.out(1.5)"
    }, "-=0.2")

    // Sidebar list items stagger
    .from('.friend_list ul a', {
        duration: 0.4,
        x: -30,
        opacity: 0,
        stagger: 0.06,
        ease: "power2.out"
    }, "-=0.2");
});


// ==========================================
// FOLLOW BUTTON WITH ANIMATION
// ==========================================
const card_btn = document.querySelectorAll(".card_btn");

card_btn.forEach(card => {
    const parent = card.closest(".card_info");
    const cardBtn = parent.querySelector(".card_btn");

    cardBtn.addEventListener("click", function(e) {
        // Button press animation
        gsap.timeline()
            .to(cardBtn, {
                scale: 0.9,
                duration: 0.1,
                ease: "power2.in"
            })
            .to(cardBtn, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });

        // Color transition
        if (cardBtn.innerText === "Follow") {
            gsap.to(cardBtn, {
                backgroundColor: "#6C5CE7",
                color: "#ffffff",
                duration: 0.3
            });
            cardBtn.innerText = "Following";
            
            // Card success pulse
            const cardEl = cardBtn.closest('.card');
            gsap.fromTo(cardEl,
                { boxShadow: '0 0 0 0 rgba(108, 92, 231, 0.6)' },
                { boxShadow: '0 0 20px 10px rgba(108, 92, 231, 0)', duration: 1 }
            );
        } else {
            gsap.to(cardBtn, {
                backgroundColor: "#00cec9",
                color: "#ffffff",
                duration: 0.3
            });
            cardBtn.innerText = "Follow";
        }
    });
});


// ==========================================
// CARD HOVER ANIMATIONS
// ==========================================
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -8,
            scale: 1.03,
            boxShadow: '0 15px 40px rgba(108, 92, 231, 0.3)',
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: '0px 0px 0px 1px rgba(255, 255, 255, 0.1)',
            duration: 0.3,
            ease: "power2.out"
        });
    });
});


// ==========================================
// SIDEBAR LINK HOVER
// ==========================================
document.querySelectorAll('.friend_list ul a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            x: 5,
            duration: 0.2,
            ease: "power2.out"
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            x: 0,
            duration: 0.2,
            ease: "power2.out"
        });
    });
});


// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
ScrollTrigger.create({
    start: "top -80",
    end: 99999,
    onUpdate: (self) => {
        if (self.direction === 1 && self.scrollY > 50) {
            gsap.to('.navbar', {
                boxShadow: '0 5px 30px rgba(0, 0, 0, 0.3)',
                background: 'rgba(10, 14, 39, 0.98)',
                duration: 0.3
            });
        } else if (self.direction === -1 && self.scrollY < 50) {
            gsap.to('.navbar', {
                boxShadow: '0 1px 0 rgba(108, 92, 231, 0.15)',
                background: 'rgba(10, 14, 39, 0.85)',
                duration: 0.3
            });
        }
    }
});


// ==========================================
// HTMX AFTER REQUEST - Re-run card animations
// ==========================================
document.body.addEventListener('htmx:afterRequest', function(evt) {
    // Re-animate new follow buttons
    const newBtns = evt.target.querySelectorAll('.card_btn');
    newBtns.forEach(btn => {
        btn.addEventListener("click", function(e) {
            gsap.timeline()
                .to(btn, { scale: 0.9, duration: 0.1 })
                .to(btn, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
        });
    });
});