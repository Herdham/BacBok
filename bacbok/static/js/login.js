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
});

// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('pass1');
const togglePasswordBtn = document.getElementById('togglePassword');

// Password Toggle
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    const icon = togglePasswordBtn.querySelector('ion-icon');
    if (icon) {
        icon.setAttribute('name', isPassword ? 'eye-outline' : 'eye-off-outline');
    }
    
    document.getElementById('showPassword').checked = !isPassword;
});

// Checkbox toggle
document.getElementById('showPassword').addEventListener('change', function() {
    passwordInput.type = this.checked ? 'text' : 'password';
    
    const icon = togglePasswordBtn.querySelector('ion-icon');
    if (icon) {
        icon.setAttribute('name', this.checked ? 'eye-outline' : 'eye-off-outline');
    }
}); // ← THIS WAS MISSING!

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
    });
});

// Form Submission - Loading state
loginForm.addEventListener('submit', function(e) {
    loginBtn.classList.add('loading');
    loginBtn.querySelector('.btn-text').textContent = 'Signing in...';
});