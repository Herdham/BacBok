// GSAP Initial Animations
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    tl.from('.bg-shape', {
        duration: 1.5,
        scale: 0,
        opacity: 0,
        stagger: 0.2
    })
    .from('.auth-card', {
        duration: 0.8,
        y: 60,
        opacity: 0,
        rotationX: 10
    }, "-=0.5")
    .from('.logo-icon', {
        duration: 0.6,
        scale: 0,
        rotation: -180,
        opacity: 0
    }, "-=0.3")
    .from('.auth-header h1', {
        duration: 0.5,
        y: 30,
        opacity: 0
    }, "-=0.2")
    .from('.reset-title', {
        duration: 0.5,
        y: 20,
        opacity: 0
    }, "-=0.1")
    .from('.subtitle', {
        duration: 0.5,
        y: 20,
        opacity: 0
    }, "-=0.1")
    .from('.info-item', {
        duration: 0.5,
        scale: 0.9,
        opacity: 0
    }, "-=0.2")
    .from('.input-group', {
        duration: 0.5,
        y: 30,
        opacity: 0
    }, "-=0.2")
    .from('.submit-btn', {
        duration: 0.5,
        y: 20,
        opacity: 0,
        scale: 0.9
    }, "-=0.2")
    .from('.auth-footer', {
        duration: 0.5,
        y: 20,
        opacity: 0
    }, "-=0.2");

    // Alert animations
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        gsap.from(alert, {
            duration: 0.5,
            x: -20,
            opacity: 0,
            ease: "back.out(1.7)"
        });
    });
});

// DOM Elements
const resetForm = document.getElementById('resetForm');
const resetBtn = document.getElementById('resetBtn');
const emailInput = document.getElementById('email');

// Input Focus Animations
emailInput.addEventListener('focus', () => {
    const iconElement = emailInput.parentElement.querySelector('.input-icon');
    if (iconElement) {
        gsap.to(iconElement, {
            duration: 0.3,
            scale: 1.2,
            color: '#fdcb6e',
            ease: "back.out(1.7)"
        });
    }
    
    const borderElement = emailInput.parentElement.querySelector('.input-border');
    if (borderElement) {
        gsap.to(borderElement, {
            duration: 0.3,
            width: '100%',
            ease: "power2.out"
        });
    }
    
    // Animate info item
    const infoItem = document.querySelector('.info-item');
    if (infoItem) {
        gsap.to(infoItem, {
            duration: 0.3,
            borderColor: 'rgba(253, 203, 110, 0.3)',
            backgroundColor: 'rgba(253, 203, 110, 0.05)',
            ease: "power2.out"
        });
    }
});

emailInput.addEventListener('blur', () => {
    const iconElement = emailInput.parentElement.querySelector('.input-icon');
    if (iconElement) {
        gsap.to(iconElement, {
            duration: 0.3,
            scale: 1,
            color: '#6c6f85',
            ease: "power2.out"
        });
    }
    
    const borderElement = emailInput.parentElement.querySelector('.input-border');
    if (borderElement) {
        gsap.to(borderElement, {
            duration: 0.3,
            width: '0%',
            ease: "power2.out"
        });
    }
    
    // Reset info item
    const infoItem = document.querySelector('.info-item');
    if (infoItem) {
        gsap.to(infoItem, {
            duration: 0.3,
            borderColor: 'rgba(108, 92, 231, 0.1)',
            backgroundColor: 'rgba(108, 92, 231, 0.05)',
            ease: "power2.out"
        });
    }
});

// Form Submission with Loading Animation
resetForm.addEventListener('submit', function(e) {
    const email = emailInput.value.trim();
    
    if (!email) {
        e.preventDefault();
        
        // Shake animation for empty field
        gsap.to(emailInput, {
            duration: 0.1,
            x: [-10, 10, -10, 10, 0],
            ease: "power2.out"
        });
        
        gsap.to(emailInput, {
            duration: 0.3,
            borderColor: '#ff6b6b',
            ease: "power2.out"
        });
        
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        e.preventDefault();
        
        // Shake animation for invalid email
        gsap.to(emailInput, {
            duration: 0.1,
            x: [-10, 10, -10, 10, 0],
            ease: "power2.out"
        });
        
        gsap.to(emailInput, {
            duration: 0.3,
            borderColor: '#ff6b6b',
            ease: "power2.out"
        });
        
        return false;
    }
    
    // Add loading state
    resetBtn.classList.add('loading');
    
    // Change button text and icon
    const btnText = resetBtn.querySelector('.btn-text');
    const btnIcon = resetBtn.querySelector('.btn-icon');
    
    if (btnText) {
        btnText.textContent = 'Sending...';
    }
    
    if (btnIcon) {
        btnIcon.setAttribute('name', 'sync-outline');
    }
    
    // Button press animation
    gsap.to(resetBtn, {
        duration: 0.3,
        scale: 0.95,
        ease: "power2.out"
    });
    
    // Simulate loading (remove in production, this is just for demo)
    // The form will submit naturally
    setTimeout(() => {
        // This timeout is just for visual feedback
        // In production, the form submits and Django handles the redirect
    }, 500);
});

// Add ripple effect on button click
resetBtn.addEventListener('click', function(e) {
    const circle = document.createElement('span');
    const diameter = Math.max(resetBtn.clientWidth, resetBtn.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - resetBtn.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - resetBtn.getBoundingClientRect().top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    circle.style.transform = 'scale(0)';
    circle.style.animation = 'ripple 0.6s ease-out';
    circle.style.pointerEvents = 'none';
    
    resetBtn.appendChild(circle);
    
    setTimeout(() => {
        if (circle && circle.parentNode) {
            circle.remove();
        }
    }, 600);
});

// Footer link hover animations
document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        const icon = link.querySelector('ion-icon');
        if (icon) {
            gsap.to(icon, {
                duration: 0.3,
                x: link.classList.contains('back-link') ? -3 : 3,
                ease: "power2.out"
            });
        }
    });
    
    link.addEventListener('mouseleave', () => {
        const icon = link.querySelector('ion-icon');
        if (icon) {
            gsap.to(icon, {
                duration: 0.3,
                x: 0,
                ease: "power2.out"
            });
        }
    });
});