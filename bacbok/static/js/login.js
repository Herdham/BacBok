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
    .from('.subtitle', {
        duration: 0.5,
        y: 20,
        opacity: 0
    }, "-=0.2")
    .from('.input-group', {
        duration: 0.5,
        y: 30,
        opacity: 0,
        stagger: 0.1
    }, "-=0.2")
    .from('.form-options', {
        duration: 0.5,
        y: 20,
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
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('pass1');
const togglePasswordBtn = document.getElementById('togglePassword');
const showPasswordCheckbox = document.getElementById('showPassword');

// Password Toggle Functions
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    const icon = togglePasswordBtn.querySelector('ion-icon');
    if (icon) {
        icon.setAttribute('name', isPassword ? 'eye-outline' : 'eye-off-outline');
    }
    
    showPasswordCheckbox.checked = !isPassword;
    
    gsap.from(passwordInput, {
        duration: 0.3,
        scale: 0.95,
        ease: "back.out(1.7)"
    });
}

// Event Listeners for Password Toggle
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
showPasswordCheckbox.addEventListener('change', togglePasswordVisibility);

// Input Focus Animations
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
        const iconElement = input.parentElement.querySelector('.input-icon');
        if (iconElement) {
            gsap.to(iconElement, {
                duration: 0.3,
                scale: 1.2,
                color: '#a29bfe',
                ease: "back.out(1.7)"
            });
        }
        
        const borderElement = input.parentElement.querySelector('.input-border');
        if (borderElement) {
            gsap.to(borderElement, {
                duration: 0.3,
                width: '100%',
                ease: "power2.out"
            });
        }
    });

    input.addEventListener('blur', () => {
        const iconElement = input.parentElement.querySelector('.input-icon');
        if (iconElement) {
            gsap.to(iconElement, {
                duration: 0.3,
                scale: 1,
                color: '#6c6f85',
                ease: "power2.out"
            });
        }
        
        const borderElement = input.parentElement.querySelector('.input-border');
        if (borderElement) {
            gsap.to(borderElement, {
                duration: 0.3,
                width: '0%',
                ease: "power2.out"
            });
        }
    });
});

// Form Validation
function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const isValid = email !== '' && password !== '';
    
    loginBtn.disabled = !isValid;
    
    if (isValid) {
        gsap.to(loginBtn, {
            duration: 0.3,
            scale: 1.02,
            ease: "power2.out"
        });
    }
}

emailInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

// Form Submission with Ripple Effect
loginForm.addEventListener('submit', function(e) {
    if (!loginBtn.disabled) {
        gsap.to(loginBtn, {
            duration: 0.3,
            scale: 0.95,
            ease: "power2.out"
        });
        
        const circle = document.createElement('span');
        const diameter = Math.max(loginBtn.clientWidth, loginBtn.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${loginBtn.clientWidth / 2 - radius}px`;
        circle.style.top = `${loginBtn.clientHeight / 2 - radius}px`;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s ease-out';
        circle.style.pointerEvents = 'none';
        
        loginBtn.appendChild(circle);
        
        setTimeout(() => {
            if (circle && circle.parentNode) {
                circle.remove();
            }
        }, 600);
    }
});